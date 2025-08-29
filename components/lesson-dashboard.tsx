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
        // Fetch lesson data from the lessons collection
        const lessonResponse = await fetch('/api/lessons/1');
        if (lessonResponse.ok) {
          const lessonData = await lessonResponse.json();
          console.log('Lesson data loaded:', lessonData);
          setLessons([lessonData]);
        } else {
          console.error('Failed to load lesson:', lessonResponse.status);
        }

        // Fetch progress for lesson 1 using the correct endpoint
        if (session?.user?.email) {
          const progressResponse = await fetch('/api/progress/1');
          if (progressResponse.ok) {
            const progress = await progressResponse.json();
            console.log('Progress data loaded:', progress);
            setProgressData([progress]);
          } else {
            console.error('Failed to load progress:', progressResponse.status);
          }
        }

        // Fetch stats
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const s = await statsRes.json();
          console.log('Stats loaded:', s);
          setStats(s);
          setDueCount(s.dueToday ?? 0);
        } else {
          console.error('Failed to load stats:', statsRes.status);
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
    <Card className="mb-8 bg-brand-background border-brand-accentLight">
      <CardContent>
        <div className="space-y-4">
          {/* Stats Summary */}
          {stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-brand-accentLight bg-brand-background">
                <div className="text-sm text-brand-dark/60">📚 Items Learned</div>
                <div className="text-2xl font-semibold text-brand-dark">{stats.totalLearned}</div>
              </div>
              <div className="p-4 rounded-lg border border-brand-accentLight bg-brand-background">
                <div className="text-sm text-brand-dark/60">⏳ Reviews Due Today</div>
                <div className="text-2xl font-semibold text-brand-dark">{stats.dueToday}</div>
              </div>
              <div className="p-4 rounded-lg border border-brand-accentLight bg-brand-background">
                <div className="text-sm text-brand-dark/60">🔥 Streak</div>
                <div className="text-2xl font-semibold text-brand-dark">{stats.streak} days</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Items Learned','Reviews Due Today','Streak'].map((label, i) => (
                <div key={i} className="p-4 rounded-lg border border-brand-accentLight bg-brand-background">
                  <div className="text-sm text-brand-dark/60">{label}</div>
                  <div className="h-7 mt-1 bg-brand-accentLight/30 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between p-4 border border-brand-accentLight rounded-lg bg-brand-background">
            <div className="text-brand-dark/70">
              <span className="font-medium">{dueCount}</span> items due for review today
            </div>
            <Button variant="outline" onClick={() => router.push('/review')} className="text-brand-primary border-brand-accentLight hover:bg-brand-accentLight/20">
              Review Now
            </Button>
          </div>
          
          {lessons.map((lesson) => {
            const progress = getProgressForLesson(lesson.lessonId);
            const completionPercentage = getCompletionPercentage(lesson.lessonId);
            const lessonDue = getDueForLesson(lesson.lessonId);
            
            return (
              <div 
                key={lesson.lessonId}
                className="flex items-center justify-between p-4 border border-brand-accentLight rounded-lg hover:bg-brand-accentLight/10 transition-colors bg-brand-background"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-brand-dark">
                      Lesson {lesson.lessonId}: {lesson.title}
                      {progress && (
                        <span className="ml-2 text-sm text-brand-dark/60">— {completionPercentage}% complete</span>
                      )}
                    </h3>
                    {lessonDue > 0 && (
                      <span className="px-2 py-1 bg-brand-accent/20 text-brand-accent text-xs font-medium rounded-full">
                        {lessonDue} due
                      </span>
                    )}
                    {progress && (
                      <span className="px-2 py-1 bg-brand-accentLight/20 text-brand-accent text-xs font-medium rounded-full">
                        {completionPercentage}% Complete
                      </span>
                    )}
                  </div>
                  
                  <p className="text-brand-dark/70 mb-2">
                    {lesson.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-brand-dark/60">
                    <span>{lesson.totalItems} items</span>
                    <span>•</span>
                    <span>~{Math.ceil(lesson.totalItems / 5)} min</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {progress && progress.completedItems.length > 0 && (
                    <div className="text-right">
                      <div className="text-sm text-brand-dark/60 mb-1">Progress</div>
                      <div className="w-20 bg-brand-accentLight/30 rounded-full h-2">
                        <div 
                          className="bg-brand-accent h-2 rounded-full transition-all duration-500"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => router.push(`/lessons/${lesson.lessonId}`)}
                    className="bg-brand-accent hover:bg-brand-accentLight text-white hover:scale-105 transition-all duration-200"
                  >
                    {progress && progress.completedItems.length > 0 ? 'Continue' : 'Start'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
