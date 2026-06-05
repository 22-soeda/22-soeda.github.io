/**
 * content/projects/*.md → projects/*.html
 *
 * Usage:
 *   npm run build:projects
 *   npm run build:project -- hack1-grand-prix-2026
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  createMarkedRenderer,
  escapeHtml,
  formatDateJaFlexible,
  normalizeDateIso,
  parseMarkdown,
  renderTemplate,
} from "./lib/markdown-html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "projects");
const TEMPLATE_PATH = path.join(__dirname, "templates", "project.html");

const SECTION_I = "                ";
const I = "                    ";
const BADGE_I = "                ";
const HERO_I = "            ";
const HERO_IMG_I = "                ";

const projectRenderer = createMarkedRenderer({
  indent: I,
  indentInner: `${I}    `,
  h2Class: "text-xl font-bold custom-title mb-2 tracking-wide",
  h3Class: "text-lg font-bold custom-title",
  paragraphClass: "text-base opacity-90",
  includeImages: true,
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

function loadProjectsJsonEntry(slug) {
  const jsonPath = path.join(ROOT, "data", "projects.json");
  if (!fs.existsSync(jsonPath)) {
    return null;
  }
  const { projects } = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  return projects?.find((p) => p.slug === slug) ?? null;
}

function mergeProjectMeta(slug, data) {
  const entry = loadProjectsJsonEntry(slug);
  if (!entry) {
    return data;
  }
  return {
    ...data,
    title: data.title ?? entry.title,
    heroTitle: data.heroTitle ?? data.title ?? entry.title,
    pageTitle: data.pageTitle ?? data.heroTitle ?? data.title ?? entry.title,
    summary: data.summary ?? entry.summary,
    thumbModern: data.thumbModern ?? entry.thumbModern,
    thumbRetro: data.thumbRetro ?? entry.thumbRetro,
    thumbAlt: data.thumbAlt ?? entry.title,
  };
}

function renderHeroImages(data) {
  const { thumbModern, thumbRetro, thumbAlt, heroTitle, title } = data;
  if (!thumbModern && !thumbRetro) {
    return "";
  }

  const alt = escapeHtml(thumbAlt ?? heroTitle ?? title ?? "Project");
  const hasRetro = thumbRetro && String(thumbRetro).trim() !== "";
  const retroClass = hasRetro ? "" : " thumb-retro-pending";

  const lines = [
    `${HERO_I}<div class="w-full aspect-[4/3] bg-gray-100 relative overflow-hidden${retroClass}">`,
  ];

  if (thumbModern) {
    lines.push(
      `${HERO_IMG_I}<img src="../${escapeHtml(thumbModern)}"`,
      `${HERO_IMG_I}     alt="${alt}"`,
      `${HERO_IMG_I}     class="img-modern absolute inset-0 w-full h-full object-cover">`
    );
  }
  if (hasRetro) {
    lines.push(
      `${HERO_IMG_I}<img src="../${escapeHtml(thumbRetro)}"`,
      `${HERO_IMG_I}     alt="${alt}（レトロ）"`,
      `${HERO_IMG_I}     class="img-retro absolute inset-0 w-full h-full object-cover">`
    );
  }

  lines.push(`${HERO_I}</div>`, "");
  return lines.join("\n");
}

function renderBadges(badges) {
  if (!Array.isArray(badges) || badges.length === 0) {
    return "";
  }
  return badges
    .map(
      (badge) =>
        `${BADGE_I}<span class="custom-badge">${escapeHtml(String(badge))}</span>`
    )
    .join("\n");
}

function buildProject(mdPath) {
  const raw = fs.readFileSync(mdPath, "utf8");
  const { data, content } = matter(raw);

  const slug = path.basename(mdPath, ".md");
  const meta = mergeProjectMeta(slug, data);

  const heroTitle = meta.heroTitle ?? meta.title ?? slug;
  const pageTitle = meta.pageTitle ?? heroTitle;
  const summary = meta.summary ?? "";

  if (!meta.date) {
    throw new Error(`${mdPath}: front matter "date" is required (YYYY-MM or YYYY-MM-DD)`);
  }
  const dateIso = normalizeDateIso(meta.date);
  const dateDisplay = meta.dateDisplay ?? formatDateJaFlexible(meta.date);

  const bodyHtml = wrapSections(parseMarkdown(content.trim(), projectRenderer));
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");

  const html = renderTemplate(template, {
    pageTitle: escapeHtml(pageTitle),
    heroTitle: escapeHtml(heroTitle),
    summary: escapeHtml(summary),
    dateIso,
    dateDisplay,
    styleVersion: meta.styleVersion ?? slug,
    highlight: meta.highlight === true,
    heroImages: renderHeroImages({ ...meta, heroTitle, title: meta.title }),
    badges: renderBadges(meta.badges),
    body: bodyHtml,
  });

  const outputRel = meta.output ?? `projects/${slug}.html`;
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
      console.error(`No project found matching: ${filter}`);
      process.exit(1);
    }
  }

  if (files.length === 0) {
    console.error(`No markdown files in ${CONTENT_DIR}`);
    process.exit(1);
  }

  for (const file of files) {
    const { slug, outputPath } = buildProject(file);
    console.log(`Built ${slug} → ${path.relative(ROOT, outputPath)}`);
  }
}

main();
