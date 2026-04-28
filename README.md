# 22-soeda.github.io

添田悠介さんのポートフォリオサイトです。  
このリポジトリは **静的サイト** で、`index.html` を中心に構成されています。

## 構成

- `index.html` : トップページ
- `project.html` : プロジェクト詳細（工事中ページ）
- `style.css` : 共通スタイル（モダン/レトロテーマ切り替え）

## 起動方法（ローカル確認）

ビルドは不要です。以下のどちらかで確認できます。

### 1) ファイルを直接開く（最短）

1. エクスプローラーでこのフォルダを開く
2. `index.html` をダブルクリック

### 2) ローカルサーバーで起動（推奨）

相対パスやブラウザ挙動を安定して確認できるため、こちらを推奨します。

PowerShell でプロジェクト直下に移動して実行:

```powershell
cd C:\Users\soeda\22-soeda.github.io
python -m http.server 8000
```

起動後、ブラウザで以下にアクセス:

- <http://localhost:8000>

終了する場合は、PowerShell で `Ctrl + C` を押してください。

## 開発方法

このサイトは HTML/CSS を直接編集して開発します。

1. `index.html` / `project.html` / `style.css` を編集
2. ブラウザで再読み込みして確認
3. レイアウト・配色・リンク動作をチェック

### 開発時のチェックポイント

- `index.html` のセクション内リンク（`#about`, `#skills`, `#history`, `#projects`）が正しく動くか
- `project.html` への遷移と `index.html` への戻り導線
- 右下のテーマ切り替えボタン（モダン/レトロ）動作
- 画面幅を変えたときの表示崩れ（PC/スマホ）
- 画像パス（`fig/...`）の表示可否

## 公開とアクセス方法（GitHub Pages）

このリポジトリ名から、GitHub Pages の公開先は通常以下です:

- <https://22-soeda.github.io/>

公開手順（例）:

1. 変更をコミット
2. GitHub に push
3. GitHub Pages の反映を待つ（通常数十秒〜数分）
4. 上記 URL にアクセスして反映を確認

`project.html` は以下で直接確認できます:

- <https://22-soeda.github.io/project.html>

## 補足

- Tailwind CSS は CDN 読み込み（`<script src="https://cdn.tailwindcss.com"></script>`）を使用しています。
- テーマ状態は `localStorage`（`portfolioTheme`）に保存されます。

## 訪問者カウンタ

フッターの訪問者表示は [Moe Counter](https://github.com/journey-ad/Moe-Counter) の公開インスタンス `https://count.getloli.com` を利用しています。

- カウンタの識別子は `index.html` 内の `data-counter-url`（`@22-soeda-portfolio`）で一意に決まります。別サイトと分けたい場合は `@` 以降の文字列を変更してください。
- モダン / レトロテーマに応じて `?theme=` の見た目を切り替えています（`js/theme.js` の `setVisitorCounterTheme`）。
- ページ表示のたびにカウントが増える「閲覧回数（ヒット）」型です。ユニーク訪問者数ではありません。
- 公開インスタンスは無料・無保証のため、停止した場合は [Moe Counter の README](https://github.com/journey-ad/Moe-Counter) に従い Cloudflare Workers 等で自前ホストした URL を `data-counter-url` に差し替える運用が可能です。
