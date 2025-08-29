'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Volume2, CheckCircle, XCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useAudio } from "@/lib/useAudio";
import Quiz from "./Quiz";
import Review from "./Review";

interface LessonItem {
  id: string;
  arabic: string;
  transliteration: string;
  english: string;
  audioUrl: string;
}

interface LessonViewerProps {
  lessonId: string;
  items: LessonItem[];
  onProgressUpdate?: () => void;
}

type TabType = 'cards' | 'quiz' | 'review';

export default function LessonViewer({ lessonId, items, onProgressUpdate }: LessonViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('cards');
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { play, isPlaying } = useAudio();

  const currentItem = items[currentIndex];
  const isLastItem = currentIndex === items.length - 1;
  const isFirstItem = currentIndex === 0;

  // Load existing progress when component mounts
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await fetch(`/api/progress/${lessonId}`);
        if (response.ok) {
          const progress = await response.json();
          setCompletedItems(new Set(progress.completedItems || []));
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      loadProgress();
    }
  }, [lessonId]);

  const handleNext = () => {
    if (!isLastItem) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstItem) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = async () => {
    if (currentItem) {
      try {
        // Save progress to database
        const response = await fetch(`/api/progress/${lessonId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemId: currentItem.id }),
        });

        if (response.ok) {
          // Update local state
          setCompletedItems(prev => new Set([...prev, currentItem.id]));
          
          // Notify parent component about progress update
          if (onProgressUpdate) {
            onProgressUpdate();
          }
        }
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const handleAudioPlay = () => {
    if (currentItem?.audioUrl) {
      play(currentItem.audioUrl);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'cards', label: 'Cards', icon: '📚' },
    { id: 'quiz', label: 'Quiz', icon: '🧠' },
    { id: 'review', label: 'Review', icon: '🔄' },
  ];

  const progress = (completedItems.size / items.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">
            Lesson {lessonId}
          </h1>
          <p className="text-lg text-brand-dark/70">
            Master the Shami dialect one phrase at a time
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-brand-dark/70">
              Progress: {completedItems.size} / {items.length}
            </span>
            <span className="text-sm font-medium text-brand-dark/70">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-brand-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 mx-2 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-brand-primary text-white shadow-lg'
                  : 'bg-brand-background text-brand-dark border border-brand-accentLight hover:bg-brand-accentLight/20 hover:border-brand-accent'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            {currentItem && (
              <Card className="text-center p-8 bg-brand-background border-brand-accentLight shadow-lg">
                <CardContent className="space-y-6">
                  {/* Arabic Text */}
                  <div className="mb-6">
                    <h2 className="text-6xl font-bold text-brand-dark mb-4 leading-tight">
                      {currentItem.arabic}
                    </h2>
                    <p className="text-xl text-brand-dark/70 italic">
                      {currentItem.transliteration}
                    </p>
                  </div>

                  {/* English Translation */}
                  <div className="mb-6">
                    <p className="text-2xl text-brand-dark/80 font-medium">
                      {currentItem.english}
                    </p>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={handleAudioPlay}
                      disabled={isPlaying}
                      className="bg-brand-accent hover:bg-brand-accentLight text-white hover:scale-105 transition-all duration-200 px-6 py-3 rounded-xl"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {isPlaying ? 'Playing...' : 'Play Audio'}
                    </Button>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-6">
                    <Button
                      onClick={handlePrevious}
                      disabled={isFirstItem}
                      variant="outline"
                      className="text-brand-primary border-brand-accentLight hover:bg-brand-accentLight/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleComplete}
                        className="bg-brand-accent hover:bg-brand-accentLight text-white hover:scale-105 transition-all duration-200 px-6 py-3 rounded-xl"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Done
                      </Button>
                    </div>

                    <Button
                      onClick={handleNext}
                      disabled={isLastItem}
                      variant="outline"
                      className="text-brand-primary border-brand-accentLight hover:bg-brand-accentLight/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <Quiz lessonId={lessonId} items={items} />
        )}

        {activeTab === 'review' && (
          <Review lessonId={lessonId} items={items} />
        )}
      </div>
    </div>
  );
}
