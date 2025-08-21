'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MongoDBTest() {
  const testConnection = async () => {
    try {
      const response = await fetch('/api/test-mongo');
      const data = await response.json();
      if (response.ok) {
        alert('✅ MongoDB connected successfully!\n\nMessage: ' + data.message + '\nLesson found: ' + data.lessonFound + '\nLesson count: ' + data.lessonCount);
      } else {
        alert('❌ MongoDB connection failed: ' + data.error);
      }
    } catch (error) {
      alert('❌ Error testing connection: ' + error);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">
          MongoDB Atlas Connection
        </CardTitle>
        <CardDescription>
          Test your MongoDB Atlas connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="default" 
            onClick={testConnection}
          >
            Test MongoDB Connection
          </Button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Make sure you have set up your MONGODB_URI environment variable in .env.local
        </p>
      </CardContent>
    </Card>
  );
}
