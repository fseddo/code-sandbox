"use client";

import { Fragment } from "react";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { useCommandPalette } from "./CommandPaletteProvider";
import { BrandMenu } from "./BrandMenu";

/** One breadcrumb segment. A `href` makes it a link (an ancestor); the last/current segment omits it. */
export type Crumb = { label: string; href?: string };

/** The shared app shell header: the brand area-switcher → breadcrumb trail, and the ⌘K search trigger. */
export const AppHeader = ({ crumb }: { crumb?: string | Crumb[] }) => {
  const { open } = useCommandPalette();
  const trail: Crumb[] = crumb === undefined ? [] : typeof crumb === "string" ? [{ label: crumb }] : crumb;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-sidebar-border bg-card px-4">
      <BrandMenu />

      {trail.map((segment, index) => (
        <Fragment key={index}>
          <span className="shrink-0 text-muted-foreground/40">/</span>
          {segment.href ? (
            <Link
              href={segment.href}
              className="shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {segment.label}
            </Link>
          ) : (
            <span className="min-w-0 truncate text-sm font-medium">{segment.label}</span>
          )}
        </Fragment>
      ))}

      <div className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={open}
          className="flex h-10 w-full max-w-xl items-center gap-2 rounded-lg border border-border bg-background px-3.5 text-sm text-muted-foreground transition-colors hover:border-primary/50"
        >
          <LuSearch className="size-4 shrink-0" />
          Search site-wide — pages, topics, problems…
          <kbd className="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 text-[0.7rem]">⌘K</kbd>
        </button>
      </div>
    </header>
  );
};
