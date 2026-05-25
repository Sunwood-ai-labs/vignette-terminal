import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Vignette Terminal",
  description: "A Tauri terminal with cinematic video backgrounds.",
  base: "/vignette-terminal/",
  cleanUrls: true,
  head: [["link", { rel: "icon", href: "/vignette-terminal/icon.png" }]],
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
