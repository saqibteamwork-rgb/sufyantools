import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let url = '';
let serviceRoleKey = '';

try {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      url = trimmed.split('=')[1].replace(/['"]/g, '').trim();
    }
    if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      serviceRoleKey = trimmed.split('=')[1].replace(/['"]/g, '').trim();
    }
  }
} catch (e) {
  console.error('Error reading .env.local:', e.message);
}

const supabase = createClient(url, serviceRoleKey);

async function checkDatabase() {
  console.log(`🔍 Checking database: ${url}`);
  
  const tables = ['site_config', 'services', 'web_tools', 'reviews', 'coupons', 'admin_vault'];
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase.from(table).select('*', { count: 'exact' }).limit(4);
      if (error) {
        console.log(`❌ Table '${table}': ${error.code} - ${error.message}`);
      } else {
        console.log(`✅ Table '${table}': Found ${count} total rows`);
        if (table === 'coupons') {
          console.log('   Coupons list:', data.map(c => `${c.code} (${c.discount_type}: ${c.discount_value})`));
        }
      }
    } catch (e) {
      console.log(`❌ Table '${table}': Exception -> ${e.message}`);
    }
  }
}

checkDatabase();
