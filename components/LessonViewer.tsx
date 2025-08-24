'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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

interface LessonViewerProps {
  lessonId: string;
}

export default function LessonViewer({ lessonId }: LessonViewerProps) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

      {/* Lesson Content Cards */}
      <div className="space-y-4">
        {lesson.data.map((item, index) => (
          <Card 
            key={index} 
            className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <CardContent className="p-0">
              <div className="space-y-3">
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
              </div>
            </CardContent>
          </Card>
        ))}
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
