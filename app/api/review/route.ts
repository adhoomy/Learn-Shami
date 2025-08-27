import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';

type ReviewDoc = {
  userId: string;
  lessonId: number;
  itemId: string;
  nextReview: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
  updatedAt: Date;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviews = await getCollection<ReviewDoc>('reviews');
    const now = new Date();
    const due = await reviews
      .find({ userId: session.user.email, nextReview: { $lte: now } })
      .sort({ nextReview: 1 })
      .toArray();

    return NextResponse.json(due);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, grade } = await request.json();
    // SM-2 uses integer grades 0..5
    if (!itemId || typeof grade !== 'number' || grade < 0 || grade > 5) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const reviews = await getCollection<ReviewDoc>('reviews');
    const existing = await reviews.findOne({ userId: session.user.email, itemId });
    if (!existing) {
      return NextResponse.json({ error: 'Review item not found' }, { status: 404 });
    }

    let { repetitions, interval, easeFactor } = existing;
    repetitions = repetitions ?? 0;
    interval = interval ?? 1;
    easeFactor = easeFactor ?? 2.5;

    // SM-2 algorithm
    let nextReview = new Date();
    if (grade < 3) {
      repetitions = 0;
      interval = 1;
      // EF adjustment on fails per SM-2
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
      nextReview.setDate(nextReview.getDate() + 1);
    } else {
      repetitions = repetitions + 1;
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.max(1, Math.round(interval * easeFactor));
      }
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
      nextReview.setDate(nextReview.getDate() + interval);
    }

    const updated = await reviews.findOneAndUpdate(
      { userId: session.user.email, itemId },
      {
        $set: {
          repetitions,
          interval,
          easeFactor,
          nextReview,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    // Update user streak stats
    const statsCol = await getCollection('user_stats');

    const today = new Date();
    const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    const stats = await statsCol.findOne({ userId: session.user.email });
    let newStreak = 1;
    let lastReviewDate: Date | null = utcToday;
    if (stats?.lastReviewDate) {
      const last = new Date(stats.lastReviewDate);
      const lastUtc = new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate()));
      const diffDays = Math.round((utcToday.getTime() - lastUtc.getTime()) / (24 * 60 * 60 * 1000));
      if (diffDays === 0) {
        newStreak = stats.streak ?? 1; // already reviewed today; keep streak
      } else if (diffDays === 1) {
        newStreak = (stats.streak ?? 0) + 1;
      } else {
        newStreak = 1; // reset and start new streak today
      }
    }

    await statsCol.updateOne(
      { userId: session.user.email },
      { $set: { userId: session.user.email, lastReviewDate: utcToday, streak: newStreak } },
      { upsert: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}



