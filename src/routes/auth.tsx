import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — HotelGroupBook" },
      {
        name: "description",
        content: "Sign in to the HotelGroupBook content administration area.",
      },
      { property: "og:title", content: "Sign in — HotelGroupBook" },
      {
        property: "og:description",
        content: "Sign in to the HotelGroupBook content administration area.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0B0D] px-5">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setMessage(null);
          try {
            if (mode === "signin") {
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              if (error) throw error;
              await router.navigate({ to: "/" });
            } else {
              const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: window.location.origin },
              });
              if (error) throw error;
              setMessage("Check your email to confirm your account.");
            }
          } catch (err) {
            setMessage(err instanceof Error ? err.message : "Something went wrong");
          } finally {
            setBusy(false);
          }
        }}
        className="w-full max-w-[380px] rounded-xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md"
      >
        <h1
          className="text-center text-[28px] font-light text-white"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mt-6 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-[#6B7683] outline-none focus:border-[#FFC400]/60"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-3 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-[#6B7683] outline-none focus:border-[#FFC400]/60"
        />
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-md bg-[#F5AE00] px-4 py-2.5 text-sm font-semibold text-[#04111A] transition-colors hover:bg-[#FFC400] disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-xs text-[#8A96A2] transition-colors hover:text-[#FFC400]"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
        {message && <p className="mt-4 text-center text-xs text-[#E7D3AE]">{message}</p>}
      </form>
    </main>
  );
}