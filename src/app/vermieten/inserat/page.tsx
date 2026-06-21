import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InseratForm } from "./inserat-form";

export const metadata: Metadata = {
  title: "Box inserieren",
  description: "Inseriere deine Dachbox auf Caprio.",
};

export default async function InseratPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/anmelden?redirect=/vermieten/inserat");

  return (
    <div className="mx-auto max-w-3xl px-3 py-14 sm:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-taupe-700">
          Box vermieten
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Deine Box inserieren
        </h1>
        <p className="mt-3 text-ink-soft">
          Füll die Details aus – Mieter:innen sehen genau das, was du hier eingibst.
        </p>
      </div>

      <InseratForm />
    </div>
  );
}
