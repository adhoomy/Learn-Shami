import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getCollection } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { lessonId, itemId } = await request.json();
    
    // Validate input
    if (!lessonId || !itemId) {
      return NextResponse.json(
        { error: 'Missing lessonId or itemId' },
        { status: 400 }
      );
    }

    if (typeof lessonId !== 'number' || typeof itemId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid lessonId or itemId types' },
        { status: 400 }
      );
    }

    const progressCollection = await getCollection('progress');
    
    // Find existing progress for this user and lesson
    const existingProgress = await progressCollection.findOne({
      userId: session.user.email,
      lessonId: lessonId
    });

    if (existingProgress) {
      // Update existing progress - add itemId if not already present
      if (!existingProgress.completedItems.includes(itemId)) {
        const updatedProgress = await progressCollection.findOneAndUpdate(
          {
            userId: session.user.email,
            lessonId: lessonId
          },
          {
            $push: { completedItems: itemId },
            $set: { updatedAt: new Date() }
          },
          { returnDocument: 'after' }
        );
        
        return NextResponse.json(updatedProgress);
      } else {
        // Item already completed, return existing progress
        return NextResponse.json(existingProgress);
      }
    } else {
      // Create new progress document
      const newProgress = {
        userId: session.user.email,
        lessonId: lessonId,
        completedItems: [itemId],
        updatedAt: new Date()
      };
      
      const result = await progressCollection.insertOne(newProgress);
      const createdProgress = await progressCollection.findOne({ _id: result.insertedId });
      
      return NextResponse.json(createdProgress);
    }

  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
