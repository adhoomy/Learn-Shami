
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Flame, 
  Clock, 
  TrendingUp, 
  Play,
  CheckCircle,
  Target
} from "lucide-react";
import Link from "next/link";
import AnimatedCard, { AnimatedStatsCard, AnimatedProgressBar } from "@/components/ui/animated-card";

export default function Dashboard() {
  // Mock data - replace with real data from your API
  const stats = [
    {
      title: "Lessons Completed",
      value: "12",
      icon: BookOpen,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
      change: "+2 this week"
    },
    {
      title: "Learning Streak",
      value: "7",
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "🔥 Keep it up!"
    },
    {
      title: "Reviews Due",
      value: "5",
      icon: Clock,
      color: "text-accent-600",
      bgColor: "bg-accent-50",
      change: "Due today"
    }
  ];

  const recentLessons = [
    { id: 1, title: "Basic Greetings", progress: 80, completed: true },
    { id: 2, title: "Numbers 1-10", progress: 60, completed: false },
    { id: 3, title: "Family Members", progress: 0, completed: false },
    { id: 4, title: "Daily Activities", progress: 0, completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <AnimatedCard delay={0} whileHover={false}>
          <div className="mb-8">
            <h1 className="text-4xl font-display text-neutral-900 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-xl text-neutral-600">
              Ready to continue your Shami learning journey?
            </p>
          </div>
        </AnimatedCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <AnimatedStatsCard key={stat.title} delay={index + 1}>
                <Card className="group hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-display text-neutral-900 mb-2">
                          {stat.value}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedStatsCard>
            );
          })}
        </div>

        {/* Continue Learning CTA */}
        <AnimatedCard delay={4}>
          <Card className="mb-8 bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-display mb-4">
                  Ready for your next lesson? 🚀
                </h2>
                <p className="text-primary-100 text-lg mb-6">
                  Keep your streak alive and master new Shami phrases today!
                </p>
                <Link href="/lessons">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary-600 hover:bg-neutral-100 hover:scale-105 transition-all duration-200 px-8 py-4 text-lg font-medium rounded-2xl shadow-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Continue Learning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Lessons Grid */}
        <div className="mb-8">
          <AnimatedCard delay={5} whileHover={false}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-neutral-900">
                Your Lessons
              </h2>
              <Link href="/lessons">
                <Button variant="outline" className="text-primary-600 border-primary-200 hover:bg-primary-50">
                  View All
                </Button>
              </Link>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLessons.map((lesson, index) => (
              <AnimatedCard key={lesson.id} delay={6 + index}>
                <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 mb-2">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-3">
                          {lesson.completed ? (
                            <CheckCircle className="w-4 h-4 text-primary-500" />
                          ) : (
                            <Target className="w-4 h-4 text-neutral-400" />
                          )}
                          <span className="text-sm text-neutral-500">
                            {lesson.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                      {lesson.completed && (
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-primary-600" />
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Progress</span>
                        <span className="font-medium text-neutral-900">{lesson.progress}%</span>
                      </div>
                      <AnimatedProgressBar progress={lesson.progress} />
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                      {lesson.completed ? (
                        <Button 
                          variant="outline" 
                          className="w-full text-primary-600 border-primary-200 hover:bg-primary-50"
                          onClick={() => window.location.href = `/lessons/${lesson.id}`}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-primary-500 hover:bg-primary-600"
                          onClick={() => window.location.href = `/lessons/${lesson.id}`}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {lesson.progress > 0 ? 'Continue' : 'Start'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedCard delay={10}>
            <Card className="hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">
                      Review Due Items
                    </h3>
                    <p className="text-sm text-neutral-600 mb-3">
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

          <AnimatedCard delay={11}>
            <Card className="hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">
                      Maintain Streak
                    </h3>
                    <p className="text-sm text-neutral-600 mb-3">
                      Don't break your 7-day learning streak!
                    </p>
                    <Link href="/lessons">
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
