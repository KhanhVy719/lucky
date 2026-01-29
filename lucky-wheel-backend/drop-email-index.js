const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      blacklisted: Boolean
    }));
    
    try {
      // Drop the email index
      await User.collection.dropIndex('email_1');
      console.log('✅ Dropped email_1 index successfully');
    } catch (error) {
      console.log('ℹ️  Index email_1 not found or already dropped');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
