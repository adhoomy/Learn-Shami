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

// Function to parse CSV and convert to data array
function parseCSV(csvPath) {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index] ? values[index].trim() : '';
      });
      data.push(row);
    }
  }
  return data;
}

async function seedLessons() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    const db = client.db(dbName);
    const lessons = db.collection('lessons');

    // Define all lessons to seed
    const lessonsToSeed = [
      { id: 1, jsonFile: 'lesson1_greetings.json', csvFile: 'lesson1_greetings.csv' },
      { id: 2, jsonFile: 'lesson2_introductions.json', csvFile: 'lesson2_introductions.csv' },
      { id: 3, jsonFile: 'lesson3_numbers.json', csvFile: 'lesson3_numbers.csv' },
      { id: 4, jsonFile: 'lesson4_phrases.json', csvFile: 'lesson4_phrases.csv' },
      { id: 5, jsonFile: 'lesson5_family.json', csvFile: 'lesson5_family.csv' }
    ];

    for (const lesson of lessonsToSeed) {
      const jsonPath = path.join(process.cwd(), 'lessons', lesson.jsonFile);
      const csvPath = path.join(process.cwd(), 'lessons', lesson.csvFile);

      if (!fs.existsSync(jsonPath)) {
        console.error(`❌ ${lesson.jsonFile} not found`);
        continue;
      }
      if (!fs.existsSync(csvPath)) {
        console.error(`❌ ${lesson.csvFile} not found`);
        continue;
      }

      // Read JSON metadata
      const content = fs.readFileSync(jsonPath, 'utf-8');
      const meta = JSON.parse(content);

      // Parse CSV data
      const data = parseCSV(csvPath);

      const doc = {
        id: lesson.id,
        title: meta.title || `Lesson ${lesson.id}`,
        description: meta.description || '',
        difficulty: meta.difficulty || 'Beginner',
        tags: meta.tags || [],
        csv: lesson.csvFile,
        unit: meta.unit || 1,
        order: meta.order || lesson.id,
        estimatedTime: meta.estimatedTime || '10 min',
        data: data, // Include the parsed CSV data
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await lessons.updateOne({ id: lesson.id }, { $set: doc }, { upsert: true });
      console.log(`✅ Seeded lesson ${lesson.id} metadata and data (${data.length} items)`);
    }

    // Create unique index on id field
    await lessons.createIndex({ id: 1 }, { unique: true });
    console.log('✅ Created unique index on lesson id');
  } catch (e) {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

seedLessons();


