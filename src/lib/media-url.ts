/** Builds public media URLs from a CDN base without exposing storage credentials. */
export function resolveMediaAssetUrl(
  movieId: string,
  assetName: string,
  cdnBaseUrl: string | undefined,
  fallbackUrl: string,
): string {
  const baseUrl = cdnBaseUrl?.trim().replace(/\/+$/, "");
  if (!baseUrl) return fallbackUrl;

  return `${baseUrl}/${encodeURIComponent(movieId)}/${encodeURIComponent(assetName)}`;
}

export function resolveMovieManifestUrl(
  movieId: string,
  cdnBaseUrl: string | undefined,
  fallbackUrl: string,
): string {
  return resolveMediaAssetUrl(movieId, "master.m3u8", cdnBaseUrl, fallbackUrl);
}