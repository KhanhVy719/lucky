const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use the standard Postgres connection string from Supabase
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Supabase requires SSL
    }
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Supabase (PostgreSQL) successfully.');
    // Sync models
    await sequelize.sync({ alter: true }); // Automatically updates schema
    console.log('✅ Database synchronized.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
