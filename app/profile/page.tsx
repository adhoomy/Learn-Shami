'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, BookOpen, Trophy, Calendar } from "lucide-react";
import Link from "next/link";
import AnimatedCard from "@/components/ui/animated-card";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedCard delay={1}>
            <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-display mb-2">12</div>
                <div className="text-primary-100">Lessons Completed</div>
              </CardContent>
            </Card>
          </AnimatedCard>
          
          <AnimatedCard delay={2}>
            <Card className="bg-gradient-to-r from-accent-500 to-accent-600 text-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-display mb-2">7</div>
                <div className="text-accent-100">Day Streak</div>
              </CardContent>
            </Card>
          </AnimatedCard>
          
          <AnimatedCard delay={3}>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-display mb-2">85%</div>
                <div className="text-green-100">Overall Accuracy</div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>

        {/* Profile Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AnimatedCard delay={4}>
            <Card className="hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-display text-black mb-2">Account Settings</h3>
                  <p className="text-gray-600 mb-4">Manage your account preferences and settings</p>
                  <Button variant="outline" className="w-full text-primary-600 border-primary-200 hover:bg-primary-50">
                    <Settings className="w-4 h-4 mr-2" />
                    Open Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={5}>
            <Card className="hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-accent-600" />
                  </div>
                  <h3 className="text-xl font-display text-black mb-2">Achievements</h3>
                  <p className="text-gray-600 mb-4">View your learning milestones and badges</p>
                  <Button variant="outline" className="w-full text-accent-600 border-accent-200 hover:bg-accent-50">
                    <Trophy className="w-4 h-4 mr-2" />
                    View Achievements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>

        {/* Quick Actions */}
        <AnimatedCard delay={6}>
          <Card className="bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-display mb-4">
                  Keep learning! 🚀
                </h2>
                <p className="text-slate-200 text-lg mb-6">
                  Your profile shows great progress. Continue building your Shami Arabic skills!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/lessons">
                    <Button 
                      size="lg" 
                      className="bg-white text-slate-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 px-6 py-3 text-lg font-medium rounded-xl shadow-lg"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Continue Learning
                    </Button>
                  </Link>
                  <Link href="/review">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-slate-700 transition-all duration-200 px-6 py-3 text-lg font-medium rounded-xl"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Start Review
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>
    </div>
  );
}
