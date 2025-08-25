import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function setupProgressCollection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is required');
    console.log('Please create a .env.local file with your MongoDB connection string');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');

    const db = client.db(process.env.MONGODB_DB || 'learn-shami');
    console.log(`✅ Database: ${db.databaseName}`);
    
    // Create progress collection
    const progressCollection = db.collection('progress');
    
    // Create indexes for better performance
    await progressCollection.createIndex({ userId: 1, lessonId: 1 }, { unique: true });
    await progressCollection.createIndex({ userId: 1 });
    await progressCollection.createIndex({ lessonId: 1 });
    
    console.log('✅ Progress collection setup complete');
    console.log('✅ Indexes created:');
    console.log('  - userId + lessonId (unique compound index)');
    console.log('  - userId');
    console.log('  - lessonId');
    
    // Show collection stats
    const stats = await db.stats();
    console.log(`✅ Database: ${stats.db}`);
    console.log(`✅ Collections: ${stats.collections}`);
    
    console.log('\n🎉 Progress collection is ready!');
    console.log('You can now test it with: npm run test-progress');
    
  } catch (error) {
    console.error('❌ Error setting up progress collection:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if MongoDB is running');
    console.log('2. Verify your connection string in .env.local');
    console.log('3. Check network connectivity');
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

setupProgressCollection().catch(console.error);
