/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly ADMIN_PASSWORD: string;
  readonly VERCEL_REBUILD_WEBHOOK_URL?: string;
  // Migration variables
  readonly OLD_PUBLIC_SUPABASE_URL?: string;
  readonly OLD_PUBLIC_SUPABASE_ANON_KEY?: string;
  readonly OLD_SUPABASE_SERVICE_ROLE_KEY?: string;
  // Airtable API
  readonly AIRTABLE_API_KEY?: string;
  readonly AIRTABLE_BASE_ID?: string;
  readonly AIRTABLE_TABLE_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
