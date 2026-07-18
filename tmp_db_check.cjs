const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env','utf8').split(/\r?\n/).reduce((acc, line) => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) acc[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '');
  return acc;
}, {});
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);
(async () => {
  try {
    const q = await supabase
      .from('information_schema.tables')
      .select('table_catalog,table_schema,table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['profiles','user_organizations','organizations','pending_customers','payments','completed_customers'])
      .limit(20);
    console.log(JSON.stringify(q, null, 2));
  } catch (e) {
    console.error(e);
  }
})();
