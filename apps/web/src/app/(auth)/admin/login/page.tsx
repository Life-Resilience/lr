"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import { adminLoginAction, clearPendingLoginAction } from "../auth-actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const unauthorizedError = searchParams.get("error") === "unauthorized";

  useEffect(() => {
    clearPendingLoginAction();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    startTransition(async () => {
      // 1. Attempt client-side Supabase sign-in so browser cookies are populated if password matches
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        await supabase.auth.signInWithPassword({ email, password });
      } catch {
        // Ignore if using server env password
      }

      // 2. Run admin login action
      const res = await adminLoginAction(null, formData);
      if (!res.success) {
        setErrorMessage(res.error || "Authentication failed.");
      } else if (res.redirect) {
        router.push(res.redirect);
      }
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-8 py-16 px-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase">
          Command Center
        </h1>
        <p className="text-[14px] text-muted-foreground">
          Sign in to access the administration panel.
        </p>
      </div>

      {unauthorizedError && (
        <div className="flex items-center gap-3 bg-red-500/10 p-4 rounded-sm border border-red-500/20 text-[13px] text-red-500">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Please sign in with your administrator account.</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20 text-red-500 text-[13px]">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border px-4 h-14 focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all rounded-sm text-[15px] text-foreground border-border/60"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border px-4 h-14 pr-12 focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all rounded-sm text-[15px] text-foreground border-border/60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-3"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full flex items-center justify-center gap-3 text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 h-14 rounded-sm transition-all hover:bg-foreground/90 disabled:opacity-60 mt-2"
        >
          {isPending ? "AUTHENTICATING…" : "SIGN IN →"}
        </button>
      </form>
    </div>
  );
}
