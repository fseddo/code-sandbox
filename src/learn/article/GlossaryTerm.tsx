"use client";

import Link from "next/link";
import { PreviewCard } from "@base-ui/react/preview-card";
import type { ResolvedTerm } from "@/learn/data/glossary";

/** An inline glossary term: dotted underline + a hover/focus card with a short blurb and optional "Read more". */
export const GlossaryTerm = ({ label, blurb, href }: ResolvedTerm) => (
  <PreviewCard.Root>
    <PreviewCard.Trigger
      render={<span tabIndex={0} />}
      className="cursor-help font-medium text-foreground underline decoration-dotted decoration-primary/50 underline-offset-4 hover:decoration-primary focus-visible:outline-none"
    >
      {label}
    </PreviewCard.Trigger>
    <PreviewCard.Portal>
      <PreviewCard.Positioner sideOffset={6} className="z-50">
        <PreviewCard.Popup className="z-50 max-w-xs origin-(--transform-origin) rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <p className="text-sm leading-relaxed text-muted-foreground">{blurb}</p>
          {href && (
            <Link
              href={href}
              className="mt-2 inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Read more →
            </Link>
          )}
          <PreviewCard.Arrow className="size-2.5 rotate-45 rounded-[2px] border-r border-b border-border bg-popover data-[side=bottom]:-top-1 data-[side=top]:-bottom-1" />
        </PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
);
