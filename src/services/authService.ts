import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface UserProfileData {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthResponse<T = unknown> {
  data: T | null;
  error: string | null;
}

class AuthService {
  /**
   * Register a new user with Supabase Auth and generate their profile
   */
  public async signUp(
    email: string,
    password: string,
    username: string,
    displayName?: string
  ): Promise<AuthResponse<{ user: User; profile: UserProfileData }>> {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: 'Supabase is not configured. Please set your environment variables.' };
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (cleanUsername.length < 3) {
      return { data: null, error: 'Username must be at least 3 characters and contain only letters, numbers, and underscores.' };
    }

    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: cleanUsername,
            display_name: displayName?.trim() || cleanUsername,
          },
        },
      });

      if (authErr) {
        return { data: null, error: authErr.message };
      }

      if (!authData.user) {
        return { data: null, error: 'User registration failed. Please verify credentials.' };
      }

      const profileData: UserProfileData = {
        id: authData.user.id,
        username: cleanUsername,
        displayName: displayName?.trim() || cleanUsername,
        createdAt: new Date().toISOString(),
      };

      // Ensure profile row exists in public.profiles table
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            username: cleanUsername,
            display_name: profileData.displayName,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
      } catch (profileErr) {
        console.warn('[TypeRush] Profile sync note (run schema.sql in Supabase):', profileErr);
      }

      return {
        data: {
          user: authData.user,
          profile: profileData,
        },
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed unexpectedly.';
      return { data: null, error: msg };
    }
  }

  /**
   * Sign in an existing user with email and password
   */
  public async signIn(
    email: string,
    password: string
  ): Promise<AuthResponse<{ user: User; session: Session; profile: UserProfileData }>> {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: 'Supabase is not configured. Please check your environment variables.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data.user || !data.session) {
        return { data: null, error: 'Authentication failed. Please check your credentials.' };
      }

      const profile = await this.getProfile(data.user.id, data.user);

      return {
        data: {
          user: data.user,
          session: data.session,
          profile,
        },
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed unexpectedly.';
      return { data: null, error: msg };
    }
  }

  /**
   * Sign out current user
   */
  public async signOut(): Promise<{ error: string | null }> {
    if (!supabase) return { error: null };
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error ? error.message : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Sign out error' };
    }
  }

  /**
   * Request password reset email
   */
  public async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Password reset failed.' };
    }
  }

  /**
   * Get current active session
   */
  public async getSession(): Promise<Session | null> {
    if (!supabase) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  }

  /**
   * Fetch user profile from database with user_metadata fallback
   */
  public async getProfile(userId: string, userObj?: User): Promise<UserProfileData> {
    const metaUsername = userObj?.user_metadata?.username;
    const metaDisplay = userObj?.user_metadata?.display_name;
    const emailPrefix = userObj?.email ? userObj.email.split('@')[0] : 'racer';

    const fallback: UserProfileData = {
      id: userId,
      username: metaUsername || emailPrefix,
      displayName: metaDisplay || metaUsername || emailPrefix,
      createdAt: userObj?.created_at,
    };

    if (!supabase) return fallback;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          username: data.username,
          displayName: data.display_name || data.username,
          avatarUrl: data.avatar_url,
          createdAt: data.created_at,
        };
      }

      // If profile does not exist in table yet, try to create it
      if (userObj) {
        await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: fallback.username,
            display_name: fallback.displayName,
          });
      }
    } catch {
      // Table may not exist yet in fresh Supabase projects
    }

    return fallback;
  }

  /**
   * Update profile display name or avatar
   */
  public async updateProfile(userId: string, updates: Partial<UserProfileData>): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.displayName) payload.display_name = updates.displayName.trim();
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId);

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Listen to auth state transitions
   */
  public onAuthStateChange(
    callback: (user: User | null, profile: UserProfileData | null) => void
  ): () => void {
    if (!supabase) {
      callback(null, null);
      return () => {};
    }

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await this.getProfile(session.user.id, session.user);
        callback(session.user, profile);
      } else {
        callback(null, null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }
}

export const authService = new AuthService();
