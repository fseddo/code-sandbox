"use client";

import { useEffect, useState } from "react";
import type { SupportedLanguage } from "@/problems/data/problem";

/** Lazy, shared Shiki import — loaded once when the first highlighted block mounts (e.g. opening the Solutions tab). */
let shikiPromise: Promise<typeof import("shiki")> | null = null;

/**
 * Client-side Shiki highlighting for editor surfaces that can't be server components (the workspace is a
 * client tree). Emits the same `github-light`/`github-dark-default` dual-theme markup as the Learn
 * `CodeSection`, so the `.dark` swap in globals.css themes it identically. Falls back to a plain `<pre>`
 * until the highlighter resolves.
 */
export const HighlightedCode = ({ code, language }: { code: string; language: SupportedLanguage }) => {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (shikiPromise ??= import("shiki"))
      .then(({ codeToHtml }) =>
        codeToHtml(code, { lang: language, themes: { light: "github-light", dark: "github-dark-default" } }),
      )
      .then((result) => {
        if (active) setHtml(result);
      });
    return () => {
      active = false;
    };
  }, [code, language]);

  return html ? (
    <div
      className="overflow-auto rounded-md border border-border [&_pre]:m-0 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <pre className="overflow-auto rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground">
      {code}
    </pre>
  );
};
