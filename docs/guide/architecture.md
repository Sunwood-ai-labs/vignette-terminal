# Architecture

Vignette Terminal is intentionally small:

- Tauri hosts the desktop shell.
- Rust starts and manages a PTY through `portable-pty`.
- xterm.js renders the terminal surface.
- Vanilla JavaScript manages media playback, crossfades, and window controls.
- Vite builds the frontend assets.

The app keeps media playback in the frontend and process control in Rust. That split makes the terminal behavior easier to reason about while preserving a flexible UI layer.
