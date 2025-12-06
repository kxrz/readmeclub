import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ykwwrqxcfsahcelqgzrs.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrd3dycXhjZnNhaGNlbHFnenJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTI0NzYsImV4cCI6MjA4MDU2ODQ3Nn0.tfMJDZ9lkzJhJgZGUoU2Xjy-wkWGd0adC2cSL0PJ84o";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase as s };
