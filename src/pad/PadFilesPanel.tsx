"use client";

import { useState } from "react";
import { FilePlus, Trash2 } from "lucide-react";
import { SandpackFileExplorer, useSandpack } from "@codesandbox/sandpack-react";
import type { usePadSave } from "@/pad/usePadSave";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** Normalizes a user-typed file name to an absolute pad path. */
const normalizePath = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

/** Starter content for a new file — a component stub for .tsx/.jsx, else blank. */
const starterContent = (path: string): string => {
  if (!/\.(tsx|jsx)$/.test(path)) return "";
  const fileName = path.split("/").pop() ?? "";
  const base = fileName.replace(/\.(tsx|jsx)$/, "").replace(/[^\w]/g, "");
  const name = base ? base[0].toUpperCase() + base.slice(1) : "Component";
  return `const ${name} = () => <div>${name}</div>;\n\nexport default ${name};\n`;
};

type PadSaveOps = Pick<ReturnType<typeof usePadSave>, "addFile" | "deleteFile">;

/** File tree with a toolbar for creating and deleting files. */
export const PadFilesPanel = ({ addFile, deleteFile }: PadSaveOps) => {
  const { sandpack } = useSandpack();
  const [newFileOpen, setNewFileOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const openNewFileDialog = () => {
    setName("");
    setError(null);
    setNewFileOpen(true);
  };

  const createFile = () => {
    const path = normalizePath(name);
    if (!path) {
      setError("Enter a file name.");
      return;
    }
    if (sandpack.files[path]) {
      setError("A file with that name already exists.");
      return;
    }
    addFile(path, starterContent(path));
    toast.success(`Created ${path}`);
    setNewFileOpen(false);
  };

  const deleteActiveFile = () => {
    const path = sandpack.activeFile;
    deleteFile(path);
    toast.success(`Deleted ${path}`);
  };

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
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Delete current file"
              >
                <Trash2 className="size-4" />
              </Button>
            }
            title="Delete this file?"
            description={
              <>
                <code className="font-mono text-foreground">
                  {sandpack.activeFile}
                </code>{" "}
                will be permanently removed from this pad.
              </>
            }
            confirmLabel="Delete file"
            onConfirm={deleteActiveFile}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <SandpackFileExplorer style={{ height: "100%" }} />
      </div>

      <Dialog open={newFileOpen} onOpenChange={setNewFileOpen}>
        <DialogContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              createFile();
            }}
            className="grid gap-4"
          >
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

    </div>
  );
};
