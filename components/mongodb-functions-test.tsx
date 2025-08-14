'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MongoDBFunctionsTest() {
  const testMongoDBFunctions = async () => {
    try {
      const response = await fetch('/api/test-mongo');
      const data = await response.json();
      if (response.ok) {
        alert('✅ MongoDB functions working!\n\nUser found: ' + data.userFound + '\nTest inserted: ' + data.testInserted);
      } else {
        alert('❌ MongoDB functions failed: ' + data.error);
      }
    } catch (error) {
      alert('❌ Error testing functions: ' + error);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">
          MongoDB Functions Test
        </CardTitle>
        <CardDescription>
          Test the database utility functions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="outline" 
            onClick={testMongoDBFunctions}
          >
            Test MongoDB Functions
          </Button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This tests the findDocument and insertDocument functions used by NextAuth
        </p>
      </CardContent>
    </Card>
  );
}
