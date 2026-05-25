# はじめる

## 必要なもの

- Node.js 20 以上
- `rustup` で入れた Rust ツールチェーン
- Windows では Visual Studio Build Tools の C++ ワークロード

## 開発起動

```powershell
npm install
npm run tauri dev
```

## 本番ビルド

```powershell
npm run tauri build
```

生成物は `src-tauri/target/release` 以下に出力されます。

## 背景動画

既定の動画は `src/assets/media` から同梱されます。別の動画セットを使う場合は、ファイルを置き換えるか `src/main.js` の `defaultPlaylist` を更新してください。
