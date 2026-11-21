import { describe, expect, it } from "bun:test";
import { resolveMediaAssetUrl, resolveMovieManifestUrl } from "./media-url.ts";

describe("media CDN URL resolution", () => {
  it("keeps the existing public demo URL until a CDN base is configured", () => {
    const fallback = "https://demo.example/master.m3u8";
    expect(resolveMovieManifestUrl("big-buck-bunny", undefined, fallback)).toBe(fallback);
    expect(resolveMovieManifestUrl("big-buck-bunny", "  ", fallback)).toBe(fallback);
  });

  it("builds a CDN manifest path and normalizes trailing slashes", () => {
    expect(
      resolveMovieManifestUrl("big-buck-bunny", "https://media.example.com/library///", "fallback"),
    ).toBe("https://media.example.com/library/big-buck-bunny/master.m3u8");
  });

  it("builds encoded CDN thumbnail paths", () => {
    expect(resolveMediaAssetUrl("film one", "poster.webp", "https://media.example.com", "fallback"))
      .toBe("https://media.example.com/film%20one/poster.webp");
  });
});