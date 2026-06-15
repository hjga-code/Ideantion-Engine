import { supabase } from './lib/supabase';
import type { Session } from './types';
import type { GlobalSettings } from './types';

export const MAX_SESSIONS = 10;

// ─── SESSIONS ────────────────────────────────────────────────────────────────

export const getSessions = async (userId: string): Promise<Session[]> => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('last_modified', { ascending: false });

  if (error) { console.error('getSessions:', error); return []; }

  return (data ?? []).map((row: Record<string, any>) => ({
    id: row.id,
    title: row.title,
    timestamp: row.timestamp,
    lastModified: row.last_modified,
    messages: row.messages ?? [],
    module: row.module,
    preset: row.preset,
    language: row.language,
    format: row.format,
    provider: row.provider,
    modelUsed: row.model_used,
  })) as Session[];
};

export const upsertSession = async (userId: string, session: Session): Promise<void> => {
  const { error } = await supabase
    .from('sessions')
    .upsert({
      id: session.id,
      user_id: userId,
      title: session.title,
      timestamp: session.timestamp,
      last_modified: session.lastModified,
      messages: session.messages,
      module: session.module,
      preset: session.preset,
      language: session.language ?? 'AUTO',
      format: session.format ?? 'MARKDOWN',
      provider: session.provider ?? 'GEMINI',
      model_used: session.modelUsed ?? 'gemini-3.5-flash',
    }, { onConflict: 'id' });

  if (error) console.error('upsertSession:', error);
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);

  if (error) console.error('deleteSession:', error);
};

export const getSessionCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('sessions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) { console.error('getSessionCount:', error); return 0; }
  return count ?? 0;
};

// ─── USER SETTINGS ───────────────────────────────────────────────────────────

export const getUserSettings = async (userId: string): Promise<GlobalSettings | null> => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: 'global',
    provider: data.provider,
    geminiKey: data.gemini_key ?? '',
    openRouterKey: data.open_router_key ?? '',
    openRouterModel: data.open_router_model ?? 'anthropic/claude-sonnet-4-6',
    geminiModel: data.gemini_model ?? 'gemini-3.5-flash',
    providerName: data.provider_name ?? 'My Workspace',
    tourCompleted: data.tour_completed ?? false,
  } as GlobalSettings;
};

export const saveUserSettings = async (userId: string, settings: GlobalSettings): Promise<void> => {
  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      provider: settings.provider,
      gemini_key: settings.geminiKey,
      gemini_model: settings.geminiModel,
      open_router_key: settings.openRouterKey,
      open_router_model: settings.openRouterModel,
      provider_name: settings.providerName,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) console.error('saveUserSettings:', error);
};

// ─── TOUR ────────────────────────────────────────────────────────────────────

export const markTourCompleted = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_settings')
    .upsert(
      { user_id: userId, tour_completed: true },
      { onConflict: 'user_id' }
    );
  if (error) console.error('markTourCompleted:', error);
};

export const getTourCompleted = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('tour_completed')
    .eq('user_id', userId)
    .single();
  if (error || !data) return false;
  return data.tour_completed ?? false;
};
