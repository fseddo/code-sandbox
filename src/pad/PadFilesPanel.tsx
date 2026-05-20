"use client";

import { useState } from "react";
import { LuFilePlus, LuFolderPlus } from "react-icons/lu";
import { useSandpack } from "@codesandbox/sandpack-react";
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
import { PadFileTree } from "@/pad/PadFileTree";

type CreateKind = "file" | "folder";

type CreateState = {
  open: boolean;
  dirPath: string;
  kind: CreateKind;
  name: string;
  error: string | null;
};

const CLOSED_CREATE: CreateState = {
  open: false,
  dirPath: "/",
  kind: "file",
  name: "",
  error: null,
};

/** Joins a directory path and an entry name into an absolute path. */
const joinPath = (dir: string, name: string): string => {
  const cleanDir = dir === "/" ? "" : dir.replace(/\/$/, "");
  const cleanName = name.replace(/^\/+/, "");
  return `${cleanDir}/${cleanName}`;
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

/** File tree with a slim header for root-level file creation. */
export const PadFilesPanel = ({ addFile, deleteFile }: PadSaveOps) => {
  const { sandpack } = useSandpack();
  const [createState, setCreateState] = useState<CreateState>(CLOSED_CREATE);
  const [deletePath, setDeletePath] = useState<string | null>(null);

  const openCreateDialog = (dirPath: string, kind: CreateKind) => {
    setCreateState({ open: true, dirPath, kind, name: "", error: null });
  };

  const closeCreateDialog = () => setCreateState(CLOSED_CREATE);

  const setError = (error: string) =>
    setCreateState((prev) => ({ ...prev, error }));

  const create = () => {
    const trimmed = createState.name.trim();
    if (!trimmed) {
      setError(`Enter a ${createState.kind} name.`);
      return;
    }
    if (trimmed.includes("/")) {
      setError("Use a single name — nesting comes from the row you click.");
      return;
    }
    if (createState.kind === "folder") {
      const filePath = joinPath(joinPath(createState.dirPath, trimmed), "index.ts");
      if (sandpack.files[filePath]) {
        setError("That folder already exists.");
        return;
      }
      addFile(filePath, "");
      toast.success(`Created ${trimmed}/`);
    } else {
      const filePath = joinPath(createState.dirPath, trimmed);
      if (sandpack.files[filePath]) {
        setError("A file with that name already exists.");
        return;
      }
      addFile(filePath, starterContent(filePath));
      toast.success(`Created ${filePath}`);
    }
    closeCreateDialog();
  };

  const confirmDelete = () => {
    if (!deletePath) return;
    deleteFile(deletePath);
    toast.success(`Deleted ${deletePath}`);
    setDeletePath(null);
  };

  const dialogTitle = createState.kind === "folder" ? "New folder" : "New file";
  const dialogDescription =
    createState.kind === "folder"
      ? `Creates an empty index.ts inside the new folder, under ${createState.dirPath}.`
      : `Saves under ${createState.dirPath}.`;
  const placeholder = createState.kind === "folder" ? "components" : "Button.tsx";

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-sidebar-border pr-1.5 pl-3">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Files
        </span>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="New file at root"
            title="New file at root"
            onClick={() => openCreateDialog("/", "file")}
          >
            <LuFilePlus className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="New folder at root"
            title="New folder at root"
            onClick={() => openCreateDialog("/", "folder")}
          >
            <LuFolderPlus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <PadFileTree
          onCreateInDir={openCreateDialog}
          onDelete={setDeletePath}
        />
      </div>

      <Dialog
        open={createState.open}
        onOpenChange={(open) => (open ? null : closeCreateDialog())}
      >
        <DialogContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              create();
            }}
            className="grid gap-4"
          >
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-1.5">
              <Input
                autoFocus
                value={createState.name}
                placeholder={placeholder}
                onChange={(event) =>
                  setCreateState((prev) => ({
                    ...prev,
                    name: event.target.value,
                    error: null,
                  }))
                }
              />
              {createState.error ? (
                <p className="text-xs text-destructive">{createState.error}</p>
              ) : null}
            </div>
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deletePath !== null}
        onOpenChange={(open) => {
          if (!open) setDeletePath(null);
        }}
        title="Delete this file?"
        description={
          <>
            <code className="font-mono text-foreground">{deletePath}</code> will
            be permanently removed from this pad.
          </>
        }
        confirmLabel="Delete file"
        onConfirm={confirmDelete}
      />
    </div>
  );
};
