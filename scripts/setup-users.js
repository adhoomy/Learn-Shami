import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'learn-shami';

if (!uri) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

async function setupUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    
    // Upsert demo and admin users
    const users = [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        password: await bcrypt.hash('password', 12),
        role: 'admin',
      },
      {
        email: 'demo@email.com',
        name: 'Demo Learner',
        password: await bcrypt.hash('demo123', 12),
        role: 'learner',
      }
    ];

    for (const u of users) {
      await usersCollection.updateOne(
        { email: u.email },
        { $set: { ...u, createdAt: new Date(), updatedAt: new Date() } },
        { upsert: true }
      );
    }
    console.log('✅ Upserted users:', users.map(u => u.email));
    
    // Create indexes for better performance
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ role: 1 });
    
    console.log('Created indexes on email and role fields');
    
  } catch (error) {
    console.error('Error setting up users:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

setupUsers();
