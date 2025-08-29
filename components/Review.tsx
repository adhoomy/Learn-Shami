'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Volume2, CheckCircle, XCircle, RotateCcw, TrendingUp, Eye, Minus } from "lucide-react";
import { useAudio } from "@/lib/useAudio";
import { AudioPlayer } from '@/components/ui/audio-player';

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
        <Card className="max-w-2xl mx-auto border-0 shadow-none bg-white">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-black mb-2">
                Review Complete! 🎯
              </h2>
              <p className="text-lg text-gray-600">
                Great job reviewing all items!
              </p>
            </div>
            
            <div className="bg-primary-100 rounded-2xl p-6 mb-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {completed}/{items.length}
              </div>
              <div className="text-lg text-gray-700">
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
      <Card className="max-w-4xl mx-auto border-0 shadow-none bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-black">
            Spaced Repetition Review 🔄
          </CardTitle>
          <p className="text-gray-600">
            Review {currentIndex + 1} of {items.length}
          </p>
        </CardHeader>
        <CardContent className="p-8">
          {currentItem && (
            <div className="space-y-8">
              {/* Arabic Text */}
              <div className="text-center mb-8">
                <h3 className="text-5xl font-bold text-black mb-4 leading-tight">
                  {currentItem.arabic}
                </h3>
                <p className="text-xl text-gray-600 italic mb-4">
                  {currentItem.transliteration}
                </p>
                
                {/* Audio Player */}
                <Button
                  onClick={handleAudioPlay}
                  disabled={isPlaying}
                  className="bg-primary-500 hover:bg-primary-600 text-white hover:scale-105 transition-all duration-200 px-6 py-3 rounded-xl"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  {isPlaying ? 'Playing...' : 'Play Audio'}
                </Button>
              </div>

              {/* Show Answer Button */}
              {!showAnswer && (
                <div className="text-center">
                  <Button
                    onClick={handleShowAnswer}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 text-lg font-medium rounded-xl hover:scale-105 transition-all duration-200"
                  >
                    Show Answer
                  </Button>
                </div>
              )}

              {/* Answer and Difficulty Selection */}
              {showAnswer && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-black mb-2">English Translation</h4>
                    <p className="text-xl text-gray-700">{currentItem.english}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-4">How well did you know this?</p>
                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={() => handleDifficultySelect('easy')}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
                      >
                        Easy
                      </Button>
                      <Button
                        onClick={() => handleDifficultySelect('medium')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
                      >
                        Medium
                      </Button>
                      <Button
                        onClick={() => handleDifficultySelect('hard')}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
                      >
                        Hard
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Indicator */}
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-500"
                    style={{ width: `${(completed / items.length) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {completed} of {items.length} items reviewed
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



