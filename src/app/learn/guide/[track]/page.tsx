import { redirect } from "next/navigation";
import { firstEntryHref, isTrackId } from "@/learn/data/curriculum";

/** A track has no landing of its own — bounce to its first entry so the stepped view always opens on content. */
const TrackHome = async ({ params }: { params: Promise<{ track: string }> }) => {
  const { track } = await params;
  const href = isTrackId(track) ? firstEntryHref(track) : undefined;
  if (href) redirect(href);

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center text-muted-foreground">
      This track has no content yet — check back soon.
    </div>
  );
};

export default TrackHome;
