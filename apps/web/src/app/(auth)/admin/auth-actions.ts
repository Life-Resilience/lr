"use server";

import { cookies } from "next/headers";
import { 
  validateAdminCredentials, 
  getTotpUri, 
  verifyTOTP, 
  signAdminToken,
  getAdminConfig
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

  const isValid = validateAdminCredentials(email, password);
  if (!isValid) {
    return { 
      success: false, 
      error: "Incorrect email or password. Please check your credentials." 
    };
  }

  try {
    const supabase = await createClient();
    await supabase.auth.signInWithPassword({ email, password });
  } catch {
  }

  const cookieStore = await cookies();

  cookieStore.set("lr_admin_pending_email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  return { success: true, redirect: "/admin/mfa" };
}

export async function getMfaSetupData() {
  const cookieStore = await cookies();
  const pendingEmail = cookieStore.get("lr_admin_pending_email")?.value;
  const isLocked = cookieStore.get("lr-admin-locked")?.value === "true";
  const existingSession = cookieStore.get("lr_admin_session")?.value;

  if (!pendingEmail && !isLocked && !existingSession) {
    return null;
  }

  const { adminEmail, adminMfaSecret } = getAdminConfig();

  const email = (pendingEmail || adminEmail).trim().toLowerCase();
  if (email !== adminEmail) {
    return null;
  }

  const secret = adminMfaSecret;

  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart.length > 1 
    ? localPart[0] + '*'.repeat(localPart.length - 1)
    : '*';
  const maskedEmail = maskedLocal + '@' + domain;

  return {
    email: maskedEmail,
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

  const { adminEmail, adminMfaSecret } = getAdminConfig();

  const email = (pendingEmail || adminEmail).trim().toLowerCase();
  if (email !== adminEmail) {
    return { success: false, error: "Unauthorized administrator account." };
  }

  const isValid = verifyTOTP(code, adminMfaSecret);
  if (!isValid) {
    return { success: false, error: "Incorrect 6-digit code. Please check your authenticator app and try again." };
  }

  const token = signAdminToken(email);
  cookieStore.set("lr_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });

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
  }

  return { success: true };
}
