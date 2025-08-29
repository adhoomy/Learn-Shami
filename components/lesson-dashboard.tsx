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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display text-black mb-4">
            Welcome, {session?.user?.email}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to start learning? Choose a lesson below to begin your journey with Palestinian Arabic.
          </p>
        </div>

        {/* Stats Summary */}
        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card className="group hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-display text-primary-600 mb-2">{stats.totalLearned}</div>
                  <div className="text-sm text-gray-600">📚 Items Learned</div>
                </div>
              </CardContent>
            </Card>
            <Card className="group hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-display text-orange-600 mb-2">{stats.streak}</div>
                  <div className="text-sm text-gray-600">🔥 Day Streak</div>
                </div>
              </CardContent>
            </Card>
            <Card className="group hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-display text-accent-600 mb-2">{stats.dueToday}</div>
                  <div className="text-sm text-gray-600">⏳ Reviews Due</div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {['Items Learned','Day Streak','Reviews Due'].map((label, i) => (
              <Card key={i} className="group hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="h-8 mt-1 bg-slate-200 rounded animate-pulse mx-auto w-16"></div>
                    <div className="text-sm text-gray-600 mt-2">{label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Due Section */}
        <Card className="mb-8 bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-slate-100">
                <h2 className="text-2xl font-display mb-2">Reviews Due Today</h2>
                <p className="text-primary-100">{dueCount} items due for review</p>
              </div>
              <Button 
                variant="outline" 
                className="bg-white text-primary-600 border-white hover:bg-gray-100"
                onClick={() => router.push('/review')}
              >
                Review Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Section */}
        <div className="space-y-6">
          {lessons.map((lesson) => {
            const progress = getProgressForLesson(lesson.lessonId);
            const completionPercentage = getCompletionPercentage(lesson.lessonId);
            const lessonDue = getDueForLesson(lesson.lessonId);
            
            return (
              <Card 
                key={lesson.lessonId}
                className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-display text-black">
                          Lesson {lesson.lessonId}: {lesson.title}
                        </h3>
                        {progress && (
                          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                            {completionPercentage}% complete
                          </span>
                        )}
                        {lessonDue > 0 && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                            {lessonDue} due
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-lg mb-4">
                        {lesson.description}
                      </p>
                      
                      {/* Progress Bar */}
                      {progress && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span className="font-medium">{progress.completedItems.length} / {lesson.totalItems} items complete ({completionPercentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                          {lesson.difficulty}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          {lesson.estimatedTime}
                        </span>
                      </div>
                      
                      {lesson.tags && lesson.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {lesson.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => goToLesson(lesson.lessonId)}
                      className="ml-6 px-8 py-3 text-lg"
                      variant={progress && completionPercentage > 0 ? "default" : "outline"}
                    >
                      {progress && completionPercentage > 0 ? 'Continue' : 'Start'} Lesson
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {lessons.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500 text-lg">No lessons available yet. Check back soon!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
