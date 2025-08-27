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
    
    // Create collections
    const progressCollection = db.collection('progress');
    const reviewsCollection = db.collection('reviews');
    const statsCollection = db.collection('user_stats');
    
    // Create indexes for better performance
    await progressCollection.createIndex({ userId: 1, lessonId: 1 }, { unique: true });
    await progressCollection.createIndex({ userId: 1 });
    await progressCollection.createIndex({ lessonId: 1 });
    await reviewsCollection.createIndex({ userId: 1, itemId: 1 }, { unique: true });
    await reviewsCollection.createIndex({ userId: 1, nextReview: 1 });
    await statsCollection.createIndex({ userId: 1 }, { unique: true });
    
    console.log('✅ Collections setup complete');
    console.log('✅ Indexes created:');
    console.log('  - progress: userId + lessonId (unique), userId, lessonId');
    console.log('  - reviews: userId + itemId (unique), userId + nextReview');
    console.log('  - user_stats: userId (unique)');
    
    // Show collection stats
    const stats = await db.stats();
    console.log(`✅ Database: ${stats.db}`);
    console.log(`✅ Collections: ${stats.collections}`);
    
    // Seed demo data
    console.log('\n🧪 Seeding demo data...');
    const demoUser = 'demo@email.com';
    const lessonId = 1;
    const now = new Date();
    const demoItems = Array.from({ length: 10 }).map((_, i) => ({
      userId: demoUser,
      lessonId,
      itemId: `item_${lessonId}_${i}`,
      nextReview: new Date(now.getTime() + (i % 3 === 0 ? -1 : 0) * 24*60*60*1000),
      interval: i < 2 ? 1 : 3,
      easeFactor: 2.5,
      repetitions: i % 2,
      updatedAt: now,
    }));
    await reviewsCollection.deleteMany({ userId: demoUser });
    if (demoItems.length) await reviewsCollection.insertMany(demoItems);
    await progressCollection.updateOne(
      { userId: demoUser, lessonId },
      { $set: { userId: demoUser, lessonId, completedItems: demoItems.slice(0,6).map((_, i) => `item_${lessonId}_${i}`), updatedAt: now } },
      { upsert: true }
    );
    await statsCollection.updateOne(
      { userId: demoUser },
      { $set: { userId: demoUser, streak: 3, lastReviewDate: now } },
      { upsert: true }
    );
    
    console.log('\n🎉 Progress collections are ready and demo data seeded!');
    
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
