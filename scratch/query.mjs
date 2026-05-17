import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const hash = '1f223de6fb407ca5c9ec8f899fc4fd272aa780850dc80e2273bb180d19775643';
  const { data: docs, error: docErr } = await supabase.from('cover_letters').select('id, midnight_hash').eq('midnight_hash', hash);
  console.log("Docs with this hash:", docs);
  console.log("Error:", docErr);
}

check();
