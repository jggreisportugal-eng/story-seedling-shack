import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kvavayuwvmyrhtlgqnko.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2YXZheXV3dm15cmh0bGdxbmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzA0NjksImV4cCI6MjA4NTM0NjQ2OX0.7754aaTpPDyPgYiirCOc3m54xtqySqd13K0FTIT-l40';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
