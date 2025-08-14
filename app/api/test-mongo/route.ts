import { NextResponse } from 'next/server';
import { findDocument, insertDocument } from '@/lib/db';

export async function GET() {
  try {
    // Test finding a document
    const user = await findDocument("users", { email: "admin@example.com" });
    
    // Test inserting a document
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: "Test document"
    };
    
    const result = await insertDocument("test", testDoc);
    
    return NextResponse.json({ 
      message: 'MongoDB functions working',
      userFound: !!user,
      testInserted: !!result.insertedId,
      testId: result.insertedId
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    return NextResponse.json(
      { error: 'MongoDB test failed: ' + error },
      { status: 500 }
    );
  }
}
