import type { NextRequest } from "next/server";
import type { RunMode, SupportedLanguage } from "@/judge/problem";
import { getProblem } from "@/judge/problems";
import { runSubmission } from "@/judge/runner/runSubmission";

// Worker threads + node:vm are Node-only; the Edge runtime can't host them.
export const runtime = "nodejs";

const LANGUAGES: SupportedLanguage[] = ["javascript", "typescript"];

type JudgeBody = { problemId?: unknown; language?: unknown; source?: unknown; mode?: unknown };

export const POST = async (request: NextRequest) => {
  const { problemId, language, source, mode }: JudgeBody = await request.json().catch(() => ({}));

  if (typeof problemId !== "string" || typeof source !== "string" || typeof language !== "string") {
    return Response.json({ error: "Expected { problemId, language, source }." }, { status: 400 });
  }
  if (!LANGUAGES.includes(language as SupportedLanguage)) {
    return Response.json({ error: `Unsupported language: ${language}.` }, { status: 400 });
  }
  const problem = getProblem(problemId);
  if (!problem) {
    return Response.json({ error: `Unknown problem: ${problemId}.` }, { status: 404 });
  }
  // The worker judges pure functions; build problems aren't run here.
  if (problem.kind !== "algo") {
    return Response.json({ error: `Problem is not runnable: ${problemId}.` }, { status: 400 });
  }

  // Default to the exposed-only run; only an explicit "submit" pulls in the hidden set.
  const runMode: RunMode = mode === "submit" ? "submit" : "run";
  const outcome = await runSubmission({ problem, language: language as SupportedLanguage, source, mode: runMode });
  return Response.json(outcome);
};
