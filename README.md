<div align="center">
  <img src="src/assets/brand/vignette-terminal-icon.png" alt="Vignette Terminal icon" width="220" />
  <h1>Vignette Terminal</h1>
  <p><strong>A Tauri terminal with cinematic video backgrounds, random playback, and smooth crossfades.</strong></p>

  <p>
    <a href="README.ja.md">日本語</a>
  </p>

  <p>
    <img alt="Tauri" src="https://img.shields.io/badge/Tauri-2.x-24C8DB?logo=tauri&logoColor=white">
    <img alt="xterm.js" src="https://img.shields.io/badge/xterm.js-6.x-1f2937">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
  </p>
</div>

## ✨ Features

- Cinematic MP4 background playback bundled with the app
- Random background selection with smooth crossfades
- Real PTY-backed Windows command prompt through `portable-pty`
- Transparent `xterm.js` terminal layer with web link support
- Frameless Tauri window with custom controls and draggable title strip
- Manual media picker for local images and videos

## 📸 Preview

![Vignette Terminal screenshot](docs/public/screenshot.png)

Vignette Terminal is designed for people who want a command prompt that feels like a focused workspace, not a blank rectangle. It keeps the terminal readable while giving the background enough presence to feel alive.

## 🚀 Quick Start

Prerequisites:

- Node.js 20 or newer
- Rust toolchain via `rustup`
- Visual Studio Build Tools with the C++ workload on Windows

```powershell
npm install
npm run tauri dev
```

Build the production app:

```powershell
npm run tauri build
```

The Windows executable and installers are written under:

```text
src-tauri/target/release/
src-tauri/target/release/bundle/
```

## 📦 Releases

Release builds are produced by GitHub Actions for Windows, Linux, and macOS. Push a version tag to create a GitHub Release and attach platform bundles:

```powershell
git tag v0.1.0
git push origin v0.1.0
```

The release workflow uploads:

- Windows: `.exe` NSIS installer and `.msi`
- Linux: `.AppImage`, `.deb`, and `.rpm`
- macOS: `.dmg` and app bundle archive when produced by Tauri

See the [v0.1.0 release notes](https://sunwood-ai-labs.github.io/vignette-terminal/guide/releases/v0.1.0) and [walkthrough article](https://sunwood-ai-labs.github.io/vignette-terminal/guide/articles/v0.1.0) for the first public release.

## 🎬 Background Media

The default background clips live in:

```text
src/assets/media/
```

You can replace them with your own MP4 files and update `defaultPlaylist` in `src/main.js`. The app also supports choosing local media at runtime with the `背景` button.

## 🧭 Documentation

Local docs:

```powershell
npm run docs:dev
```

Build docs:

```powershell
npm run docs:build
```

## 🛠️ Tech Stack

- Tauri 2
- Vanilla HTML/CSS/JavaScript
- xterm.js
- portable-pty
- Vite
- VitePress

## 🤝 Contributing

Issues and pull requests are welcome. Please keep changes scoped, run the relevant build checks, and avoid committing generated installers, `node_modules`, or `src-tauri/target`.

## 📄 License

MIT License. See [LICENSE](LICENSE).
