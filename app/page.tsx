import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Welcome to Learn Shami
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            A Next.js project with TypeScript, Tailwind CSS, and shadcn/ui
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">
                Next.js 15
              </CardTitle>
              <CardDescription>
                Latest version with App Router and Turbopack
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Built with the newest Next.js features for optimal performance and developer experience.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">
                TypeScript
              </CardTitle>
              <CardDescription>
                Full type safety and IntelliSense support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Type-safe development with modern TypeScript features and strict configuration.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">
                Tailwind CSS v4
              </CardTitle>
              <CardDescription>
                Utility-first CSS framework
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Rapid UI development with the latest Tailwind CSS version and custom design system.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* shadcn/ui Showcase */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">
              shadcn/ui Components
            </CardTitle>
            <CardDescription>
              Beautiful, accessible components built with Radix UI and Tailwind CSS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              These components are fully customizable and follow modern design principles.
            </p>
          </CardContent>
        </Card>

        {/* Project Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">
              Project Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                ESLint disabled for faster development
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                App Router for modern Next.js routing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Turbopack for faster builds
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                TypeScript for type safety
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Tailwind CSS v4 for styling
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                shadcn/ui for beautiful components
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
