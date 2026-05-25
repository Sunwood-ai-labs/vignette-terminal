# Contributing

Thanks for helping improve Vignette Terminal.

## Development

```powershell
npm install
npm run tauri dev
```

Before opening a pull request, run:

```powershell
npm run build
npm run docs:build
cargo check --manifest-path src-tauri/Cargo.toml
```

On Windows, run Cargo from a shell where the Visual Studio C++ tools are available.

## Guidelines

- Keep pull requests focused.
- Do not commit `node_modules`, `dist`, `src-tauri/target`, generated installers, or screenshots.
- Prefer small, readable UI changes over broad restyles.
- Explain user-facing behavior changes in the pull request description.
