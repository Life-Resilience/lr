import { Suspense } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-foreground selection:text-background relative">
      <Suspense fallback={<header className="absolute top-0 w-full p-6 lg:px-8" />}>
        <AuthHeader />
      </Suspense>
      <main className="flex-1 flex flex-col justify-center items-center p-6">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
