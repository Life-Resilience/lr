import crypto from 'crypto';

export const FIXED_ADMIN_EMAIL = 'jothishgandham2@gmail.com';
export const FIXED_ADMIN_PASSWORD = 'admin@123456';
export const FIXED_ADMIN_MFA_SECRET = 'JBSWY3DPEHPK3PXP';

const AUTH_SECRET = process.env.ADMIN_PASSWORD || FIXED_ADMIN_PASSWORD;

export function getAdminConfig() {
  const adminEmail = (process.env.ADMIN_EMAIL || FIXED_ADMIN_EMAIL).trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || FIXED_ADMIN_PASSWORD;
  const adminMfaSecret = (process.env.ADMIN_MFA_SECRET || FIXED_ADMIN_MFA_SECRET).replace(/\s+/g, '').toUpperCase();

  return {
    adminEmail,
    adminPassword,
    adminMfaSecret: FIXED_ADMIN_MFA_SECRET,
  };
}

export function validateAdminCredentials(emailInput: string, passwordInput: string): boolean {
  const { adminEmail, adminPassword } = getAdminConfig();
  const normalizedEmail = (emailInput || '').trim().toLowerCase();

  // Strictly only jothishgandham2@gmail.com is authorized
  const isEmailAllowed = normalizedEmail === FIXED_ADMIN_EMAIL && normalizedEmail === adminEmail;
  
  // Strictly only admin@123456 is authorized
  const isPasswordCorrect = passwordInput === FIXED_ADMIN_PASSWORD && passwordInput === adminPassword;

  return isEmailAllowed && isPasswordCorrect;
}

// Base32 helpers for TOTP (RFC 6238)
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateBase32Secret(length = 20): string {
  const randomBytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE32_CHARS[randomBytes[i] % BASE32_CHARS.length];
  }
  return result;
}

function base32Decode(str: string): Buffer {
  const clean = str.replace(/[\s-]/g, '').toUpperCase();
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_CHARS.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

function getTOTPForEpoch(secret: string, epoch: number): string {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(epoch));

  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code =
    (((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)) %
    1000000;

  return code.toString().padStart(6, '0');
}

export function verifyTOTP(token: string, secret: string): boolean {
  if (!token || !secret) return false;
  const cleanToken = token.replace(/\s+/g, '');
  if (cleanToken.length !== 6) return false;

  const currentEpoch = Math.floor(Date.now() / 1000 / 30);
  // Allow drift of ±1 step (±30s)
  for (let i = -1; i <= 1; i++) {
    if (getTOTPForEpoch(secret, currentEpoch + i) === cleanToken) {
      return true;
    }
  }
  return false;
}

export function getTotpUri(secret: string, email: string): string {
  const issuer = 'LR Command Center';
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

// Session signing / verification for admin
export function signAdminToken(email: string): string {
  const payload = JSON.stringify({
    email: email.trim().toLowerCase(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(b64Payload).digest('base64url');
  return `${b64Payload}.${signature}`;
}

export function verifyAdminToken(token: string): { valid: boolean; email?: string } {
  if (!token || !token.includes('.')) return { valid: false };
  const [b64Payload, signature] = token.split('.');
  const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(b64Payload).digest('base64url');

  if (signature !== expectedSignature) {
    return { valid: false };
  }

  try {
    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Date.now()) {
      return { valid: false };
    }
    const tokenEmail = (payload.email || '').trim().toLowerCase();
    if (tokenEmail !== FIXED_ADMIN_EMAIL) {
      return { valid: false };
    }
    return { valid: true, email: tokenEmail };
  } catch {
    return { valid: false };
  }
}
