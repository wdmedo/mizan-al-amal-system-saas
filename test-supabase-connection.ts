import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jhfwhmnbpfrecqzoifuh.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Z0LCWbmbsgeAc-yaovzGGA_yDef-6Se';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  try {
    // Create client
    console.log('1️⃣  Creating Supabase client...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    console.log('✅ Client created successfully\n');

    // Test basic connectivity by fetching tables
    console.log('2️⃣  Testing database connection...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error:', error.message);
      return false;
    }

    console.log('✅ Database connection successful');
    console.log(`   Found ${data?.length || 0} profiles\n`);

    // Test auth status
    console.log('3️⃣  Checking auth status...');
    const { data: authData } = await supabase.auth.getSession();
    
    if (authData?.session) {
      console.log('✅ User is authenticated');
      console.log(`   Email: ${authData.session.user.email}\n`);
    } else {
      console.log('ℹ️  No active session (not logged in)\n');
    }

    console.log('🎉 All connection tests passed!');
    return true;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('❌ Connection test failed:', err.message);
    console.error(err.stack);
    return false;
  }
}

// Run the test
testSupabaseConnection();
