// Supabase client singleton
// Credentials for: ideation-engine project (lwtnfxvusvzbzxfllvfo)

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lwtnfxvusvzbzxfllvfo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dG5meHZ1c3Z6Ynp4ZmxsdmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzUwMDYsImV4cCI6MjA5Njc1MTAwNn0.gZjinW7gmVV0tEC-3kVfLnsJucnQZ57Ytq-N3vjSOaE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
