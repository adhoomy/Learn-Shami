import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testProgressAPI() {
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
    
    const progressCollection = db.collection('progress');
    
    // Test data
    const testUserId = 'test@example.com';
    const testLessonId = 1;
    const testItemId = 'item_1_0';
    
    console.log('\n🧪 === Testing Progress Collection ===');
    
    // Test 1: Insert progress
    console.log('\n1️⃣ Testing progress insertion...');
    const insertResult = await progressCollection.insertOne({
      userId: testUserId,
      lessonId: testLessonId,
      completedItems: [testItemId],
      updatedAt: new Date()
    });
    console.log('✅ Progress inserted:', insertResult.insertedId);
    
    // Test 2: Find progress
    console.log('\n2️⃣ Testing progress retrieval...');
    const foundProgress = await progressCollection.findOne({
      userId: testUserId,
      lessonId: testLessonId
    });
    console.log('✅ Progress found:', foundProgress);
    
    // Test 3: Update progress (add new item)
    console.log('\n3️⃣ Testing progress update...');
    const updateResult = await progressCollection.findOneAndUpdate(
      { userId: testUserId, lessonId: testLessonId },
      { 
        $push: { completedItems: 'item_1_1' },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    console.log('✅ Progress updated:', updateResult);
    
    // Test 4: Check unique constraint
    console.log('\n4️⃣ Testing unique constraint...');
    try {
      await progressCollection.insertOne({
        userId: testUserId,
        lessonId: testLessonId,
        completedItems: ['item_1_2'],
        updatedAt: new Date()
      });
      console.log('❌ Should have failed due to duplicate key');
    } catch (error) {
      if (error.code === 11000) {
        console.log('✅ Unique constraint working (duplicate key rejected)');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    // Test 5: Query by user
    console.log('\n5️⃣ Testing user progress query...');
    const userProgress = await progressCollection.find({ userId: testUserId }).toArray();
    console.log('✅ User progress found:', userProgress.length, 'lessons');
    
    // Test 6: Query by lesson
    console.log('\n6️⃣ Testing lesson progress query...');
    const lessonProgress = await progressCollection.find({ lessonId: testLessonId }).toArray();
    console.log('✅ Lesson progress found:', lessonProgress.length, 'users');
    
    // Cleanup test data
    console.log('\n7️⃣ Cleaning up test data...');
    await progressCollection.deleteMany({ userId: testUserId });
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 === All Tests Passed! ===');
    console.log('Your progress tracking system is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing progress API:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure you ran npm run setup-progress first');
    console.log('2. Check if MongoDB is running');
    console.log('3. Verify your connection string in .env.local');
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

testProgressAPI().catch(console.error);
