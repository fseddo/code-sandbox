"use client";

import { useMemo, useState } from "react";
import {
  LuChevronDown,
  LuChevronRight,
  LuFolder,
  LuFolderOpen,
  LuFolderPlus,
  LuFilePlus,
  LuTrash2,
} from "react-icons/lu";
import { useSandpack } from "@codesandbox/sandpack-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { iconFor } from "@/pad/fileIcons";

type FileNode = {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileNode[];
};

const ROOT_PATH = "/";

const segmentsOf = (path: string) => path.split("/").filter(Boolean);

/** Builds a tree from a flat list of absolute paths. */
const buildTree = (paths: readonly string[]): FileNode => {
  const root: FileNode = { name: "", path: ROOT_PATH, isDir: true, children: [] };
  for (const path of paths) {
    const segs = segmentsOf(path);
    let cursor = root;
    segs.forEach((name, i) => {
      const isLast = i === segs.length - 1;
      const childPath = `/${segs.slice(0, i + 1).join("/")}`;
      let next = cursor.children!.find((c) => c.name === name);
      if (!next) {
        next = {
          name,
          path: childPath,
          isDir: !isLast,
          children: isLast ? undefined : [],
        };
        cursor.children!.push(next);
      }
      cursor = next;
    });
  }
  const sortLevel = (node: FileNode) => {
    if (!node.children) return;
    node.children.sort((a, b) =>
      a.isDir !== b.isDir
        ? a.isDir
          ? -1
          : 1
        : a.name.localeCompare(b.name),
    );
    node.children.forEach(sortLevel);
  };
  sortLevel(root);
  return root;
};

/** True if `dirPath` is a prefix of `filePath` (or equal). */
const dirContains = (dirPath: string, filePath: string): boolean =>
  filePath === dirPath || filePath.startsWith(`${dirPath}/`);

export type PadFileTreeActions = {
  onCreateInDir: (dirPath: string, kind: "file" | "folder") => void;
  onDelete: (path: string) => void;
};

/**
 * Recursive file tree. Reads files + active file from Sandpack, renders rows
 * with extension-aware icons, full-row click + selection, and per-row hover
 * actions (new file / new folder on directories, delete on files).
 */
export const PadFileTree = ({ onCreateInDir, onDelete }: PadFileTreeActions) => {
  const { sandpack } = useSandpack();
  const { files, activeFile, setActiveFile } = sandpack;

  const visiblePaths = useMemo(
    () => Object.entries(files)
      .filter(([, file]) => !file.hidden)
      .map(([path]) => path),
    [files],
  );
  const tree = useMemo(() => buildTree(visiblePaths), [visiblePaths]);

  // Default-expand any directory that contains the active file.
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const init = new Set<string>([ROOT_PATH]);
    const segs = segmentsOf(activeFile);
    for (let i = 0; i < segs.length - 1; i++) {
      init.add(`/${segs.slice(0, i + 1).join("/")}`);
    }
    return init;
  });

  const toggleExpanded = (path: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  return (
    <ul className="py-1 text-sm">
      {tree.children?.map((node) => (
        <TreeRow
          key={node.path}
          node={node}
          depth={0}
          expanded={expanded}
          toggleExpanded={toggleExpanded}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          onCreateInDir={onCreateInDir}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

type TreeRowProps = {
  node: FileNode;
  depth: number;
  expanded: Set<string>;
  toggleExpanded: (path: string) => void;
  activeFile: string;
  setActiveFile: (path: string) => void;
} & PadFileTreeActions;

const TreeRow = ({
  node,
  depth,
  expanded,
  toggleExpanded,
  activeFile,
  setActiveFile,
  onCreateInDir,
  onDelete,
}: TreeRowProps) => {
  const isOpen = expanded.has(node.path);
  const isActive = !node.isDir && node.path === activeFile;
  const isOnActivePath = node.isDir && dirContains(node.path, activeFile);

  const onActivate = () => {
    if (node.isDir) toggleExpanded(node.path);
    else setActiveFile(node.path);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate();
    }
  };

  const Caret = node.isDir
    ? isOpen
      ? LuChevronDown
      : LuChevronRight
    : null;
  const { Icon, color } = node.isDir
    ? { Icon: isOpen ? LuFolderOpen : LuFolder, color: "text-indigo-300" }
    : iconFor(node.name);

  return (
    <li>
      <div
        role="treeitem"
        tabIndex={0}
        aria-selected={isActive}
        aria-expanded={node.isDir ? isOpen : undefined}
        onClick={onActivate}
        onKeyDown={onKeyDown}
        style={{ paddingLeft: `${depth * 12 + 6}px` }}
        className={cn(
          "group/row relative flex h-7 cursor-pointer items-center gap-1 pr-1 select-none",
          "hover:bg-accent/60",
          isActive && "bg-accent text-accent-foreground",
          !isActive && isOnActivePath && "text-foreground",
          !isActive && !isOnActivePath && "text-muted-foreground",
        )}
      >
        {isActive ? (
          <span
            aria-hidden
            className="absolute top-0 bottom-0 left-0 w-0.5 bg-primary"
          />
        ) : null}
        <span className="flex w-3 shrink-0 justify-center">
          {Caret ? <Caret className="size-3" /> : null}
        </span>
        <Icon className={cn("size-4 shrink-0", color)} />
        <span className="truncate">{node.name}</span>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/row:opacity-100 focus-within:opacity-100">
          {node.isDir ? (
            <>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`New file in ${node.name}`}
                title="New file"
                onClick={(event) => {
                  event.stopPropagation();
                  onCreateInDir(node.path, "file");
                }}
              >
                <LuFilePlus className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`New folder in ${node.name}`}
                title="New folder"
                onClick={(event) => {
                  event.stopPropagation();
                  onCreateInDir(node.path, "folder");
                }}
              >
                <LuFolderPlus className="size-3" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Delete ${node.name}`}
              title="Delete"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(node.path);
              }}
            >
              <LuTrash2 className="size-3" />
            </Button>
          )}
        </div>
      </div>
      {node.isDir && isOpen && node.children?.length ? (
        <ul>
          {node.children.map((child) => (
            <TreeRow
              key={child.path}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              toggleExpanded={toggleExpanded}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              onCreateInDir={onCreateInDir}
              onDelete={onDelete}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};
