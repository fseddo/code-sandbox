"use client";

import { LuHistory, LuSave, LuSparkles } from "react-icons/lu";
import type { SupportedLanguage } from "@/problems/data/problem";
import { CodeEditor } from "@/components/CodeEditor";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EditorToolbar } from "@/components/EditorToolbar";
import { SaveStatus } from "@/components/SaveStatus";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SolutionEditorProps = {
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  source: string;
  onSourceChange: (source: string) => void;
  onRestoreSubmission: () => void;
  canRestore: boolean;
  onFormat: () => void;
  isFormatting: boolean;
  onSave: () => void;
  isDirty: boolean;
  autosave: boolean;
  isAutocompleteEnabled: boolean;
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
  onRestoreSubmission,
  canRestore,
  onFormat,
  isFormatting,
  onSave,
  isDirty,
  autosave,
  isAutocompleteEnabled,
}: SolutionEditorProps) => (
  <div className="flex h-full flex-col bg-card">
    <EditorToolbar
      leading={
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
      }
    >
      <SaveStatus isDirty={isDirty} autosave={autosave} />
      <ConfirmDialog
        trigger={
          <Button size="sm" variant="outline" disabled={!canRestore} title="Load your last accepted submission">
            <LuHistory className="size-3.5" />
            Last submission
          </Button>
        }
        title="Load your last submission?"
        description="This replaces the current editor contents with the solution that last passed Submit. Unsaved edits in this buffer are discarded."
        confirmLabel="Load submission"
        onConfirm={onRestoreSubmission}
      />
      <Button size="sm" variant="outline" onClick={onFormat} disabled={isFormatting} title="Format with Prettier">
        <LuSparkles className="size-3.5" />
        {isFormatting ? "Formatting…" : "Format"}
      </Button>
      <Button size="sm" variant="success-outline" onClick={onSave} disabled={autosave || !isDirty} title="Save (⌘S)">
        <LuSave className="size-3.5" />
        Save
      </Button>
    </EditorToolbar>
    <div className="min-h-0 flex-1">
      <CodeEditor
        value={source}
        onChange={onSourceChange}
        language={language}
        isAutocompleteEnabled={isAutocompleteEnabled}
      />
    </div>
  </div>
);
