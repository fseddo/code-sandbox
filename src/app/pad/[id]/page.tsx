import { redirect } from "next/navigation";
import { getProblem } from "@/judge/problems";
import { CoderPadLoader } from "./PadLoader";

const PadPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  // A problem id isn't a scratchpad — build problems share pad storage but must open as the problem
  // (with their non-editable header), so a Pads-list entry or stale link lands on the right page.
  if (getProblem(id)) redirect(`/problems/${id}`);

  return (
    <main className="h-screen w-screen overflow-hidden">
      <CoderPadLoader padId={id} />
    </main>
  );
};

export default PadPage;
