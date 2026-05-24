"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ProblemSummary } from "@/problems/data/problems";
import type { TopicSummary } from "@/learn/data/topic";
import { CommandPalette } from "./CommandPalette";

type CommandPaletteApi = { open: () => void };

const CommandPaletteContext = createContext<CommandPaletteApi | null>(null);

/** Open the global ⌘K palette from anywhere under the provider (e.g. the header's search button). */
export const useCommandPalette = (): CommandPaletteApi => {
  const api = useContext(CommandPaletteContext);
  if (!api) throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  return api;
};

/**
 * Owns the palette's open state and the global ⌘K / Ctrl-K shortcut, and renders the palette once for
 * the whole app. Problem + topic summaries are passed in from the server layout so the client never
 * imports the registries (problems carry answers + hidden tests; topics carry full article bodies).
 */
export const CommandPaletteProvider = ({
  problems,
  topics,
  children,
}: {
  problems: ProblemSummary[];
  topics: TopicSummary[];
  children: React.ReactNode;
}) => {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <CommandPaletteContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <CommandPalette problems={problems} topics={topics} isOpen={isOpen} onOpenChange={setOpen} />
    </CommandPaletteContext.Provider>
  );
};
