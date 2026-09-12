"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check, AlertTriangle } from "lucide-react";

const PRIMARY_ROLES = ["Student", "Researcher", "Developer", "Designer", "Engineer", "Security Professional", "Product / Business", "Educator", "Entrepreneur", "Professional", "Other"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert", "Prefer not to say"];
const ATTRIBUTION_OPTIONS = ["My name", "Contributor ID", "Anonymous"];
const ORG_TYPES = ["University", "Company", "Independent", "Government", "Non-profit", "Research institution", "Other"];

export default function AccountPage() {
  const supabase = createClient();
  const router = useRouter();

  // Core State
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    preferredName: "",
    primaryRole: "",
    field: "",
    experienceLevel: "",
    organizationType: "",
    country: "",
    attributionPreference: "My name",
  });
  const [editError, setEditError] = useState("");
  const [editStatus, setEditStatus] = useState<"idle" | "saving" | "success">("idle");

  // Password Change State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "success">("idle");

  // Delete State
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Password Validation
  const reqLength = newPassword.length >= 8;
  const passwordsMatch = confirmNewPassword.length > 0 && newPassword === confirmNewPassword;
  const showPasswordMismatch = confirmNewPassword.length > 0 && !passwordsMatch;

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user) {
          setUser(user);
          const { data: profileData } = await supabase
            .from("contributor_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
            setEditForm({
              name: profileData.name || "",
              preferredName: profileData.preferred_name || "",
              primaryRole: profileData.primary_role || profileData.study_work || "",
              field: profileData.field || "",
              experienceLevel: profileData.experience_level || "",
              organizationType: profileData.organization_type || "",
              country: profileData.country || "",
              attributionPreference: profileData.attribution_preference || "My name",
            });
          }
        }
      } catch (error) {
        // Silently handle - user will be caught by !user check
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [supabase]);

  // Prevent accidental navigation with unsaved changes
  const hasUnsavedChanges = isEditing && (
    editForm.name !== (profile?.name || "") ||
    editForm.preferredName !== (profile?.preferred_name || "") ||
    editForm.primaryRole !== (profile?.primary_role || profile?.study_work || "") ||
    editForm.field !== (profile?.field || "") ||
    editForm.experienceLevel !== (profile?.experience_level || "") ||
    editForm.organizationType !== (profile?.organization_type || "") ||
    editForm.country !== (profile?.country || "") ||
    editForm.attributionPreference !== (profile?.attribution_preference || "My name")
  );

  // Formatters & Helpers
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(dateString));
  };

  const mapErrorMessage = (err: any) => {
    const msg = err?.message?.toLowerCase() || "";
    if (msg.includes("network") || msg.includes("fetch")) return "Check your connection and try again.";
    if (msg.includes("session")) return "Your session has expired. Please sign in again.";
    return "We couldn't complete this action. Please try again.";
  };

  const getInitial = (name: string, email: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "?";
  };

  // Handlers
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/contribute/login");
  };

  const handleSaveProfile = async () => {
    setEditStatus("saving");
    setEditError("");
    
    try {
      const { error } = await supabase
        .from("contributor_profiles")
        .update({
          name: editForm.name || null,
          preferred_name: editForm.preferredName || null,
          primary_role: editForm.primaryRole || null,
          field: editForm.field || null,
          experience_level: editForm.experienceLevel || null,
          organization_type: editForm.organizationType || null,
          country: editForm.country || null,
          attribution_preference: editForm.attributionPreference,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      setProfile({
        ...profile,
        name: editForm.name,
        preferred_name: editForm.preferredName,
        primary_role: editForm.primaryRole,
        field: editForm.field,
        experience_level: editForm.experienceLevel,
        organization_type: editForm.organizationType,
        country: editForm.country,
        attribution_preference: editForm.attributionPreference,
      });
      setEditStatus("success");
      
      setTimeout(() => {
        setIsEditing(false);
        setEditStatus("idle");
        router.refresh();
      }, 1500);
      
    } catch (err: any) {
      setEditError(mapErrorMessage(err));
      setEditStatus("idle");
    }
  };

  const handleUpdatePassword = async () => {
    if (!reqLength) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }
    if (!passwordsMatch) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordStatus("saving");
    setPasswordError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordStatus("success");
      setNewPassword("");
      setConfirmNewPassword("");
      
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordStatus("idle");
      }, 2000);
    } catch (err: any) {
      setPasswordError(mapErrorMessage(err));
      setPasswordStatus("idle");
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
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;

      await supabase.auth.signOut();
      router.replace("/contribute");
    } catch (err: any) {
      setDeleteError(mapErrorMessage(err));
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 max-w-3xl mx-auto w-full animate-pulse flex flex-col gap-16 pb-32">
        <div className="flex flex-col gap-4">
          <div className="h-10 bg-muted/40 w-48 rounded-sm" />
          <div className="h-5 bg-muted/30 w-72 rounded-sm" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-6 bg-muted/40 w-32 rounded-sm" />
          <div className="h-64 bg-muted/20 border border-border/30 rounded-sm" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-6 bg-muted/40 w-32 rounded-sm" />
          <div className="h-40 bg-muted/20 border border-border/30 rounded-sm" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-6 animate-in fade-in duration-500">
        <h1 className="text-2xl font-medium tracking-tight text-foreground uppercase">Sign In Required</h1>
        <p className="text-[15px] text-muted-foreground max-w-sm">
          You need to be signed in to access your contributor account.
        </p>
        <Link href="/contribute/login" className="group flex items-center justify-center text-[13px] font-semibold uppercase tracking-widest text-background bg-foreground px-8 h-12 rounded-sm transition-all hover:bg-foreground/90 mt-2">
          GO TO LOGIN →
        </Link>
      </div>
    );
  }

  const isVerified = user.email_confirmed_at != null;
  const isProfileComplete = profile?.onboarding_completed;

  return (
    <div className="p-6 lg:p-12 max-w-3xl mx-auto w-full pb-32 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col gap-3 mb-16">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-foreground leading-none uppercase">
          Account
        </h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          Manage your profile, security, and account preferences.
        </p>
      </div>

      <div className="flex flex-col gap-20">
        
        {/* PROFILE SECTION */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
              PROFILE
            </h2>
            <p className="text-[14px] text-muted-foreground">
              Your contributor identity and information.
            </p>
          </div>

          <div className="border border-border/60 rounded-sm overflow-hidden bg-background">
            {/* Identity Block */}
            <div className="flex items-center gap-5 p-6 md:p-8 border-b border-border/40 bg-muted/10">
              <div className="w-16 h-16 rounded-sm bg-foreground flex items-center justify-center text-background text-2xl font-medium shrink-0">
                {getInitial(profile?.name, user.email)}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[18px] font-medium text-foreground leading-none">
                  {profile?.name || "Anonymous Contributor"}
                </span>
                <span className="text-[13.5px] text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
                  Contributor
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {!isEditing ? (
                <div className="flex flex-col gap-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Full Name</span>
                      <span className="text-[15px] text-foreground">{profile?.name || "—"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Preferred Name</span>
                      <span className="text-[15px] text-foreground">{profile?.preferred_name || "—"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Primary Role</span>
                      <span className="text-[15px] text-foreground">{profile?.primary_role || profile?.study_work || "—"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Field / Focus</span>
                      <span className="text-[15px] text-foreground">{profile?.field || "—"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Experience Level</span>
                      <span className="text-[15px] text-foreground">{profile?.experience_level || "—"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Country / Region</span>
                      <span className="text-[15px] text-foreground">{profile?.country || "—"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Attribution</span>
                      <span className="text-[15px] text-foreground">{profile?.attribution_preference || "My name"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Organization</span>
                      <span className="text-[15px] text-foreground">{profile?.organization_type || "—"}</span>
                    </div>
                  </div>

                  {/* Research Interests Tags */}
                  {Array.isArray(profile?.research_interests) && profile.research_interests.length > 0 && (
                    <div className="flex flex-col gap-3 pt-6 border-t border-border/40">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Research Interests</span>
                      <div className="flex flex-wrap gap-2">
                        {profile.research_interests.map((interest: string) => (
                          <span key={interest} className="text-[12px] font-mono uppercase tracking-wider px-3 py-1 bg-muted/30 border border-border/60 rounded-sm text-foreground">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-[12px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors"
                    >
                      EDIT PROFILE →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {editError && (
                    <div className="text-[13px] text-red-500 bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20" role="alert">
                      {editError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Full Name</label>
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})} 
                        className="w-full bg-background border border-border/60 px-4 h-12 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground" 
                      />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Preferred Name</label>
                      <input 
                        type="text" 
                        value={editForm.preferredName} 
                        onChange={e => setEditForm({...editForm, preferredName: e.target.value})} 
                        className="w-full bg-background border border-border/60 px-4 h-12 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground" 
                      />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Primary Role</label>
                      <select 
                        value={editForm.primaryRole} 
                        onChange={e => setEditForm({...editForm, primaryRole: e.target.value})} 
                        className="w-full bg-background border border-border/60 px-4 h-12 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground"
                      >
                        <option value="">Select a role</option>
                        {PRIMARY_ROLES.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Field / Focus</label>
                      <input 
                        type="text" 
                        value={editForm.field} 
                        onChange={e => setEditForm({...editForm, field: e.target.value})} 
                        placeholder="e.g. Cybersecurity, AI, Systems"
                        className="w-full bg-background border border-border/60 px-4 h-12 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground" 
                      />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Experience Level</label>
                      <select 
                        value={editForm.experienceLevel} 
                        onChange={e => setEditForm({...editForm, experienceLevel: e.target.value})} 
                        className="w-full bg-background border border-border/60 px-4 h-12 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground"
                      >
                        <option value="">Select level</option>
                        {EXPERIENCE_LEVELS.map(lvl => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Country / Region</label>
                      <input 
                        type="text" 
                        value={editForm.country} 
                        onChange={e => setEditForm({...editForm, country: e.target.value})} 
                        className="w-full bg-background border border-border/60 px-4 h-12 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground" 
                      />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Attribution</label>
                      <select 
                        value={editForm.attributionPreference} 
                        onChange={e => setEditForm({...editForm, attributionPreference: e.target.value})} 
                        className="w-full bg-background border border-border/60 px-4 h-12 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground"
                      >
                        {ATTRIBUTION_OPTIONS.map(attr => (
                          <option key={attr} value={attr}>{attr}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Organization Type</label>
                      <select 
                        value={editForm.organizationType} 
                        onChange={e => setEditForm({...editForm, organizationType: e.target.value})} 
                        className="w-full bg-background border border-border/60 px-4 h-12 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground"
                      >
                        <option value="">Select organization</option>
                        {ORG_TYPES.map(org => (
                          <option key={org} value={org}>{org}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 pt-4 mt-2 border-t border-border/40">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={editStatus !== "idle" || !hasUnsavedChanges}
                      className="bg-foreground text-background px-8 h-12 rounded-sm text-[12px] font-semibold uppercase tracking-widest hover:bg-foreground/90 disabled:opacity-50 transition-all flex items-center justify-center min-w-[160px]"
                    >
                      {editStatus === "saving" ? "SAVING…" : editStatus === "success" ? "CHANGES SAVED ✓" : "SAVE CHANGES"}
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setEditError("");
                        setEditForm({
                          name: profile?.name || "",
                          preferredName: profile?.preferred_name || "",
                          primaryRole: profile?.primary_role || profile?.study_work || "",
                          field: profile?.field || "",
                          experienceLevel: profile?.experience_level || "",
                          organizationType: profile?.organization_type || "",
                          country: profile?.country || "",
                          attributionPreference: profile?.attribution_preference || "My name",
                        });
                      }}
                      disabled={editStatus === "saving"}
                      className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ACCOUNT SECTION */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
              ACCOUNT
            </h2>
            <p className="text-[14px] text-muted-foreground">
              Your LR account information.
            </p>
          </div>

          <div className="border border-border/60 rounded-sm p-6 md:p-8 flex flex-col gap-8 bg-background">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Email</span>
                <span className="text-[15px] text-foreground">{user.email}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Status</span>
                <span className="text-[15px] text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-foreground" />
                  Active
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Member Since</span>
                <span className="text-[15px] text-foreground">{formatDate(user.created_at)}</span>
              </div>
            </div>

            <div className="pt-8 border-t border-border/40">
              <button 
                onClick={handleLogout}
                className="text-[12px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors"
              >
                LOG OUT →
              </button>
            </div>
          </div>
        </section>

        {/* SECURITY SECTION */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
              SECURITY
            </h2>
            <p className="text-[14px] text-muted-foreground">
              Protect your LR account.
            </p>
          </div>

          <div className="border border-border/60 rounded-sm p-6 md:p-8 flex flex-col gap-8 bg-background">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-border/40">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Email Verification</span>
                <span className="text-[15px] text-foreground flex items-center gap-2">
                  {isVerified ? (
                    <><span className="w-2 h-2 rounded-full bg-foreground" /> Verified</>
                  ) : (
                    <><span className="w-2 h-2 rounded-full bg-yellow-500" /> Verification required</>
                  )}
                </span>
              </div>
              {!isVerified && (
                <button className="text-[12px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors">
                  RESEND EMAIL →
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Password</span>
              
              {!isChangingPassword ? (
                <div className="flex flex-col gap-6 mt-1">
                  <span className="text-[15px] text-foreground">Password is set and active.</span>
                  <button 
                    onClick={() => setIsChangingPassword(true)}
                    className="w-fit text-[12px] font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors"
                  >
                    CHANGE PASSWORD →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6 mt-4 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {passwordError && (
                    <div className="text-[13px] text-red-500 bg-red-500/5 px-4 py-3 rounded-sm border border-red-500/20" role="alert">
                      {passwordError}
                    </div>
                  )}

                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">New Password</label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        value={newPassword} 
                        onChange={e => { setNewPassword(e.target.value); setPasswordError(""); }} 
                        className="w-full bg-background border border-border/60 px-4 h-12 pr-12 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground rounded-sm"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Confirm New Password</label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={confirmNewPassword} 
                        onChange={e => { setConfirmNewPassword(e.target.value); setPasswordError(""); }} 
                        className={`w-full bg-background border px-4 h-12 pr-12 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all rounded-sm text-[15px] text-foreground ${showPasswordMismatch ? 'border-red-500/50' : 'border-border/60'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground rounded-sm"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Live Validation UI */}
                    <div className="text-[12px] mt-1 min-h-[20px]" aria-live="polite">
                      {!newPassword ? (
                        <span className="text-muted-foreground">Use a strong password.</span>
                      ) : (
                        <div className="flex items-center gap-4">
                          <span className={`flex items-center gap-1.5 ${reqLength ? 'text-green-600 dark:text-green-500 font-medium' : 'text-muted-foreground'}`}>
                            {reqLength ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />} 8+ characters
                          </span>
                          {passwordsMatch && (
                            <span className="text-green-600 dark:text-green-500 font-medium flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" /> Passwords match
                            </span>
                          )}
                          {showPasswordMismatch && (
                            <span className="text-red-500 flex items-center gap-1.5">
                              Passwords don&apos;t match
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-5 mt-2">
                    <button 
                      onClick={handleUpdatePassword}
                      disabled={passwordStatus !== "idle" || !newPassword || !passwordsMatch || !reqLength}
                      className="bg-foreground text-background px-8 h-12 rounded-sm text-[12px] font-semibold uppercase tracking-widest hover:bg-foreground/90 disabled:opacity-50 transition-all flex items-center justify-center min-w-[160px]"
                    >
                      {passwordStatus === "saving" ? "UPDATING…" : passwordStatus === "success" ? "PASSWORD UPDATED ✓" : "UPDATE PASSWORD"}
                    </button>
                    <button 
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordError("");
                        setNewPassword("");
                        setConfirmNewPassword("");
                      }}
                      disabled={passwordStatus === "saving"}
                      className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-red-500">
              DANGER ZONE
            </h2>
            <p className="text-[14px] text-muted-foreground">
              Permanent account actions.
            </p>
          </div>

          <div className="border border-border/60 rounded-sm p-6 md:p-8 flex flex-col gap-4 bg-background">
            <h3 className="text-[15px] font-medium text-foreground">Delete account</h3>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-2xl">
              Permanently delete your account and associated data according to LR&apos;s account deletion policy. This action cannot be undone.
            </p>

            {!isDeleting ? (
              <div className="mt-4">
                <button 
                  onClick={() => setIsDeleting(true)}
                  className="w-fit text-[12px] font-semibold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                >
                  DELETE ACCOUNT
                </button>
              </div>
            ) : (
              <div className="mt-6 p-6 border border-red-500/20 bg-red-500/5 rounded-sm flex flex-col gap-5 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-medium text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Are you absolutely sure?
                  </span>
                  <span className="text-[13.5px] text-muted-foreground">
                    This will permanently delete your LR account. Type <strong>DELETE</strong> below to confirm.
                  </span>
                </div>
                
                <input 
                  type="text" 
                  value={deleteConfirmation}
                  onChange={(e) => { setDeleteConfirmation(e.target.value); setDeleteError(""); }}
                  placeholder="DELETE"
                  className="w-full bg-background border border-border/60 px-4 h-12 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all rounded-sm font-mono text-[14px] text-foreground uppercase"
                />
                
                {deleteError && (
                  <span className="text-[13px] text-red-500 -mt-2">
                    {deleteError}
                  </span>
                )}
                
                <div className="flex items-center gap-4 pt-2">
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading || deleteConfirmation !== "DELETE"}
                    className="bg-red-500 text-white px-6 h-12 rounded-sm text-[12px] font-semibold uppercase tracking-widest hover:bg-red-600 disabled:opacity-50 transition-all flex items-center justify-center min-w-[160px]"
                  >
                    {deleteLoading ? "DELETING…" : "PERMANENTLY DELETE"}
                  </button>
                  <button 
                    onClick={() => { setIsDeleting(false); setDeleteError(""); setDeleteConfirmation(""); }}
                    disabled={deleteLoading}
                    className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}