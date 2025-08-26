'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type QuizMode = 'mcq' | 'typing';

interface LessonItem {
  arabic?: string | null;
  english?: string | null;
  transliteration?: string | null;
  audioUrl?: string | null;
  [key: string]: unknown;
}

interface LessonResponse {
  lessonId: number;
  title: string;
  description: string;
  totalItems: number;
  data: LessonItem[];
}

interface QuizProps {
  lessonId: string;
  mode: QuizMode;
}

interface McqQuestion {
  type: 'mcq';
  prompt: string; // Arabic shown
  options: string[]; // English options
  correct: string; // English correct
}

interface TypingQuestion {
  type: 'typing';
  prompt: string; // English shown
  correct: string; // Arabic expected
}

type Question = McqQuestion | TypingQuestion;

function getRandomSample<T>(array: T[], count: number, excludeIndex?: number): T[] {
  const indices = array.map((_, idx) => idx).filter((i) => i !== excludeIndex);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, Math.min(count, indices.length)).map((i) => array[i]);
}

export default function Quiz({ lessonId, mode }: QuizProps) {
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        if (!res.ok) throw new Error('Failed to load lesson');
        const data: LessonResponse = await res.json();
        setLesson(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const cleanedItems = useMemo(() => {
    if (!lesson) return [] as LessonItem[];
    return lesson.data.filter((it) => (it.arabic && it.english));
  }, [lesson]);

  useEffect(() => {
    if (!cleanedItems.length) return;
    const total = Math.min(10, cleanedItems.length);
    const baseIndices = getRandomSample(cleanedItems, total).map((it) => cleanedItems.indexOf(it));

    const newQuestions: Question[] = baseIndices.map((idx) => {
      const item = cleanedItems[idx];
      if (mode === 'typing') {
        return {
          type: 'typing',
          prompt: String(item.english),
          correct: String(item.arabic),
        } as TypingQuestion;
      }

      // mcq
      const distractors = getRandomSample(
        cleanedItems,
        3,
        idx
      )
        .map((d) => String(d.english))
        .filter((opt) => opt && opt !== item.english);

      const options = [...new Set([String(item.english), ...distractors])];
      while (options.length < 4 && cleanedItems.length > options.length) {
        const candidate = String(getRandomSample(cleanedItems, 1, idx)[0]?.english ?? '');
        if (candidate && !options.includes(candidate)) options.push(candidate);
      }

      // shuffle options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      return {
        type: 'mcq',
        prompt: String(item.arabic),
        options,
        correct: String(item.english),
      } as McqQuestion;
    });

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setFeedback(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    setFinished(false);
  }, [cleanedItems, mode]);

  const current = questions[currentIndex];

  const submitAnswer = () => {
    if (!current || feedback) return;

    let isCorrect = false;
    if (current.type === 'mcq') {
      if (!selectedOption) return;
      isCorrect = selectedOption === current.correct;
    } else {
      const normalize = (s: string) => s.trim();
      isCorrect = normalize(typedAnswer) !== '' && normalize(typedAnswer) === normalize(current.correct);
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setTypedAnswer('');
    setFeedback(null);
  };

  const restart = () => {
    // regenerate by toggling a trivial state
    setQuestions((qs) => [...qs]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setFeedback(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    setFinished(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-red-600 dark:text-red-400 text-center">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!lesson || !questions.length) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-slate-600 dark:text-slate-400">
          Not enough data to generate a quiz.
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    const total = questions.length;
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Quiz Complete</CardTitle>
          <CardDescription>
            Score: {correctCount} / {total} ({Math.round((correctCount / total) * 100)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={restart}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border rounded-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Question {currentIndex + 1} / {questions.length}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Mode: {mode === 'mcq' ? 'Multiple Choice' : 'Typing'}
              </CardDescription>
            </div>
            <div className="text-right text-sm text-slate-500 dark:text-slate-400">
              <span className="mr-3">✅ {correctCount}</span>
              <span>❌ {incorrectCount}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="p-6 border rounded-lg bg-white dark:bg-slate-900">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {current.type === 'mcq' ? current.prompt : current.prompt}
              </div>
            </div>

            {current.type === 'mcq' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.options.map((opt) => {
                  const isSelected = selectedOption === opt;
                  const isCorrect = feedback && opt === current.correct;
                  const isIncorrect = feedback && isSelected && opt !== current.correct;
                  return (
                    <Button
                      key={opt}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`justify-start text-left hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        isCorrect ? 'bg-green-600 hover:bg-green-700 text-white' : ''
                      } ${isIncorrect ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                      onClick={() => !feedback && setSelectedOption(opt)}
                      disabled={!!feedback}
                    >
                      {opt}
                    </Button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  placeholder="Type the Arabic here"
                  disabled={!!feedback}
                />
                {feedback && (
                  <div className={`text-sm ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback === 'correct' ? 'Correct!' : `Incorrect. Correct answer: ${current.correct}`}
                  </div>
                )}
              </div>
            )}

            {!feedback ? (
              <div className="mt-6">
                <Button
                  onClick={submitAnswer}
                  disabled={current.type === 'mcq' ? !selectedOption : typedAnswer.trim() === ''}
                >
                  Submit
                </Button>
              </div>
            ) : (
              <div className="mt-6 flex items-center gap-3">
                <span className={`${feedback === 'correct' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                </span>
                <Button variant="outline" onClick={nextQuestion}>Next</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


