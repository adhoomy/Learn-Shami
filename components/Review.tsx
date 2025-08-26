'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReviewDoc {
  userId: string;
  lessonId: number;
  itemId: string;
  nextReview: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  updatedAt: string;
}

interface LessonItem {
  arabic?: string | null;
  english?: string | null;
}

interface LessonResponse {
  lessonId: number;
  data: LessonItem[];
}

export default function Review({ lessonId }: { lessonId: string }) {
  const [due, setDue] = useState<ReviewDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [lesson, setLesson] = useState<LessonResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [r, l] = await Promise.all([
          fetch('/api/review'),
          fetch(`/api/lessons/${lessonId}`),
        ]);
        if (!r.ok) throw new Error('Failed to load due reviews');
        if (!l.ok) throw new Error('Failed to load lesson');
        const dueItems: ReviewDoc[] = await r.json();
        const lessonData: LessonResponse = await l.json();
        setDue(dueItems.filter((d) => d.lessonId === Number(lessonId)));
        setLesson(lessonData);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load review data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lessonId]);

  const current = due[index];
  const itemData = useMemo(() => {
    if (!current || !lesson) return null;
    const [, , idxStr] = current.itemId.split('_');
    const i = Number(idxStr);
    return lesson.data[i];
  }, [current, lesson]);

  const grade = async (result: 'correct' | 'incorrect') => {
    if (!current) return;
    try {
      // Map to SM-2 numeric grades: Correct -> 5 (perfect), Incorrect -> 2 (fail)
      const numeric = result === 'correct' ? 5 : 2;
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: current.itemId, grade: numeric }),
      });
    } catch {}
    if (index + 1 < due.length) setIndex(index + 1);
    else setDue([]);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-red-600 dark:text-red-400 text-center">{error}</CardContent>
      </Card>
    );
  }

  if (!current || !itemData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">No items due</CardTitle>
          <CardDescription>You're all caught up for this lesson.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">Review</CardTitle>
            <CardDescription>
              {index + 1} of {due.length} reviewed
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-6 border rounded-lg">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{itemData.arabic}</div>
            <div className="text-slate-600 dark:text-slate-400">{itemData.english}</div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => grade('correct')}>Correct</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => grade('incorrect')}>Incorrect</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



