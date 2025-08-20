'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LessonItem {
  id: string;
  topic: string;
  type: string;
  arabic: string;
  transliteration: string;
  english: string;
  source: string;
  notes: string | null;
  audioUrl: string | null;
}

interface LessonResponse {
  lessonId: number;
  totalItems: number;
  data: LessonItem[];
}

export default function LessonLoader() {
  const [lessonId, setLessonId] = useState('1');
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLesson = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/lessons/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load lesson');
      }
      
      const data = await response.json();
      setLesson(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLesson(lessonId);
  }, []);

  const handleLoadLesson = () => {
    if (lessonId.trim()) {
      loadLesson(lessonId.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lesson Loader</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              placeholder="Enter lesson number (e.g., 1)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleLoadLesson} disabled={loading}>
              {loading ? 'Loading...' : 'Load Lesson'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {lesson && (
        <Card>
          <CardHeader>
            <CardTitle>
              Lesson {lesson.lessonId} - {lesson.totalItems} items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lesson.data.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{item.arabic}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-gray-600">{item.transliteration}</p>
                  <p className="text-gray-800">{item.english}</p>
                  {item.notes && (
                    <p className="text-sm text-gray-500 italic">{item.notes}</p>
                  )}
                  <div className="flex gap-2 text-xs text-gray-400">
                    <span>Source: {item.source}</span>
                    {item.audioUrl && <span>• Audio available</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
