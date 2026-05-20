import { CoderPadLoader } from "./PadLoader";

const PadPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <main className="h-screen w-screen overflow-hidden">
      <CoderPadLoader padId={id} />
    </main>
  );
};

export default PadPage;
