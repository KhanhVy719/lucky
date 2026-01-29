async function seedStudents() {
  try {
    console.log('📥 Adding 44 students to database...\n');
    
    const response = await fetch('http://localhost:3000/api/seed/seed', {
      method: 'POST',
      headers: {
        'Authorization': 'admin-token',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success!');
      console.log(`📊 ${data.message}`);
      console.log(`📝 Total: ${data.count} students\n`);
      
      // Verify by getting all users
      const usersResponse = await fetch('http://localhost:3000/api/users');
      const users = await usersResponse.json();
      console.log(`✅ Verified: ${users.length} students in database`);
      console.log('\nFirst 5 students:');
      users.slice(0, 5).forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.name}`);
      });
    } else {
      console.log('❌ Error:', data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

seedStudents();
