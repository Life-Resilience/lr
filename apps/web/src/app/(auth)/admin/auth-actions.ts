"use server";

import { cookies } from "next/headers";
import { 
  validateAdminCredentials, 
  getTotpUri, 
  verifyTOTP, 
  signAdminToken,
  getAdminConfig,
  FIXED_ADMIN_EMAIL,
  FIXED_ADMIN_MFA_SECRET 
} from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export async function clearPendingLoginAction() {
  const cookieStore = await cookies();
  cookieStore.delete("lr_admin_pending_email");
}

export async function adminLoginAction(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string || "").trim().toLowerCase();
  const password = formData.get("password") as string || "";

  if (!email || !password) {
    return { success: false, error: "Please enter your email and password." };
  }

  // Strictly confirm only the designated admin credentials
  const isValid = validateAdminCredentials(email, password);
  if (!isValid) {
    return { 
      success: false, 
      error: "Incorrect email or password. Please check your credentials." 
    };
  }

  // Optional Supabase session sync for the authenticated admin
  try {
    const supabase = await createClient();
    await supabase.auth.signInWithPassword({ email, password });
  } catch {
    // Ignore if Supabase auth user does not match or is unconfigured
  }

  const cookieStore = await cookies();

  // Set pending login state strictly for the verified admin email
  cookieStore.set("lr_admin_pending_email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes to complete MFA
  });

  return { success: true, redirect: "/admin/mfa" };
}

export async function getMfaSetupData() {
  const cookieStore = await cookies();
  const pendingEmail = cookieStore.get("lr_admin_pending_email")?.value;
  const isLocked = cookieStore.get("lr-admin-locked")?.value === "true";
  const existingSession = cookieStore.get("lr_admin_session")?.value;

  // Strict check: must have passed password authentication or be unlocking an active session
  if (!pendingEmail && !isLocked && !existingSession) {
    return null;
  }

  const email = (pendingEmail || FIXED_ADMIN_EMAIL).trim().toLowerCase();
  if (email !== FIXED_ADMIN_EMAIL) {
    return null;
  }

  // Permanent locked secret key: JBSWY3DPEHPK3PXP
  const secret = FIXED_ADMIN_MFA_SECRET;

  return {
    email,
    secret,
  };
}

export async function verifyMfaAction(code: string) {
  const cookieStore = await cookies();
  const pendingEmail = cookieStore.get("lr_admin_pending_email")?.value;
  const isLocked = cookieStore.get("lr-admin-locked")?.value === "true";
  const existingSession = cookieStore.get("lr_admin_session")?.value;

  if (!pendingEmail && !isLocked && !existingSession) {
    return { success: false, error: "Authentication required. Please sign in with your credentials first." };
  }

  const email = (pendingEmail || FIXED_ADMIN_EMAIL).trim().toLowerCase();
  if (email !== FIXED_ADMIN_EMAIL) {
    return { success: false, error: "Unauthorized administrator account." };
  }

  // Permanent locked verification using JBSWY3DPEHPK3PXP
  const isValid = verifyTOTP(code, FIXED_ADMIN_MFA_SECRET);
  if (!isValid) {
    return { success: false, error: "Incorrect 6-digit code. Please check your authenticator app and try again." };
  }

  // Create valid signed session token
  const token = signAdminToken(email);
  cookieStore.set("lr_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60, // 24 hours
  });

  // Clear pending flags & locks
  cookieStore.delete("lr_admin_pending_email");
  cookieStore.delete("lr-admin-locked");

  return { success: true };
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("lr_admin_session");
  cookieStore.delete("lr_admin_pending_email");
  cookieStore.delete("lr-admin-locked");

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore
  }

  return { success: true };
}
