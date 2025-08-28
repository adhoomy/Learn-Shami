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
  const { playAudio, isPlaying } = useAudio();

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
      playAudio(currentItem.audioUrl);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'cards', label: 'Cards', icon: '📚' },
    { id: 'quiz', label: 'Quiz', icon: '🧠' },
    { id: 'review', label: 'Review', icon: '🔄' },
  ];

  const progress = (completedItems.size / items.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display text-neutral-900 mb-2">
            Lesson {lessonId}
          </h1>
          <p className="text-lg text-neutral-600">
            Master the Shami dialect one phrase at a time
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-neutral-700">
              Progress: {completedItems.size} / {items.length}
            </span>
            <span className="text-sm font-medium text-neutral-700">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-neutral-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={isFirstItem}
                variant="outline"
                className="flex items-center space-x-2 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <span className="text-sm text-neutral-500">
                {currentIndex + 1} of {items.length}
              </span>
              
              <Button
                onClick={handleNext}
                disabled={isLastItem}
                variant="outline"
                className="flex items-center space-x-2 disabled:opacity-50"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Lesson Card */}
            <Card className="group hover:scale-105 transition-all duration-300 shadow-lg border-0">
              <CardContent className="p-8">
                {/* Arabic Text */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-display text-neutral-900 mb-4 leading-relaxed">
                    {currentItem?.arabic}
                  </h2>
                  
                  {/* Audio Player */}
                  <div className="flex justify-center mb-6">
                    <Button
                      onClick={handleAudioPlay}
                      disabled={isPlaying}
                      size="lg"
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white shadow-lg hover:scale-110 transition-all duration-200"
                    >
                      {isPlaying ? (
                        <Volume2 className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Transliteration */}
                <div className="text-center mb-6">
                  <p className="text-xl text-neutral-600 italic font-medium">
                    {currentItem?.transliteration}
                  </p>
                </div>

                {/* English Translation */}
                <div className="text-center mb-8">
                  <p className="text-2xl text-neutral-800 font-medium">
                    {currentItem?.english}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleComplete}
                    disabled={completedItems.has(currentItem?.id || '')}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {completedItems.has(currentItem?.id || '') ? 'Completed' : 'Mark Complete'}
                  </Button>
                </div>

                {/* Completion Status */}
                {completedItems.has(currentItem?.id || '') && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Completed!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
