import { describe, expect, it } from "bun:test";
import { getQualityOptions } from "./player.ts";

describe("getQualityOptions", () => {
  it("only offers resolutions found in the stream and keeps the best duplicate", () => {
    const options = getQualityOptions([
      { width: 640, height: 360, bitrate: 500_000 },
      { width: 1280, height: 720, bitrate: 2_000_000 },
      { width: 854, height: 480, bitrate: 900_000 },
      { width: 640, height: 360, bitrate: 750_000 },
    ]);

    expect(options.map(({ label }) => label)).toEqual(["360p", "480p", "720p"]);
    expect(options[0]?.index).toBe(3);
  });

  it("omits levels without a usable video resolution", () => {
    expect(getQualityOptions([{ width: 0, height: 0, bitrate: 100_000 }])).toEqual([]);
  });
});