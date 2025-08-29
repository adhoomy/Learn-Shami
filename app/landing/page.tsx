'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Globe, Brain, Users } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/');
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-display text-black mb-6">
            Welcome to ShamiLearn
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the Shami dialect through interactive lessons, spaced repetition, and AI-powered learning. 
            Start your journey to fluency today.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-8 hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-display text-black mb-3">Interactive Lessons</h3>
            <p className="text-gray-600">
              Learn through engaging flashcards, audio pronunciation, and interactive exercises
            </p>
          </Card>

          <Card className="text-center p-8 hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-accent-600" />
            </div>
            <h3 className="text-xl font-display text-black mb-3">Smart Review</h3>
            <p className="text-gray-600">
              AI-powered spaced repetition ensures long-term retention of what you learn
            </p>
          </Card>

          <Card className="text-center p-8 hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-display text-black mb-3">Community</h3>
            <p className="text-gray-600">
              Join a community of learners and track your progress with detailed analytics
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-display mb-6">
                Ready to start learning? 🚀
              </h2>
              <p className="text-primary-100 text-xl mb-8">
                Join thousands of learners mastering Shami Arabic. Create your account and begin your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200 px-8 py-4 text-lg font-medium rounded-2xl shadow-lg"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-200 px-8 py-4 text-lg font-medium rounded-2xl"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            Already have an account? <Link href="/login" className="text-primary-600 hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
