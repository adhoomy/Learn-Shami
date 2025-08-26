'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from '@/components/ui/audio-player';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface LessonData {
  lessonId: number;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  totalItems: number;
  data: any[];
  unit: string;
  order: number;
  estimatedTime: string;
}

interface ProgressData {
  userId: string;
  lessonId: number;
  completedItems: string[];
  updatedAt: string;
}

interface LessonViewerProps {
  lessonId: string;
}

export default function LessonViewer({ lessonId }: LessonViewerProps) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/lessons/${lessonId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load lesson: ${response.statusText}`);
        }
        
        const lessonData = await response.json();
        setLesson(lessonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!session?.user?.email) return;
      
      try {
        const response = await fetch(`/api/progress/${lessonId}`);
        if (response.ok) {
          const progressData = await response.json();
          setProgress(progressData);
        }
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      }
    };

    fetchProgress();
  }, [lessonId, session?.user?.email]);

  const handleItemComplete = async (itemId: string) => {
    if (!session?.user?.email || !lesson) return;

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: lesson.lessonId,
          itemId: itemId
        }),
      });

      if (response.ok) {
        const updatedProgress = await response.json();
        setProgress(updatedProgress);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const isItemCompleted = (itemId: string) => {
    return progress?.completedItems.includes(itemId) || false;
  };

  const getCompletionPercentage = () => {
    if (!lesson || !progress) return 0;
    return Math.round((progress.completedItems.length / lesson.totalItems) * 100);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="text-lg font-semibold mb-2">Error Loading Lesson</p>
            <p>{error}</p>
            <Button 
              onClick={() => router.push('/')} 
              className="mt-4"
            >
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!lesson) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl text-slate-900 dark:text-slate-100 mb-2">
                {lesson.title}
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                {lesson.description}
              </CardDescription>
            </div>
            <div className="text-right text-sm text-slate-500 dark:text-slate-400">
              <p><strong>Total Items:</strong> {lesson.totalItems}</p>
              <p><strong>Difficulty:</strong> {lesson.difficulty}</p>
              <p><strong>Unit:</strong> {lesson.unit}</p>
              <p><strong>Time:</strong> {lesson.estimatedTime}</p>
              {progress && (
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  <strong>Progress:</strong> {getCompletionPercentage()}% Complete
                </p>
              )}
            </div>
          </div>
          
          {lesson.tags && lesson.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lesson.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      {progress && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Progress</span>
                <span>
                  {progress.completedItems.length} / {lesson.totalItems} items complete ({getCompletionPercentage()}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lesson Content Cards */}
      <div className="space-y-4">
        {lesson.data.map((item, index) => {
          const itemId = `item_${lessonId}_${index}`;
          const completed = isItemCompleted(itemId);
          
          return (
            <Card 
              key={index} 
              className={`p-6 border rounded-lg hover:shadow-md transition-all duration-200 ${
                completed 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <CardContent className="p-0">
                <div className="space-y-3">
                  {/* Audio Player */}
                  {item.audioUrl && (
                    <div className="flex justify-center">
                      <AudioPlayer 
                        audioUrl={`/audio/${item.audioUrl}`} 
                        size="sm"
                        className="mb-2"
                      />
                    </div>
                  )}
                  
                  {/* Arabic Text */}
                  {item.arabic && (
                    <div className="text-xl font-bold text-center text-slate-900 dark:text-slate-100">
                      {item.arabic}
                    </div>
                  )}
                  
                  {/* Transliteration */}
                  {item.transliteration && (
                    <div className="text-sm italic text-slate-600 dark:text-slate-400 text-center">
                      {item.transliteration}
                    </div>
                  )}
                  
                  {/* English Text */}
                  {item.english && (
                    <div className="text-base text-slate-700 dark:text-slate-300 text-center">
                      {item.english}
                    </div>
                  )}
                  
                  {/* Progress Checkbox */}
                  <div className="flex justify-center pt-2">
                    <Button
                      variant={completed ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleItemComplete(itemId)}
                      className={`${
                        completed 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {completed ? (
                        <>
                          <span className="mr-2">✓</span>
                          Learned
                        </>
                      ) : (
                        'Mark as Learned'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
        <Button 
          variant="outline" 
          onClick={() => router.push('/')}
          className="hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ← Back to Dashboard
        </Button>
        
        <Button 
          disabled 
          variant="outline"
          className="opacity-50 cursor-not-allowed"
        >
          Next Lesson →
        </Button>
      </div>
    </div>
  );
}
