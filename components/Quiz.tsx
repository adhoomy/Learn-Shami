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
      <div className="bg-brand-background rounded-lg shadow-lg p-8">
        <Card className="max-w-2xl mx-auto border-0 shadow-none bg-brand-background">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-brand-dark mb-2">
                Quiz Complete! 🎉
              </h2>
              <p className="text-lg text-brand-dark/70">
                Great job completing the quiz!
              </p>
            </div>
            
            <div className="bg-brand-accentLight/20 rounded-2xl p-6 mb-6">
              <div className="text-4xl font-bold text-brand-accent mb-2">
                {score}/{items.length}
              </div>
              <div className="text-lg text-brand-dark/70">
                {score === items.length ? 'Perfect Score!' : 'Keep practicing!'}
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-full bg-brand-primary rounded-full transition-all duration-1000"
                    style={{ width: `${(score / items.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleRestart}
              className="bg-brand-accent hover:bg-brand-accentLight text-white px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
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
    <div className="bg-brand-background rounded-lg shadow-lg p-8">
      <Card className="max-w-4xl mx-auto border-0 shadow-none bg-brand-background">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-brand-dark">
            Quiz Mode 🧠
          </CardTitle>
          <p className="text-brand-dark/70">
            Question {currentQuestionIndex + 1} of {items.length}
          </p>
        </CardHeader>
        <CardContent className="p-8">
          {currentItem && (
            <div className="space-y-8">
              {/* Question */}
              <div className="text-center">
                <h3 className="text-3xl font-bold text-brand-dark mb-4">
                  {question.question}
                </h3>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-6 text-left text-lg font-medium rounded-xl transition-all duration-200 ${
                      selectedAnswer === option
                        ? option === question.correctAnswer
                          ? 'bg-brand-accent text-white shadow-lg scale-105'
                          : 'bg-red-500 text-white shadow-lg scale-105'
                        : 'bg-brand-background text-brand-dark border border-brand-accentLight hover:bg-brand-accentLight/20 hover:border-brand-accent hover:scale-105'
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {/* Feedback */}
              {selectedAnswer && (
                <div className="text-center">
                  {isCorrect ? (
                    <div className="flex items-center justify-center space-x-2 text-brand-accent text-lg">
                      <CheckCircle className="w-6 h-6" />
                      <span>Correct! Well done!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-red-500 text-lg">
                      <XCircle className="w-6 h-6" />
                      <span>Incorrect. The correct answer is: {question.correctAnswer}</span>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleNext}
                    className="mt-4 bg-brand-accent hover:bg-brand-accentLight text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
                  >
                    {currentQuestionIndex < items.length - 1 ? 'Next Question' : 'See Results'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


