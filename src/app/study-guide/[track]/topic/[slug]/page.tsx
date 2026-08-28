import { notFound } from "next/navigation";
import { getTopic } from "@/learn/data/topics";
import { listProblemSummaries, type ProblemSummary } from "@/problems/data/problems";
import { TRACKS, resolveTrack, type TrackId } from "@/learn/data/curriculum";
import { LearnArticle } from "@/learn/article/LearnArticle";
import { TopicReadToggle } from "@/learn/guide/TopicReadToggle";

// Prerender each track's chapter-intro topic pages; the valid {track, slug} pairs come from the curriculum.
export const generateStaticParams = () =>
  (Object.keys(TRACKS) as TrackId[]).flatMap((track) =>
    resolveTrack(track)
      .flatMap((chapter) => chapter.entries)
      .flatMap((entry) => (entry.kind === "topic" ? [{ track, slug: entry.slug }] : [])),
  );

const GuideTopicPage = async ({ params }: { params: Promise<{ track: string; slug: string }> }) => {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const problemsById: Record<string, ProblemSummary> = Object.fromEntries(
    listProblemSummaries().map((problem) => [problem.id, problem]),
  );

  return (
    <>
      <div className="mx-auto flex max-w-5xl justify-end px-6 pt-6">
        <TopicReadToggle slug={topic.slug} />
      </div>
      <LearnArticle topic={topic} problemsById={problemsById} />
    </>
  );
};

export default GuideTopicPage;
