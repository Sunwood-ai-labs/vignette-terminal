# Releasing

Vignette Terminal uses GitHub Actions to build desktop bundles on native runners.

## Manual Artifact Build

Run the `Release Builds` workflow from the Actions tab. This produces downloadable workflow artifacts for:

- Windows: NSIS `.exe` and `.msi`
- Linux: `.AppImage`, `.deb`, and `.rpm`
- macOS: `.dmg` and app bundle archive when produced by Tauri

## Publish a GitHub Release

Push a version tag:

```powershell
git tag v0.1.0
git push origin v0.1.0
```

The workflow builds each platform and attaches the generated bundles to the GitHub Release.
