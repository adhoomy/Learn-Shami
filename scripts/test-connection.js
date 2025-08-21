import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testConnection() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    console.log('Please create a .env.local file with your MongoDB connection string');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    
    const db = client.db(process.env.MONGODB_DB || 'learn-shami');
    console.log(`✅ Database: ${db.databaseName}`);
    
    // Test basic operations
    const collections = await db.listCollections().toArray();
    console.log(`✅ Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('Collections:', collections.map(c => c.name).join(', '));
    }
    
    console.log('\n🎉 MongoDB connection test passed!');
    console.log('You can now run: npm run populate-lessons');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if MongoDB is running');
    console.log('2. Verify your connection string in .env.local');
    console.log('3. Check network connectivity');
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

testConnection().catch(console.error);
