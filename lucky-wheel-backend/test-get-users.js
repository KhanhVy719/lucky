async function testGetUsers() {
  try {
    console.log('📋 Testing GET /api/users...\n');
    
    const response = await fetch('http://localhost:3000/api/users');
    const users = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Total users: ${users.length}\n`);
    
    if (users.length > 0) {
      console.log('First 3 users:');
      users.slice(0, 3).forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.name} - ID: ${u._id}`);
      });
    } else {
      console.log('⚠️  No users in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGetUsers();
