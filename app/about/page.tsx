'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Globe, Users, Target, Award } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/landing">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Landing
            </Button>
          </Link>
          <div className="text-center">
            <img src="/logo.png" alt="Learn Shami Logo" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-display text-black mb-4">About Learn Shami</h1>
            <p className="text-lg text-gray-600">Empowering learners to master Shami Arabic</p>
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-black">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              Learn Shami is dedicated to making Shami Arabic accessible to learners worldwide. 
              We believe that language is a bridge to understanding culture, history, and people. 
              Our platform combines traditional learning methods with modern technology to create 
              an engaging and effective learning experience.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Whether you're a beginner starting your Arabic journey or an advanced learner 
              looking to perfect your Shami dialect, we're here to support your progress 
              every step of the way.
            </p>
          </CardContent>
        </Card>

        {/* What We Offer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display text-black flex items-center">
                <img src="/logo.png" alt="Logo" className="w-6 h-6 mr-3" />
                Interactive Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Structured lessons covering essential vocabulary, grammar, and cultural context 
                specific to Shami Arabic. Each lesson includes audio pronunciation, 
                transliteration, and practical examples.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display text-black flex items-center">
                <Target className="w-6 h-6 text-accent-600 mr-3" />
                Spaced Repetition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our intelligent review system adapts to your learning pace, ensuring optimal 
                retention through scientifically-proven spaced repetition techniques.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display text-black flex items-center">
                <Globe className="w-6 h-6 text-green-600 mr-3" />
                Cultural Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Learn not just the language, but the cultural nuances, expressions, and 
                context that make Shami Arabic unique and meaningful.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display text-black flex items-center">
                <Award className="w-6 h-6 text-orange-600 mr-3" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Monitor your learning journey with detailed progress tracking, achievements, 
                and personalized insights to keep you motivated and on track.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Lean to Falasteen */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-black">Why Choose Learn Shami?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Expert-Curated Content</h3>
                <p className="text-gray-600 text-sm">
                  Lessons created by native speakers and language experts
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Personalized Learning</h3>
                <p className="text-gray-600 text-sm">
                  Adaptive learning paths that match your pace and goals
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Proven Results</h3>
                <p className="text-gray-600 text-sm">
                  Thousands of learners have successfully mastered the basics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-display mb-4">
                Ready to Start Learning? 🚀
              </h2>
              <p className="text-primary-100 text-lg mb-6">
                Join thousands of learners who are already mastering Shami Arabic with Learn Shami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200 px-8 py-4 text-lg font-medium rounded-2xl shadow-lg"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/lessons">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-200 px-8 py-4 text-lg font-medium rounded-2xl"
                  >
                    Browse Lessons
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
