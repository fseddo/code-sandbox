import { CoderPadLoader } from "./pad-loader";

export default async function PadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="h-screen w-screen overflow-hidden">
      <CoderPadLoader padId={id} />
    </main>
  );
}
