// Player logic isolated from UI. Handles HLS.js initialization,
// native HLS fallback (Safari), and cleanup.
import Hls from "hls.js";

export type PlayerEvents = {
  onError?: (message: string) => void;
  onReady?: () => void;
  onQualityLevels?: (levels: QualityOption[]) => void;
  onResolutionChange?: (height: number | null) => void;
  onQualityError?: (message: string) => void;
};

export type QualityLevelSource = {
  width: number;
  height: number;
  bitrate: number;
};

export type QualityOption = {
  index: number;
  width: number;
  height: number;
  bitrate: number;
  label: string;
};

export function getQualityOptions(levels: readonly QualityLevelSource[]): QualityOption[] {
  const byHeight = new Map<number, QualityOption>();

  levels.forEach((level, index) => {
    if (!Number.isFinite(level.height) || level.height <= 0) return;

    const existing = byHeight.get(level.height);
    if (!existing || level.bitrate > existing.bitrate) {
      byHeight.set(level.height, {
        index,
        width: level.width,
        height: level.height,
        bitrate: level.bitrate,
        label: `${level.height}p`,
      });
    }
  });

  return [...byHeight.values()].sort((a, b) => a.height - b.height);
}

export type AttachedPlayer = {
  destroy: () => void;
  selectQuality: (levelIndex: number | null) => boolean;
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
    const onLoaded = () => {
      events.onReady?.();
      events.onResolutionChange?.(video.videoHeight || null);
    };
    const onResize = () => events.onResolutionChange?.(video.videoHeight || null);
    const onErr = () => events.onError?.("Stream unavailable");
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("resize", onResize);
    video.addEventListener("error", onErr);
    return {
      selectQuality: () => false,
      destroy: () => {
        video.removeEventListener("loadedmetadata", onLoaded);
        video.removeEventListener("resize", onResize);
        video.removeEventListener("error", onErr);
        video.removeAttribute("src");
        video.load();
      },
    };
  }

  // 2. hls.js path (Chrome, Firefox, Edge, etc.)
  if (Hls.isSupported()) {
    const hls = new Hls({ enableWorker: true, lowLatencyMode: false });

    const publishLevels = () => {
      events.onQualityLevels?.(getQualityOptions(hls.levels));
    };

    hls.loadSource(src);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      publishLevels();
      events.onReady?.();
    });
    hls.on(Hls.Events.LEVELS_UPDATED, publishLevels);
    hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
      const level = hls.levels[data.level];
      events.onResolutionChange?.(level?.height || null);
    });

    hls.on(Hls.Events.ERROR, (_evt, data) => {
      if (data.details === "levelSwitchError" && !hls.autoLevelEnabled) {
        hls.nextLevel = -1;
        events.onQualityError?.("That quality is unavailable. Playback returned to Auto.");
        return;
      }

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
      selectQuality: (levelIndex) => {
        if (levelIndex === null) {
          hls.nextLevel = -1;
          return true;
        }

        const isAvailable = hls.levels.some(
          (level, index) => index === levelIndex && Number.isFinite(level.height) && level.height > 0,
        );
        if (!isAvailable) return false;

        try {
          // nextLevel changes at the next safe segment boundary without resetting playback.
          hls.nextLevel = levelIndex;
          return true;
        } catch {
          return false;
        }
      },
      destroy: () => {
        hls.destroy();
      },
    };
  }

  // 3. No support at all
  events.onError?.("HLS is not supported in this browser");
  return { selectQuality: () => false, destroy: () => {} };
}
