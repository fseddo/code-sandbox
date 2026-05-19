"use client";

import dynamic from "next/dynamic";

// Sandpack touches the DOM on import, so it must never render on the server.
const CoderPad = dynamic(() => import("@/components/coder-pad"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Loading workspace…
    </div>
  ),
});

export function CoderPadLoader({ padId }: { padId: string }) {
  return <CoderPad padId={padId} />;
}
