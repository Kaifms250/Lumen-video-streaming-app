import { useEffect, useRef, useState } from "react";
import { attachHlsStream } from "@/lib/player";

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

  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Attach HLS stream on mount / when src changes. Cleanup on unmount.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setLoading(true);
    setError(null);

    const attached = attachHlsStream(video, src, {
      onReady: () => {
        setLoading(false);
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

    return () => {
      attached.destroy();
    };
  }, [src, autoPlay]);

  // Wire up media events for UI state.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => setCurrentTime(video.currentTime);
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
  }, []);

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
      </div>

      {!error && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: 8, flexWrap: "wrap" }}>
          <button onClick={togglePlay} disabled={loading}>
            {playing ? "Pause" : "Play"}
          </button>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <input
            type="range"
            min={0}
            max={isFinite(duration) ? duration : 0}
            step={0.1}
            value={currentTime}
            onChange={onSeek}
            style={{ flex: 1, minWidth: 120 }}
          />
          <button onClick={toggleFullscreen}>Fullscreen</button>
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
