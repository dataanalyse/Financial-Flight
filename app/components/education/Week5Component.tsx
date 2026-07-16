"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Check, Trophy, Star, ArrowRight, ArrowLeft, RotateCcw, X, Award, Calendar, Users, PiggyBank, Sparkles, TrendingUp, Coins, Zap } from 'lucide-react';
import Badge from '../shared/Badge';
import ProgressBar from '../shared/ProgressBar';
import QuizEngine, { QuizQuestion } from '../shared/QuizEngine';
import LessonComponent, { LessonSection } from '../shared/LessonComponent';

interface Week5Props {
  onComplete: (weekNumber: number, badge: string) => void;
  onBack: () => void;
}

interface WeekProgress {
  lesson: boolean;
  savingsGame: boolean;
  quiz: boolean;
  badge: boolean;
}

interface SavingsGameState {
  round: number;
  totalSaved: number;
  interestEarned: number;
  choices: Array<{round: number, choice: string, amount: number, bonus?: number}>;
}

const Week5Component: React.FC<Week5Props> = ({ onComplete, onBack }) => {
  const [lessonStep, setLessonStep] = useState('overview');
  const [savingsGameCompleted, setSavingsGameCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  
  // Savings Sprint Game State
  const [gameState, setGameState] = useState<SavingsGameState>({
    round: 1,
    totalSaved: 0,
    interestEarned: 0,
    choices: []
  });
  
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [lastChoice, setLastChoice] = useState<{choice: string, amount: number, bonus?: number} | null>(null);

  const [weekProgress, setWeekProgress] = useState<WeekProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('week5Progress');
      return saved ? JSON.parse(saved) : {
        lesson: false,
        savingsGame: false,
        quiz: false,
        badge: false
      };
    }
    return {
      lesson: false,
      savingsGame: false,
      quiz: false,
      badge: false
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('week5Progress', JSON.stringify(weekProgress));
    }
  }, [weekProgress]);

  // Quiz questions for Week 5
  const quizQuestions: QuizQuestion[] = [
    {
      question: "What is one reason people save money?",
      options: [
        "To make their parents happy",
        "To prepare for emergencies and future goals",
        "Because banks force them to"
      ],
      correct: 1,
      explanation: "People save money to be prepared for emergencies, achieve their dreams, and have financial security!",
      hint: "Think about why having money set aside would be helpful.",
      difficulty: 'easy'
    },
    {
      question: "What does interest mean?",
      options: [
        "Money the bank pays you for saving with them",
        "Money you pay the bank to keep your money safe",
        "The cost of buying something expensive"
      ],
      correct: 0,
      explanation: "Interest is like a reward! The bank pays you a small amount for keeping your money with them because they can use it to help other people.",
      hint: "Think about what the bank gives you as a thank-you for saving.",
      difficulty: 'easy'
    },
    {
      question: "What makes compound interest magical?",
      options: [
        "You earn interest only on your original money",
        "You earn interest on your money AND on previous interest earned",
        "It makes your money disappear"
      ],
      correct: 1,
      explanation: "Compound interest is magical because you earn interest on your original money PLUS interest on the interest you've already earned! It grows like a snowball!",
      hint: "Think about earning rewards on your rewards.",
      difficulty: 'medium'
    },
    {
      question: "What's a smarter financial move?",
      options: [
        "Spend $20 on impulse purchases every week",
        "Save $5 every week consistently",
        "Only save money when you feel like it"
      ],
      correct: 1,
      explanation: "Consistent saving, even small amounts like $5/week, builds powerful habits and grows your money over time through compound interest!",
      hint: "Think about which choice helps your money grow over time.",
      difficulty: 'medium'
    }
  ];

  // Lesson sections for Week 5
  const lessonSections: LessonSection[] = [
    {
      id: 'warm-up',
      title: 'Where Did My Money Go? 😱',
      type: 'story',
      content: (
        <div>
          <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200 mb-4">
            <p className="text-lg text-orange-800 mb-4">
              <strong>Imagine this scenario:</strong> You've been saving $20 every week for 3 weeks. You're so proud! 💪
            </p>
            <div className="bg-white p-4 rounded-lg mb-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🏦</div>
                <p className="font-bold text-green-600 text-xl">Your Savings: $60</p>
                <p className="text-sm text-gray-600">3 weeks × $20 = $60</p>
              </div>
            </div>
            <p className="text-orange-800 mb-4">
              Then you walk into a store and see your <strong>favorite hoodie</strong> on sale for $55... 👕
            </p>
            <div className="bg-red-100 p-4 rounded border border-red-300">
              <p className="text-red-800 font-medium text-center">
                💸 You buy it! Now your savings: <strong>$5</strong>
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-blue-800 mb-3">🤔 Think About It:</h4>
            <ul className="text-blue-700 space-y-2">
              <li>• How would you feel right after buying the hoodie?</li>
              <li>• Was it worth losing all your savings progress?</li>
              <li>• What could you have done differently?</li>
              <li>• What if you had waited just one more week?</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              ✨ <strong>What if I told you...</strong> that money could have grown into something much bigger if you had saved it just a little longer? 
              That's the magic we're learning today!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'what-is-saving',
      title: 'What Is Saving? 🏦',
      type: 'example',
      content: (
        <div>
          <p className="text-lg mb-4">
            <strong>Saving</strong> means putting money aside now to use in the future, instead of spending it right away.
          </p>
          
          <div className="bg-blue-100 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-blue-800 mb-4">🎯 Why Do People Save?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🆘</div>
                <h5 className="font-semibold text-red-700">Emergencies</h5>
                <p className="text-sm text-red-600">When unexpected things happen</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h5 className="font-semibold text-purple-700">Big Dreams</h5>
                <p className="text-sm text-purple-600">Bikes, phones, college, travel</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🧘</div>
                <h5 className="font-semibold text-green-700">Peace of Mind</h5>
                <p className="text-sm text-green-600">Feeling secure and prepared</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-gray-800 mb-4">📅 Savings Time Buckets:</h4>
            <div className="space-y-3">
              <div className="bg-green-100 p-3 rounded border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-green-800">Short-term (1-3 months)</span>
                  <span className="text-green-600">Snacks, books, small treats</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded border-l-4 border-yellow-500">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-yellow-800">Medium-term (3-12 months)</span>
                  <span className="text-yellow-600">New shoes, concert tickets, gadgets</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded border-l-4 border-purple-500">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-800">Long-term (1+ years)</span>
                  <span className="text-purple-600">Laptop, travel, college, car</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-bold text-orange-800 mb-2">🧠 Your Turn!</h4>
            <p className="text-orange-700">
              Think of one goal for each time bucket. What would you save for in the short-term, medium-term, and long-term?
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'maya-magic-jar',
      title: 'Maya and the Magic Jar ✨',
      type: 'story',
      content: (
        <div>
          <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200 mb-4">
            <p className="text-lg text-purple-800 mb-4">
              <strong>Meet Maya!</strong> She has a very special jar... 🏺✨
            </p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold text-purple-700 mb-3">📖 Maya's Amazing Discovery:</h4>
              <div className="space-y-3">
                <div className="flex items-center bg-purple-100 p-3 rounded">
                  <span className="text-2xl mr-3">1️⃣</span>
                  <p className="text-purple-800">Maya saves <strong>$100</strong> in a special bank account</p>
                </div>
                <div className="flex items-center bg-purple-100 p-3 rounded">
                  <span className="text-2xl mr-3">2️⃣</span>
                  <p className="text-purple-800">After 1 year, the bank gives her <strong>$10</strong> as a thank-you!</p>
                </div>
                <div className="flex items-center bg-purple-100 p-3 rounded">
                  <span className="text-2xl mr-3">3️⃣</span>
                  <p className="text-purple-800">Now she has <strong>$110</strong> total</p>
                </div>
                <div className="flex items-center bg-yellow-100 p-3 rounded border border-yellow-300">
                  <span className="text-2xl mr-3">✨</span>
                  <p className="text-yellow-800"><strong>The Magic:</strong> Next year, she earns 10% on <strong>$110</strong> - not just the original $100!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-green-800 mb-3">🌱 What Is Interest?</h4>
            <p className="text-green-700 mb-3">
              <strong>Interest</strong> is like a tiny reward the bank gives you for saving your money with them. 
              They can use your money to help other people, so they share some profit with you!
            </p>
            <div className="bg-white p-4 rounded border border-green-300">
              <p className="text-green-800 font-medium">
                🪄 <strong>Compound Interest Magic:</strong> When your interest earns interest too! 
                It starts slow but grows like a snowball rolling down a hill! ⛄➡️🏔️
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">📊 Let's See the Magic in Action:</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-red-100 p-3 rounded">
                <h5 className="font-bold text-red-700">Alex</h5>
                <p className="text-red-600">Saves $0</p>
                <p className="text-sm">After 5 years: <strong>$0</strong></p>
              </div>
              <div className="bg-yellow-100 p-3 rounded">
                <h5 className="font-bold text-yellow-700">Bailey</h5>
                <p className="text-yellow-600">Saves $10/month</p>
                <p className="text-sm">After 5 years: <strong>$600</strong></p>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <h5 className="font-bold text-green-700">Casey</h5>
                <p className="text-green-600">Saves $10/month + 5% interest</p>
                <p className="text-sm">After 5 years: <strong>$680+</strong></p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'compound-magic',
      title: 'The Compound Interest Snowball Effect 🏔️',
      type: 'tip',
      content: (
        <div>
          <p className="text-lg mb-4">
            Compound interest works <strong>slowly at first</strong>, then builds up like a snowball rolling downhill!
          </p>
          
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-purple-800 mb-4">🧮 Real World Example:</h4>
            <div className="bg-white p-4 rounded border border-purple-300">
              <p className="text-purple-700 mb-2">If you save <strong>$5 every week:</strong></p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>After 1 year (no interest):</span>
                  <span className="font-bold">$260</span>
                </div>
                <div className="flex justify-between">
                  <span>After 1 year (with 5% interest):</span>
                  <span className="font-bold text-green-600">$273</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>After 5 years (with compound interest):</span>
                  <span className="font-bold text-green-600 text-lg">$1,500+</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">⛄</div>
              <h5 className="font-bold text-yellow-800">Year 1</h5>
              <p className="text-yellow-600">Small snowball</p>
              <p className="text-sm">Slow growth</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">☃️</div>
              <h5 className="font-bold text-orange-800">Year 3</h5>
              <p className="text-orange-600">Medium snowball</p>
              <p className="text-sm">Picking up speed</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🏔️</div>
              <h5 className="font-bold text-blue-800">Year 5+</h5>
              <p className="text-blue-600">Huge snowball!</p>
              <p className="text-sm">Rapid growth</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-2">🚀 The Secret Formula:</h4>
            <p className="text-green-700">
              <strong>Time + Consistency + Interest = Money Magic!</strong><br/>
              The earlier you start and the longer you wait, the more powerful the magic becomes!
            </p>
          </div>
        </div>
      )
    }
  ];

  // Savings Sprint Game functions
  const makeChoice = (choice: 'spend' | 'save' | 'saveWithInterest') => {
    const round = gameState.round;
    let amount = 0;
    let bonus = 0;
    let choiceText = '';

    switch (choice) {
      case 'spend':
        amount = -5;
        choiceText = 'Spent $5';
        break;
      case 'save':
        amount = 5;
        choiceText = 'Saved $5';
        break;
      case 'saveWithInterest':
        amount = 5;
        bonus = Math.round((Math.random() * 1 + 0.5) * 100) / 100; // $0.50 to $1.50
        choiceText = `Saved $5 + earned $${bonus} interest!`;
        break;
    }

    const newTotalSaved = Math.max(0, gameState.totalSaved + amount);
    const newInterestEarned = gameState.interestEarned + bonus;

    const choiceRecord = {
      round,
      choice: choiceText,
      amount,
      bonus: bonus > 0 ? bonus : undefined
    };

    setLastChoice(choiceRecord);
    setShowRoundResult(true);

    setGameState(prev => ({
      ...prev,
      totalSaved: newTotalSaved,
      interestEarned: newInterestEarned,
      choices: [...prev.choices, choiceRecord]
    }));
  };

  const nextRound = () => {
    if (gameState.round >= 10) {
      setSavingsGameCompleted(true);
      setWeekProgress(prev => ({ ...prev, savingsGame: true }));
    } else {
      setGameState(prev => ({ ...prev, round: prev.round + 1 }));
    }
    setShowRoundResult(false);
    setLastChoice(null);
  };

  const resetGame = () => {
    setGameState({
      round: 1,
      totalSaved: 0,
      interestEarned: 0,
      choices: []
    });
    setShowRoundResult(false);
    setLastChoice(null);
    setSavingsGameCompleted(false);
  };

  // Other handler functions
  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizPassed(passed);
    if (passed) {
      setWeekProgress(prev => ({ ...prev, quiz: true }));
      setTimeout(() => {
        setLessonStep('badge');
      }, 1000);
    }
  };

  const handleLessonComplete = () => {
    setWeekProgress(prev => ({ ...prev, lesson: true }));
    setLessonStep('savingsGame');
  };

  const getProgressSteps = () => {
    const steps = [];
    if (weekProgress.lesson) steps.push('lesson');
    if (weekProgress.savingsGame) steps.push('savingsGame');
    if (weekProgress.quiz) steps.push('quiz');
    if (weekProgress.badge) steps.push('badge');
    return steps.length;
  };

  // Render functions
  const renderOverview = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Week 5: The Magic of Saving 🪄</h2>
              <p className="text-purple-100 mt-2">Discover why saving money is like having superpowers!</p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Ages 13-16</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>20-25 minutes</span>
                </div>
              </div>
            </div>
            <Badge 
              badge="🦸 Savings Hero"
              earned={weekProgress.badge}
              size="large"
              animation="sparkle"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <ProgressBar 
              current={getProgressSteps()} 
              total={4} 
              color="purple"
              showSteps
              stepLabels={['Learn', 'Savings Game', 'Quiz', 'Badge']}
              animated
            />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.lesson ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>
              <BookOpen className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Learn</span>
              {weekProgress.lesson && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.savingsGame ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>
              <PiggyBank className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Savings Game</span>
              {weekProgress.savingsGame && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.quiz ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>
              <Star className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Quiz</span>
              {weekProgress.quiz && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.badge ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>
              <Award className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Badge</span>
              {weekProgress.badge && <Check className="h-4 w-4 ml-auto" />}
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-900 mb-2">🎯 What You'll Learn</h3>
            <p className="text-purple-700">Master the magic of saving! Learn how compound interest works, practice smart saving decisions, and discover how small amounts can grow into big dreams.</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setLessonStep('lesson')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              {weekProgress.lesson ? 'Review Savings Magic' : 'Discover the Magic of Saving!'}
              <Sparkles className="h-5 w-5 ml-2" />
            </button>
            
            {weekProgress.lesson && (
              <button
                onClick={() => setLessonStep('savingsGame')}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all flex items-center justify-center"
              >
                {weekProgress.savingsGame ? 'Review Savings Sprint' : 'Play Savings Sprint Game'}
                <PiggyBank className="h-5 w-5 ml-2" />
              </button>
            )}
            
            {weekProgress.savingsGame && (
              <button
                onClick={() => setLessonStep('quiz')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center"
              >
                {weekProgress.quiz ? 'Review Quiz' : 'Take the Savings Quiz'}
                <Star className="h-5 w-5 ml-2" />
              </button>
            )}
            
            <button
              onClick={onBack}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all"
            >
              Back to Course Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSavingsSprintGame = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-purple-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">🏃‍♀️ Savings Sprint Challenge</h2>
              <p className="text-green-100 mt-2">Goal: Save $100 in 10 rounds! Make smart choices!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetGame}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={() => setLessonStep('overview')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {savingsGameCompleted && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Savings Sprint Complete!</h3>
              <p className="text-green-700">
                You saved ${gameState.totalSaved.toFixed(2)} and earned ${gameState.interestEarned.toFixed(2)} in interest!
              </p>
              <p className="text-green-600 text-sm mt-2">
                {gameState.totalSaved >= 100 ? "🏆 You reached the $100 goal! Amazing!" : "Great effort! Every dollar saved is a step toward your dreams!"}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {!showRoundResult && !savingsGameCompleted ? (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Round {gameState.round} of 10</h3>
                 <p className="text-gray-600 mb-6">Choose your action for this round:</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <button
                     onClick={() => makeChoice('spend')}
                     className="p-6 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-all transform hover:scale-105"
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">🍿</div>
                       <h4 className="font-bold text-red-700 mb-2">Spend $5</h4>
                       <p className="text-sm text-red-600">Buy something fun now</p>
                     </div>
                   </button>

                   <button
                     onClick={() => makeChoice('save')}
                     className="p-6 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all transform hover:scale-105"
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">💵</div>
                       <h4 className="font-bold text-blue-700 mb-2">Save $5</h4>
                       <p className="text-sm text-blue-600">Put money aside safely</p>
                     </div>
                   </button>

                   <button
                     onClick={() => makeChoice('saveWithInterest')}
                     className="p-6 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-all transform hover:scale-105"
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">✨</div>
                       <h4 className="font-bold text-purple-700 mb-2">Save $5 + Interest</h4>
                       <p className="text-sm text-purple-600">Earn bonus $0.50-$1.50!</p>
                     </div>
                   </button>
                 </div>
               </div>
             ) : showRoundResult ? (
               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                 <h3 className="text-xl font-bold text-yellow-800 mb-4">Round {gameState.round} Result</h3>
                 <div className="text-4xl mb-4">
                   {lastChoice?.choice.includes('Spent') ? '😔' : 
                    lastChoice?.bonus ? '🎉' : '😊'}
                 </div>
                 <p className="text-lg font-semibold text-yellow-700 mb-4">
                   {lastChoice?.choice}
                 </p>
                 {lastChoice?.bonus && (
                   <div className="bg-purple-100 p-3 rounded-lg mb-4">
                     <p className="text-purple-700 font-medium">
                       🎲 Lucky! You earned an extra ${lastChoice.bonus} in interest!
                     </p>
                   </div>
                 )}
                 <button
                   onClick={nextRound}
                   className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
                 >
                   {gameState.round >= 10 ? 'See Final Results' : 'Next Round'}
                 </button>
               </div>
             ) : (
               <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                 <h3 className="text-xl font-bold text-green-800 mb-4">🏁 Game Complete!</h3>
                 <div className="space-y-3 mb-6">
                   <div className="flex justify-between">
                     <span className="text-green-700">Total Saved:</span>
                     <span className="font-bold text-green-800">${gameState.totalSaved.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-purple-700">Interest Earned:</span>
                     <span className="font-bold text-purple-800">${gameState.interestEarned.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between border-t pt-2">
                     <span className="text-gray-700">Total Value:</span>
                     <span className="font-bold text-lg">${(gameState.totalSaved + gameState.interestEarned).toFixed(2)}</span>
                   </div>
                 </div>
                 
                 <div className="bg-white p-4 rounded border border-green-300">
                   <h4 className="font-semibold text-green-800 mb-2">Your Choices:</h4>
                   <div className="max-h-40 overflow-y-auto space-y-1">
                     {gameState.choices.map((choice, index) => (
                       <div key={index} className="text-sm text-green-700">
                         Round {choice.round}: {choice.choice}
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}
           </div>

           <div className="bg-gray-50 rounded-xl p-6">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Dashboard</h3>
             
             <div className="space-y-4 mb-6">
               <div>
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-gray-600">Savings Goal:</span>
                   <span className="font-bold text-purple-600">$100</span>
                 </div>
                 <ProgressBar 
                   current={gameState.totalSaved} 
                   total={100} 
                   color="purple"
                   showPercentage
                 />
               </div>
               
               <div className="bg-white p-4 rounded border">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-green-700">💰 Total Saved:</span>
                   <span className="font-bold text-green-800">${gameState.totalSaved.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-purple-700">✨ Interest Earned:</span>
                   <span className="font-bold text-purple-800">${gameState.interestEarned.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center border-t pt-2">
                   <span className="text-gray-700">🏆 Total Value:</span>
                   <span className="font-bold text-lg">${(gameState.totalSaved + gameState.interestEarned).toFixed(2)}</span>
                 </div>
               </div>
               
               <div className="bg-blue-100 p-3 rounded">
                 <div className="text-center">
                   <span className="text-blue-700 text-sm">Round</span>
                   <div className="text-2xl font-bold text-blue-800">{gameState.round}</div>
                   <span className="text-blue-600 text-sm">of 10</span>
                 </div>
               </div>
             </div>

             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
               <h4 className="font-semibold text-yellow-800 mb-2">💡 Strategy Tips:</h4>
               <ul className="text-sm text-yellow-700 space-y-1">
                 <li>• Interest adds up over time</li>
                 <li>• Consistent saving wins</li>
                 <li>• Every dollar counts!</li>
                 <li>• Think long-term goals</li>
               </ul>
             </div>
           </div>
         </div>

         <div className="mt-8 flex justify-between items-center">
           <button
             onClick={() => setLessonStep('lesson')}
             className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
           >
             <ArrowLeft className="h-5 w-5 mr-2" />
             Back to Lesson
           </button>

           {savingsGameCompleted ? (
             <button
               onClick={() => setLessonStep('quiz')}
               className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
             >
               Take Quiz
               <Star className="h-5 w-5 ml-2" />
             </button>
           ) : (
             <button
               onClick={() => setLessonStep('quiz')}
               className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all"
             >
               Skip to Quiz
               <ArrowRight className="h-5 w-5 ml-2" />
             </button>
           )}
         </div>
       </div>
     </div>
   </div>
 );

 const renderBadgeCeremony = () => (
   <div className="max-w-4xl mx-auto">
     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
       <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-8 text-white text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-75 animate-pulse"></div>
         <div className="relative z-10">
           <div className="text-6xl mb-4 animate-bounce">🏆</div>
           <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
           <p className="text-yellow-100 text-lg">You've earned the Savings Hero badge!</p>
         </div>
         <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute top-4 left-4 text-yellow-300 animate-ping">✨</div>
           <div className="absolute top-8 right-8 text-yellow-300 animate-ping" style={{animationDelay: '0.5s'}}>⭐</div>
           <div className="absolute bottom-6 left-8 text-yellow-300 animate-ping" style={{animationDelay: '1s'}}>💫</div>
           <div className="absolute bottom-4 right-4 text-yellow-300 animate-ping" style={{animationDelay: '1.5s'}}>✨</div>
         </div>
       </div>
       
       <div className="p-8 text-center">
         <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-300 rounded-2xl p-6 mb-6">
           <div className="text-8xl mb-4">🦸</div>
           <h3 className="text-2xl font-bold text-orange-800 mb-2">Savings Hero</h3>
           <p className="text-orange-700 text-lg mb-4">
             You've learned how to turn $1 into $100 with smart choices and time. That's real-world wizardry! 🎩✨
           </p>
           <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
             <h4 className="font-semibold text-orange-800 mb-2">What you mastered:</h4>
             <div className="text-left space-y-2 text-orange-700">
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Understanding why saving is important for emergencies and dreams</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Learning how compound interest makes money grow over time</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Making smart spending vs saving decisions in real scenarios</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Setting short-term, medium-term, and long-term savings goals</span>
               </div>
             </div>
           </div>
         </div>

         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
           <h4 className="text-xl font-bold text-blue-800 mb-3">🔮 Coming Next Week...</h4>
           <div className="flex items-center justify-center mb-3">
             <div className="text-4xl mr-4">🌱</div>
             <div className="text-left">
               <h5 className="font-semibold text-blue-800">Week 6: Understanding Interest</h5>
               <p className="text-blue-700">Learn how money can grow over time through compound interest!</p>
             </div>
           </div>
         </div>

         <div className="space-y-4">
           <button
             onClick={() => {
               setWeekProgress(prev => ({ ...prev, badge: true }));
               onComplete(5, 'Savings Hero');
             }}
             className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center"
           >
             Continue to Week 6! 
             <ArrowRight className="h-6 w-6 ml-2" />
           </button>
           
           <button
             onClick={onBack}
             className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all"
           >
             Back to Course Overview
           </button>
         </div>

         <div className="mt-6 pt-6 border-t border-gray-200">
           <p className="text-gray-600 mb-3">Share your achievement!</p>
           <div className="flex justify-center space-x-4">
             <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
               📱 Share
             </button>
             <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
               💾 Save Progress
             </button>
           </div>
         </div>
       </div>
     </div>
   </div>
 );

 const renderCurrentStep = () => {
   switch (lessonStep) {
     case 'overview':
       return renderOverview();
     case 'lesson':
       return (
         <LessonComponent
           weekNumber={5}
           title="The Magic of Saving"
           sections={lessonSections}
           onComplete={handleLessonComplete}
           onBack={() => setLessonStep('overview')}
           color="purple"
         />
       );
     case 'savingsGame':
       return renderSavingsSprintGame();
     case 'quiz':
       return (
         <QuizEngine
           questions={quizQuestions}
           onComplete={handleQuizComplete}
           minPassingScore={3}
           maxLives={3}
           showHints={true}
           allowRetry={true}
           color="purple"
         />
       );
     case 'badge':
       return renderBadgeCeremony();
     default:
       return renderOverview();
   }
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
     {renderCurrentStep()}
   </div>
 );
};

export default Week5Component;