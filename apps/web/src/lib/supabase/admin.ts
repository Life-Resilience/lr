import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from './server';

export async function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (serviceKey && serviceKey.length > 20 && !serviceKey.includes('your_')) {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }

  // Fallback to authenticated server client
  return await createServerClient();
}
