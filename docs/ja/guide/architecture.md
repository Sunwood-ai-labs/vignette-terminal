# アーキテクチャ

Vignette Terminal は小さく分けて構成しています。

- Tauri がデスクトップシェルを提供します。
- Rust が `portable-pty` で PTY を起動・管理します。
- xterm.js がターミナル画面を描画します。
- Vanilla JavaScript が動画再生、クロスフェード、ウィンドウ操作を管理します。
- Vite がフロントエンド asset をビルドします。

動画再生はフロントエンド、プロセス制御は Rust に分けています。これにより、端末としての挙動を保ちながら UI を柔軟にできます。
