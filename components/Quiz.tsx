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
              <h2 className="text-3xl font-display text-neutral-900 mb-2">
                Quiz Complete! 🎉
              </h2>
              <p className="text-lg text-neutral-600">
                Great job completing the quiz!
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 mb-6">
              <div className="text-4xl font-display text-primary-600 mb-2">
                {score}/{items.length}
              </div>
              <div className="text-lg text-neutral-600">
                {score === items.length ? 'Perfect Score!' : 'Keep practicing!'}
              </div>
              <div className="mt-4">
                <div className="w-full bg-neutral-200 rounded-full h-3">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(score / items.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleRestart}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
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
      <Card className="max-w-4xl mx-auto border-0 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-display text-neutral-900">
            Quiz Time! 🧠
          </CardTitle>
          <p className="text-neutral-600">
            Question {currentQuestionIndex + 1} of {items.length}
          </p>
          <div className="w-full bg-neutral-200 rounded-full h-2 mt-4">
            <div 
              className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-1000"
              style={{ width: `${((currentQuestionIndex + 1) / items.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-display text-neutral-900 mb-6 text-center">
              {question.question}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-16 text-lg font-medium transition-all duration-200 ${
                    selectedAnswer === option
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
          
          {selectedAnswer && (
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                isCorrect 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Correct!
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Incorrect. The answer is: {question.correctAnswer}
                  </>
                )}
              </div>
              
              <Button 
                onClick={handleNext}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
              >
                {currentQuestionIndex < items.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  'See Results'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


