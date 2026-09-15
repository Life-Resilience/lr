"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function AdminSessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 15 minutes of inactivity triggers lock
  const INACTIVITY_LIMIT = 15 * 60 * 1000;

  const handleActivity = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      document.cookie = "lr-admin-locked=true; path=/";
      router.replace("/admin/mfa");
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(e => document.addEventListener(e, handleActivity));
    
    // Initial start
    handleActivity();

    return () => {
      events.forEach(e => document.removeEventListener(e, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return <>{children}</>;
}
