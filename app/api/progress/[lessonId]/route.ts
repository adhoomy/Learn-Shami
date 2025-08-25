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
