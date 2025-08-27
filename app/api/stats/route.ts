import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';

type UserStatsDoc = {
  userId: string;
  streak: number;
  lastReviewDate?: Date | null;
};

function startOfUtcDay(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  return d;
}

function endOfUtcDay(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
  return d;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const now = new Date();
    const startToday = startOfUtcDay(now);
    const endToday = endOfUtcDay(now);

    const progressCol = await getCollection('progress');
    const reviewsCol = await getCollection('reviews');
    const statsCol = await getCollection<UserStatsDoc>('user_stats');

    // totalLearned = count of unique items the user has marked learned across all lessons
    const totalLearnedAgg = await progressCol
      .aggregate([
        { $match: { userId } },
        { $unwind: '$completedItems' },
        { $group: { _id: '$completedItems' } },
        { $count: 'count' }
      ])
      .toArray();
    const totalLearned = totalLearnedAgg[0]?.count ?? 0;

    // dueToday = items with nextReview <= end of today
    const dueToday = await reviewsCol.countDocuments({ userId, nextReview: { $lte: endToday } });

    // per-lesson due counts (for lessons list UI)
    const perLessonDueAgg = await reviewsCol
      .aggregate([
        { $match: { userId, nextReview: { $lte: endToday } } },
        { $group: { _id: '$lessonId', dueCount: { $sum: 1 } } },
        { $project: { _id: 0, lessonId: '$_id', dueCount: 1 } },
        { $sort: { lessonId: 1 } }
      ])
      .toArray();

    // reviews done today (optional visual polish)
    const reviewsDoneToday = await reviewsCol.countDocuments({ userId, updatedAt: { $gte: startToday, $lte: endToday } });

    // streak + lastReviewDate
    const userStats = await statsCol.findOne({ userId });
    const streak = userStats?.streak ?? 0;
    const lastReviewDate = userStats?.lastReviewDate ?? null;

    return NextResponse.json({
      totalLearned,
      dueToday,
      streak,
      lastReviewDate,
      reviewsDoneToday,
      perLessonDue: perLessonDueAgg,
    });
  } catch (error) {
    console.error('Error building stats:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}


