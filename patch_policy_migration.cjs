const fs = require('fs');
const path = require('path');
const p = path.join('supabase', 'migrations', '20250902093915_b95341e5-500e-497a-9d9b-3383ce771dea.sql');
let s = fs.readFileSync(p, 'utf8');
const regex = /^CREATE POLICY "([^"]+)" ON (public\.[^\s]+)(.*)$/gm;
s = s.replace(regex, (_, name, table, rest) => `DROP POLICY IF EXISTS "${name}" ON ${table};\nCREATE POLICY "${name}" ON ${table}${rest}`);
fs.writeFileSync(p, s, 'utf8');
console.log('patched', p);
