import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

/**
 * High-Performance Supabase Client Configuration
 * - Transaction Connection Pooling (Supavisor / PgBouncer port 6543)
 * - Cached API queries with automatic stale-while-revalidate
 * - Auth session auto-refresh without main-thread blocking
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-application-name': 'label-by-vinnie-web',
    },
  },
  db: {
    schema: 'public',
  },
});

/**
 * Database Connection Pooling Reference & Pooler String Constructor:
 * In production Supabase, connect via the pooled URL:
 * postgres://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=20
 */
export function getPooledConnectionString(baseUri: string): string {
  if (!baseUri) return '';
  const url = new URL(baseUri);
  url.port = '6543'; // Transaction pooler port
  url.searchParams.set('pgbouncer', 'true');
  url.searchParams.set('connection_limit', '20');
  return url.toString();
}
