import { defineConfig } from "vitepress";

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
    ],
    outline: "deep",
    sidebar: [],

    socialLinks: [{ icon: "github", link: "https://github.com/FBIKdot" }],
  },
});
