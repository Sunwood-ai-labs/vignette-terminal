# Getting Started

## Requirements

- Node.js 20 or newer
- Rust toolchain via `rustup`
- Visual Studio Build Tools with the C++ workload on Windows

## Development

```powershell
npm install
npm run tauri dev
```

## Production Build

```powershell
npm run tauri build
```

Build outputs are generated under `src-tauri/target/release`.

## Background Clips

Default clips are bundled from `src/assets/media`. Replace those files or update `defaultPlaylist` in `src/main.js` to use another curated set.
