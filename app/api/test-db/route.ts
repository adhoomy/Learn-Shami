import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    // Test the connection
    const client = await clientPromise;
    const db = client.db();
    
    // Get database info
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    
    return NextResponse.json({ 
      message: 'Successfully connected to MongoDB Atlas!',
      ping: result,
      database: db.databaseName,
      collections: await db.listCollections().toArray()
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB' },
      { status: 500 }
    );
  }
}
