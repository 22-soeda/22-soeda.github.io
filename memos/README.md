# 備忘録（`memos/`）の運用メモ

本フォルダの HTML は、[raspberry-pi5-ubuntu-ssh-wired.html](./raspberry-pi5-ubuntu-ssh-wired.html) と同じ構造・デザインパターンで執筆する。

## 新規記事を出すとき

1. **`MEMO-TEMPLATE.html` を複製**し、ファイル名は **ハイフン区切り（kebab-case）** の英小文字など、URL として読みやすい名前にする（例: `my-topic-note.html`）。
2. **メタ情報の置き換え**
   - `<title>` と `<h1>` の記事タイトル。
   - 執筆日・`<time datetime="YYYY-MM-DD">`（本文側の年月日も合わせる）。
   - **`../style.css` のクエリ文字列 `?v=…`** は内容を変更したら日付などで更新し、読者のブラウザキャッシュを避ける。
3. **トップページの一覧に追加**：リポジトリ直下の **`index.html`** の `#memos` セクションに、`<a href="memos/（ファイル名）">` と一覧用ラベルを足す。
4. 複製後、テンプレ付属の **`style.css?v=memo-template`** を編集日などに合わせて更新する（例: `?v=20260507-1`）。

## 本文とコードの書き方

### 文章中の短文（ファイル名・コマンドの切れ端など）

- `<code class="code-inline">…</code>` を使う。
- **`code-inline` は淡色背景・本文と同系の文字色**。暗いパネル風になるのは **コードブロック内だけ**。

### コードブロック（bash / YAML など）

- 次の入れ子にする：

```html
<figure class="code-sample" data-lang="bash">
    <figcaption class="code-sample-label">bash</figcaption>
    <pre class="code-block"><code class="language-bash">
（ここは改行ありのまま）

    </code></pre>
</figure>
```

- **`data-lang`**: `bash` / `yaml` / `powershell` など。**タブ見出しの色**に効く。
- **`code` に付ける Highlight.js のクラス**：`language-bash`、`language-yaml` など。利用可能な名前は Highlight.js の言語一覧に準拠する。
- CDN の **`highlight.min.js`（共通パッケージ）に含まれない言語**がある。必要なら言語単体ファイルの追加読み込みや、別言語での近似に切り替える（例: SSH の 1 行は **`language-bash`** で問題ないことが多い）。

### Highlight.js とテーマが不要な記事

- コードブロックがプレーン表示でよければ、`MEMO-TEMPLATE.html` と同様に **`atom-one-dark.min.css` と `highlight.min.js` と `hljs.highlightAll()` のブロックを削除**してよい。

## `style.css` 側との関係（このサイト共通）

コードまわりの見た目は **`../style.css`** にあり、備忘録の `<article>` 内でつぎが主なクラスとなる。

| クラス（例） | 役割 |
|--------------|------|
| `figure.code-sample` | コードブロック枠・角丸・影 |
| `figcaption.code-sample-label` | 上段タブ見出し（等幅） |
| `pre.code-block` | ブロック本体（左アクセント線など） |
| `code.hljs` | Highlight.js 適用後に付与。テーマのトークン色が効く |
| `article .code-inline` | 本文用インライン（淡色背景） |

## 参照・テンプレート

| ファイル | 内容 |
|----------|------|
| [MEMO-TEMPLATE.html](./MEMO-TEMPLATE.html) | 空の骨組み。新規記事はこれを複製する。 |
| [raspberry-pi5-ubuntu-ssh-wired.html](./raspberry-pi5-ubuntu-ssh-wired.html) | セクション構成・コード例・Highlight.js 込みの完成例。 |
