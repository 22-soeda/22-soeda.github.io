import { marked } from "marked";

export const CODE_LANG_ALIASES = {
  text: "plaintext",
  plaintext: "plaintext",
};

export function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function normalizeDateIso(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).trim();
}

export function formatDateJa(isoDate) {
  const iso = normalizeDateIso(isoDate);
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

/** YYYY-MM or YYYY-MM-DD → 2026年4月 / 2026年4月12日 */
export function formatDateJaFlexible(isoDate) {
  const iso = normalizeDateIso(isoDate);
  const parts = iso.split("-").map(Number);
  if (parts.length >= 3 && parts[2]) {
    return formatDateJa(iso);
  }
  if (parts.length >= 2) {
    return `${parts[0]}年${parts[1]}月`;
  }
  return iso;
}

export function parseFenceInfo(langRaw) {
  if (!langRaw) {
    return { dataLang: "text", hljsLang: "plaintext", label: "text" };
  }

  const parts = langRaw.trim().split(/\s+/);
  const lang = parts[0].toLowerCase();
  const label = parts.slice(1).join(" ") || lang;

  const hljsLang = CODE_LANG_ALIASES[lang] ?? lang;
  const dataLang = lang === "plaintext" ? "text" : lang;

  return { dataLang, hljsLang, label };
}

export function renderTemplate(template, vars) {
  const hljsHead = vars.highlight
    ? '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">'
    : "";
  const hljsScripts = vars.highlight
    ? `    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    </script>`
    : "";

  let out = template;
  for (const [key, value] of Object.entries({
    ...vars,
    hljsHead,
    hljsScripts,
  })) {
    out = out.replaceAll(`{{${key}}}`, value ?? "");
  }

  return out;
}

export function stripLeadingH1(markdown) {
  return markdown.replace(/^#\s+.+\n+/, "").trim();
}

/**
 * @param {{
 *   indent: string;
 *   indentInner?: string;
 *   h2Class: string;
 *   h3Class: string;
 *   paragraphClass: string;
 *   listClass?: string;
 *   listItemIndent?: string;
 *   includeCodeBlocks?: boolean;
 *   includeImages?: boolean;
 *   imageFigureClass?: string;
 * }} options
 */
export function createMarkedRenderer(options) {
  const I = options.indent;
  const I2 = options.indentInner ?? `${I}    `;
  const listClass =
    options.listClass ?? "list-disc pl-6 space-y-2 text-base";
  const includeCode = options.includeCodeBlocks !== false;

  function renderCodeBlock(code, langRaw) {
    const { dataLang, hljsLang, label } = parseFenceInfo(langRaw);
    const escaped = escapeHtml(code.replace(/\n$/, ""));

    return [
      `${I}<figure class="code-sample" data-lang="${escapeHtml(dataLang)}">`,
      `${I2}<figcaption class="code-sample-label">${escapeHtml(label)}</figcaption>`,
      `${I2}<pre class="code-block"><code class="language-${escapeHtml(hljsLang)}">${escaped}</code></pre>`,
      `${I}</figure>`,
    ].join("\n");
  }

  const pOpen = options.paragraphClass
    ? `<p class="${options.paragraphClass}">`
    : "<p>";

  return {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      if (depth === 2) {
        return `${I}<h2 class="${options.h2Class}">${text}</h2>\n`;
      }
      if (depth === 3) {
        return `${I}<h3 class="${options.h3Class}">${text}</h3>\n`;
      }
      return `<h${depth}>${text}</h${depth}>\n`;
    },
    paragraph({ tokens }) {
      if (
        tokens.length === 1 &&
        tokens[0].type === "image"
      ) {
        return this.image(tokens[0]);
      }
      const text = this.parser.parseInline(tokens);
      return `${I}${pOpen}${text}</p>\n`;
    },
    html({ text }) {
      return text;
    },
    list({ items, ordered }) {
      const tag = ordered ? "ol" : "ul";
      const orderedClass = "list-decimal pl-6 space-y-3 text-base";
      const klass = ordered ? orderedClass : listClass;
      const liPad = options.listItemIndent ?? I2;
      const body = items
        .map((item) => {
          const text = this.parser.parseInline(item.tokens);
          return `${liPad}<li>${text}</li>`;
        })
        .join("\n");
      return `${I}<${tag} class="${klass}">\n${body}\n${I}</${tag}>\n`;
    },
    codespan({ text }) {
      return `<code class="code-inline">${escapeHtml(text)}</code>`;
    },
    strong({ tokens }) {
      const text = this.parser.parseInline(tokens);
      return `<strong class="font-bold">${text}</strong>`;
    },
    code({ text, lang }) {
      if (!includeCode) {
        return `<pre><code>${escapeHtml(text)}</code></pre>\n`;
      }
      return `${renderCodeBlock(text, lang)}\n`;
    },
    image({ href, title, text }) {
      if (options.includeImages === false) {
        return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text || title || "")}">\n`;
      }
      const alt = escapeHtml(text || title || "");
      const caption = escapeHtml(text || title || "");
      const figureClass = options.imageFigureClass ?? "space-y-2";
      return [
        `${I}<figure class="${figureClass}">`,
        `${I2}<img src="${escapeHtml(href)}" alt="${alt}" class="w-full rounded-xl border-2" style="border-color: var(--border-color);">`,
        caption
          ? `${I2}<figcaption class="text-sm opacity-70 text-center">${caption}</figcaption>`
          : "",
        `${I}</figure>`,
      ]
        .filter(Boolean)
        .join("\n");
    },
  };
}

export function parseMarkdown(markdown, renderer) {
  marked.use({ renderer });
  return marked.parse(markdown);
}
