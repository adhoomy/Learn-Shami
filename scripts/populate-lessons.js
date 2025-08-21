import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function populateLessons() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is required');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(process.env.MONGODB_DB || 'learn-shami');
    const lessonsCollection = db.collection('lessons');
    
    // Read the lesson metadata
    const lessonPath = path.join(__dirname, '..', 'lessons', 'lesson1_greetings.json');
    const lessonData = JSON.parse(await fs.readFile(lessonPath, 'utf-8'));
    
    // Check if lesson already exists
    const existingLesson = await lessonsCollection.findOne({ id: lessonData.id });
    
    if (existingLesson) {
      console.log(`Lesson ${lessonData.id} already exists, updating...`);
      await lessonsCollection.updateOne(
        { id: lessonData.id },
        { $set: lessonData }
      );
    } else {
      console.log(`Inserting lesson ${lessonData.id}...`);
      await lessonsCollection.insertOne(lessonData);
    }
    
    console.log('Lessons collection populated successfully');
    
    // Display the inserted/updated lesson
    const result = await lessonsCollection.findOne({ id: lessonData.id });
    console.log('Lesson data:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error populating lessons:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

populateLessons().catch(console.error);
