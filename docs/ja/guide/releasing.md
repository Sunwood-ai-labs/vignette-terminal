# リリース

Vignette Terminal は GitHub Actions で各 OS の runner 上に配布物を生成します。

## 手動 artifact ビルド

Actions タブから `Release Builds` workflow を手動実行できます。以下の workflow artifact が生成されます。

- Windows: NSIS `.exe` と `.msi`
- Linux: `.AppImage`、`.deb`、`.rpm`
- macOS: `.dmg` と、Tauri が生成する場合は app bundle archive

## GitHub Release の公開

バージョンタグを push します。

```powershell
git tag v0.1.0
git push origin v0.1.0
```

workflow が各 platform の bundle をビルドし、GitHub Release に添付します。
