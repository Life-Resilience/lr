"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, LogOut } from "lucide-react";
import { getMfaSetupData, verifyMfaAction, adminLogoutAction } from "../auth-actions";

export default function AdminMFAPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [setupData, setSetupData] = useState<{
    email?: string;
    secret?: string;
  } | null>(null);

  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getMfaSetupData();
      if (!data?.secret) {
        router.replace("/admin/login");
        return;
      }
      setSetupData(data);
      setIsLoading(false);
    }
    loadData();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setErrorMessage("Please enter your 6-digit code.");
      return;
    }

    setErrorMessage(null);
    startTransition(async () => {
      const res = await verifyMfaAction(code);
      if (res.success) {
        router.replace("/admin");
        router.refresh();
      } else {
        setErrorMessage(res.error || "Incorrect code. Please try again.");
      }
    });
  };

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogoutAction();
      router.replace("/admin/login");
      router.refresh();
    });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="w-6 h-6 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Loading Two-Factor Authentication…
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-8 py-16 px-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 mb-1">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase">
          Security Verification
        </h1>
        <p className="text-[14px] text-muted-foreground">
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20 text-red-500 text-[13px]">
          {errorMessage}
        </div>
      )}

      {/* Verification Code Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="code" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Authenticator Code
            </label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {setupData?.email}
            </span>
          </div>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            autoFocus
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full bg-background border px-4 h-14 focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all rounded-sm text-[26px] font-mono text-center tracking-[0.4em] text-foreground border-border/60"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={isPending || code.length !== 6}
            className="w-full flex items-center justify-center gap-3 text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 h-14 rounded-sm transition-all hover:bg-foreground/90 disabled:opacity-50"
          >
            {isPending ? "VERIFYING…" : "VERIFY & ENTER WORKSPACE"}
            {!isPending && <ArrowRight className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 py-2 text-[12px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cancel & Sign Out</span>
          </button>
        </div>
      </form>

    </div>
  );
}
