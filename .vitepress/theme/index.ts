import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "@catppuccin/vitepress/theme/mocha/peach.css";
import Layout from "./Layout.vue";

export default {
  extends: DefaultTheme,
  Layout,
} satisfies Theme;
