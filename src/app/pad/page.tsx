import { redirect } from "next/navigation";
import { newPadId } from "@/lib/pad";

// Always mint a fresh id on visit, never serve a cached redirect.
export const dynamic = "force-dynamic";

export default function NewPad() {
  redirect(`/pad/${newPadId()}`);
}
