// Quick Production Verification Script
// Run this in your browser console on https://www.adiastra.com

console.log('🔍 Production Environment Check');
console.log('================================');

// Check if environment variables are properly set
const checks = {
  supabaseUrl: window.location.origin,
  hasSupabase: !!window.supabase,
  canCreateLead: typeof window.createTestLead === 'function'
};

console.log('✅ Site loaded from:', window.location.origin);

// Test Supabase connection
if (typeof fetch !== 'undefined') {
  // Quick test to see if we can reach Supabase
  fetch('https://gjkagdysjgljjbnagoib.supabase.co/rest/v1/', {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqa2FnZHlzamdsampibmFnb2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NTAyMDcsImV4cCI6MjA0OTAyNjIwN30.Ufv6PUFpfPZdQHlDU3wZBrwOB7K-df6lkqWpdXDRKlk'
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ Supabase connection: SUCCESS');
    } else {
      console.log('❌ Supabase connection: FAILED');
    }
  })
  .catch(error => {
    console.log('❌ Supabase connection: ERROR', error);
  });
}

// Instructions
console.log('\n📋 Manual Test Instructions:');
console.log('1. Fill out the assessment form');
console.log('2. Submit it');
console.log('3. Check if you get a success message');
console.log('4. Check your dashboard at /dashboard');

console.log('\n🚨 If forms still don\'t work:');
console.log('1. Clear browser cache (Ctrl+Shift+R)');
console.log('2. Wait 5 minutes for Vercel deployment');
console.log('3. Try in incognito mode'); 