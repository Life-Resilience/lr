"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Check } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Validation
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);

  // Real-time password strength checks
  const reqLength = password.length >= 8;
  const reqUpper = /[A-Z]/.test(password);
  const reqLower = /[a-z]/.test(password);
  const reqNum = /[0-9]/.test(password);
  const reqSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordStrong = reqLength && reqUpper && reqLower && reqNum && reqSpecial;
  const doPasswordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const showPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      // 1. Check if user is currently in a session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        if (isMounted) {
          setHasValidSession(true);
          setIsCheckingSession(false);
        }
        return;
      }

      // 2. Also listen for auth state change in case recovery token is in hash
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && newSession)) {
            if (isMounted) {
              setHasValidSession(true);
              setIsCheckingSession(false);
            }
          }
        }
      );

      // Timeout fallback to allow hash processing
      const timer = setTimeout(() => {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }, 1500);

      return () => {
        authListener.subscription.unsubscribe();
        clearTimeout(timer);
      };
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!isPasswordStrong) {
      setError("Please ensure your new password meets all security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        const msg = updateError.message.toLowerCase();
        if (msg.includes("should be different") || msg.includes("same password")) {
          throw new Error("New password must be different from your previous password.");
        }
        throw updateError;
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err?.message ||
          "We could not update your password. Your reset link may have expired. Please request a new one."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <div className="w-4 h-4 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Verifying security token…
        </span>
      </div>
    );
  }

  if (!hasValidSession && !isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col gap-8 pt-24 px-6 animate-in fade-in duration-500 text-center">
        <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase">
          Link Expired or Invalid
        </h1>
        <p className="text-muted-foreground text-[15px] leading-relaxed">
          This password reset link is invalid, expired, or has already been used. For your security,
          reset links can only be used once.
        </p>
        <div className="flex flex-col gap-4 mt-2">
          <Link
            href="/contribute/forgot-password"
            className="w-full flex items-center justify-center text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 h-14 rounded-sm transition-all hover:bg-foreground/90"
          >
            REQUEST A NEW RESET LINK →
          </Link>
          <Link
            href="/contribute/login"
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col gap-8 pt-24 px-6 animate-in fade-in duration-500 text-center">
        <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-2">
          <Check className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase">
          Password Updated
        </h1>
        <p className="text-muted-foreground text-[15px] leading-relaxed">
          Your password has been changed successfully. Your active session is secure, and you can now
          continue to your Contributor Space.
        </p>
        <div className="flex flex-col gap-4 mt-2">
          <button
            onClick={() => router.replace("/contributor")}
            className="w-full flex items-center justify-center text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 h-14 rounded-sm transition-all hover:bg-foreground/90"
          >
            OPEN CONTRIBUTOR SPACE →
          </button>
          <Link
            href="/contribute/login"
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Or return to sign in
          </Link>
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
        {/* Left Column (Main Form) */}
        <div className="flex flex-col order-1 lg:col-start-1 lg:row-start-1 max-w-[500px]">
          {/* Introduction */}
          <div className="flex flex-col gap-5 mb-10">
            <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
              CHOOSE NEW PASSWORD
            </h1>
            <div className="flex flex-col gap-2">
              <p className="text-[17px] text-foreground leading-relaxed font-medium">
                Set a strong, new password.
              </p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Choose a secure password with letters, numbers, and special characters.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            {error && (
              <div
                className="text-red-500 text-[13px] bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* New Password */}
            <div className="flex flex-col gap-2.5">
              <label
                htmlFor="password"
                className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby="password-requirements"
                  className="w-full bg-background border border-border/60 px-4 h-14 pr-12 focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent focus:ring-offset-1 focus:ring-offset-background transition-all rounded-sm text-[16px] text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Progressive Password Guidance */}
              <div id="password-requirements" className="text-[13px] mt-0.5" aria-live="polite">
                {!password ? (
                  <span className="text-muted-foreground">Must be at least 8 characters.</span>
                ) : isPasswordStrong ? (
                  <span className="text-green-600 dark:text-green-500 flex items-center gap-1.5 font-medium">
                    <Check className="w-4 h-4" /> Strong password
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1">
                    <span
                      className={`flex items-center gap-1 ${
                        reqLength
                          ? "text-green-600 dark:text-green-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {reqLength ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />} 8+
                      characters
                    </span>
                    <span
                      className={`flex items-center gap-1 ${
                        reqUpper
                          ? "text-green-600 dark:text-green-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {reqUpper ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />} Uppercase
                    </span>
                    <span
                      className={`flex items-center gap-1 ${
                        reqLower
                          ? "text-green-600 dark:text-green-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {reqLower ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />} Lowercase
                    </span>
                    <span
                      className={`flex items-center gap-1 ${
                        reqNum
                          ? "text-green-600 dark:text-green-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {reqNum ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />} Number
                    </span>
                    <span
                      className={`flex items-center gap-1 ${
                        reqSpecial
                          ? "text-green-600 dark:text-green-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {reqSpecial ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />} Special
                      character
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-2.5">
              <label
                htmlFor="confirmPassword"
                className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                CONFIRM NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-invalid={showPasswordMismatch}
                  aria-describedby="confirm-requirements"
                  className={`w-full bg-background border px-4 h-14 pr-12 focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent focus:ring-offset-1 focus:ring-offset-background transition-all rounded-sm text-[16px] text-foreground ${
                    showPasswordMismatch ? "border-red-500/50" : "border-border/60"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Real-time Match UI */}
              <div id="confirm-requirements" className="text-[13px] mt-0.5 min-h-[20px]" aria-live="polite">
                {doPasswordsMatch && (
                  <span className="text-green-600 dark:text-green-500 flex items-center gap-1.5 font-medium">
                    <Check className="w-4 h-4" /> Passwords match
                  </span>
                )}
                {showPasswordMismatch && (
                  <span className="text-red-500 flex items-center gap-1.5">
                    Passwords don&apos;t match
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-5">
              <button
                type="submit"
                disabled={isLoading || !isPasswordStrong || showPasswordMismatch}
                className="group w-full flex items-center justify-center gap-3 text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 h-14 rounded-sm transition-all hover:bg-foreground/90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
              >
                {isLoading ? "UPDATING PASSWORD…" : "UPDATE PASSWORD →"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (Instructions) */}
        <div className="order-2 lg:col-start-2 lg:row-start-1 mt-2 lg:mt-0 hidden lg:block">
          <div className="bg-muted/30 border border-border/40 p-10 flex flex-col gap-8 rounded-sm sticky top-12">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
              Password Security
            </h3>

            <ul className="flex flex-col gap-5 text-[14px] text-muted-foreground leading-relaxed">
              <li className="flex flex-col gap-1">
                <span className="font-medium text-foreground">Unique to LR</span>
                <span>Avoid reusing passwords from personal or corporate accounts.</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-medium text-foreground">Passphrase or complex</span>
                <span>Combine memorable words with symbols and numbers for optimal strength.</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-medium text-foreground">Instant activation</span>
                <span>Your updated password takes effect immediately across all sessions.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
