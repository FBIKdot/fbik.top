import { readFileSync } from "node:fs";
import blogLoader from "../../.vitepress/blog.data";

// 轻量提取 frontmatter 中的 tag/tags（单值、内联数组、列表三种形式）
function extractTags(src: string): string[] {
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!fm) return [];
  const lines = fm.split(/\r?\n/);
  const tags: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(?:tag|tags)\s*:\s*(.*)$/);
    if (!m) continue;
    const rest = m[1].trim();
    if (!rest) {
      // 列表形式：- blog
      for (let j = i + 1; j < lines.length; j++) {
        const item = lines[j].match(/^\s*-\s*(.+)$/);
        if (!item) break;
        tags.push(item[1].trim());
      }
    } else if (rest.startsWith("[")) {
      // 内联数组：[blog, Web]
      rest
        .slice(1, rest.endsWith("]") ? -1 : undefined)
        .split(",")
        .forEach((t) => tags.push(t.trim().replace(/["']/g, "")));
    } else {
      tags.push(rest.replace(/["']/g, ""));
    }
    break;
  }
  return tags.filter(Boolean);
}

export default {
  watch: blogLoader.watch,
  paths(watchedFiles: string[]) {
    const tags = new Set<string>();
    for (const file of watchedFiles) {
      for (const tag of extractTags(readFileSync(file, "utf-8"))) {
        tags.add(tag);
      }
    }
    return [...tags].sort().map((tag) => ({ params: { tag } }));
  },
  transformPageData(pageData: { params: { tag: string }; title?: string }) {
    pageData.title = pageData.params.tag;
  },
};
