'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, CheckCircle, Target, Clock, Star, TrendingUp, Flame } from "lucide-react";
import Link from "next/link";
import AnimatedCard from "@/components/ui/animated-card";

// Real lesson data from your JSON file
const lessons = [
  {
    id: 1,
    title: "Greetings",
    description: "Learn common Palestinian greetings for daily interactions.",
    difficulty: "Beginner",
    estimatedTime: "5 minutes",
    unit: 1,
    order: 1,
    tags: ["palestinian", "arabic", "greetings"],
    totalItems: 20 // This will be updated with real data
  }
];

export default function LessonsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lessonsWithProgress, setLessonsWithProgress] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      loadLessonsWithProgress();
    }
  }, [status]);

  const loadLessonsWithProgress = async () => {
    try {
      // Load user stats
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Load progress data for lessons
      const progressRes = await fetch('/api/progress');
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        
        // Merge lessons with progress data
        const lessonsWithProgressData = lessons.map(lesson => {
          const userProgress = progressData.find((p: any) => p.lessonId === lesson.id);
          const completedItems = userProgress?.completedItems?.length || 0;
          const totalItems = lesson.totalItems;
          const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
          
          return {
            ...lesson,
            progress,
            completed: progress === 100,
            totalItems,
            completedItems: completedItems,
            userProgress
          };
        });
        
        setLessonsWithProgress(lessonsWithProgressData);
      }
    } catch (error) {
      console.error('Error loading lessons progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async (lessonId: number) => {
    try {
      // This would update the lesson progress in your database
      // For now, we'll just refresh the data
      await loadLessonsWithProgress();
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const startLesson = (lessonId: number) => {
    router.push(`/lessons/${lessonId}`);
  };

  const continueLesson = (lessonId: number) => {
    router.push(`/lessons/${lessonId}`);
  };

  const reviewLesson = (lessonId: number) => {
    router.push(`/lessons/${lessonId}?view=review`);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <AnimatedCard delay={0} whileHover={false}>
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-display text-black mb-4">
              Your Learning Path 🚀
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master Shami Arabic step by step with our structured lessons
            </p>
          </div>
        </AnimatedCard>

        {/* Stats Overview */}
        {stats && (
          <AnimatedCard delay={1} whileHover={false}>
            <Card className="mb-8 bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-display mb-1">{stats.totalLearned || 0}</div>
                    <div className="text-primary-100 text-sm">Items Learned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display mb-1">{stats.streak || 0}</div>
                    <div className="text-primary-100 text-sm">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display mb-1">{stats.dueToday || 0}</div>
                    <div className="text-primary-100 text-sm">Reviews Due</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        )}

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessonsWithProgress.map((lesson, index) => (
            <AnimatedCard key={lesson.id} delay={2 + index}>
              <Card className="group hover:scale-105 transition-all duration-300 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </div>
                    {lesson.completed && (
                      <CheckCircle className="w-6 h-6 text-primary-500" />
                    )}
                  </div>
                  <CardTitle className="text-xl text-black group-hover:text-primary-600 transition-colors duration-200">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {lesson.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Lesson Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{lesson.completedItems}/{lesson.totalItems}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-black">{lesson.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${lesson.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {lesson.completed ? (
                      <>
                        <Button 
                          className="w-full bg-primary-500 hover:bg-primary-600"
                          onClick={() => reviewLesson(lesson.id)}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Review Lesson
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-primary-600 border-primary-200 hover:bg-primary-50"
                          onClick={() => continueLesson(lesson.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Practice Again
                        </Button>
                      </>
                    ) : lesson.progress > 0 ? (
                      <>
                        <Button 
                          className="w-full bg-primary-500 hover:bg-primary-600"
                          onClick={() => continueLesson(lesson.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Continue Lesson
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-primary-600 border-primary-200 hover:bg-primary-50"
                          onClick={() => markLessonComplete(lesson.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full bg-primary-500 hover:bg-primary-600"
                        onClick={() => startLesson(lesson.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Lesson
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <AnimatedCard delay={8}>
            <Card className="hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-1">
                      Review Due Items
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Practice with spaced repetition for better retention
                    </p>
                    <Link href="/review">
                      <Button variant="outline" size="sm" className="text-accent-600 border-accent-200 hover:bg-accent-50">
                        Start Review
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={9}>
            <Card className="hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-1">
                      Maintain Streak
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Don't break your learning streak!
                    </p>
                    <Link href="/lessons/1">
                      <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                        Learn Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
