import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MongoDBTest from "@/components/mongodb-test";
import MongoDBFunctionsTest from "@/components/mongodb-functions-test";
import SignInForm from "@/components/auth/signin-form";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">
                Modern Tech Stack
              </CardTitle>
              <CardDescription>
                Next.js 15, TypeScript, Tailwind CSS v4
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Built with the latest technologies for optimal performance and developer experience.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">
                Authentication & Database
              </CardTitle>
              <CardDescription>
                NextAuth.js with MongoDB Atlas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Secure user authentication with persistent data storage in MongoDB.
              </p>
            </CardContent>
          </Card>
        </div>



        {/* MongoDB Atlas Connection */}
        <MongoDBTest />

        {/* MongoDB Functions Test */}
        <MongoDBFunctionsTest />

        {/* Authentication */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">
              NextAuth.js Authentication
            </CardTitle>
            <CardDescription>
              User authentication with MongoDB persistence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
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
                Next.js 15 with App Router and Turbopack
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
                shadcn/ui components
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                MongoDB Atlas integration
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                NextAuth.js authentication
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
