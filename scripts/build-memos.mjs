/**
 * content/memos/*.md → memos/*.html
 *
 * Usage:
 *   npm run build:memos
 *   npm run build:memo -- raspberry-pi5-ubuntu-ros2-jazzy-setup
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  createMarkedRenderer,
  escapeHtml,
  formatDateJa,
  normalizeDateIso,
  parseMarkdown,
  renderTemplate,
} from "./lib/markdown-html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "memos");
const TEMPLATE_PATH = path.join(__dirname, "templates", "memo.html");

const SECTION_I = "                ";
const I = "                    ";

const memoRenderer = createMarkedRenderer({
  indent: I,
  indentInner: `${I}    `,
  h2Class: "text-xl font-bold custom-title mb-2 tracking-wide",
  h3Class: "text-lg font-bold custom-title",
  paragraphClass: "text-base opacity-90",
});

function wrapSections(html) {
  const chunks = html.split(new RegExp(`(?=${I}<h2 class)`)).filter((c) => c.trim());
  return chunks
    .map(
      (chunk) =>
        `${SECTION_I}<section class="space-y-4">\n${chunk.trimEnd()}\n${SECTION_I}</section>`
    )
    .join("\n\n");
}

function buildMemo(mdPath) {
  const raw = fs.readFileSync(mdPath, "utf8");
  const { data, content } = matter(raw);

  const slug = path.basename(mdPath, ".md");
  const title = data.title ?? slug;
  if (!data.date) {
    throw new Error(`${mdPath}: front matter "date" is required (YYYY-MM-DD)`);
  }
  const dateIso = normalizeDateIso(data.date);

  const bodyHtml = wrapSections(parseMarkdown(content.trim(), memoRenderer));
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");

  const html = renderTemplate(template, {
    title: escapeHtml(title),
    dateIso,
    dateDisplay: formatDateJa(dateIso),
    styleVersion: data.styleVersion ?? slug,
    highlight: data.highlight !== false,
    body: bodyHtml,
  });

  const outputRel = data.output ?? `memos/${slug}.html`;
  const outputPath = path.join(ROOT, outputRel);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, "utf8");

  return { slug, outputPath };
}

function listMarkdownFiles() {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => path.join(CONTENT_DIR, name));
}

function main() {
  const filter = process.argv[2];
  let files = listMarkdownFiles();

  if (filter) {
    const needle = filter.replace(/\.md$/, "");
    files = files.filter((f) => path.basename(f, ".md").includes(needle));
    if (files.length === 0) {
      console.error(`No memo found matching: ${filter}`);
      process.exit(1);
    }
  }

  if (files.length === 0) {
    console.error(`No markdown files in ${CONTENT_DIR}`);
    process.exit(1);
  }

  for (const file of files) {
    const { slug, outputPath } = buildMemo(file);
    console.log(`Built ${slug} → ${path.relative(ROOT, outputPath)}`);
  }
}

main();
