import type { Section } from "@/learn/data/topic";
import { resolveTerm } from "@/learn/data/glossary";
import { GlossaryTerm } from "@/learn/article/GlossaryTerm";

type ProseSection = Extract<Section, { kind: "prose" }>;

/**
 * Split a paragraph into runs, wrapping `code` spans, *emphasis*, and `[[glossary terms]]` — a lightweight
 * stand-in for markdown. An unknown glossary term falls back to its plain text.
 */
const renderInline = (text: string) =>
  text.split(/(`[^`]+`|\*[^*]+\*|\[\[[^\]]+\]\])/g).map((run, index) => {
    if (run.startsWith("`")) {
      return (
        <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
          {run.slice(1, -1)}
        </code>
      );
    }
    if (run.startsWith("*")) return <em key={index}>{run.slice(1, -1)}</em>;
    if (run.startsWith("[[")) {
      const term = resolveTerm(run.slice(2, -2));
      return term ? <GlossaryTerm key={index} {...term} /> : run.slice(2, -2);
    }
    return run;
  });

export const ProseSection = ({ section }: { section: ProseSection }) => (
  <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
    {section.body.split(/\n\n+/).map((paragraph, index) => (
      <p key={index}>{renderInline(paragraph)}</p>
    ))}
  </div>
);
