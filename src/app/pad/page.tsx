import { redirect } from "next/navigation";
import { newPadId } from "@/pad/pad";

// Always mint a fresh id on visit, never serve a cached redirect.
export const dynamic = "force-dynamic";

const NewPad = () => {
  redirect(`/pad/${newPadId()}`);
};

export default NewPad;
