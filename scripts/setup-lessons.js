import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function setupLessonsCollection() {
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
    
    // Create lessons collection
    const lessonsCollection = db.collection('lessons');
    
    // Create indexes for better performance
    await lessonsCollection.createIndex({ id: 1 }, { unique: true });
    await lessonsCollection.createIndex({ unit: 1, order: 1 });
    
    console.log('✅ Lessons collection setup complete');
    console.log('✅ Indexes created: id (unique), unit + order');
    
    // Read lesson metadata from JSON file
    const lessonJsonPath = path.join(process.cwd(), 'lessons', 'lesson1_greetings.json');
    const lessonJson = JSON.parse(await fs.readFile(lessonJsonPath, 'utf-8'));
    
    // Read lesson content from CSV file
    const lessonCsvPath = path.join(process.cwd(), 'lessons', 'lesson1_greetings.csv');
    const lessonCsv = await fs.readFile(lessonCsvPath, 'utf-8');
    
    // Parse CSV to get total items count
    const result = Papa.parse(lessonCsv, {
      header: true,
      skipEmptyLines: true
    });
    
    const totalItems = result.data.length;
    console.log(`✅ Lesson 1 has ${totalItems} items`);
    
    // Create lesson document for MongoDB
    const lessonDoc = {
      id: lessonJson.id,
      title: lessonJson.title,
      description: lessonJson.description,
      difficulty: lessonJson.difficulty,
      tags: lessonJson.tags,
      unit: lessonJson.unit,
      order: lessonJson.order,
      estimatedTime: lessonJson.estimatedTime,
      csv: lessonJson.csv,
      totalItems: totalItems,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Upsert lesson document
    await lessonsCollection.updateOne(
      { id: lessonDoc.id },
      { $set: lessonDoc },
      { upsert: true }
    );
    
    console.log('✅ Lesson 1 upserted to MongoDB');
    console.log('📚 Lesson details:', {
      id: lessonDoc.id,
      title: lessonDoc.title,
      totalItems: lessonDoc.totalItems,
      difficulty: lessonDoc.difficulty
    });
    
    // Show collection stats
    const stats = await db.stats();
    console.log(`✅ Database: ${stats.db}`);
    console.log(`✅ Collections: ${stats.collections}`);
    
    console.log('\n🎉 Lessons collection is ready!');
    console.log('Your lesson dashboard should now work properly.');
    
  } catch (error) {
    console.error('❌ Error setting up lessons collection:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if MongoDB is running');
    console.log('2. Verify your connection string in .env.local');
    console.log('3. Check if lessons/lesson1_greetings.json and .csv exist');
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

setupLessonsCollection().catch(console.error);
