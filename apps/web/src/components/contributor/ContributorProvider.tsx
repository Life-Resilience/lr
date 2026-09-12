"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface ContributorProfile {
  name: string | null;
  preferred_name: string | null;
  onboarding_status: string;
}

interface ContributorContextType {
  user: User | null;
  profile: ContributorProfile | null;
  isLoading: boolean;
  displayName: string;
  initial: string;
}

const ContributorContext = createContext<ContributorContextType | undefined>(undefined);

export function ContributorProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ContributorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchIdentity() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("No active session");
        
        setUser(user);

        const { data: profileData } = await supabase
          .from('contributor_profiles')
          .select('name, preferred_name, onboarding_status')
          .eq('user_id', user.id)
          .single();
          
        if (profileData) {
          setProfile(profileData);
        }
      } catch (err) {
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIdentity();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchIdentity();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const displayName = profile?.preferred_name || profile?.name || user?.email?.split('@')[0] || "Anonymous Contributor";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <ContributorContext.Provider value={{ user, profile, isLoading, displayName, initial }}>
      {children}
    </ContributorContext.Provider>
  );
}

export function useContributor() {
  const context = useContext(ContributorContext);
  if (context === undefined) {
    throw new Error("useContributor must be used within a ContributorProvider");
  }
  return context;
}