import type { LearnTopic } from "@/learn/data/topic";

export const clientSideRendering = {
  slug: "client-side-rendering",
  title: "Client-side rendering (CSR)",
  category: "web",
  summary: "Ship a JS bundle; the browser builds the DOM. App-like navigation, slower first paint.",
  tags: ["frontend", "rendering"],
  sources: [{ label: "web.dev — Rendering on the web", url: "https://web.dev/articles/rendering-on-the-web" }],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "In client-side rendering the server sends a near-empty HTML shell plus a JavaScript bundle; the browser " +
          "then fetches data and builds the [[DOM]] — the classic single-page app. First paint waits on the bundle, " +
          "but subsequent navigation is fast and app-like, with no full page reloads.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for CSR for highly interactive, app-like UIs — dashboards, editors, internal tools — typically " +
          "behind a login where SEO and first-paint speed matter less. The tradeoffs are a slower initial load " +
          "and weaker SEO, which server-side rendering and static generation address.",
      },
    ],
  },
} satisfies LearnTopic;
