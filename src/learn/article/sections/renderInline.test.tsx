import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderInline } from "./renderInline";

const render = (text: string) => renderToStaticMarkup(<>{renderInline(text)}</>);

describe("renderInline", () => {
  it("degrades an unresolved term to a marked span, not a link", () => {
    const html = render("see [[not-a-real-topic]] for more");
    expect(html).toContain("not-a-real-topic");
    // Marked as a named concept so it survives a page of muted prose, but with no href and no dotted
    // underline — there is no page to promise yet.
    expect(html).toContain("<span");
    expect(html).not.toContain("href");
  });

  it("degrades an unresolved alias to its display label, not the raw source", () => {
    // Forward references are the norm on the system design track — a lesson links a chapter that
    // isn't built yet — so the unresolved path is the common one, not the edge case.
    const html = render("a [[not-a-real-topic|load balancer]] sits here");
    expect(html).toContain("load balancer");
    expect(html).not.toContain("not-a-real-topic");
  });

  it("recurses into emphasis, so a bolded cross-link is not rendered as raw source", () => {
    // The house style bolds the named thing and the named thing is often a cross-link, so the two
    // markers collide constantly — `**[[slug|label]]**`.
    const html = render("**[[not-a-real-topic|load balancer]]** spreads requests");
    expect(html).toContain("load balancer");
    expect(html).not.toContain("[[");
    expect(html).not.toContain("|");
  });

  it("resolves a real topic slug to a link carrying the alias label", () => {
    const html = render("[[hash-maps|hash table]]");
    expect(html).toContain("hash table");
    expect(html).not.toContain("hash-maps|");
  });
});
