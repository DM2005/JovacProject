// Test MongoDB connection
// Usage: node src/utils/testMongoDB.js

require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoDB() {
    console.log('Testing MongoDB connection...\n');
    
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rephome';
    
    console.log('Connection URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    console.log('');
    
    try {
        console.log('Attempting to connect...');
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        
        console.log('✅ MongoDB connected successfully!');
        console.log('Database name:', mongoose.connection.db.databaseName);
        console.log('Host:', mongoose.connection.host);
        console.log('Port:', mongoose.connection.port);
        
        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nCollections in database:', collections.length);
        if (collections.length > 0) {
            console.log('Collection names:', collections.map(c => c.name).join(', '));
        }
        
        await mongoose.disconnect();
        console.log('\n✅ Connection test completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection failed!');
        console.error('Error:', error.message);
        console.error('\nCommon issues:');
        console.error('1. MongoDB is not running');
        console.error('   - Windows: Check Services or run: net start MongoDB');
        console.error('   - Mac/Linux: Run: sudo systemctl start mongod');
        console.error('2. Wrong connection string');
        console.error('   - Check your .env file: MONGODB_URI=mongodb://127.0.0.1:27017/rephome');
        console.error('3. Firewall blocking port 27017');
        console.error('4. MongoDB not installed');
        console.error('   - Download from: https://www.mongodb.com/try/download/community');
        process.exit(1);
    }
}

testMongoDB();

