"use client";

import { useMemo } from "react";
import { SandpackProvider, type SandpackFiles } from "@codesandbox/sandpack-react";
import { PAD_BASE_FILES, PAD_TEMPLATE, loadPad } from "@/pad/pad";
import { PadWorkspace } from "@/pad/PadWorkspace";

/** Sandpack bundler scoped to one pad. Client-only (Sandpack needs the DOM). */
const CoderPad = ({ padId }: { padId: string }) => {
  const files = useMemo<SandpackFiles>(
    () => ({ ...(loadPad(padId) ?? {}), ...PAD_BASE_FILES }),
    [padId],
  );

  return (
    <SandpackProvider
      key={padId}
      template={PAD_TEMPLATE}
      theme="dark"
      files={files}
      options={{
        autorun: false,
        autoReload: false,
      }}
      className="h-full!"
      style={{ height: "100%" }}
    >
      <PadWorkspace padId={padId} />
    </SandpackProvider>
  );
};

export default CoderPad;
