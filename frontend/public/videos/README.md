# Optional landing hero video

No video was supplied with this project. `/landing` currently uses the existing circuit image plus a small original SVG/CSS animation inspired by the supplied Pinterest preview. The Pinterest video is not copied or hotlinked.

To enable local video, add one or both files here and rebuild/restart Next.js:

- `unicompute-hero.webm` — preferred, VP9 or VP8
- `unicompute-hero.mp4` — fallback, H.264, yuv420p, fast-start metadata

Use an original or licensed 6–10 second seamless loop, approximately 1600×900 or 1920×1080, 24–30 fps, without audio, text, watermarks, or hard cuts. Aim for 2 MB or less per file. Keep the left half dark, the processor on the right, with slow cyan light pulses and blue circuitry. The image at `/images/unicompute-landing-background.jpeg` remains visible beneath the video.

`src/lib/hero-media.ts` detects these exact filenames on the server. The landing-only component uses autoplay, loop, muted, and playsInline. It does not mount video sources for reduced-motion, data-saving, or known slow connections. Unsupported playback, autoplay rejection, or a 4.5-second readiness timeout keeps the static image. A pause control and offscreen/background-tab pausing are included. No video is imported by the dashboard or login page.
