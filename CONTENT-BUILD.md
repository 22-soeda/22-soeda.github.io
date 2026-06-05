# コンテンツビルドガイド

Markdown で記事を書き、Node.js スクリプトで HTML を生成する仕組みの解説です。

---

## 全体の流れ

```
content/
  memos/xxx.md       →  (build:memos)   →  memos/xxx.html
  projects/xxx.md    →  (build:projects) →  projects/xxx.html
```

`content/` 以下に Markdown を置いてビルドコマンドを実行すると、サイトに配置される HTML が生成されます。

---

## 初回セットアップ

依存パッケージをインストールします（初回のみ）。

```bash
npm install
```

---

## 備忘録（memos）

### Markdown の置き場所

```
content/memos/<slug>.html
```

`<slug>` はハイフン区切りの英小文字にします（例: `my-topic-note.md`）。

### Front matter（必須・任意）

```yaml
---
title: 記事タイトル          # 必須
date: 2026-05-06            # 必須（YYYY-MM-DD）
styleVersion: "20260506"    # 任意。style.css のキャッシュバスティング用。省略するとslugが使われる
highlight: true             # 任意。コードブロックの Highlight.js 有効化（デフォルト: true）
output: memos/xxx.html      # 任意。省略すると memos/<slug>.html に出力
---
```

### 本文の書き方

- `##` セクション見出し → `<section>` ブロックに自動変換される
- `###` 小見出しも使用可
- コードブロック（`` ``` ``）→ `figure.code-sample` に変換される（`highlight: true` で Highlight.js が効く）
- インラインコード（`` ` ``）→ `<code class="code-inline">` に変換される
- 箇条書き・番号付きリスト・**太字** はそのまま使用可
- 画像（`![alt](src)`）は `<figure>` + `<figcaption>` に変換される

### ビルドコマンド

```bash
# すべての備忘録をビルド
npm run build:memos

# 特定の1件だけビルド（slug の部分一致）
npm run build:memo -- my-topic-note
```

### トップページへの追加

ビルドしても `index.html` の一覧には自動追加されません。
`index.html` の `#memos` セクションに手動でリンクを追加してください。

---

## プロジェクト（projects）

### Markdown の置き場所

```
content/projects/<slug>.md
```

`<slug>` は `data/projects.json` の `"slug"` フィールドと一致させます。

### data/projects.json との関係

Front matter に書いていない項目（`title`・`summary`・`thumbModern`・`thumbRetro`）は `data/projects.json` の同スラッグのエントリから自動補完されます。Markdown 側の記述が優先されます。

### Front matter（必須・任意）

```yaml
---
title: プロジェクトタイトル         # 省略時は projects.json の title を使用
heroTitle: ヒーロー部分のタイトル   # 任意。省略時は title と同じ
pageTitle: <title> タグの文字列    # 任意。省略時は heroTitle と同じ
summary: 一言説明                   # 省略時は projects.json の summary を使用
date: "2026-04"                    # 必須（YYYY-MM または YYYY-MM-DD）
styleVersion: "20260518-hero"      # 任意。style.css のキャッシュバスティング用
highlight: false                   # 任意。コードブロックの Highlight.js（デフォルト: false）
badges:                            # 任意。ヒーロー下部に表示するバッジ
  - Node.js
  - Next.js
thumbModern: fig/home/xxx.png      # 省略時は projects.json から補完
thumbRetro: fig/home/xxx-retro.png # 省略時は projects.json から補完
output: projects/xxx.html          # 任意。省略すると projects/<slug>.html に出力
---
```

### 本文の書き方

備忘録と同じ書き方が使えます。画像パスは HTML の出力先（`projects/`）からの相対パスで書きます。

```markdown
![キャプション](../fig/projects/image.png)
```

### ビルドコマンド

```bash
# すべてのプロジェクトをビルド
npm run build:projects

# 特定の1件だけビルド（slug の部分一致）
npm run build:project -- hack1-grand-prix-2026
```

---

## まとめてビルド

```bash
# memos と projects を両方ビルド
npm run build:content
```

---

## ファイル構成（参考）

```
scripts/
  build-memos.mjs          # memos ビルドスクリプト
  build-projects.mjs       # projects ビルドスクリプト
  lib/
    markdown-html.mjs      # Markdown → HTML 変換の共通ライブラリ
  templates/
    memo.html              # memo の HTML テンプレート
    project.html           # project の HTML テンプレート
content/
  memos/                   # 備忘録の Markdown ソース
  projects/                # プロジェクトの Markdown ソース
data/
  projects.json            # プロジェクト一覧データ（トップページ + ビルド補完用）
```
