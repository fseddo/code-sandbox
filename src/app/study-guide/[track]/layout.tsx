import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { GuideSidebar } from "@/learn/guide/GuideSidebar";
import { GuideEntryNav } from "@/learn/guide/GuideEntryNav";
import { TRACKS, isTrackId, resolveTrack } from "@/learn/data/curriculum";

const GuideLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ track: string }>;
}) => {
  const { track } = await params;
  if (!isTrackId(track)) notFound();
  const meta = TRACKS[track];
  const chapters = resolveTrack(track);
  const navEntries = chapters.flatMap((chapter) =>
    chapter.entries.map((entry) => ({ title: entry.title, href: entry.href })),
  );

  return (
    <div className="flex h-screen flex-col">
      <AppHeader
        crumb={[{ label: "Interview Study Guide", href: "/study-guide" }, { label: meta.title }]}
      />
      <div className="flex min-h-0 flex-1">
        <GuideSidebar trackTitle={meta.title} chapters={chapters} />
        <main className="min-w-0 flex-1 overflow-auto">
          {children}
          <GuideEntryNav entries={navEntries} />
        </main>
      </div>
    </div>
  );
};

export default GuideLayout;
