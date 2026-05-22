"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuChevronDown, LuPlus } from "react-icons/lu";
import { relativeTime, useRecentPads } from "@/pad/useRecentPads";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const MAX_RECENT = 8;

/**
 * The "Pads" nav as a two-segment control: the left segment opens a dropdown of recent pads to revisit;
 * the `+` segment mints a fresh pad (`/pad` redirects to a new id). One control, so there's no separate
 * "New pad" button.
 */
export const PadsMenu = () => {
  const pathname = usePathname();
  const pads = useRecentPads();
  const isActive = pathname.startsWith("/pad");

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-border transition-colors",
        isActive && "bg-muted",
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex items-center gap-1 rounded-l-md py-1 pr-1.5 pl-2.5 text-sm transition-colors hover:bg-muted",
            isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          Pads
          <LuChevronDown className="size-3.5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-60">
          {pads.length === 0 ? (
            <DropdownMenuLabel className="font-normal text-muted-foreground">No pads yet</DropdownMenuLabel>
          ) : (
            pads.slice(0, MAX_RECENT).map((pad) => (
              <DropdownMenuItem key={pad.id} render={<Link href={`/pad/${pad.id}`} />}>
                <span className={cn("min-w-0 flex-1 truncate", !pad.title && "font-mono text-xs")}>
                  {pad.title ?? pad.id}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{relativeTime(pad.updatedAt)}</span>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        href="/pad"
        aria-label="New pad"
        title="New pad"
        className="flex items-center rounded-r-md border-l border-border px-1.5 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LuPlus className="size-4" />
      </Link>
    </div>
  );
};
