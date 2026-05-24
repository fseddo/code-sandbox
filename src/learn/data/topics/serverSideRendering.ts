import type { LearnTopic } from "@/learn/data/topic";

export const serverSideRendering = {
  slug: "server-side-rendering",
  title: "Server-side rendering (SSR)",
  category: "web",
  summary: "Render full HTML per request, then hydrate — fast first paint and SEO, at server-compute cost.",
  tags: ["frontend", "rendering", "backend"],
  sources: [
    { label: "web.dev — Rendering on the web", url: "https://web.dev/articles/rendering-on-the-web" },
    { label: "Next.js — Rendering", url: "https://nextjs.org/docs/app/building-your-application/rendering" },
  ],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "In server-side rendering the server produces the full HTML for each request, so the browser shows " +
          "content immediately; JavaScript then **hydrates** that markup to make it interactive. After hydration, " +
          "navigation can be client-routed or hit the server again.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for SSR when content is dynamic and per-request *and* you need fast first paint plus good SEO — " +
          "e-commerce, news, personalized pages. The costs are server compute on every request and the complexity " +
          "of hydration; cache rendered output where you can. Static generation is cheaper when content rarely " +
          "changes.",
      },
    ],
  },
} satisfies LearnTopic;
