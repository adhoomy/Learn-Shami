'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface QuizProps {
  lessonId: string;
  items: any[];
}

export default function Quiz({ lessonId, items }: QuizProps) {
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

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
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
      <Card className="max-w-2xl mx-auto">
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
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-display text-neutral-900">
          Quiz Time! 🧠
        </CardTitle>
        <p className="text-neutral-600">
          Question {currentQuestionIndex + 1} of {items.length}
        </p>
      </CardHeader>
      <CardContent className="p-8">
        {/* Question */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-medium text-neutral-800 mb-4">
            {question.question}
          </h3>
          <div className="text-4xl font-display text-neutral-900 mb-2">
            {currentItem?.arabic}
          </div>
          <p className="text-lg text-neutral-600 italic">
            {currentItem?.transliteration}
          </p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={selectedAnswer !== null}
              variant="outline"
              className={`h-16 text-lg font-medium rounded-2xl transition-all duration-200 hover:scale-105 ${
                selectedAnswer === option
                  ? isCorrect
                    ? 'bg-green-100 border-green-500 text-green-700 hover:bg-green-100'
                    : 'bg-red-100 border-red-500 text-red-700 hover:bg-red-100'
                  : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {option}
            </Button>
          ))}
        </div>

        {/* Feedback */}
        {selectedAnswer && (
          <div className={`text-center p-4 rounded-xl mb-6 ${
            isCorrect 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <span className={`text-lg font-medium ${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </span>
            </div>
            {!isCorrect && (
              <p className="text-red-600">
                The correct answer is: <strong>{question.correctAnswer}</strong>
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center">
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
          >
            {currentQuestionIndex === items.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


