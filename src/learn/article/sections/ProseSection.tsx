import type { Section } from "@/learn/data/topic";
import { renderInline } from "./renderInline";

type ProseSection = Extract<Section, { kind: "prose" }>;

/** A blank-line-separated block whose every line starts with "- " renders as a bullet list; otherwise a paragraph. */
export const ProseSection = ({ section }: { section: ProseSection }) => (
  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
    {section.body.split(/\n\n+/).map((block, index) => {
      const lines = block.split("\n");
      const isList = lines.every((line) => line.trim().startsWith("- "));
      return isList ? (
        <ul key={index} className="list-disc space-y-1 pl-5">
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>{renderInline(line.trim().slice(2))}</li>
          ))}
        </ul>
      ) : (
        <p key={index}>{renderInline(block)}</p>
      );
    })}
  </div>
);
