"use client";

import { useMemo } from "react";
import CodeMirror, { EditorView, keymap, Prec } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { acceptCompletion } from "@codemirror/autocomplete";
import type { SupportedLanguage } from "@/judge/problem";
import { cn } from "@/lib/utils";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  isReadOnly?: boolean;
  isAutocompleteEnabled?: boolean;
  className?: string;
};

const sizing = EditorView.theme({
  "&": { height: "100%", fontSize: "13px", backgroundColor: "transparent" },
  ".cm-gutters": { backgroundColor: "transparent", border: "none" },
  ".cm-scroller": { fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" },
});

/** Standalone CodeMirror editor for a single file. Reusable; not tied to Sandpack. */
export const CodeEditor = ({
  value,
  onChange,
  language,
  isReadOnly,
  isAutocompleteEnabled = true,
  className,
}: CodeEditorProps) => {
  const extensions = useMemo(
    () => [
      javascript({ jsx: true, typescript: language === "typescript" }),
      // Tab accepts the open completion; falls through to default Tab when none is open.
      Prec.highest(keymap.of([{ key: "Tab", run: acceptCompletion }])),
      sizing,
    ],
    [language],
  );

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme="dark"
      readOnly={isReadOnly}
      extensions={extensions}
      basicSetup={{
        foldGutter: false,
        highlightActiveLine: !isReadOnly,
        autocompletion: isAutocompleteEnabled,
      }}
      className={cn("h-full overflow-auto text-sm", className)}
    />
  );
};
