"use client";

import { LuPlay } from "react-icons/lu";
import type { SupportedLanguage } from "./problem";
import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SolutionEditorProps = {
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  source: string;
  onSourceChange: (source: string) => void;
  onRun: () => void;
  isRunning: boolean;
};

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
};

export const SolutionEditor = ({
  language,
  onLanguageChange,
  source,
  onSourceChange,
  onRun,
  isRunning,
}: SolutionEditorProps) => (
  <div className="flex h-full flex-col bg-card">
    <div className="flex items-center justify-between gap-2 border-b border-sidebar-border px-3 py-2">
      <div className="flex items-center gap-1 rounded-md bg-background p-0.5">
        {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => onLanguageChange(lang)}
            aria-pressed={lang === language}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              lang === language
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {LANGUAGE_LABELS[lang]}
          </button>
        ))}
      </div>
      <Button size="sm" variant="success" onClick={onRun} disabled={isRunning}>
        <LuPlay className="size-3.5" />
        {isRunning ? "Running…" : "Run"}
      </Button>
    </div>
    <div className="min-h-0 flex-1">
      <CodeEditor value={source} onChange={onSourceChange} language={language} />
    </div>
  </div>
);
