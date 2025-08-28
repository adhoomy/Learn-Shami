'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Volume2, CheckCircle, XCircle, RotateCcw, TrendingUp } from "lucide-react";
import { useAudio } from "@/lib/useAudio";

interface ReviewProps {
  lessonId: string;
  items: any[];
}

export default function Review({ lessonId, items }: ReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [completed, setCompleted] = useState(0);
  const { playAudio, isPlaying } = useAudio();

  const currentItem = items[currentIndex];
  const isLastItem = currentIndex === items.length - 1;

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleDifficultySelect = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setCompleted(completed + 1);
    
    // Simulate spaced repetition logic
    setTimeout(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
        setDifficulty(null);
      }
    }, 1000);
  };

  const handleAudioPlay = () => {
    if (currentItem?.audioUrl) {
      playAudio(currentItem.audioUrl);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setDifficulty(null);
    setCompleted(0);
  };

  if (completed === items.length) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-3xl font-display text-neutral-900 mb-2">
              Review Complete! 🎯
            </h2>
            <p className="text-lg text-neutral-600">
              Great job reviewing all items!
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 mb-6">
            <div className="text-4xl font-display text-primary-600 mb-2">
              {completed}/{items.length}
            </div>
            <div className="text-lg text-neutral-600">
              All items reviewed successfully!
            </div>
          </div>
          
          <Button 
            onClick={handleRestart}
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Review Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-display text-neutral-900">
          Spaced Repetition Review 🔄
        </CardTitle>
        <p className="text-neutral-600">
          Review {currentIndex + 1} of {items.length}
        </p>
        <div className="w-full bg-neutral-200 rounded-full h-2 mt-4">
          <div 
            className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-1000"
            style={{ width: `${(completed / items.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {/* Question Card */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-medium text-neutral-800 mb-4">
            What does this mean?
          </h3>
          
          {/* Arabic Text */}
          <div className="text-4xl font-display text-neutral-900 mb-6 leading-relaxed">
            {currentItem?.arabic}
          </div>
          
          {/* Audio Player */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleAudioPlay}
              disabled={isPlaying}
              size="lg"
              className="w-16 h-16 rounded-full bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white shadow-lg hover:scale-110 transition-all duration-200"
            >
              {isPlaying ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
          </div>
          
          {/* Transliteration */}
          <p className="text-xl text-neutral-600 italic font-medium">
            {currentItem?.transliteration}
          </p>
        </div>

        {/* Answer Section */}
        {!showAnswer ? (
          <div className="text-center">
            <Button
              onClick={handleShowAnswer}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
            >
              Show Answer
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Answer Display */}
            <Card className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-0">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-medium text-neutral-700 mb-2">
                  English Translation:
                </h4>
                <p className="text-2xl font-medium text-neutral-900">
                  {currentItem?.english}
                </p>
              </CardContent>
            </Card>

            {/* Difficulty Selection */}
            <div className="text-center">
              <h4 className="text-lg font-medium text-neutral-700 mb-4">
                How well did you know this?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleDifficultySelect('easy')}
                  className="h-16 bg-green-100 hover:bg-green-200 text-green-700 border-green-300 hover:scale-105 transition-all duration-200 rounded-xl"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">😊</div>
                    <div className="font-medium">Easy</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleDifficultySelect('medium')}
                  className="h-16 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-300 hover:scale-105 transition-all duration-200 rounded-xl"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🤔</div>
                    <div className="font-medium">Medium</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleDifficultySelect('hard')}
                  className="h-16 bg-red-100 hover:bg-red-200 text-red-700 border-red-300 hover:scale-105 transition-all duration-200 rounded-xl"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">😰</div>
                    <div className="font-medium">Hard</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Progress Info */}
        <div className="mt-8 text-center text-sm text-neutral-500">
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Progress: {completed} of {items.length} completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



