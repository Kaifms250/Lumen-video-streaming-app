import { createFileRoute } from "@tanstack/react-router";
import { VideoPlayer } from "@/components/VideoPlayer";

const SAMPLE_HLS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HLS Streaming Demo" },
      { name: "description", content: "Minimal HLS video streaming proof of concept using hls.js." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main style={{ minHeight: "100vh", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>HLS Streaming Demo</h1>
      <VideoPlayer src={SAMPLE_HLS} autoPlay />
    </main>
  );
}
