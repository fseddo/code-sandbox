"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code2, Link2, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { clearPad } from "@/pad/pad";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Separator } from "@/components/ui/separator";

/** Top bar of a pad: branding, save state, and pad actions. */
export const PadToolbar = ({
  padId,
  isDirty,
}: {
  padId: string;
  isDirty: boolean;
}) => {
  const router = useRouter();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Pad link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const resetPad = () => {
    clearPad(padId);
    window.location.reload();
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b px-3">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Code2 className="size-4 text-primary" />
        <span>codepad</span>
      </Link>
      <Separator orientation="vertical" className="h-5!" />
      <Badge variant="secondary" className="font-mono font-normal">
        {padId}
      </Badge>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span
          className={cn(
            "size-1.5 rounded-full",
            isDirty ? "bg-amber-500" : "bg-emerald-500",
          )}
        />
        {isDirty ? "Unsaved" : "Saved"}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={copyLink}>
          <Link2 className="size-4" />
          Copy link
        </Button>

        <ConfirmDialog
          trigger={
            <Button variant="outline" size="sm">
              <RotateCcw className="size-4" />
              Reset
            </Button>
          }
          title="Reset this pad?"
          description="This restores the starter template and permanently discards the code saved in this pad."
          confirmLabel="Reset pad"
          onConfirm={resetPad}
        />

        <Button variant="outline" size="sm" onClick={() => router.push("/pad")}>
          <Plus className="size-4" />
          New pad
        </Button>
      </div>
    </header>
  );
};
