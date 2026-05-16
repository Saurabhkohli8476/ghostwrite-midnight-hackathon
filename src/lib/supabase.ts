import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Check .env.local is in project root and named exactly `.env.local`'
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Bypass navigator.locks entirely.
    // When a user clicks "Begin with Google" and presses the browser back
    // button, Chrome restores the page from bfcache with zombie locks
    // permanently held. Any subsequent Supabase call (getSession,
    // signInWithOAuth, etc.) tries to acquire those same locks and
    // HANGS FOREVER. This no-op lock function eliminates the deadlock.
    lock: async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
      return await fn();
    },
  },
});