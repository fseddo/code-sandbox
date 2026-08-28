"use client";

import { LuBookOpenCheck } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { toggleComplete, topicProgressKey } from "@/problems/progress/progress";
import { useProgress } from "@/problems/progress/useProgress";

/**
 * Manual completion for a study-guide article. Like a build problem, a lesson has no pass/fail oracle —
 * "read" is the reader's own call — so this mirrors [BuildToolbar](../../problems/build/BuildToolbar.tsx)'s
 * toggle rather than inventing a second completion model.
 */
export const TopicReadToggle = ({ slug }: { slug: string }) => {
  const key = topicProgressKey(slug);
  const isRead = useProgress()(key) === "complete";

  return (
    <Button variant={isRead ? "success" : "outline"} size="sm" onClick={() => toggleComplete(key)}>
      <LuBookOpenCheck className="size-3.5" />
      {isRead ? "Read" : "Mark as read"}
    </Button>
  );
};
