'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/protected-route';
import UserHeader from '@/components/auth/user-header';
import LessonViewer from '@/components/LessonViewer';
import Quiz from '@/components/Quiz';
import Review from '@/components/Review';

// Mock lesson data - replace with real API call
const mockLessonItems = [
  {
    id: 'greet_0001',
    arabic: 'مرحبا',
    transliteration: 'marHaba',
    english: 'Hello',
    audioUrl: '/audio/greet_0001.wav'
  },
  {
    id: 'greet_0002',
    arabic: 'أهلين',
    transliteration: 'ahleen',
    english: 'Hi there',
    audioUrl: '/audio/greet_0002.wav'
  },
  {
    id: 'greet_0003',
    arabic: 'أهلا وسهلا',
    transliteration: 'ahlan wa sahlan',
    english: 'Welcome',
    audioUrl: '/audio/greet_0003.wav'
  },
  {
    id: 'greet_0004',
    arabic: 'صباح الخير',
    transliteration: 'ṣabāḥ il-khēr',
    english: 'Good morning',
    audioUrl: '/audio/greet_0004.wav'
  },
  {
    id: 'greet_0005',
    arabic: 'مسا الخير',
    transliteration: 'masāʾ il-khēr',
    english: 'Good evening',
    audioUrl: '/audio/greet_0005.wav'
  }
];

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lessonId, setLessonId] = useState<string>('');
  const [tab, setTab] = useState<'cards' | 'quiz' | 'review'>('cards');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const getLessonId = async () => {
      const { id } = await params;
      setLessonId(id);
    };
    getLessonId();
  }, [params]);

  useEffect(() => {
    const q = searchParams?.get('view');
    if (q === 'quiz') setTab('quiz');
    else if (q === 'review') setTab('review');
    else setTab('cards');
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900 dark:border-slate-100 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!lessonId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading lesson ID...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-6xl mx-auto">
          {/* User Header */}
          <UserHeader />

          {/* Tabs */}
          <div className="mt-4 mb-6 flex gap-2">
            <button
              className={`px-4 py-2 rounded border ${
                tab === 'cards'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={() => router.push(`/lessons/${lessonId}?view=cards`)}
            >
              Cards
            </button>
            <button
              className={`px-4 py-2 rounded border ${
                tab === 'quiz'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={() => router.push(`/lessons/${lessonId}?view=quiz`)}
            >
              Quiz
            </button>
            <button
              className={`px-4 py-2 rounded border ${
                tab === 'review'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={() => router.push(`/lessons/${lessonId}?view=review`)}
            >
              Review
            </button>
          </div>

          {/* Content */}
          {tab === 'cards' && <LessonViewer lessonId={lessonId} items={mockLessonItems} />}
          {tab === 'quiz' && <Quiz lessonId={lessonId} items={mockLessonItems} />}
          {tab === 'review' && <Review lessonId={lessonId} />}
        </div>
      </div>
    </ProtectedRoute>
  );
}
