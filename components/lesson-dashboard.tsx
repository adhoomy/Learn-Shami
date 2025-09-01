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
        // Fetch all lessons and progress data
        if (session?.user?.email) {
          const progressResponse = await fetch('/api/progress');
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            console.log('Progress data loaded:', progressData);
            
            // Extract lessons from progress data
            const lessonsData = progressData.map((item: any) => ({
              lessonId: item.lessonId,
              title: item.title,
              description: item.description,
              difficulty: 'Beginner', // Default for now
              tags: ['palestinian', 'arabic'],
              totalItems: item.totalItems,
              unit: 1,
              order: item.lessonId,
              estimatedTime: '10 min'
            }));
            
            setLessons(lessonsData);
            setProgressData(progressData.map((item: any) => item.progress));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Summary */}
      <div className="mb-8">
        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600 mb-2">📚 Items Learned</div>
              <div className="text-3xl font-bold text-black">{stats.totalLearned}</div>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600 mb-2">⏳ Reviews Due Today</div>
              <div className="text-3xl font-bold text-black">{stats.dueToday}</div>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600 mb-2">🔥 Streak</div>
              <div className="text-3xl font-bold text-black">{stats.streak} days</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {['Items Learned','Reviews Due Today','Streak'].map((label, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="text-sm text-gray-600 mb-2">{label}</div>
                <div className="h-8 mt-1 bg-gray-300 rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Review CTA */}
      <div className="mb-8">
        <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-gray-700">
            <span className="font-semibold text-lg">{dueCount}</span> items due for review today
          </div>
          <Button variant="outline" onClick={() => router.push('/review')} className="text-primary-600 border-primary-200 hover:bg-primary-50 px-6 py-2">
            Review Now
          </Button>
        </div>
      </div>
      
      {/* Lessons Grid */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => {
            const progress = getProgressForLesson(lesson.lessonId);
            const completionPercentage = getCompletionPercentage(lesson.lessonId);
            const lessonDue = getDueForLesson(lesson.lessonId);
            
            return (
              <Card 
                key={lesson.lessonId}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 bg-white"
                onClick={() => router.push(`/lessons/${lesson.lessonId}`)}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Lesson {lesson.lessonId}
                      </h3>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {lesson.title}
                      </h4>
                    </div>
                    {lessonDue > 0 && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        {lessonDue} due
                      </span>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {lesson.description}
                  </p>
                  
                  {/* Progress */}
                  {progress && progress.completedItems.length > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span className="font-medium">{completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{lesson.totalItems} items</span>
                    <span>•</span>
                    <span>~{Math.ceil(lesson.totalItems / 5)} min</span>
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-2.5 rounded-lg transition-all duration-200 group-hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/lessons/${lesson.lessonId}`);
                    }}
                  >
                    {progress && progress.completedItems.length > 0 ? 'Continue Learning' : 'Start Lesson'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
