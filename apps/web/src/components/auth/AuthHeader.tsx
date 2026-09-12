/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export function AuthHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    router.replace('/contribute');
  };

  return (
    <header className="absolute top-0 w-full p-6 lg:px-8 flex justify-between items-center">
      <button 
        onClick={handleBack}
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground focus-visible:outline-none hover:opacity-70 transition-opacity"
      >
        LR / BACK
      </button>
      
      <div className="flex items-center">
        <Image
          src="/lr-logo-light.svg"
          alt="LR Logo"
          width={160}
          height={160}
          className="logo-light"
        />
        <Image
          src="/lr-logo-dark.svg"
          alt="LR Logo"
          width={160}
          height={160}
          className="logo-dark"
        />
      </div>
    </header>
  );
}

