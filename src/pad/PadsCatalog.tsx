"use client";

import { useState } from "react";
import Link from "next/link";
import { LuArrowRight, LuPlus, LuSearch } from "react-icons/lu";
import { relativeTime, useScratchPads } from "@/pad/useScratchPads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** The /pads list: search over saved scratchpads, list rows → the pad workspace, and a New pad action. */
export const PadsCatalog = () => {
  const pads = useScratchPads();
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  const results = needle
    ? pads.filter((pad) => (pad.title ?? pad.id).toLowerCase().includes(needle))
    : pads;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-6 py-8">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <LuSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${pads.length} pads…`}
            className="h-9 pl-8"
          />
        </div>
        <Button size="lg" nativeButton={false} render={<Link href="/pad" />}>
          <LuPlus />
          New pad
        </Button>
      </div>

      {results.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {pads.length === 0 ? (
            <>
              No pads yet — start one with <span className="font-medium text-foreground">New pad</span>.
            </>
          ) : (
            "No pads match your search."
          )}
        </div>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {results.map((pad) => (
            <Link
              key={pad.id}
              href={`/pad/${pad.id}`}
              className="group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <span className={cn("min-w-0 flex-1 truncate text-sm", pad.title ? "font-medium" : "font-mono text-muted-foreground")}>
                {pad.title ?? pad.id}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                {relativeTime(pad.updatedAt)}
                <LuArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
