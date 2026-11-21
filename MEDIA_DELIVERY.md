# Lumen media delivery setup

## Current state

The player continues to use the existing HLS implementation: hls.js handles adaptive playback in browsers without native HLS, while Safari uses native HLS. The catalog now resolves each title's manifest, poster, and backdrop from a public CDN base URL when configured. With no base URL, it intentionally keeps the existing verified public demo streams and current artwork.

No object-storage or CDN account is connected to this project, and no video assets have been copied. CDN playback is therefore **not deployed or verified yet**. Do not set the CDN base URL until the paths below exist and return the uploaded assets.

## Recommended Cloudflare R2 layout

Create an R2 bucket and attach a Cloudflare-managed custom domain such as `media.your-domain.example`. Use that custom domain as the public CDN origin; do not use R2 access credentials in the app or rely on the development `r2.dev` URL for production delivery.

Upload each title with this layout:

```text
<movie-id>/master.m3u8
<movie-id>/variants/360p/index.m3u8
<movie-id>/variants/360p/segment-00001.ts
<movie-id>/variants/720p/index.m3u8
<movie-id>/variants/720p/segment-00001.m4s
<movie-id>/variants/720p/init.mp4
<movie-id>/poster.webp
<movie-id>/backdrop.webp
```

The catalog expects `master.m3u8`, `poster.webp`, and `backdrop.webp` under each movie ID. Include every quality playlist, segment, initialization map, and encryption key referenced by the master or variant playlists. Keep child playlist and segment references relative to their parent playlist (including `EXT-X-MAP` paths); hls.js and Safari resolve those URLs relative to the playlist automatically. Preserve the source's directory structure when copying its manifests and segments.

For AWS instead, use a private S3 bucket behind CloudFront with Origin Access Control, and the same per-title object paths and response headers. The public CDN base URL remains the only app-side setting.

## CDN environment setting

Set `VITE_MEDIA_CDN_BASE_URL` to the public base path that contains the movie-ID folders, for example the origin `https://media.your-domain.example`. Do not include a trailing slash. Set it in the Lovable preview and published app environment settings, or in a local `.env.local` file (use `.env.example` as a reference). This is a public URL, not a credential. The app constructs paths such as `<base>/<movie-id>/master.m3u8` and `<base>/<movie-id>/poster.webp`.

Never put R2/S3 access keys, account tokens, or signing secrets in a `VITE_` variable, frontend code, or the repository. Use Cloudflare dashboard controls or a trusted server-side deployment tool to upload files and set object metadata.

## CORS and content types

Allow cross-origin `GET` and `HEAD` requests from the exact local, Lovable preview, and published app origins. Allow the `Range`, `Origin`, `Accept`, and `Content-Type` request headers; expose `Accept-Ranges`, `Content-Length`, `Content-Range`, and `ETag` so browsers can make and inspect ranged media requests. Do not use a wildcard origin when authenticated media is introduced.

Set the object content types as follows:

| File | Content-Type |
| --- | --- |
| `.m3u8` | `application/vnd.apple.mpegurl` |
| `.ts` | `video/mp2t` |
| `.m4s` | `video/iso.segment` |
| `.mp4` | `video/mp4` |
| `.webp` | `image/webp` |

## Cache policy

Set cache metadata on upload and ensure the CDN honors it:

| Asset | Cache-Control |
| --- | --- |
| Frequently updated/live `.m3u8` playlists | `public, max-age=5, s-maxage=15, stale-while-revalidate=30` |
| Finished VOD `.m3u8` playlists | `public, max-age=30, s-maxage=60, stale-while-revalidate=30` |
| Immutable, never-overwritten video segments and init files | `public, max-age=31536000, immutable` |
| Artwork with versioned filenames | `public, max-age=31536000, immutable` |

Only apply the one-year immutable policy to paths that will never be overwritten. Use new/versioned paths when replacing a segment or artwork.

## Private media

The current catalog contains public demo content, so signed delivery is not needed. For private titles, protect the entire HLS asset set, not just the master playlist: a valid viewer must be authorized for variant playlists, segments, maps, and keys too. Use CDN signed cookies or a server-issued token that covers the full title path; do not generate signatures in browser code. This app has no login or signing service configured, so private signed delivery is intentionally not enabled.

## Verification after setup

1. Fetch the configured `master.m3u8` and confirm it returns `200`, the HLS MIME type, and `#EXTM3U`.
2. Fetch at least one referenced quality playlist, initialization file, and segment through the custom domain; confirm `200`/`206`, the expected MIME type, cache policy, and CORS headers.
3. Open a title's `/watch/<movie-id>` page and inspect browser network requests. The master, variants, and segments should all use the CDN domain; verify playback, seeking, and quality switching.
4. If a playlist or segment still requests its old source host, fix the playlist's references before enabling the CDN base URL.