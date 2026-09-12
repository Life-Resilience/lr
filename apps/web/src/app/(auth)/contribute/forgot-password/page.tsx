"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() => {
    const err = searchParams.get("error");
    if (err === "expired") {
      return "Your password reset link is invalid or has expired. Please request a new one.";
    }
    return err ? decodeURIComponent(err) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const validateEmail = (val: string) => {
    if (!val.trim()) {
      return "Please enter your email address.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError(null);
    const err = validateEmail(email);
    if (err) {
      setFieldError(err);
      return;
    }

    setIsLoading(true);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${origin}/auth/callback?next=/contribute/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (resetError) {
        // Map common errors
        const msg = resetError.message.toLowerCase();
        if (msg.includes("rate limit") || msg.includes("too many requests")) {
          throw new Error("Too many password reset requests. Please wait a few minutes before trying again.");
        }
        throw resetError;
      }

      setSuccess(true);
      setResendCooldown(60);
    } catch (err: any) {
      setError(err?.message || "We could not process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${origin}/auth/callback?next=/contribute/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (resetError) throw resetError;

      setResendCooldown(60);
    } catch (err: any) {
      setError(err?.message || "Failed to resend reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col gap-8 pt-24 px-6 animate-in fade-in duration-500 text-center">
        <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase">
          Check your email
        </h1>
        <div className="flex flex-col gap-3 text-muted-foreground text-[15px] leading-relaxed">
          <p>
            We sent a password reset link to{" "}
            <strong className="text-foreground font-medium">{email}</strong>.
          </p>
          <p>
            Click the link in the email to securely choose a new password. The link will expire shortly.
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-[13px] bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20 text-left">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 mt-2">
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || isLoading}
            className="w-full flex items-center justify-center text-[13px] font-semibold uppercase tracking-widest text-foreground border border-border/60 bg-background px-8 h-14 rounded-sm transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "SENDING…"
              : resendCooldown > 0
              ? `Resend available in ${resendCooldown}s`
              : "RESEND RESET LINK"}
          </button>

          <div className="flex items-center justify-center gap-6 mt-4 text-[13px]">
            <button
              onClick={() => {
                setSuccess(false);
                setError(null);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Use a different email
            </button>
            <span className="text-border">|</span>
            <Link
              href="/contribute/login"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-16 relative animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="w-full mb-12 lg:mb-20">
        <Link
          href="/contribute/login"
          className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          ← BACK TO LOGIN
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-y-16 gap-x-16 lg:gap-x-24">
        {/* Left Column (Main Flow) */}
        <div className="flex flex-col order-1 lg:col-start-1 lg:row-start-1 max-w-[500px]">
          {/* Introduction */}
          <div className="flex flex-col gap-5 mb-10">
            <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
              RESET PASSWORD
            </h1>
            <div className="flex flex-col gap-2">
              <p className="text-[17px] text-foreground leading-relaxed font-medium">
                Forgot your password?
              </p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>
            {/* Global Error Banner */}
            {error && (
              <div
                className="flex flex-col gap-2 bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20"
                role="alert"
              >
                <span className="text-[13px] text-red-500 leading-relaxed">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2.5">
              <label
                htmlFor="email"
                className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                ACCOUNT EMAIL
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldError) setFieldError(null);
                }}
                aria-invalid={!!fieldError}
                aria-describedby={fieldError ? "email-error" : undefined}
                className={`w-full bg-background border px-4 h-14 focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent focus:ring-offset-1 focus:ring-offset-background transition-all rounded-sm text-[16px] text-foreground ${
                  fieldError ? "border-red-500/50" : "border-border/60"
                }`}
              />
              {fieldError && (
                <span id="email-error" className="text-[13px] text-red-500 mt-1">
                  {fieldError}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-6">
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-3 text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 h-14 rounded-sm transition-all hover:bg-foreground/90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
              >
                {isLoading ? "SENDING LINK…" : "SEND RESET LINK →"}
              </button>

              <div className="flex flex-col gap-6">
                <p className="text-[13.5px] text-muted-foreground text-center px-4">
                  Remember your password?{" "}
                  <Link
                    href="/contribute/login"
                    className="font-medium text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column (Instructions / Security Notice) */}
        <div className="order-2 lg:col-start-2 lg:row-start-1 mt-2 lg:mt-0 hidden lg:block">
          <div className="bg-muted/30 border border-border/40 p-10 flex flex-col gap-8 rounded-sm sticky top-12">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
              Security Notice
            </h3>

            <ol className="flex flex-col gap-7">
              <li className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                  01 — Verification
                </span>
                <span className="text-[14.5px] text-foreground leading-relaxed">
                  Reset links are only sent to verified registered accounts.
                </span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                  02 — Expiration
                </span>
                <span className="text-[14.5px] text-foreground leading-relaxed">
                  For your safety, password reset links expire after a short period.
                </span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                  03 — One-Time Use
                </span>
                <span className="text-[14.5px] text-foreground leading-relaxed">
                  Each link can only be used once. If expired, request a new link.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
