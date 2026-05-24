"use client";

import { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

/** Copy-to-clipboard control for a code block — fades in on hover of the block (the `group` ancestor). */
export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className="absolute top-2 right-2 rounded-md border border-border bg-card/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
    >
      {copied ? <LuCheck className="size-3.5 text-emerald-400" /> : <LuCopy className="size-3.5" />}
    </button>
  );
};
