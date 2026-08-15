import { defineConfig } from "vitepress";
import { RSSOptions, RssPlugin } from "vitepress-plugin-rss";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "site",

  title: "FBIK.",
  description: "Minimalism",

  lang: "zh-cn",
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Blog", link: "/blog" },
      { text: "Tags", link: "/blog/tags" },
      { text: "RSS Feed", link: "/feed.rss", target: "_Blank" },
    ],
    outline: "deep",
    sidebar: [],

    socialLinks: [{ icon: "github", link: "https://github.com/FBIKdot" }],
  },
  vite: {
    plugins: [
      RssPlugin({
        title: "FBIK.",
        baseUrl: "https://fbik.top",
        copyright: "Copyright (c) 2026-present, FBIK.",
        filter: (post) => {
          const url = post.url.replace(/\/$/, "");
          return !url.startsWith("/blog/tags") && url !== "/blog";
        },
      }),
    ],
  },
});
