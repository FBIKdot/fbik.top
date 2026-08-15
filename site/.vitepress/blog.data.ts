import { createContentLoader } from "vitepress";

interface Post {
  date: string;
  title: string;
  url: string;
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

export default createContentLoader("blog/**/*.md", {
  transform(raw): Post[] {
    return raw
      .filter((page) => page.url !== "/blog/")
      .map((page) => {
        const { date, title } = page.frontmatter;
        return { date: formatDate(date), title, url: page.url };
      })
      .filter((post) => post.title && post.date)
      .sort((a, b) => b.date.localeCompare(a.date));
  },
});
