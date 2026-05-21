"use client";

import { useMemo } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import type { SupportedLanguage } from "@/judge/problem";
import { cn } from "@/lib/utils";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  isReadOnly?: boolean;
  className?: string;
};

const sizing = EditorView.theme({
  "&": { height: "100%", fontSize: "13px", backgroundColor: "transparent" },
  ".cm-gutters": { backgroundColor: "transparent", border: "none" },
  ".cm-scroller": { fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" },
});

/** Standalone CodeMirror editor for a single file. Reusable; not tied to Sandpack. */
export const CodeEditor = ({ value, onChange, language, isReadOnly, className }: CodeEditorProps) => {
  const extensions = useMemo(
    () => [javascript({ jsx: true, typescript: language === "typescript" }), sizing],
    [language],
  );

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme="dark"
      readOnly={isReadOnly}
      extensions={extensions}
      basicSetup={{ foldGutter: false, highlightActiveLine: !isReadOnly }}
      className={cn("h-full overflow-auto text-sm", className)}
    />
  );
};
