const mongoose = require('mongoose');
require('dotenv').config();

async function clearDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      blacklisted: Boolean
    }));
    
    console.log('🗑️  Deleting all users...');
    const result = await User.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} users\n`);
    
    console.log('📊 Verifying...');
    const count = await User.countDocuments();
    console.log(`✅ Current user count: ${count}\n`);
    
    if (count === 0) {
      console.log('🎉 Database cleared successfully!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

clearDatabase();
