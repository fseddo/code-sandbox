"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

type NavEntry = { title: string; href: string };

/** Prev/next links across the whole track's flattened entry list, keyed off the current path. */
export const GuideEntryNav = ({ entries }: { entries: NavEntry[] }) => {
  const pathname = usePathname();
  const index = entries.findIndex((entry) => entry.href === pathname);
  if (index === -1) return null;

  const prev = entries[index - 1];
  const next = entries[index + 1];

  return (
    <nav className="mx-auto flex max-w-3xl gap-3 px-6 pb-12">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-1 flex-col gap-0.5 rounded-lg border border-border p-3 transition-colors hover:border-primary/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <LuArrowLeft className="size-3" /> Previous
          </span>
          <span className="truncate text-sm font-medium group-hover:text-foreground">{prev.title}</span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-1 flex-col items-end gap-0.5 rounded-lg border border-border p-3 text-right transition-colors hover:border-primary/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Next <LuArrowRight className="size-3" />
          </span>
          <span className="w-full truncate text-sm font-medium group-hover:text-foreground">{next.title}</span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
};
