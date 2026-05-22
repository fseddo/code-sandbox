type EditorToolbarProps = {
  /** Left-aligned context: the judge's language toggle, or nothing (build's file path lives in its own row below). */
  leading?: React.ReactNode;
  /** Right-aligned action cluster: save status, Format, Save, and any editor-specific actions. */
  children: React.ReactNode;
};

/** Shared editor-pane toolbar shell: a fixed-height divider row with a leading context slot and a trailing action cluster. */
export const EditorToolbar = ({ leading, children }: EditorToolbarProps) => (
  <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-3">
    <div className="flex items-center gap-3">{leading}</div>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);
