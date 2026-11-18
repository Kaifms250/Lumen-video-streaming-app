import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { attachHlsStream, type AttachedPlayer, type QualityOption } from "@/lib/player";

type Props = {
  src: string;
  autoPlay?: boolean;
  initialTime?: number;
  onProgress?: (currentTime: number, duration: number) => void;
};

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ src, autoPlay = true, initialTime, onProgress }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<AttachedPlayer | null>(null);

  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [qualityOptions, setQualityOptions] = useState<QualityOption[]>([]);
  const [selectedQuality, setSelectedQuality] = useState("auto");
  const [activeResolution, setActiveResolution] = useState<number | null>(null);
  const [qualityError, setQualityError] = useState<string | null>(null);

  // Attach HLS stream on mount / when src changes. Cleanup on unmount.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setLoading(true);
    setError(null);
    setQualityOptions([]);
    setSelectedQuality("auto");
    setActiveResolution(null);
    setQualityError(null);

    const attached = attachHlsStream(video, src, {
      onQualityLevels: setQualityOptions,
      onResolutionChange: setActiveResolution,
      onQualityError: (message) => {
        setSelectedQuality("auto");
        setQualityError(message);
      },
      onReady: () => {
        setLoading(false);
        // Resume from previous progress if provided.
        if (initialTime && initialTime > 3 && isFinite(initialTime)) {
          try { video.currentTime = initialTime; } catch { /* ignore */ }
        }
        if (autoPlay) {
          // Autoplay may be blocked by browser policy — muted improves odds.
          video.muted = true;
          video.play().catch(() => {
            // Autoplay refused; user can press Play manually.
          });
        }
      },
      onError: (msg) => {
        setError(msg);
        setLoading(false);
      },
    });
    playerRef.current = attached;

    return () => {
      if (playerRef.current === attached) playerRef.current = null;
      attached.destroy();
    };
  }, [src, autoPlay]);

  // Wire up media events for UI state.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let last = 0;
    const onTime = () => {
      setCurrentTime(video.currentTime);
      // Throttle progress callback to ~1/sec.
      const now = Date.now();
      if (onProgress && now - last > 1000) {
        last = now;
        onProgress(video.currentTime, video.duration);
      }
    };
    const onDur = () => setDuration(video.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onErr = () => setError("Stream unavailable");

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("durationchange", onDur);
    video.addEventListener("loadedmetadata", onDur);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onErr);

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("durationchange", onDur);
      video.removeEventListener("loadedmetadata", onDur);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onErr);
    };
  }, [onProgress]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setError("Playback failed"));
    else v.pause();
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !isFinite(duration)) return;
    v.currentTime = Number(e.target.value);
  };

  const toggleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen?.();
  };

  const selectQuality = (value: string) => {
    const levelIndex = value === "auto" ? null : Number(value);
    if (playerRef.current?.selectQuality(levelIndex)) {
      setSelectedQuality(value);
      setQualityError(null);
    } else {
      setSelectedQuality("auto");
      setQualityError("That quality is no longer available. Playback returned to Auto.");
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ position: "relative", width: "100%", background: "#000" }}>
        <video
          ref={videoRef}
          playsInline
          controls={false}
          style={{ width: "100%", height: "auto", display: "block" }}
        />

        {loading && !error && (
          <div style={overlayStyle}>Loading…</div>
        )}
        {buffering && !loading && !error && (
          <div style={overlayStyle}>Buffering…</div>
        )}
        {error && <div style={overlayStyle}>{error}</div>}

        {!error && activeResolution && (
          <div className="absolute right-3 top-3 rounded-sm bg-background/80 px-2 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
            {activeResolution}p
          </div>
        )}
      </div>

      {!error && (
        <div className="flex flex-wrap items-center gap-2 p-2">
          <Button variant="ghost" size="sm" onClick={togglePlay} disabled={loading}>
            {playing ? "Pause" : "Play"}
          </Button>
          <span className="text-sm tabular-nums text-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <input
            type="range"
            min={0}
            max={isFinite(duration) ? duration : 0}
            step={0.1}
            value={currentTime}
            onChange={onSeek}
            aria-label="Seek video"
            className="min-w-[120px] flex-1 accent-primary"
          />
          <div className="flex min-w-0 items-center gap-2">
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              {activeResolution ? `Now playing ${activeResolution}p` : "Quality"}
            </span>
            <Select value={selectedQuality} onValueChange={selectQuality} disabled={qualityOptions.length === 0}>
              <SelectTrigger className="h-8 w-[112px]" aria-label="Video quality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                {qualityOptions.map((quality) => (
                  <SelectItem key={`${quality.height}-${quality.index}`} value={String(quality.index)}>
                    {quality.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>Fullscreen</Button>
          {qualityError && <span role="status" className="w-full text-xs text-destructive">{qualityError}</span>}
        </div>
      )}
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  background: "rgba(0,0,0,0.5)",
  fontFamily: "system-ui, sans-serif",
  fontSize: 16,
};
