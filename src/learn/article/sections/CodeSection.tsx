import { codeToHtml } from "shiki";
import type { Section } from "@/learn/data/topic";

type CodeSection = Extract<Section, { kind: "code" }>;

/** Server-side syntax highlighting via Shiki — VS Code grammars/themes, emitted as static HTML (no client JS). */
export const CodeSection = async ({ section }: { section: CodeSection }) => {
  const html = await codeToHtml(section.source, {
    lang: section.lang,
    themes: { light: "github-light", dark: "github-dark-default" },
  });

  return (
    <figure className="space-y-2">
      <div
        className="overflow-hidden rounded-lg border border-border [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[0.8rem] [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {section.caption && (
        <figcaption className="text-xs text-muted-foreground">{section.caption}</figcaption>
      )}
    </figure>
  );
};
