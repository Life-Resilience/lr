"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Flow State
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'confirmation_failed' 
      ? "We couldn't complete your email confirmation. You can try signing in again or request another confirmation email." 
      : null
  );
  const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsCheckingAuth(false);
    });
  }, [supabase.auth]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const resolveDestination = (raw: string | null): string => {
    if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/contributor';
    if (raw === '/contribute' || raw === '/contribute/') return '/contributor';
    if (raw.startsWith('/contribute/login') || raw.startsWith('/contribute/signup')) return '/contributor';
    return raw;
  };

  const getRedirectUrl = () => {
    const rawRedirect = searchParams.get('next') || searchParams.get('returnTo') || searchParams.get('redirect');
    const redirectPath = resolveDestination(rawRedirect);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`;
  };

  const mapAuthError = (err: any) => {
    const msg = err?.message?.toLowerCase() || "";
    if (msg.includes("invalid login credentials")) return "Incorrect email or password.";
    if (msg.includes("email not confirmed")) return "Please verify your email before signing in.";
    if (msg.includes("rate limit") || msg.includes("too many requests")) return "Too many login attempts. Please try again later.";
    if (msg.includes("network") || msg.includes("fetch")) return "We couldn't connect to LR. Check your connection and try again.";
    return "We couldn't log you in. Please try again.";
  };

  const validateForm = () => {
    const errors: {email?: string, password?: string} = {};
    if (!email.trim()) errors.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
    
    if (!password) errors.password = "Please enter your password.";
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError(null);
    setUnconfirmedEmail(false);
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setUnconfirmedEmail(true);
        }
        throw error;
      }
      
      const rawRedirect = searchParams.get('next') || searchParams.get('returnTo') || searchParams.get('redirect');
      const finalRedirect = resolveDestination(rawRedirect);
      router.replace(finalRedirect);
    } catch (err: any) {
      setError(mapAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: getRedirectUrl() }
      });
      setResendCooldown(48);
      setError("Confirmation email sent. Check your inbox for the verification link.");
      setUnconfirmedEmail(false);
    } catch (err) {
      setError("Failed to resend confirmation email. Please try again later.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (isCheckingAuth) {
    return (
      <div className="w-full min-h-[60vh] flex justify-center items-center">
        <div className="w-4 h-4 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col gap-8 text-center pt-24 animate-in fade-in duration-500">
        <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase">You&apos;re already signed in</h1>
        <p className="text-[15px] text-muted-foreground">You are already using an LR account.</p>
        <div className="flex flex-col gap-4 mt-2">
          <Link href="/contributor" className="group w-full flex items-center justify-center text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 py-4 rounded-sm transition-all hover:bg-foreground/90 active:scale-[0.99]">
            OPEN CONTRIBUTOR SPACE →
          </Link>
          <button onClick={handleSignOut} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors font-medium">
            Continue with a different account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-16 relative animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="w-full mb-12 lg:mb-20">
        <Link href="/contribute" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">
          ← BACK TO LR
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-y-16 gap-x-16 lg:gap-x-24">
        
        {/* Left Column (Main Flow) */}
        <div className="flex flex-col order-1 lg:col-start-1 lg:row-start-1 max-w-[500px]">
          
          {/* Introduction */}
          <div className="flex flex-col gap-5 mb-10">
            <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
              LOGIN TO LR
            </h1>
            <div className="flex flex-col gap-2">
              <p className="text-[17px] text-foreground leading-relaxed font-medium">
                Welcome back.
              </p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Sign in to continue contributing to LR.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>
            
            {/* Global Errors / Unconfirmed Email State */}
            {error && (
              <div className="flex flex-col gap-3 bg-red-500/5 px-4 py-4 rounded-sm border border-red-500/20" role="alert">
                <span className={`text-[13px] ${unconfirmedEmail ? 'text-foreground font-medium' : 'text-red-500'}`}>
                  {error}
                </span>
                {unconfirmedEmail && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="w-fit text-[11px] font-semibold uppercase tracking-widest text-foreground bg-background border border-border/60 px-4 py-2 rounded-sm transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                  >
                    {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : "RESEND CONFIRMATION EMAIL"}
                  </button>
                )}
              </div>
            )}
            
            {/* Email */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                EMAIL
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                }}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className={`w-full bg-background border px-4 h-14 focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent focus:ring-offset-1 focus:ring-offset-background transition-all rounded-sm text-[16px] text-foreground ${fieldErrors.email ? 'border-red-500/50' : 'border-border/60'}`}
              />
              {fieldErrors.email && (
                <span id="email-error" className="text-[13px] text-red-500 mt-1">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  PASSWORD
                </label>
                <Link 
                  href="/contribute/forgot-password" 
                  className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  className={`w-full bg-background border px-4 h-14 pr-12 focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent focus:ring-offset-1 focus:ring-offset-background transition-all rounded-sm text-[16px] text-foreground ${fieldErrors.password ? 'border-red-500/50' : 'border-border/60'}`}
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
              {fieldErrors.password && (
                <span id="password-error" className="text-[13px] text-red-500 mt-1">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-6">
              <button 
                type="submit" 
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-3 text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 h-14 rounded-sm transition-all hover:bg-foreground/90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
              >
                {isLoading ? "LOGGING IN…" : "LOG IN →"}
              </button>
              
              <div className="flex flex-col gap-6">
                <p className="text-[13.5px] text-muted-foreground text-center px-4">
                  Your account lets you submit and track your contributions.
                </p>
                <div className="h-[1px] w-full bg-border/40" />
                <div className="flex justify-center">
                  <Link 
                    href={`/contribute/signup?next=${encodeURIComponent(resolveDestination(searchParams.get('next') || searchParams.get('returnTo') || searchParams.get('redirect')))}`} 
                    className="text-[14px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm px-2 py-1"
                  >
                    Don&apos;t have an account? <span className="font-medium text-foreground ml-1">Sign up →</span>
                  </Link>
                </div>
              </div>
            </div>
          </form>

        </div>

        {/* Right Column (Your Contributor Space) */}
        <div className="order-2 lg:col-start-2 lg:row-start-1 mt-2 lg:mt-0 hidden lg:block">
          <div className="bg-muted/30 border border-border/40 p-10 flex flex-col gap-8 rounded-sm sticky top-12">
            
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
              Your Contributor Space
            </h3>
            
            <ol className="flex flex-col gap-7">
              <li className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">01 — Submit</span>
                <span className="text-[14.5px] text-foreground leading-relaxed">
                  Share experiences, observations, ideas, questions, or research.
                </span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">02 — Track</span>
                <span className="text-[14.5px] text-foreground leading-relaxed">
                  Follow the progress of your contributions in the review process.
                </span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">03 — Respond</span>
                <span className="text-[14.5px] text-foreground leading-relaxed">
                  See updates and responses directly from LR.
                </span>
              </li>
            </ol>

          </div>
        </div>
      </div>
      
    </div>
  );
}