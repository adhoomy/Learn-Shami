import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'learn-shami';

if (!uri) {
  console.error('❌ MONGODB_URI is required in .env.local');
  process.exit(1);
}

async function seedLessons() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    const db = client.db(dbName);
    const lessons = db.collection('lessons');

    // Read JSON metadata for Lesson 1
    const jsonPath = path.join(process.cwd(), 'lessons', 'lesson1_greetings.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ lessons/lesson1_greetings.json not found');
      process.exit(1);
    }
    const content = fs.readFileSync(jsonPath, 'utf-8');
    const meta = JSON.parse(content);

    const doc = {
      id: 1,
      title: meta.title || 'Greetings',
      description: meta.description || 'Common greetings',
      difficulty: meta.difficulty || 'Beginner',
      tags: meta.tags || ['greetings'],
      csv: meta.csv || 'lesson1_greetings.csv',
      unit: meta.unit || 'Unit 1',
      order: meta.order || 1,
      estimatedTime: meta.estimatedTime || '10 min',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await lessons.updateOne({ id: 1 }, { $set: doc }, { upsert: true });
    await lessons.createIndex({ id: 1 }, { unique: true });
    console.log('✅ Seeded lesson 1 metadata');
  } catch (e) {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

seedLessons();


