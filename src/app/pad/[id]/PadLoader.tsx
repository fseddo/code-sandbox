"use client";

import dynamic from "next/dynamic";

// Sandpack touches the DOM on import, so it must never render on the server.
const CoderPad = dynamic(() => import("@/pad/CoderPad").then((m) => m.CoderPad), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Loading workspace…
    </div>
  ),
});

export const CoderPadLoader = ({ padId }: { padId: string }) => (
  <CoderPad padId={padId} />
);
