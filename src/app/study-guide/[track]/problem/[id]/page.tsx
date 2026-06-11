import { notFound } from "next/navigation";
import { getProblem, listProblemSummaries, type ProblemSummary } from "@/problems/data/problems";
import { TRACKS, resolveTrack, type TrackId } from "@/learn/data/curriculum";
import { ProblemGuide } from "@/learn/guide/ProblemGuide";

// Prerender each track's practice-problem pages; the valid {track, id} pairs come from the curriculum.
export const generateStaticParams = () =>
  (Object.keys(TRACKS) as TrackId[]).flatMap((track) =>
    resolveTrack(track)
      .flatMap((chapter) => chapter.entries)
      .flatMap((entry) => (entry.kind === "problem" ? [{ track, id: entry.id }] : [])),
  );

const GuideProblemPage = async ({ params }: { params: Promise<{ track: string; id: string }> }) => {
  const { id } = await params;
  const problem = getProblem(id);
  if (!problem) notFound();

  const problemsById: Record<string, ProblemSummary> = Object.fromEntries(
    listProblemSummaries().map((summary) => [summary.id, summary]),
  );

  return <ProblemGuide problem={problem} problemsById={problemsById} />;
};

export default GuideProblemPage;
