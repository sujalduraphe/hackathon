/**
 * SkillBridge – Schema Runner
 * Uses Supabase's postgres REST endpoint to run schema.sql
 *
 * Usage: node server/run-schema.js
 *
 * NOTE: Requires SUPABASE_SERVICE_ROLE_KEY in .env
 */

import 'dotenv/config';
import { readFileSync } from 'fs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// Extract project ref from URL (e.g. kyodwmatydkogakowwab)
const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

console.log(`🗄️  Running schema on project: ${projectRef}`);
console.log('📌 Using Supabase Management API...\n');

const sql = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');

// Run via Supabase Management API /pg/query endpoint
const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SERVICE_KEY}`,
  },
  body: JSON.stringify({ query: sql }),
});

if (res.ok) {
  const data = await res.json().catch(() => ({}));
  console.log('✅ Schema applied successfully!');
  console.log('Response:', JSON.stringify(data, null, 2));
} else {
  const err = await res.text();
  console.log(`⚠️  Management API returned ${res.status}. Trying direct postgres approach...`);
  console.log(err);

  // Alternative: use pg extension via RPC if available
  console.log('\n📋 Please run schema.sql manually in the Supabase SQL Editor:');
  console.log('   1. Go to https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
  console.log('   2. Paste the contents of server/schema.sql');
  console.log('   3. Click "Run"\n');
}
