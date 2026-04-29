import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://oxqobtlcbksfdajnvnoz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cW9idGxjYmtzZmRham52bm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NTE3MzUsImV4cCI6MjA2NzUyNzczNX0.fIC24RysJVlnTS3LAxtqwe1luz3ED_SrfQeLnjmPnMk'
);

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'gelmemeyegidenkitapkurdu@gmail.com',
    password: 'Elif.6628'
  });
  
  if (error) {
    console.error('Login error:', error);
    return;
  }
  
  console.log('Logged in');
  
  const { data: updateData, error: updateError } = await supabase
    .from('admin_profile')
    .upsert({
      id: 1,
      about: 'Test about',
      email: 'gelmemeyegidenkitapkurdu@gmail.com',
      instagram: 'test',
      image: 'test_image'
    }, { onConflict: 'id' });
    
  if (updateError) {
    console.error('Update error:', updateError);
  } else {
    console.log('Update success:', updateData);
  }
  
  const { data: readData, error: readError } = await supabase
    .from('admin_profile')
    .select('*');
    
  console.log('Read data:', readData);
}

test();
