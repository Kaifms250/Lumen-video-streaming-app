// Player logic isolated from UI. Handles HLS.js initialization,
// native HLS fallback (Safari), and cleanup.
import Hls from "hls.js";

export type PlayerEvents = {
  onError?: (message: string) => void;
  onReady?: () => void;
};

export type AttachedPlayer = {
  destroy: () => void;
};

/**
 * Attach an HLS stream to a <video> element.
 *
 * - If the browser can natively play HLS (Safari / iOS), we simply set `src`.
 * - Otherwise, if hls.js is supported (MSE-based browsers), we instantiate
 *   Hls, load the manifest, and attach to the media element.
 * - On fatal Hls.js errors we attempt limited recovery, then surface an error.
 */
export function attachHlsStream(
  video: HTMLVideoElement,
  src: string,
  events: PlayerEvents = {},
): AttachedPlayer {
  // 1. Native HLS (Safari, iOS)
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = src;
    const onLoaded = () => events.onReady?.();
    const onErr = () => events.onError?.("Stream unavailable");
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onErr);
    return {
      destroy: () => {
        video.removeEventListener("loadedmetadata", onLoaded);
        video.removeEventListener("error", onErr);
        video.removeAttribute("src");
        video.load();
      },
    };
  }

  // 2. hls.js path (Chrome, Firefox, Edge, etc.)
  if (Hls.isSupported()) {
    const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
    hls.loadSource(src);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => events.onReady?.());

    hls.on(Hls.Events.ERROR, (_evt, data) => {
      if (!data.fatal) return;
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          // Try to recover network errors once
          hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;
        default:
          events.onError?.("Stream unavailable");
          hls.destroy();
      }
    });

    return {
      destroy: () => {
        hls.destroy();
      },
    };
  }

  // 3. No support at all
  events.onError?.("HLS is not supported in this browser");
  return { destroy: () => {} };
}
