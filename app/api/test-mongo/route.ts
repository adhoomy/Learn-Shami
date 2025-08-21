import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    // Test MongoDB connection by getting the lessons collection
    const lessonsCollection = await getCollection('lessons');
    
    // Test finding a document
    const lesson = await lessonsCollection.findOne({ id: 1 });
    
    // Test inserting a test document
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: "Test document from new MongoDB helper"
    };
    
    const result = await lessonsCollection.insertOne(testDoc);
    
    // Clean up test document
    await lessonsCollection.deleteOne({ _id: result.insertedId });
    
    return NextResponse.json({ 
      message: 'MongoDB connection working',
      lessonFound: !!lesson,
      testInserted: !!result.insertedId,
      testId: result.insertedId,
      lessonCount: await lessonsCollection.countDocuments()
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    return NextResponse.json(
      { error: 'MongoDB test failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
