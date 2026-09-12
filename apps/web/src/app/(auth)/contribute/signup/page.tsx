"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Check, X } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Flow State
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Real-time validation checks
  const reqLength = password.length >= 8;
  const reqUpper = /[A-Z]/.test(password);
  const reqLower = /[a-z]/.test(password);
  const reqNum = /[0-9]/.test(password);
  const reqSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordStrong = reqLength && reqUpper && reqLower && reqNum && reqSpecial;
  const doPasswordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const showPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

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
    const redirectPath = resolveDestination(searchParams.get('next') || searchParams.get('redirect') || searchParams.get('returnTo'));
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`;
  };

  const mapAuthError = (err: any) => {
    const msg = err?.message?.toLowerCase() || "";
    if (msg.includes("already registered") || msg.includes("already exists")) return "This email is already registered.";
    if (msg.includes("rate limit") || msg.includes("too many requests")) return "Too many attempts. Please wait a few minutes before trying again.";
    if (msg.includes("network") || msg.includes("fetch")) return "We couldn't connect. Check your internet connection and try again.";
    if (msg.includes("password")) return "Please use a stronger password.";
    if (msg.includes("valid email")) return "Please enter a valid email address.";
    return "We couldn't create your account. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectUrl()
        }
      });

      if (error) throw error;
      
      if (data.session) {
        router.replace(resolveDestination(searchParams.get('next')));
      } else {
        setSuccess(true);
      }
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
      setResendCooldown(60);
    } catch (err) {
      // Silently fail or handle gracefully in UI if needed
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
        <p className="text-muted-foreground text-sm">You are already using an LR account.</p>
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

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col gap-8 pt-24 px-6 animate-in fade-in duration-500 text-center">
        <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase">Verify your email</h1>
        <div className="flex flex-col gap-2 text-muted-foreground text-[15px]">
          <p>We sent a verification link to <strong className="text-foreground font-medium">{email}</strong></p>
          <p>Your LR contributor account will be ready once your email is verified.</p>
        </div>
        
        <div className="flex flex-col gap-4 mt-4">
          <button 
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="w-full flex items-center justify-center text-[13px] font-semibold uppercase tracking-widest text-foreground border border-border/60 bg-background px-8 py-4 rounded-sm transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : "RESEND EMAIL"}
          </button>
          
          <div className="flex items-center justify-center gap-6 mt-4 text-[13px]">
            <button 
              onClick={() => setSuccess(false)} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Use a different email
            </button>
            <span className="text-border">|</span>
            <Link 
              href={`/contribute/login?next=${encodeURIComponent(resolveDestination(searchParams.get('next')))}`} 
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
        <Link href="/contribute" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">
          ← BACK TO LR
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-y-16 gap-x-16 lg:gap-x-24">
        
        {/* Left Column (Main Flow) */}
        <div className="flex flex-col order-1 lg:col-start-1 lg:row-start-1 max-w-[500px]">
          
          {/* Introduction */}
          <div className="flex flex-col gap-5 mb-10">
            <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none">
              JOIN LR
            </h1>
            <div className="flex flex-col gap-2">
              <p className="text-[17px] text-foreground leading-relaxed font-medium">
                Help us understand real human problems.
              </p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Share experiences, observations, ideas, questions, or research that may otherwise go unnoticed.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            {error && (
              <div className="text-red-500 text-[13px] bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20" role="alert">
                {error}
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
                onChange={(e) => setEmail(e.target.value.trim())}
                className="w-full bg-background border border-border/60 px-4 h-14 focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent focus:ring-offset-1 focus:ring-offset-background transition-all rounded-sm text-[16px] text-foreground"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                PASSWORD
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
                  <span className="text-muted-foreground">Use a strong password.</span>
                ) : isPasswordStrong ? (
                  <span className="text-green-600 dark:text-green-500 flex items-center gap-1.5 font-medium">
                    <Check className="w-4 h-4" /> Strong password
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1">
                    <span className={`flex items-center gap-1 ${reqLength ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'}`}>
                      {reqLength ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />} 8+ characters
                    </span>
                    <span className={`flex items-center gap-1 ${reqUpper ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'}`}>
                      {reqUpper ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />} Uppercase
                    </span>
                    <span className={`flex items-center gap-1 ${reqLower ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'}`}>
                      {reqLower ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />} Lowercase
                    </span>
                    <span className={`flex items-center gap-1 ${reqNum ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'}`}>
                      {reqNum ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />} Number
                    </span>
                    <span className={`flex items-center gap-1 ${reqSpecial ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'}`}>
                      {reqSpecial ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />} Special character
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="confirmPassword" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                CONFIRM PASSWORD
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
                  className={`w-full bg-background border px-4 h-14 pr-12 focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent focus:ring-offset-1 focus:ring-offset-background transition-all rounded-sm text-[16px] text-foreground ${showPasswordMismatch ? 'border-red-500/50' : 'border-border/60'}`}
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
                disabled={isLoading || showPasswordMismatch}
                className="group w-full flex items-center justify-center gap-3 text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 h-14 rounded-sm transition-all hover:bg-foreground/90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
              >
                {isLoading ? "CREATING ACCOUNT…" : "CREATE ACCOUNT →"}
              </button>
              
              <div className="flex flex-col gap-4">
                <p className="text-[13.5px] text-muted-foreground text-center px-4">
                  Your account lets you submit and track contributions.
                </p>
                <div className="h-[1px] w-full bg-border/40" />
                <div className="flex justify-center">
                  <Link 
                    href={`/contribute/login?next=${encodeURIComponent(resolveDestination(searchParams.get('next')))}`} 
                    className="text-[14px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm px-2 py-1"
                  >
                    Already have an account? <span className="font-medium text-foreground ml-1">Log in</span>
                  </Link>
                </div>
              </div>
            </div>
          </form>

        </div>

        {/* Right Column (What Happens Next) */}
        <div className="order-2 lg:col-start-2 lg:row-start-1 mt-2 lg:mt-0">
          <div className="bg-muted/30 border border-border/40 p-8 lg:p-10 flex flex-col gap-8 rounded-sm sticky top-12">
            
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
              What happens next
            </h3>
            
            <ol className="flex flex-col gap-6">
              <li className="flex gap-4">
                <span className="text-[13px] font-mono text-muted-foreground shrink-0 mt-0.5">01</span>
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-medium text-foreground leading-none">Create your account</span>
                  <span className="text-[13.5px] text-muted-foreground">Set up your Contributor Space.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-[13px] font-mono text-muted-foreground shrink-0 mt-0.5">02</span>
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-medium text-foreground leading-none">Submit contribution</span>
                  <span className="text-[13.5px] text-muted-foreground">Share an observation or experience.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-[13px] font-mono text-muted-foreground shrink-0 mt-0.5">03</span>
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-medium text-foreground leading-none">Track review</span>
                  <span className="text-[13.5px] text-muted-foreground">See how LR is processing your submission.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-[13px] font-mono text-muted-foreground shrink-0 mt-0.5">04</span>
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-medium text-foreground leading-none">Receive response</span>
                  <span className="text-[13.5px] text-muted-foreground">Get updates on your contribution.</span>
                </div>
              </li>
            </ol>

            <div className="pt-6 border-t border-border/40 flex flex-col gap-3">
              <span className="text-[14px] font-medium text-foreground">Your contribution</span>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                You remain in control of what you share. Submit when you&apos;re ready, track the status, and help build LR&apos;s research foundation.
              </p>
            </div>

          </div>
        </div>
      </div>
      
      {/* Footer Trust Layer */}
      <div className="mt-20 pt-8 border-t border-border/30 max-w-[500px]">
        <p className="text-[12.5px] text-muted-foreground">
          Your privacy matters. Read our <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">Privacy Policy</Link>.
        </p>
      </div>

    </div>
  );
}