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

interface ProgressData {
  userId: string;
  lessonId: number;
  completedItems: string[];
  updatedAt: string;
}

type StatsResponse = {
  totalLearned: number;
  dueToday: number;
  streak: number;
  lastReviewDate: string | null;
  reviewsDoneToday: number;
  perLessonDue: { lessonId: number; dueCount: number }[];
};

export default function LessonDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dueCount, setDueCount] = useState(0);
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      try {
        // Fetch lesson data
        const lessonResponse = await fetch('/api/lessons/1');
        if (lessonResponse.ok) {
          const lessonData = await lessonResponse.json();
          setLessons([lessonData]);
        }

        // Fetch progress for all lessons (for now just lesson 1)
        if (session?.user?.email) {
          const progressResponse = await fetch('/api/progress/1');
          if (progressResponse.ok) {
            const progress = await progressResponse.json();
            setProgressData([progress]);
          }
        }
        // Fetch stats (includes dueToday, streak, totals, per-lesson due)
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const s = await statsRes.json();
          setStats(s);
          setDueCount(s.dueToday ?? 0);
        }
      } catch (error) {
        console.error('Failed to fetch lessons or progress:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchLessonsAndProgress();
    }
  }, [session]);

  const goToLesson = (lessonId: number) => {
    router.push(`/lessons/${lessonId}`);
  };

  const getProgressForLesson = (lessonId: number) => {
    const progress = progressData.find(p => p.lessonId === lessonId);
    return progress || null;
  };

  const getCompletionPercentage = (lessonId: number) => {
    const progress = getProgressForLesson(lessonId);
    const lesson = lessons.find(l => l.lessonId === lessonId);
    
    if (!progress || !lesson) return 0;
    return Math.round((progress.completedItems.length / lesson.totalItems) * 100);
  };

  const getDueForLesson = (lessonId: number) => {
    if (!stats?.perLessonDue) return 0;
    const entry = stats.perLessonDue.find(x => x.lessonId === lessonId);
    return entry?.dueCount ?? 0;
  };

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
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
          {/* Stats Summary */}
          {stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="text-sm text-slate-500 dark:text-slate-400">📚 Items Learned</div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{stats.totalLearned}</div>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="text-sm text-slate-500 dark:text-slate-400">⏳ Reviews Due Today</div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{stats.dueToday}</div>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="text-sm text-slate-500 dark:text-slate-400">🔥 Streak</div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{stats.streak} days</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Items Learned','Reviews Due Today','Streak'].map((label, i) => (
                <div key={i} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
                  <div className="h-7 mt-1 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">{dueCount}</span> items due for review today
            </div>
            <Button variant="outline" onClick={() => router.push('/review')}>Review Now</Button>
          </div>
          {lessons.map((lesson) => {
            const progress = getProgressForLesson(lesson.lessonId);
            const completionPercentage = getCompletionPercentage(lesson.lessonId);
            const lessonDue = getDueForLesson(lesson.lessonId);
            
            return (
              <div 
                key={lesson.lessonId}
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Lesson {lesson.lessonId}: {lesson.title}
                      {progress && (
                        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">— {completionPercentage}% complete</span>
                      )}
                    </h3>
                    {lessonDue > 0 && (
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full">
                        {lessonDue} due
                      </span>
                    )}
                    {progress && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                        {completionPercentage}% Complete
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    {lesson.description}
                  </p>
                  
                  {/* Progress Bar */}
                  {progress && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{progress.completedItems.length} / {lesson.totalItems} items complete ({completionPercentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
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
                  variant={progress && completionPercentage > 0 ? "default" : "outline"}
                >
                  {progress && completionPercentage > 0 ? 'Continue' : 'Start'} Lesson
                </Button>
              </div>
            );
          })}
          
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
