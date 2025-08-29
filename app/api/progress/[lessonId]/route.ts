import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getCollection } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { lessonId } = await params;
    
    // Validate lesson ID
    if (!/^\d+$/.test(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid lesson ID. Must be a number.' },
        { status: 400 }
      );
    }

    const progressCollection = await getCollection('progress');
    
    // Find progress for this user and lesson
    const progress = await progressCollection.findOne({
      userId: session.user.email,
      lessonId: parseInt(lessonId)
    });

    // If no progress exists, return empty progress
    if (!progress) {
      return NextResponse.json({
        userId: session.user.email,
        lessonId: parseInt(lessonId),
        completedItems: [],
        updatedAt: new Date()
      });
    }

    return NextResponse.json(progress);

  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { lessonId } = await params;
    const { itemId } = await request.json();
    
    // Validate input
    if (!itemId) {
      return NextResponse.json(
        { error: 'Missing itemId' },
        { status: 400 }
      );
    }

    if (typeof itemId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid itemId type' },
        { status: 400 }
      );
    }

    const progressCollection = await getCollection('progress');
    
    // Find existing progress for this user and lesson
    const existingProgress = await progressCollection.findOne({
      userId: session.user.email,
      lessonId: parseInt(lessonId)
    });

    if (existingProgress) {
      // Update existing progress - add itemId if not already present
      if (!existingProgress.completedItems.includes(itemId)) {
        const updatedProgress = await progressCollection.findOneAndUpdate(
          {
            userId: session.user.email,
            lessonId: parseInt(lessonId)
          },
          {
            $addToSet: { completedItems: itemId },
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
            lessonId: parseInt(lessonId),
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
        lessonId: parseInt(lessonId),
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
          lessonId: parseInt(lessonId),
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { lessonId } = await params;
    const { itemId } = await request.json();
    
    // Validate input
    if (!itemId) {
      return NextResponse.json(
        { error: 'Missing itemId' },
        { status: 400 }
      );
    }

    if (typeof itemId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid itemId type' },
        { status: 400 }
      );
    }

    const progressCollection = await getCollection('progress');
    
    // Find existing progress for this user and lesson
    const existingProgress = await progressCollection.findOne({
      userId: session.user.email,
      lessonId: parseInt(lessonId)
    });

    if (existingProgress) {
      // Remove itemId from completedItems array using a simpler approach
      const newCompletedItems = existingProgress.completedItems.filter((id: string) => id !== itemId);
      const updatedProgress = await progressCollection.findOneAndUpdate(
        {
          userId: session.user.email,
          lessonId: parseInt(lessonId)
        },
        {
          $set: { 
            completedItems: newCompletedItems,
            updatedAt: new Date() 
          }
        },
        { returnDocument: 'after' }
      );
      
      // Remove spaced-repetition review record for this item
      const reviewsCollection = await getCollection('reviews');
      await reviewsCollection.deleteOne({ 
        userId: session.user.email, 
        itemId 
      });

      return NextResponse.json(updatedProgress);
    } else {
      // No progress exists, return empty progress
      return NextResponse.json({
        userId: session.user.email,
        lessonId: parseInt(lessonId),
        completedItems: [],
        updatedAt: new Date()
      });
    }

  } catch (error) {
    console.error('Error removing progress:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
