"use client";

import { useState } from "react";
import { LuPencil } from "react-icons/lu";
import { loadPadTitle, renamePad } from "@/pad/pad";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "Untitled pad";

/** Click-to-rename pad title in the breadcrumb. Enter / blur commits via `renamePad`; Escape cancels. */
export const EditablePadTitle = ({ padId }: { padId: string }) => {
  // Seeded lazily from localStorage — the pad workspace is client-only (ssr:false), so no hydration risk.
  const [title, setTitle] = useState(() => loadPadTitle(padId) ?? "");
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft === null) return;
    const next = draft.trim();
    setTitle(next);
    renamePad(padId, next);
    setDraft(null);
  };

  if (draft !== null)
    return (
      <input
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          } else if (event.key === "Escape") {
            setDraft(null);
          }
        }}
        placeholder={PLACEHOLDER}
        className="h-6 w-48 min-w-0 rounded border border-border bg-background px-1.5 text-sm font-medium outline-none focus:border-ring"
      />
    );

  return (
    <button
      type="button"
      onClick={() => setDraft(title)}
      title="Rename pad"
      className="group/title flex min-w-0 items-center gap-1.5"
    >
      <span className={cn("truncate text-sm font-medium", !title && "font-normal text-muted-foreground")}>
        {title || PLACEHOLDER}
      </span>
      <LuPencil className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/title:opacity-100" />
    </button>
  );
};
