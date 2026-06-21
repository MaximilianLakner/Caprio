import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Profil",
  description: "Bearbeite dein Caprio-Profil.",
};

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/anmelden?redirect=/profil");

  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("dachboxen")
      .select("*", { count: "exact", head: true })
      .eq("host_id", user.id),
  ]);

  const fullName: string = profile?.name ?? "";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ");
  const boxCount = count ?? 0;

  return (
    <div className="mx-auto max-w-2xl px-3 py-14 sm:px-8">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-taupe-700">
          Mein Bereich
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Profil bearbeiten
        </h1>
        <p className="mt-3 text-ink-soft">
          Aktualisiere deinen Namen und dein Profilbild.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-cream p-6 sm:p-8">
        <ProfileForm
          firstName={firstName ?? ""}
          lastName={lastName}
          name={profile?.name}
          email={user.email!}
          avatarUrl={profile?.avatar_url ?? null}
        />
      </div>

      {/* Uploaded boxes shortcut */}
      <Link
        href="/meine-boxen"
        className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-cream p-5 transition-colors hover:border-taupe-300"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blush-100">
            <Package size={18} className="text-clay-600" />
          </span>
          <div>
            <p className="font-semibold text-ink">Meine Dachboxen</p>
            <p className="text-sm text-ink-soft">
              {boxCount === 0
                ? "Noch keine Box inseriert"
                : `${boxCount} ${boxCount === 1 ? "Box" : "Boxen"} inseriert`}
            </p>
          </div>
        </div>
        <ArrowRight size={18} className="text-ink-soft" />
      </Link>
    </div>
  );
}
