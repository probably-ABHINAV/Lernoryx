import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'xoxogroovy@gmail.com',
    password: 'Cypher123@'
  });
  
  if (authErr) {
    console.error("Auth error:", authErr);
    return;
  }
  
  console.log("Logged in user:", authData.user.id);
  
  const { data, error } = await supabase.from('users').select('*').eq('id', authData.user.id);
  
  if (error) {
    console.error("Query Error:", error);
  } else {
    console.log("Query Data:", data);
  }
}

test();
