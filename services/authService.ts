import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
}

export const mapUser = (user: User): AppUser => ({
  id: user.id,
  email: user.email ?? '',
  name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
  avatarUrl: user.user_metadata?.avatar_url ?? '',
});

export const signInWithGoogle = async (): Promise<void> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  if (error) throw error;
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async (): Promise<AppUser | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  return mapUser(session.user);
};

export const onAuthStateChange = (
  callback: (user: AppUser | null) => void
) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ? mapUser(session.user) : null);
    }
  );
  return () => subscription.unsubscribe();
};
