async function testAddUser() {
  try {
    console.log('🧪 Testing add user...\n');
    
    // Add a test user
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Authorization': 'admin-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'Nguyễn Văn Test' })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Add user successful!');
      console.log('Response:', data);
    } else {
      console.log('❌ Error:', data);
    }
    
    // Get all users
    console.log('\n📋 Getting all users...');
    const usersResponse = await fetch('http://localhost:3000/api/users');
    const users = await usersResponse.json();
    console.log(`✅ Total users: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\n📝 Latest 5 users:');
      users.slice(-5).forEach((u, i) => {
        console.log(`  ${users.length - 4 + i}. ${u.name} ${u.blacklisted ? '(Blacklisted)' : ''}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAddUser();
