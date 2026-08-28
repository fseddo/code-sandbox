import Link from "next/link";
import { resolveTerm } from "@/learn/data/glossary";
import { GlossaryTerm } from "@/learn/article/GlossaryTerm";

/**
 * Split a string into runs, wrapping `code` spans, **strong**, *emphasis*, `[[glossary terms]]`, and
 * `[links](/href)` — a lightweight stand-in for markdown shared by every prose-bearing section. Order in the
 * pattern matters: `**bold**` before `*italic*` (so bold isn't read as emphasis), and `[[glossary]]` before
 * `[link](url)` (so a glossary term isn't read as a link). Emphasis recurses into its own content, since the
 * house style bolds cross-links — `**[[sharding]]**` — and a non-recursive pass renders that as raw source.
 */
export const renderInline = (text: string) =>
  text
    .split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[\[[^\]]+\]\]|\[[^\]]+\]\([^)]+\))/g)
    .map((run, index) => {
      if (run.startsWith("`")) {
        return (
          <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
            {run.slice(1, -1)}
          </code>
        );
      }
      if (run.startsWith("**")) {
        // Body prose is muted; bold is the rubric's "name the thing" marker, so it earns full contrast.
        return (
          <strong key={index} className="font-semibold text-foreground">
            {renderInline(run.slice(2, -2))}
          </strong>
        );
      }
      if (run.startsWith("*")) return <em key={index}>{renderInline(run.slice(1, -1))}</em>;
      if (run.startsWith("[[")) {
        const [slug, displayLabel] = run.slice(2, -2).split("|");
        const term = resolveTerm(run.slice(2, -2));
        if (term) return <GlossaryTerm key={index} {...term} />;
        // Unresolved — a forward reference to a topic not authored yet, which is the *common* case on the
        // system design track. Still mark it as a named concept (never the raw `slug|label` source), but
        // without the dotted underline, which would promise a destination that doesn't exist yet.
        return (
          <span key={index} className="font-medium text-foreground">
            {displayLabel ?? slug}
          </span>
        );
      }
      const link = run.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        return (
          <Link key={index} href={link[2]} className="text-primary underline-offset-2 hover:underline">
            {link[1]}
          </Link>
        );
      }
      return run;
    });
