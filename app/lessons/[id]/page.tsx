'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/protected-route';
import UserHeader from '@/components/auth/user-header';
import LessonViewer from '@/components/LessonViewer';
import Quiz from '@/components/Quiz';
import Review from '@/components/Review';

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lessonId, setLessonId] = useState<string>('');
  const [tab, setTab] = useState<'cards' | 'quiz' | 'review'>('cards');
  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const loadLessonData = async () => {
      if (!lessonId) return;
      
      try {
        const response = await fetch(`/api/lessons/${lessonId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Lesson data loaded:', data);
          setLessonData(data);
        } else {
          console.error('Failed to load lesson:', response.status);
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      loadLessonData();
    }
  }, [lessonId]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!lessonId || !lessonData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="mt-4 text-slate-600">Loading lesson data...</p>
        </div>
      </div>
    );
  }

  // Transform lesson data to match expected format
  const lessonItems = lessonData.data?.map((item: any) => ({
    id: item.id,
    arabic: item.arabic,
    transliteration: item.transliteration,
    english: item.english,
    audioUrl: item.audioUrl || `/audio/${item.id}.wav`
  })) || [];

  const handleProgressUpdate = () => {
    console.log('Progress updated');
    // This will trigger a refresh of the lesson dashboard when progress changes
    // The lesson dashboard will automatically pick up the new progress
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-brand-background p-8">
        <div className="max-w-6xl mx-auto">
          {/* User Header */}
          <UserHeader />

          {/* Tabs */}
          <div className="mt-4 mb-6 flex gap-2">
            <button
              className={`px-4 py-2 rounded border transition-all duration-200 ${
                tab === 'cards'
                  ? 'bg-brand-primary text-white border-brand-primary shadow-lg'
                  : 'bg-brand-background text-brand-dark border-brand-accentLight hover:bg-brand-accentLight/20 hover:border-brand-accent'
              }`}
              onClick={() => router.push(`/lessons/${lessonId}?view=cards`)}
            >
              Cards
            </button>
            <button
              className={`px-4 py-2 rounded border transition-all duration-200 ${
                tab === 'quiz'
                  ? 'bg-brand-primary text-white border-brand-primary shadow-lg'
                  : 'bg-brand-background text-brand-dark border-brand-accentLight hover:bg-brand-accentLight/20 hover:border-brand-accent'
              }`}
              onClick={() => router.push(`/lessons/${lessonId}?view=quiz`)}
            >
              Quiz
            </button>
            <button
              className={`px-4 py-2 rounded border transition-all duration-200 ${
                tab === 'review'
                  ? 'bg-brand-primary text-white border-brand-primary shadow-lg'
                  : 'bg-brand-background text-brand-dark border-brand-accentLight hover:bg-brand-accentLight/20 hover:border-brand-accent'
              }`}
              onClick={() => router.push(`/lessons/${lessonId}?view=review`)}
            >
              Review
            </button>
          </div>

          {/* Content */}
          {tab === 'cards' && <LessonViewer lessonId={lessonId} items={lessonItems} onProgressUpdate={handleProgressUpdate} />}
          {tab === 'quiz' && <Quiz lessonId={lessonId} items={lessonItems} onProgressUpdate={handleProgressUpdate} />}
          {tab === 'review' && <Review lessonId={lessonId} items={lessonItems} onProgressUpdate={handleProgressUpdate} />}
        </div>
      </div>
    </ProtectedRoute>
  );
}
