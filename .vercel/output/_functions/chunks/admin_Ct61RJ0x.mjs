import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ykwwrqxcfsahcelqgzrs.supabase.co";
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrd3dycXhjZnNhaGNlbHFnenJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk5MjQ3NiwiZXhwIjoyMDgwNTY4NDc2fQ.QcVrjHu0-2eaxq0uggyGWTdyhPdXSDd9KTzDhApoUpg";
function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export { getSupabaseAdmin as g };
