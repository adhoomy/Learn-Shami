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
}

type TabType = 'cards' | 'quiz' | 'review';

export default function LessonViewer({ lessonId, items }: LessonViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('cards');
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const { play, isPlaying } = useAudio();

  const currentItem = items[currentIndex];
  const isLastItem = currentIndex === items.length - 1;
  const isFirstItem = currentIndex === 0;

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

  const handleComplete = () => {
    if (currentItem) {
      setCompletedItems(prev => new Set([...prev, currentItem.id]));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display text-gray-900 mb-2">
            Lesson {lessonId}
          </h1>
          <p className="text-lg text-gray-600">
            Master the Shami dialect one phrase at a time
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completedItems.size} / {items.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-1000 ease-out"
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
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
              <Card className="text-center p-8">
                <CardContent className="space-y-6">
                  {/* Arabic Text */}
                  <div className="mb-6">
                    <h2 className="text-6xl font-display text-gray-900 mb-4 leading-tight">
                      {currentItem.arabic}
                    </h2>
                    <p className="text-xl text-gray-600 italic">
                      {currentItem.transliteration}
                    </p>
                  </div>

                  {/* English Translation */}
                  <div className="mb-6">
                    <p className="text-2xl text-gray-700 font-medium">
                      {currentItem.english}
                    </p>
                  </div>

                  {/* Audio Player */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleAudioPlay}
                      disabled={isPlaying}
                      className="w-16 h-16 rounded-full bg-primary-500 hover:bg-primary-600 p-0"
                    >
                      {isPlaying ? (
                        <Volume2 className="w-8 h-8" />
                      ) : (
                        <Play className="w-8 h-8 ml-1" />
                      )}
                    </Button>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-6">
                    <Button
                      onClick={handlePrevious}
                      disabled={isFirstItem}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <div className="text-sm text-gray-500">
                      {currentIndex + 1} of {items.length}
                    </div>

                    <Button
                      onClick={handleNext}
                      disabled={isLastItem}
                      className="flex items-center space-x-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Complete Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleComplete}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Complete
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
