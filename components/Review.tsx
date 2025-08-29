'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Volume2, CheckCircle, XCircle, RotateCcw, TrendingUp } from "lucide-react";
import { useAudio } from "@/lib/useAudio";

interface ReviewProps {
  lessonId: string;
  items: any[];
  onProgressUpdate?: () => void;
}

export default function Review({ lessonId, items, onProgressUpdate }: ReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [completed, setCompleted] = useState(0);
  const { play, isPlaying } = useAudio();

  const currentItem = items[currentIndex];
  const isLastItem = currentIndex === items.length - 1;

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleDifficultySelect = async (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setCompleted(completed + 1);
    
    // Save progress when item is reviewed
    try {
      await fetch(`/api/progress/${lessonId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId: currentItem.id }),
      });
      
      // Notify parent component about progress update
      if (onProgressUpdate) {
        onProgressUpdate();
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
    
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
      play(currentItem.audioUrl);
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
      <div className="bg-white rounded-lg shadow-lg p-8">
        <Card className="max-w-2xl mx-auto border-0 shadow-none">
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
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <Card className="max-w-4xl mx-auto border-0 shadow-none">
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
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="text-4xl font-display text-neutral-900 mb-4">
              {currentItem?.arabic}
            </div>
            <p className="text-lg text-neutral-600 italic mb-4">
              {currentItem?.transliteration}
            </p>
            
            <div className="flex justify-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={handleAudioPlay}
                disabled={isPlaying}
                className="px-6 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                {isPlaying ? 'Playing...' : 'Play Audio'}
              </Button>
            </div>
            
            {!showAnswer && (
              <Button
                onClick={handleShowAnswer}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
              >
                Show Answer
              </Button>
            )}
          </div>
          
          {showAnswer && (
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-display text-neutral-900 mb-2">
                  {currentItem?.english}
                </h3>
                <p className="text-lg text-neutral-600">
                  {currentItem?.transliteration}
                </p>
              </div>
              
              <div className="mb-6">
                <p className="text-neutral-600 mb-4">
                  How difficult was this item?
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => handleDifficultySelect('easy')}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
                  >
                    Easy 😊
                  </Button>
                  <Button
                    onClick={() => handleDifficultySelect('medium')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
                  >
                    Medium 😐
                  </Button>
                  <Button
                    onClick={() => handleDifficultySelect('hard')}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
                  >
                    Hard 😰
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



