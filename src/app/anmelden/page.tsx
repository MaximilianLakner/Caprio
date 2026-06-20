import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "./auth-form";

export const metadata: Metadata = {
  title: "Anmelden",
  description: "Melde dich bei Caprio an oder erstelle ein Konto.",
};

export default async function AnmeldenPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;

  // If Supabase is configured, redirect already-logged-in users
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) redirect(params.redirect ?? "/meine-boxen");
    } catch {}
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-20">
      <AuthForm redirectTo={params.redirect} />
    </div>
  );
}
