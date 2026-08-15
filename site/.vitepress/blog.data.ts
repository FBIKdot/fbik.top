import { createContentLoader } from "vitepress";

interface Post {
  date: string;
  title: string;
  url: string;
  tags: string[];
}

function formatDate(date: unknown): string {
  if (date instanceof Date) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
  }
  if (typeof date === "string") return date.replaceAll("-", ".");
  return "";
}

function toTags(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.map((tag) => String(tag));
  return [];
}

export default createContentLoader("blog/**/*.md", {
  transform(raw): Post[] {
    return raw
      .filter((page) => page.url !== "/blog/")
      .map((page) => {
        const { date, title, tag, tags } = page.frontmatter;
        return {
          date: formatDate(date),
          title,
          url: page.url,
          tags: toTags(tag ?? tags),
        };
      })
      .filter((post) => post.title && post.date)
      .sort((a, b) => b.date.localeCompare(a.date));
  },
});
