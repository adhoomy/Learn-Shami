'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LessonData {
  lessonId: number;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  totalItems: number;
  unit: string;
  order: number;
  estimatedTime: string;
}

export default function LessonDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // For now, we'll fetch the first lesson
        // In the future, this could fetch all available lessons
        const response = await fetch('/api/lessons/1');
        if (response.ok) {
          const lessonData = await response.json();
          setLessons([lessonData]);
        }
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchLessons();
    }
  }, [session]);

  const goToLesson = (lessonId: number) => {
    router.push(`/lessons/${lessonId}`);
  };

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading lessons...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">
          Welcome, {session?.user?.email}!
        </CardTitle>
        <CardDescription>
          Ready to start learning? Choose a lesson below to begin your journey with Palestinian Arabic.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div 
              key={lesson.lessonId}
              className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Lesson {lesson.lessonId}: {lesson.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  {lesson.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {lesson.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {lesson.estimatedTime}
                  </span>
                </div>
                {lesson.tags && lesson.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lesson.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                onClick={() => goToLesson(lesson.lessonId)}
                className="ml-4"
              >
                Start Lesson
              </Button>
            </div>
          ))}
          
          {lessons.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <p>No lessons available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
