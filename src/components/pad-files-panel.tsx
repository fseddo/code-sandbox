"use client";

import { useState } from "react";
import { FilePlus, Trash2 } from "lucide-react";
import { SandpackFileExplorer, useSandpack } from "@codesandbox/sandpack-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/** Normalizes a user-typed file name to an absolute pad path. */
function normalizePath(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/** Starter content for a new file — a component stub for .tsx/.jsx, else blank. */
function starterContent(path: string): string {
  if (!/\.(tsx|jsx)$/.test(path)) return "";
  const fileName = path.split("/").pop() ?? "";
  const base = fileName.replace(/\.(tsx|jsx)$/, "").replace(/[^\w]/g, "");
  const name = base ? base[0].toUpperCase() + base.slice(1) : "Component";
  return `export default function ${name}() {\n  return <div>${name}</div>;\n}\n`;
}

/** File tree with a toolbar for creating and deleting files. */
export function PadFilesPanel() {
  const { sandpack } = useSandpack();
  const [newFileOpen, setNewFileOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function openNewFileDialog() {
    setName("");
    setError(null);
    setNewFileOpen(true);
  }

  function createFile(event: React.FormEvent) {
    event.preventDefault();
    const path = normalizePath(name);
    if (!path) {
      setError("Enter a file name.");
      return;
    }
    if (sandpack.files[path]) {
      setError("A file with that name already exists.");
      return;
    }
    sandpack.addFile(path, starterContent(path));
    sandpack.openFile(path);
    toast.success(`Created ${path}`);
    setNewFileOpen(false);
  }

  function deleteActiveFile() {
    const path = sandpack.activeFile;
    sandpack.deleteFile(path);
    toast.success(`Deleted ${path}`);
    setDeleteOpen(false);
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-9 shrink-0 items-center justify-between border-b pr-1.5 pl-3">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Files
        </span>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="New file"
            onClick={openNewFileDialog}
          >
            <FilePlus className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete current file"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <SandpackFileExplorer style={{ height: "100%" }} />
      </div>

      <Dialog open={newFileOpen} onOpenChange={setNewFileOpen}>
        <DialogContent>
          <form onSubmit={createFile} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>New file</DialogTitle>
              <DialogDescription>
                Enter a path relative to the project root.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-1.5">
              <Input
                autoFocus
                value={name}
                placeholder="components/Button.tsx"
                onChange={(event) => {
                  setName(event.target.value);
                  setError(null);
                }}
              />
              {error ? (
                <p className="text-xs text-destructive">{error}</p>
              ) : null}
            </div>
            <DialogFooter>
              <Button type="submit">Create file</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              <code className="font-mono text-foreground">
                {sandpack.activeFile}
              </code>{" "}
              will be permanently removed from this pad.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteActiveFile}>
              Delete file
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
