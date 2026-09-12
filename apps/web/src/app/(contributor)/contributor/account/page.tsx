/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Edit form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [studyWork, setStudyWork] = useState("");
  const [discoverySource, setDiscoverySource] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Delete state
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from("contributor_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          setName(profileData.name || "");
          setAge(profileData.age || "");
          setStudyWork(profileData.study_work || "");
          setDiscoverySource(profileData.discovery_source || "");
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/contribute/login");
    router.refresh();
  };

  const handleSaveProfile = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      const { error } = await supabase
        .from("contributor_profiles")
        .update({
          name,
          age,
          study_work: studyWork,
          discovery_source: discoverySource,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      setProfile({ ...profile, name, age, study_work: studyWork, discovery_source: discoverySource });
      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      setEditError(err.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      setDeleteError("You must type DELETE to confirm.");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");
    
    try {
      // Execute our secure RPC function to delete the authenticated user.
      // This cascades and removes profile and contributions as well.
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;

      await supabase.auth.signOut();
      router.replace("/contribute");
      router.refresh();
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete account. Please try again or contact support.");
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 lg:p-12 animate-pulse font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6 lg:p-12 text-foreground">Not authenticated.</div>;
  }

  return (
    <div className="p-6 lg:p-12 max-w-4xl pb-32">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
          Account
        </h1>
      </div>

      <div className="flex flex-col gap-12">
        {/* PROFILE SECTION */}
        <div className="flex flex-col gap-8 border border-border/40 p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Profile Details</h2>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground hover:text-muted-foreground transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="flex flex-col gap-6">
              {editError && <span className="text-red-500 font-mono text-[10px] uppercase">{editError}</span>}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="bg-transparent border-b border-border/40 py-2 focus:outline-none focus:border-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Age</label>
                <input type="text" value={age} onChange={e => setAge(e.target.value)} className="bg-transparent border-b border-border/40 py-2 focus:outline-none focus:border-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Study / Work</label>
                <input type="text" value={studyWork} onChange={e => setStudyWork(e.target.value)} className="bg-transparent border-b border-border/40 py-2 focus:outline-none focus:border-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Discovery Source</label>
                <input type="text" value={discoverySource} onChange={e => setDiscoverySource(e.target.value)} className="bg-transparent border-b border-border/40 py-2 focus:outline-none focus:border-foreground" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSaveProfile}
                  disabled={editLoading}
                  className="bg-foreground text-background px-6 py-2 font-mono text-[10px] uppercase tracking-[0.15em] hover:opacity-90 disabled:opacity-50"
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  disabled={editLoading}
                  className="text-muted-foreground hover:text-foreground font-mono text-[10px] uppercase tracking-[0.15em]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Full Name</span>
                <span className="text-lg text-foreground">{profile?.name || "Not provided"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email (Read Only)</span>
                <span className="text-lg text-foreground">{user.email}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Age</span>
                <span className="text-lg text-foreground">{profile?.age || "Not provided"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Study / Work</span>
                <span className="text-lg text-foreground">{profile?.study_work || "Not provided"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Discovery Source</span>
                <span className="text-lg text-foreground">{profile?.discovery_source || "Not provided"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Onboarding Status</span>
                <span className="text-lg text-foreground">
                  {profile?.onboarding_completed ? "Completed" : profile?.onboarding_dismissed ? "Dismissed" : "Incomplete"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ACCOUNT STATUS SECTION */}
        <div className="flex flex-col gap-8 border border-border/40 p-8">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Account Status</h2>
          
          <div className="flex flex-col gap-2">
            <span className="text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
              Active Contributor
            </span>
            <span className="text-muted-foreground text-sm mt-1">
              Joined {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="pt-6 mt-2 flex flex-col gap-6 w-fit">
            <button 
              onClick={handleLogout}
              className="text-left font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="flex flex-col gap-8 border border-red-900/30 bg-red-950/5 p-8 mt-12">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-500">Danger Zone</h2>
          
          <div className="flex flex-col gap-4">
            <h3 className="text-xl text-foreground font-medium">Delete Account</h3>
            <p className="text-muted-foreground max-w-2xl">
              This will permanently delete your account, including all contributor profile data, submitted contributions, and any associated materials. This cannot be undone. You will need to create a new account to participate in the future.
            </p>
          </div>

          {isDeleting ? (
            <div className="flex flex-col gap-4 mt-4 max-w-md bg-background border border-red-900/50 p-6">
              <span className="text-foreground font-medium">Are you absolutely sure?</span>
              <span className="text-sm text-muted-foreground">Please type <strong>DELETE</strong> to confirm.</span>
              
              <input 
                type="text" 
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="bg-transparent border border-border py-2 px-3 focus:outline-none focus:border-red-500 font-mono"
              />
              {deleteError && <span className="text-red-500 font-mono text-[10px] uppercase mt-1">{deleteError}</span>}
              
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirmation !== "DELETE"}
                  className="bg-red-900 text-red-100 hover:bg-red-800 px-6 py-2 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Permanently Delete"}
                </button>
                <button 
                  onClick={() => { setIsDeleting(false); setDeleteError(""); setDeleteConfirmation(""); }}
                  disabled={deleteLoading}
                  className="text-muted-foreground hover:text-foreground font-mono text-[10px] uppercase tracking-[0.15em]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsDeleting(true)}
              className="w-fit text-red-500 hover:text-red-400 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors mt-2"
            >
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
