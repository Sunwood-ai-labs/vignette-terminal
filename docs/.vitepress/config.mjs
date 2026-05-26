import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Vignette Terminal",
  description: "A Tauri terminal with cinematic video backgrounds.",
  base: "/vignette-terminal/",
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", href: "/vignette-terminal/favicon.ico", sizes: "any" }],
    ["link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/vignette-terminal/favicon-32x32.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/vignette-terminal/favicon-16x16.png" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/vignette-terminal/apple-touch-icon.png" }],
  ],
  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        nav: [
          { text: "Guide", link: "/guide/getting-started" },
          { text: "GitHub", link: "https://github.com/Sunwood-ai-labs/vignette-terminal" },
        ],
        sidebar: [
          {
            text: "Guide",
            items: [
              { text: "Getting Started", link: "/guide/getting-started" },
              { text: "Architecture", link: "/guide/architecture" },
              { text: "Releasing", link: "/guide/releasing" },
              { text: "v0.1.0 Release", link: "/guide/releases/v0.1.0" },
              { text: "v0.1.0 Walkthrough", link: "/guide/articles/v0.1.0" },
            ],
          },
        ],
      },
    },
    ja: {
      label: "日本語",
      lang: "ja",
      link: "/ja/",
      themeConfig: {
        nav: [
          { text: "ガイド", link: "/ja/guide/getting-started" },
          { text: "GitHub", link: "https://github.com/Sunwood-ai-labs/vignette-terminal" },
        ],
        sidebar: [
          {
            text: "ガイド",
            items: [
              { text: "はじめる", link: "/ja/guide/getting-started" },
              { text: "アーキテクチャ", link: "/ja/guide/architecture" },
              { text: "リリース", link: "/ja/guide/releasing" },
              { text: "v0.1.0 リリース", link: "/ja/guide/releases/v0.1.0" },
              { text: "v0.1.0 紹介記事", link: "/ja/guide/articles/v0.1.0" },
            ],
          },
        ],
      },
    },
  },
  themeConfig: {
    logo: "/icon.png",
    socialLinks: [{ icon: "github", link: "https://github.com/Sunwood-ai-labs/vignette-terminal" }],
  },
});
