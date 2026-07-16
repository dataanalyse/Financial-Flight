"use client";

import React, { useState, useEffect } from 'react';
import { Check, X, Heart, RotateCcw, Trophy, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import ProgressBar from './ProgressBar';

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  hint?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface QuizEngineProps {
  questions: QuizQuestion[];
  onComplete: (score: number, passed: boolean) => void;
  minPassingScore?: number;
  maxLives?: number;
  showHints?: boolean;
  allowRetry?: boolean;
  randomizeQuestions?: boolean;
  timeLimit?: number; // in seconds
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
}

const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  onComplete,
  minPassingScore = Math.ceil(questions.length * 0.75), // 75% to pass
  maxLives = 3,
  showHints = true,
  allowRetry = true,
  randomizeQuestions = false,
  timeLimit,
  color = 'purple'
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(maxLives);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [quizQuestions, setQuizQuestions] = useState(questions);

  useEffect(() => {
    if (randomizeQuestions) {
      setQuizQuestions([...questions].sort(() => Math.random() - 0.5));
    }
  }, [questions, randomizeQuestions]);

  useEffect(() => {
    if (timeLimit && timeRemaining !== undefined && timeRemaining > 0 && !showFeedback && !quizComplete) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showFeedback) {
      // Time's up, treat as wrong answer
      handleAnswer(-1); // -1 indicates timeout
    }
  }, [timeRemaining, showFeedback, quizComplete, timeLimit]);

  const getColorClasses = () => {
    const colors = {
      blue: { primary: 'blue-500', light: 'blue-50', dark: 'blue-700' },
      green: { primary: 'green-500', light: 'green-50', dark: 'green-700' },
      purple: { primary: 'purple-500', light: 'purple-50', dark: 'purple-700' },
      orange: { primary: 'orange-500', light: 'orange-50', dark: 'orange-700' },
      pink: { primary: 'pink-500', light: 'pink-50', dark: 'pink-700' }
    };
    return colors[color];
  };

  const colorClasses = getColorClasses();

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;

    const question = quizQuestions[currentQuestion];
    const correct = answerIndex === question.correct;

    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
    } else {
      setLives(lives - 1);
    }

    // Don't auto-advance - let user click Next
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < quizQuestions.length && lives > 0) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowHint(false);
      setTimeRemaining(timeLimit);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizComplete(true);
    const passed = score >= minPassingScore && lives > 0;
    onComplete(score, passed);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setLives(maxLives);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuizComplete(false);
    setShowHint(false);
    setTimeRemaining(timeLimit);
    if (randomizeQuestions) {
      setQuizQuestions([...questions].sort(() => Math.random() - 0.5));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizComplete) {
    const passed = score >= minPassingScore && lives > 0;
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={`bg-gradient-to-r ${
            passed 
              ? `from-green-500 to-emerald-500` 
              : `from-${colorClasses.primary} to-${colorClasses.dark}`
          } p-6 text-white text-center`}>
            <div className="text-6xl mb-4">
              {passed ? '🏆' : '📚'}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {passed ? 'Fantastic! You passed!' : 'Good effort! Keep learning!'}
            </h2>
            <p className="text-lg opacity-90">
              You got {score} out of {quizQuestions.length} questions correct!
            </p>
          </div>

          <div className="p-8 text-center">
            <div className="mb-6">
              <ProgressBar 
                current={score} 
                total={quizQuestions.length} 
                color={passed ? 'green' : color}
                size="large"
                showPercentage
              />
            </div>

            {/* Performance breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{quizQuestions.length - score}</div>
                <div className="text-sm text-gray-600">Missed</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{lives}</div>
                <div className="text-sm text-gray-600">Lives Left</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {passed ? (
                <button
                  onClick={() => onComplete(score, true)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-8 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  Continue! 
                  <Trophy className="h-5 w-5 ml-2" />
                </button>
              ) : allowRetry ? (
                <button
                  onClick={restartQuiz}
                  className={`w-full bg-gradient-to-r from-${colorClasses.primary} to-${colorClasses.dark} text-white py-3 px-8 rounded-xl font-semibold text-lg hover:from-${colorClasses.dark} hover:to-${colorClasses.primary} transition-all transform hover:scale-105 flex items-center justify-center`}
                >
                  Try Again! 
                  <RotateCcw className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={() => onComplete(score, false)}
                  className="w-full bg-gray-500 text-white py-3 px-8 rounded-xl font-semibold text-lg hover:bg-gray-600 transition-all"
                >
                  Continue Anyway
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r from-${colorClasses.primary} to-${colorClasses.dark} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">🧠 Knowledge Check</h2>
            <div className="flex items-center space-x-4">
              {/* Lives */}
              <div className="flex space-x-1">
                {[...Array(maxLives)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`h-6 w-6 ${i < lives ? 'text-red-400 fill-current' : 'text-gray-400'}`}
                  />
                ))}
              </div>
              
              {/* Score */}
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                <span className="font-semibold">Score: {score}/{quizQuestions.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Progress */}
          <div className="mb-6">
            <ProgressBar 
              current={currentQuestion + 1} 
              total={quizQuestions.length} 
              color={color}
              showPercentage
            />
          </div>

          {/* Question */}
          <div className={`bg-gradient-to-br from-${colorClasses.light} to-white p-6 rounded-xl mb-6 border border-${colorClasses.primary} border-opacity-20`}>
            <div className="flex items-start justify-between mb-4">
              <h3 className={`text-xl font-bold text-${colorClasses.dark} flex-1`}>
                {question.question}
              </h3>
              {question.difficulty && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ml-4 ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {question.difficulty}
                </span>
              )}
            </div>

            {/* Hint button */}
            {showHints && question.hint && !showFeedback && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={`text-sm text-${colorClasses.primary} hover:text-${colorClasses.dark} mb-4`}
              >
                💡 {showHint ? 'Hide hint' : 'Need a hint?'}
              </button>
            )}

            {/* Hint */}
            {showHint && question.hint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 text-sm">💡 {question.hint}</p>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                    showFeedback
                      ? selectedAnswer === index
                        ? isCorrect
                          ? 'border-green-400 bg-green-50'
                          : 'border-red-400 bg-red-50'
                        : index === question.correct
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      : `border-${colorClasses.primary} border-opacity-20 bg-white hover:border-${colorClasses.primary} hover:bg-${colorClasses.light}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      showFeedback && index === question.correct 
                        ? 'text-green-800' 
                        : showFeedback && selectedAnswer === index && !isCorrect
                          ? 'text-red-800'
                          : `text-${colorClasses.dark}`
                    }`}>
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                    {showFeedback && (
                      <>
                        {index === question.correct && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
                        {selectedAnswer === index && !isCorrect && (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`p-4 rounded-lg border ${
              isCorrect 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            } animate-fadeIn`}>
              <div className="flex items-center mb-2">
                {isCorrect ? (
                  <>
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Correct! 🎉</span>
                  </>
                ) : selectedAnswer === -1 ? (
                  <>
                    <X className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-semibold text-red-800">Time's up! ⏰</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-semibold text-red-800">Not quite! Keep trying! 💪</span>
                  </>
                )}
              </div>
              <p className={`${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {question.explanation}
              </p>
              
              {/* Next question preview */}
              {showFeedback && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={nextQuestion}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      currentQuestion + 1 < quizQuestions.length
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {currentQuestion + 1 < quizQuestions.length ? 'Next Question →' : 'Finish Quiz →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </div>
            
            {/* Manual navigation (if not showing feedback) */}
            {!showFeedback && currentQuestion > 0 && (
              <button
                onClick={() => {
                  setCurrentQuestion(currentQuestion - 1);
                  setSelectedAnswer(null);
                  setShowHint(false);
                  setTimeRemaining(timeLimit);
                }}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
            )}
          </div>

          {/* Emergency actions */}
          {lives === 0 && !quizComplete && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-800 font-medium mb-3">No lives remaining!</p>
              {allowRetry ? (
                <button
                  onClick={restartQuiz}
                  className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center mx-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </button>
              ) : (
                <button
                  onClick={finishQuiz}
                  className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Finish Quiz
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;