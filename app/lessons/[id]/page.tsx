'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserHeader from "@/components/auth/user-header";
import ProtectedRoute from "@/components/auth/protected-route";

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

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/lessons/${id}`);
        
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

    if (status === 'authenticated') {
      loadLesson();
    }
  }, [params, status]);

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-6xl mx-auto">
          {/* User Header */}
          <UserHeader />

          {/* Navigation */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading lesson...</p>
            </div>
          )}

          {error && (
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
          )}

          {lesson && (
            <>
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

              {/* Lesson Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-slate-100">
                    Lesson Content ({lesson.totalItems} items)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-300 dark:border-slate-600">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800">
                          {lesson.data.length > 0 && Object.keys(lesson.data[0]).map((header) => (
                            <th key={header} className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left font-semibold text-slate-900 dark:text-slate-100">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {lesson.data.map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800'}>
                            {Object.values(row).map((value, colIndex) => (
                              <td key={colIndex} className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300">
                                {value ? String(value) : '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
