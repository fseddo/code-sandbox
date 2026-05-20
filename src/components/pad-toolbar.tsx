"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code2, Link2, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { clearPad } from "@/lib/pad";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/** Top bar of a pad: branding, save state, and pad actions. */
export function PadToolbar({
  padId,
  isDirty,
}: {
  padId: string;
  isDirty: boolean;
}) {
  const router = useRouter();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Pad link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  }

  function resetPad() {
    clearPad(padId);
    window.location.reload();
  }

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
          className={`size-1.5 rounded-full ${
            isDirty ? "bg-amber-500" : "bg-emerald-500"
          }`}
        />
        {isDirty ? "Unsaved" : "Saved"}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={copyLink}>
          <Link2 className="size-4" />
          Copy link
        </Button>

        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
            <RotateCcw className="size-4" />
            Reset
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset this pad?</AlertDialogTitle>
              <AlertDialogDescription>
                This restores the starter template and permanently discards the
                code saved in this pad.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetPad}>
                Reset pad
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button variant="outline" size="sm" onClick={() => router.push("/pad")}>
          <Plus className="size-4" />
          New pad
        </Button>
      </div>
    </header>
  );
}
