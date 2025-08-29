'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/protected-route';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';

export default function ReviewPage() {
  const [dueCount, setDueCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/review');
        if (res.ok) {
          const items = await res.json();
          setDueCount(items.length);
        }
      } catch {}
    };
    load();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-display mb-2">{dueCount}</div>
                <div className="text-primary-100">Items Due</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-accent-500 to-accent-600 text-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-display mb-2">7</div>
                <div className="text-accent-100">Day Streak</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-display mb-2">85%</div>
                <div className="text-green-100">Accuracy</div>
              </CardContent>
            </Card>
          </div>

          {/* Review Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-display text-black mb-2">Lesson Reviews</h3>
                  <p className="text-gray-600 mb-4">Review specific lessons to reinforce learning</p>
                  <Button 
                    className="w-full bg-primary-500 hover:bg-primary-600"
                    onClick={() => router.push('/lessons/1?view=review')}
                  >
                    Start Review
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-accent-600" />
                  </div>
                  <h3 className="text-xl font-display text-black mb-2">Mixed Practice</h3>
                  <p className="text-gray-600 mb-4">Practice with items from all completed lessons</p>
                  <Button 
                    variant="outline"
                    className="w-full text-accent-600 border-accent-200 hover:bg-accent-50"
                    onClick={() => router.push('/lessons/1?view=quiz')}
                  >
                    Start Practice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-display mb-4">
                  Ready to challenge yourself? 🎯
                </h2>
                <p className="text-slate-200 text-lg mb-6">
                  Regular review sessions help maintain your progress and build long-term retention
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-slate-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 px-6 py-3 text-lg font-medium rounded-xl shadow-lg"
                    onClick={() => router.push('/lessons/1?view=review')}
                  >
                    Start Review Session
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-slate-700 transition-all duration-200 px-6 py-3 text-lg font-medium rounded-xl"
                    onClick={() => router.push('/lessons')}
                  >
                    Browse Lessons
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}



