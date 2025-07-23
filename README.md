# 開発環境

組み込みを考慮しない xxxxx の開発環境です。

## 初回実行

`husky`を動作させるために以下の手順を上から順に踏んでください

```bash
# Gitの初期化
git init

# huskyの初期化
npx husky init

# pre-commitフックでlint-stagedが動作するように調整
echo "npx lint-staged" > .husky/pre-commit

# 正しく動作しているかどうかチェック
git add .
git commit -m "first commit"
```

## 構成

```text
.
├── .husky
│   └── pre-commit
├── dist/
├── public
│   ├── assets
│   │   └── image
│   └── favicon.svg
├── scripts
├── src
│   ├── assets
│   ├── components
│   │   ├── Head.astro
│   │   └── ui
│   │       └── Modal.astro
│   ├── const
│   │   └── breakpoints.ts
│   ├── data
│   │   └── project.ts
│   ├── layouts
│   │   ├── BaseLayout.astro
│   │   └── Layout.astro
│   ├── pages
│   │   ├── index.astro
│   │   ├── page1
│   │   │   └── index.astro
│   │   └── page2
│   │       └── index.astro
│   ├── scripts
│   │   ├── common
│   │   │   ├── disableCallOnNonMobile.ts
│   │   │   ├── index.ts
│   │   │   ├── initializeModal.ts
│   │   │   └── initializeViewport.ts
│   │   ├── entry.ts
│   │   ├── index.ts
│   │   ├── page1
│   │   │   └── index.ts
│   │   └── page2
│   │       └── index.ts
│   └── styles
│       ├── base/
│       ├── design/
│       ├── develop/
│       └── global.scss
└── tsconfig.json
```

## コマンド

| Command           | Action                                          |
| :---------------- | :---------------------------------------------- |
| `npm install`     | 必要なパッケージをインストールする              |
| `npm run dev`     | ローカル開発サーバーを立ち上げ `localhost:3000` |
| `npm run build`   | ビルドデータを `./dist/` に生成する             |
| `npm run preview` | build したデータをプレビューモードで確認する    |

## 対応ブラウザ

- 主要ブラウザの最新バージョン
- iOS の最新と 1 つ前のメジャーバージョン
- サポートが終了していないブラウザ
- postcss の autoprefixer を利用して下記の browserslist の対象を軸に CSS にベンダープレフィックスを付与

```json
"browserslist": [
  "last 1 versions",
  "last 2 iOS major versions",
  "not dead"
]
```

## スタイリングについて

- `.astro`ファイル内で`<style>`を用いて記述してください
  - 自動的にスコープされるため、クラス名などは自由に記述して構いません

## JavaScriptについて

- スタイリングと同じく`.astro`ファイル内で`<script>`を用いて記述してください
