'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, CheckCircle, Target, Clock, Star } from "lucide-react";
import Link from "next/link";
import AnimatedCard from "@/components/ui/animated-card";

// Real lessons data structure
const lessons = [
  {
    id: 1,
    title: "Greetings",
    description: "Learn common Palestinian greetings for daily interactions.",
    difficulty: "Beginner",
    estimatedTime: "5 minutes",
    unit: 1,
    order: 1,
    tags: ["palestinian", "arabic", "greetings"]
  }
  // Add more lessons as you create them
];

export default function LessonsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lessonsWithProgress, setLessonsWithProgress] = useState<any[]>([]);
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
      // Load user progress for all lessons
      const progressRes = await fetch('/api/progress');
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        
        // Merge lessons with progress data
        const lessonsWithProgressData = lessons.map(lesson => {
          const userProgress = progressData.find((p: any) => p.lessonId === lesson.id);
          const completedItems = userProgress?.completedItems?.length || 0;
          const totalItems = 20; // This should come from your lesson data
          const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
          
          return {
            ...lesson,
            progress,
            completed: progress === 100,
            totalItems,
            completedItems
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

  if (status === "loading") {
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

        {/* Progress Overview */}
        <AnimatedCard delay={1} whileHover={false}>
          <Card className="mb-8 bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display mb-2">Overall Progress</h2>
                  <p className="text-primary-100">Keep up the great work!</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-display mb-1">23%</div>
                  <div className="text-primary-100 text-sm">2 of 6 lessons</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

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

                  {/* Action Button */}
                  <div className="mt-4">
                    {lesson.completed ? (
                      <Button 
                        variant="outline" 
                        className="w-full text-primary-600 border-primary-200 hover:bg-primary-50"
                        onClick={() => router.push(`/lessons/${lesson.id}`)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Review Lesson
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-primary-500 hover:bg-primary-600"
                        onClick={() => router.push(`/lessons/${lesson.id}`)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {lesson.progress > 0 ? 'Continue' : 'Start Lesson'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        {/* Bottom CTA */}
        <AnimatedCard delay={8} whileHover={false}>
          <Card className="mt-8 bg-gradient-to-r from-accent-500 to-primary-500 text-white border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-display mb-4">
                  Ready for a challenge? 🎯
                </h2>
                <p className="text-accent-100 text-lg mb-6">
                  Complete more lessons to unlock advanced topics and build your confidence!
                </p>
                <Link href="/review">
                  <Button 
                    size="lg" 
                    className="bg-white text-accent-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200 px-8 py-4 text-lg font-medium rounded-2xl shadow-lg"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Practice Review
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>
    </div>
  );
}
