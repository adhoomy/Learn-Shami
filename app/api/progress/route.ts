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
            $push: { completedItems: { $each: [itemId] } },
            $set: { updatedAt: new Date() }
          },
          { returnDocument: 'after' }
        );
        
        // Initialize spaced-repetition review record for this item if missing
        const reviewsCollection = await getCollection('reviews');
        const existingReview = await reviewsCollection.findOne({ userId: session.user.email, itemId });
        if (!existingReview) {
          await reviewsCollection.insertOne({
            userId: session.user.email,
            lessonId: lessonId,
            itemId,
            nextReview: new Date(),
            interval: 1,
            easeFactor: 2.5,
            repetitions: 0,
            updatedAt: new Date()
          });
        }

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
      
      // Initialize spaced-repetition review record for this first item
      const reviewsCollection = await getCollection('reviews');
      const existingReview = await reviewsCollection.findOne({ userId: session.user.email, itemId });
      if (!existingReview) {
        await reviewsCollection.insertOne({
          userId: session.user.email,
          lessonId: lessonId,
          itemId,
          nextReview: new Date(),
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          updatedAt: new Date()
        });
      }

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
