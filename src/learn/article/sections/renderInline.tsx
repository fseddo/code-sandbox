import Link from "next/link";
import { resolveTerm } from "@/learn/data/glossary";
import { GlossaryTerm } from "@/learn/article/GlossaryTerm";

/**
 * Split a string into runs, wrapping `code` spans, **strong**, *emphasis*, `[[glossary terms]]`, and
 * `[links](/href)` — a lightweight stand-in for markdown shared by every prose-bearing section. Order in the
 * pattern matters: `**bold**` before `*italic*` (so bold isn't read as emphasis), and `[[glossary]]` before
 * `[link](url)` (so a glossary term isn't read as a link). An unknown glossary term falls back to plain text.
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
      if (run.startsWith("**")) return <strong key={index}>{run.slice(2, -2)}</strong>;
      if (run.startsWith("*")) return <em key={index}>{run.slice(1, -1)}</em>;
      if (run.startsWith("[[")) {
        const term = resolveTerm(run.slice(2, -2));
        return term ? <GlossaryTerm key={index} {...term} /> : run.slice(2, -2);
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
