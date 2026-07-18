const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env','utf8').split(/\r?\n/).reduce((acc,line)=>{
  const m=line.match(/^([^=]+)=(.*)$/);
  if(m) acc[m[1].trim()] = m[2].trim().replace(/^"|"$/g,'');
  return acc;
},{});
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);
(async ()=>{
  const tests = [
    { name: 'profiles_org', query: supabase.from('profiles').select('organization_id').limit(1) },
    { name: 'profiles_all', query: supabase.from('profiles').select('*').limit(1) },
    { name: 'user_organizations', query: supabase.from('user_organizations').select('*').limit(1) },
    { name: 'pending_customers', query: supabase.from('pending_customers').select('*').limit(1) }
  ];
  for (const test of tests) {
    try {
      const res = await test.query;
      console.log(test.name, JSON.stringify(res, null, 2));
    } catch (err) {
      console.error(test.name, err);
    }
  }
})();
