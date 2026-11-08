import { existsSync } from "node:fs";
import path from "node:path";

/** Server-only discovery: absent assets never produce failing browser requests. */
export function getHeroVideoSources() {
  return [
    { src: "/videos/unicompute-hero.webm", type: "video/webm" },
    { src: "/videos/unicompute-hero.mp4", type: "video/mp4" },
  ].filter(asset => existsSync(path.join(process.cwd(), "public", asset.src.slice(1))));
}
