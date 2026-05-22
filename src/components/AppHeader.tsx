"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuSearch, LuWaves } from "react-icons/lu";
import { useCommandPalette } from "./CommandPaletteProvider";
import { PadsMenu } from "./PadsMenu";
import { cn } from "@/lib/utils";

/** The shared app shell header: brand, primary nav, the ⌘K search trigger, and global actions. */
export const AppHeader = () => {
  const pathname = usePathname();
  const { open } = useCommandPalette();

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-sidebar-border bg-card px-4">
      <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
        <LuWaves className="size-5 text-primary" />
        noodle
      </Link>

      <nav className="flex items-center gap-1">
        <Link
          href="/"
          className={cn(
            "rounded-md px-2.5 py-1 text-sm transition-colors",
            pathname === "/"
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Problems
        </Link>
        <PadsMenu />
      </nav>

      <button
        type="button"
        onClick={open}
        className="flex h-9 w-full flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50"
      >
        <LuSearch className="size-4" />
        Jump to problem, topic, or company…
        <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 text-[0.7rem]">⌘K</kbd>
      </button>
    </header>
  );
};
