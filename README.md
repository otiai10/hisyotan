# hisyotan

やさしいTODO管理

## フォルダ構成

- `./desktop` Electron 製のデスクトップアプリ一式
- `./mobile` React Native などで動くモバイルアプリ（今は考えないが、将来的に）
- `./server` Node.js で動くサーバ（今は考えないが、将来的に）
- `./scripts` 開発や CI/CD 用に便利なスクリプト置き場（今はないが、近い将来）
- `./spec` 仕様置き場。常に最新を保つ

## 開発環境の起動

1. 依存パッケージをインストールする。
   ```bash
   npm install
   ```
2. Electron + Vite の開発サーバーを起動する。
   ```bash
   npm run dev
   ```

`package.json` はリポジトリ直下で管理し、アプリ本体・ビルド生成物は `desktop/` 配下に集約する方針。ビルド成果物は `desktop/dist/` 以下に生成される。
