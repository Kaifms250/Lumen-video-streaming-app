# Stream Weaver

Build a minimal Next.js application that demonstrates production-style video streaming using HLS.

Goal:

Create a working proof of concept that streams a free, publicly accessible sample video. Focus entirely on functionality, not UI.

Requirements:

- Use Next.js (App Router) with TypeScript.

- Use hls.js for HLS playback.

- Create a single page that loads and plays one HLS video automatically.

- Use a publicly available sample HLS stream (do not use copyrighted content). For example:

  https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8

- Display:

  - Video player

  - Play/Pause controls

  - Current playback time

  - Total duration

  - Loading state

  - Error state

- Handle browsers that support native HLS (Safari) and browsers that require hls.js.

- Implement proper cleanup when the component unmounts.

- Make the player responsive.

Structure:

/app

    page.tsx

/components

    VideoPlayer.tsx

/lib

    player.ts

Features:

- Auto-play if allowed by the browser.

- Allow seeking.

- Allow fullscreen.

- Show buffering indicator.

- Handle stream loading failures gracefully.

- Display "Stream unavailable" if playback cannot start.

Code quality:

- Use TypeScript throughout.

- Follow clean component architecture.

- Add comments explaining HLS initialization.

- Avoid unnecessary libraries.

- Use React hooks correctly.

- Separate player logic from UI.

Do not build authentication, database, or styling yet.

Do not create a Netflix clone interface.

The only objective is to demonstrate reliable HLS streaming using a public sample stream with clean, production-quality code.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/96fdc7ec-73eb-413f-a123-03b1c73eec69).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
