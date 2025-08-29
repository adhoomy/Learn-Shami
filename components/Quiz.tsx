'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface QuizProps {
  lessonId: string;
  items: any[];
  onProgressUpdate?: () => void;
}

export default function Quiz({ lessonId, items, onProgressUpdate }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentItem = items[currentQuestionIndex];
  
  // Create quiz question from current item
  const question = {
    question: `What does "${currentItem?.arabic}" mean?`,
    correctAnswer: currentItem?.english,
    options: [
      currentItem?.english,
      "Incorrect option 1",
      "Incorrect option 2", 
      "Incorrect option 3"
    ].sort(() => Math.random() - 0.5) // Shuffle options
  };

  const handleAnswerSelect = async (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      
      // Save progress when answer is correct
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
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < items.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <Card className="max-w-2xl mx-auto border-0 shadow-none">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h2 className="text-3xl font-display text-black mb-4">Quiz Complete! 🎉</h2>
              <p className="text-lg text-gray-600 mb-6">
                You got {score} out of {items.length} questions correct!
              </p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Score</span>
                  <span className="font-medium text-black">{Math.round((score / items.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(score / items.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleRestart}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 text-lg rounded-xl hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <Card className="max-w-2xl mx-auto border-0 shadow-none">
        <CardContent className="p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Question {currentQuestionIndex + 1} of {items.length}</span>
              <span className="font-medium text-black">{Math.round(((currentQuestionIndex + 1) / items.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIndex + 1) / items.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display text-black mb-4">
              What does "{currentItem?.arabic}" mean?
            </h2>
            <p className="text-lg text-gray-600 mb-6">{currentItem?.transliteration}</p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === option
                    ? option === question.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-500 hover:bg-primary-50'
                } disabled:cursor-not-allowed`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {selectedAnswer && (
            <div className={`text-center p-4 rounded-lg mb-6 ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-medium">
                {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
              </p>
              <p className="text-sm mt-1">
                The correct answer is: "{question.correctAnswer}"
              </p>
            </div>
          )}

          {/* Next Button */}
          {selectedAnswer && (
            <div className="text-center">
              <Button 
                onClick={handleNext}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 text-lg rounded-xl hover:scale-105 transition-all duration-200"
              >
                {currentQuestionIndex === items.length - 1 ? 'See Results' : 'Next Question'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


