'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/protected-route';
import UserHeader from '@/components/auth/user-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-3xl mx-auto">
          <UserHeader />
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-2xl">Reviews</CardTitle>
              <CardDescription>{dueCount} items due</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/lessons/1?view=review')}>Go to Lesson 1 Reviews</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}



