import { createClient, SupabaseClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function getSupabaseCredentials(): { url: string | null; key: string | null } {
  let url = envUrl ? envUrl.trim() : null;
  let key = envKey ? envKey.trim() : null;

  // Fallback to locally saved credentials in settings if environment variables are not set
  if (!url || !key) {
    try {
      const stored = localStorage.getItem('typerush_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.supabaseUrl && parsed.supabaseAnonKey) {
          url = parsed.supabaseUrl.trim();
          key = parsed.supabaseAnonKey.trim();
        }
      }
    } catch {
      // Ignore
    }
  }

  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http') && key.length > 20);
}

function initClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (url && key && url.startsWith('http')) {
    try {
      return createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
      });
    } catch (err) {
      console.warn('[TypeRush] Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

export const supabase: SupabaseClient | null = initClient();
