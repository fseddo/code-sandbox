import type { LearnTopic } from "@/learn/data/topic";

export const staticSiteGeneration = {
  slug: "static-site-generation",
  title: "Static site generation (SSG)",
  category: "web",
  summary: "Pre-render to HTML at build time, serve from a CDN — the fastest delivery; ISR refreshes pages.",
  tags: ["frontend", "rendering"],
  sources: [
    { label: "web.dev — Rendering on the web", url: "https://web.dev/articles/rendering-on-the-web" },
    { label: "Next.js — Server & static rendering", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components" },
  ],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Static site generation renders pages to plain HTML at *build* time, served straight from a CDN — the " +
          "fastest possible delivery, with no per-request server render. Incremental Static Regeneration (ISR) " +
          "extends it by rebuilding individual pages on a schedule or on demand, so 'static' needn't mean frozen.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for SSG for content that's the same for everyone and changes infrequently — marketing pages, " +
          "docs, blogs. When content updates often, reach for ISR; when it's personalized or truly per-request, " +
          "reach for SSR instead.",
      },
    ],
  },
} satisfies LearnTopic;
