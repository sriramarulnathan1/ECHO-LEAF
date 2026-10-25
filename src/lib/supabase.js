import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zxwkctqqacfjridprqva.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jt9rFul8ZHMtXDyttFSWLQ_sMJ63Afx';

export const supabase = createClient(supabaseUrl, supabaseKey);
