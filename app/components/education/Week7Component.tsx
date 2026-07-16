"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Check, Trophy, Star, ArrowRight, ArrowLeft, RotateCcw, X, Award, Calendar, Users, CreditCard, AlertTriangle, TrendingDown, Shield, Zap } from 'lucide-react';
import Badge from '../shared/Badge';
import ProgressBar from '../shared/ProgressBar';
import QuizEngine, { QuizQuestion } from '../shared/QuizEngine';
import LessonComponent, { LessonSection } from '../shared/LessonComponent';

interface Week7Props {
  onComplete: (weekNumber: number, badge: string) => void;
  onBack: () => void;
}

interface WeekProgress {
  lesson: boolean;
  debtGame: boolean;
  quiz: boolean;
  badge: boolean;
}

interface DebtGameState {
  round: number;
  cash: number;
  debt: number;
  creditScore: number;
  totalDebt: number;
  choices: Array<{
    round: number;
    event: string;
    choice: string;
    amount: number;
    paymentMethod: string;
    consequence: string;
  }>;
}

const Week7Component: React.FC<Week7Props> = ({ onComplete, onBack }) => {
  const [lessonStep, setLessonStep] = useState('overview');
  const [debtGameCompleted, setDebtGameCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  
  // Debt Dominoes Game State
  const [gameState, setGameState] = useState<DebtGameState>({
    round: 1,
    cash: 500,
    debt: 0,
    creditScore: 700,
    totalDebt: 0,
    choices: []
  });
  
  const [currentEvent, setCurrentEvent] = useState<{
    title: string;
    description: string;
    amount: number;
    emoji: string;
  } | null>(null);
  
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [lastChoice, setLastChoice] = useState<{
    choice: string;
    paymentMethod: string;
    consequence: string;
  } | null>(null);

  // Game events
  const gameEvents = [
    {
      title: "Phone Bill Surprise",
      description: "Your phone bill is higher than expected this month",
      amount: 80,
      emoji: "📱"
    },
    {
      title: "School Trip",
      description: "Amazing educational trip opportunity",
      amount: 120,
      emoji: "🎒"
    },
    {
      title: "Friend's Birthday",
      description: "Your best friend's birthday party - need a gift",
      amount: 50,
      emoji: "🎂"
    },
    {
      title: "Textbook Emergency",
      description: "Need textbooks for new semester",
      amount: 90,
      emoji: "📚"
    },
    {
      title: "Broken Headphones",
      description: "Your headphones broke and you need new ones",
      amount: 60,
      emoji: "🎧"
    }
  ];

  const [weekProgress, setWeekProgress] = useState<WeekProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('week7Progress');
      return saved ? JSON.parse(saved) : {
        lesson: false,
        debtGame: false,
        quiz: false,
        badge: false
      };
    }
    return {
      lesson: false,
      debtGame: false,
      quiz: false,
      badge: false
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('week7Progress', JSON.stringify(weekProgress));
    }
  }, [weekProgress]);

  // Initialize first event
  useEffect(() => {
    if (gameState.round <= 5 && !currentEvent && !showRoundResult && !debtGameCompleted) {
      setCurrentEvent(gameEvents[gameState.round - 1]);
    }
  }, [gameState.round, currentEvent, showRoundResult, debtGameCompleted]);

  // Quiz questions for Week 7
  const quizQuestions: QuizQuestion[] = [
    {
      question: "What is debt?",
      options: [
        "Free money from the government",
        "Money you owe to someone else", 
        "Money you found on the street"
      ],
      correct: 1,
      explanation: "Debt is money you owe! When you borrow money or use credit, you create debt that must be paid back, usually with interest.",
      hint: "Think about what happens after you borrow money.",
      difficulty: 'easy'
    },
    {
      question: "Which of these is considered 'good debt'?",
      options: [
        "Buying expensive shoes on a credit card",
        "Taking a student loan for education",
        "Borrowing money to buy video games"
      ],
      correct: 1,
      explanation: "Student loans are 'good debt' because education helps build your future earning potential! Good debt helps you grow.",
      hint: "Think about which debt helps build your future.",
      difficulty: 'medium'
    },
    {
      question: "What happens if you don't pay your credit card bill on time?",
      options: [
        "Nothing happens",
        "You get charged interest and fees",
        "You get extra money"
      ],
      correct: 1,
      explanation: "Late payments result in interest charges, late fees, and damage to your credit score. It's expensive to be late!",
      hint: "Credit card companies charge you for being late.",
      difficulty: 'easy'
    },
    {
      question: "What is a credit score?",
      options: [
        "How much money you have in the bank",
        "A grade that shows how responsible you are with credit",
        "The number of credit cards you own"
      ],
      correct: 1,
      explanation: "A credit score is like a grade (300-850) that shows lenders how responsible you are with borrowed money. Higher scores = better rates!",
      hint: "Think of it like a report card for your money behavior.",
      difficulty: 'medium'
    }
  ];

  // Lesson sections for Week 7
  const lessonSections: LessonSection[] = [
    {
      id: 'warm-up',
      title: 'The $400 Gaming Console Dilemma 🎮',
      type: 'activity',
      content: (
        <div>
          <div className="bg-blue-100 p-6 rounded-lg mb-4">
            <p className="text-lg text-blue-800 mb-4">
              <strong>Imagine this scenario:</strong> You want to buy a $400 gaming console, but you only have $100 saved up. 💰
            </p>
            <div className="bg-white p-4 rounded-lg mb-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎮</div>
                <p className="font-bold text-purple-600 text-xl">Gaming Console: $400</p>
                <p className="text-red-600">Your money: $100</p>
                <p className="text-red-800 font-bold">You're $300 short! 😱</p>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded border border-green-300">
              <p className="text-green-800 font-medium">
                💳 <strong>A credit company says:</strong> "No problem! We'll pay for it right now. 
                You just pay us back $50 a month for 10 months."
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-yellow-800 mb-3">🤔 Think About It:</h4>
            <ul className="text-yellow-700 space-y-2">
              <li>• Would you take this deal?</li>
              <li>• What if they added $100 in fees? (Total cost = $500)</li>
              <li>• What are the risks of this choice?</li>
              <li>• What if you can't make the $50 payments?</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">
              ⚠️ <strong>Welcome to the world of CREDIT!</strong> It can be incredibly useful when used wisely, 
              but dangerous and expensive when misused. Let's learn how to use it smartly!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'what-is-credit-debt',
      title: 'What Are Credit and Debt? 💳',
      type: 'example',
      content: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">💳</div>
                <h4 className="font-bold text-blue-800">CREDIT</h4>
              </div>
              <p className="text-blue-700 text-center mb-3">
                Someone lets you use money now, with a promise to pay it back later
              </p>
              <div className="bg-white p-3 rounded border border-blue-300">
                <p className="text-blue-600 text-sm font-medium">Examples:</p>
                <ul className="text-blue-600 text-sm space-y-1">
                  <li>• Credit cards</li>
                  <li>• Student loans</li>
                  <li>• Car loans</li>
                  <li>• Borrowing from friends</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">💸</div>
                <h4 className="font-bold text-red-800">DEBT</h4>
              </div>
              <p className="text-red-700 text-center mb-3">
                The money you owe after using credit
              </p>
              <div className="bg-white p-3 rounded border border-red-300">
                <p className="text-red-600 text-sm font-medium">What you owe:</p>
                <ul className="text-red-600 text-sm space-y-1">
                  <li>• Original amount borrowed</li>
                  <li>• + Interest charges</li>
                  <li>• + Late fees (if any)</li>
                  <li>• = Total debt</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-gray-800 mb-4">🧠 Quick Game: Credit or Not Credit?</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl mb-1">💳</div>
                <p className="text-sm font-medium">Credit Card</p>
                <p className="text-xs text-blue-600">✅ Credit</p>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl mb-1">💰</div>
                <p className="text-sm font-medium">Debit Card</p>
                <p className="text-xs text-gray-600">❌ Not Credit</p>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl mb-1">🤝</div>
                <p className="text-sm font-medium">Friend Loan</p>
                <p className="text-xs text-blue-600">✅ Informal Credit</p>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl mb-1">📱</div>
                <p className="text-sm font-medium">Prepaid Phone</p>
                <p className="text-xs text-gray-600">❌ Not Credit</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">💡 Key Insight:</h4>
            <p className="text-green-700">
              Credit = Borrowing money. Debt = Owing money. 
              The goal is to use credit wisely and pay off debt quickly!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'how-credit-cards-work',
      title: 'How Do Credit Cards Work? 🔄',
      type: 'story',
      content: (
        <div>
          <p className="text-lg mb-4">
            Let's follow the journey of a credit card purchase step by step!
          </p>
          
          <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200 mb-4">
            <h4 className="font-bold text-purple-800 mb-4">📖 Sarah's $100 Jacket Story:</h4>
            <div className="space-y-4">
              <div className="flex items-center bg-white p-4 rounded border border-purple-300">
                <span className="text-2xl mr-4">1️⃣</span>
                <div>
                  <p className="font-semibold text-purple-800">Sarah sees a $100 jacket she loves</p>
                  <p className="text-purple-600 text-sm">She swipes her credit card to buy it</p>
                </div>
              </div>
              
              <div className="flex items-center bg-white p-4 rounded border border-purple-300">
                <span className="text-2xl mr-4">2️⃣</span>
                <div>
                  <p className="font-semibold text-purple-800">Credit card company pays the store $100</p>
                  <p className="text-purple-600 text-sm">Sarah gets the jacket immediately</p>
                </div>
              </div>
              
              <div className="flex items-center bg-white p-4 rounded border border-purple-300">
                <span className="text-2xl mr-4">3️⃣</span>
                <div>
                  <p className="font-semibold text-purple-800">Sarah now owes the credit card company $100</p>
                  <p className="text-purple-600 text-sm">She gets a bill at the end of the month</p>
                </div>
              </div>
              
              <div className="flex items-center bg-yellow-100 p-4 rounded border border-yellow-400">
                <span className="text-2xl mr-4">⚠️</span>
                <div>
                  <p className="font-semibold text-yellow-800">If Sarah pays late...</p>
                  <p className="text-yellow-700 text-sm">She might owe $115 ($100 + $15 interest/fees)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-blue-800 mb-3">📊 The Credit Card Cycle:</h4>
            <div className="flex items-center justify-between text-center">
              <div className="bg-white p-3 rounded shadow">
                <div className="text-2xl mb-1">💳</div>
                <p className="text-xs font-medium">Card Swipe</p>
              </div>
              <ArrowRight className="text-blue-600" />
              <div className="bg-white p-3 rounded shadow">
                <div className="text-2xl mb-1">📧</div>
                <p className="text-xs font-medium">Monthly Bill</p>
              </div>
              <ArrowRight className="text-blue-600" />
              <div className="bg-white p-3 rounded shadow">
                <div className="text-2xl mb-1">💰</div>
                <p className="text-xs font-medium">Payment</p>
              </div>
              <ArrowRight className="text-blue-600" />
              <div className="bg-white p-3 rounded shadow">
                <div className="text-2xl mb-1">📈</div>
                <p className="text-xs font-medium">Credit Score</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-100 p-4 rounded border border-green-300">
              <h5 className="font-bold text-green-800 mb-2">✅ Good Credit Habits:</h5>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Pay on time every month</li>
                <li>• Pay more than the minimum</li>
                <li>• Don't max out your card</li>
                <li>• Only buy what you can afford</li>
              </ul>
            </div>
            <div className="bg-red-100 p-4 rounded border border-red-300">
              <h5 className="font-bold text-red-800 mb-2">❌ Bad Credit Habits:</h5>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Missing payments</li>
                <li>• Only paying minimum forever</li>
                <li>• Maxing out credit limits</li>
                <li>• Buying things you can't afford</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'good-vs-bad-debt',
      title: 'Good Debt vs Bad Debt: The Showdown! ⚖️',
      type: 'tip',
      content: (
        <div>
          <p className="text-lg mb-4">
            Not all debt is created equal! Some debt helps build your future, while other debt can trap you.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">✅</div>
                <h4 className="font-bold text-green-800">GOOD DEBT</h4>
                <p className="text-green-600 text-sm">Helps build your future!</p>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border border-green-200">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">📚</span>
                    <div>
                      <p className="font-semibold text-green-800">Student Loans</p>
                      <p className="text-green-600 text-xs">Education increases earning power</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">🏠</span>
                    <div>
                      <p className="font-semibold text-green-800">Home Mortgage</p>
                      <p className="text-green-600 text-xs">Property can gain value over time</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">💼</span>
                    <div>
                      <p className="font-semibold text-green-800">Business Loan</p>
                      <p className="text-green-600 text-xs">Can generate income and growth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border-2 border-red-300">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">❌</div>
                <h4 className="font-bold text-red-800">BAD DEBT</h4>
                <p className="text-red-600 text-sm">Can trap you financially!</p>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border border-red-200">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">👟</span>
                    <div>
                      <p className="font-semibold text-red-800">Luxury Shopping</p>
                      <p className="text-red-600 text-xs">Buying things you don't need</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-red-200">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">💳</span>
                    <div>
                      <p className="font-semibold text-red-800">Minimum Payments Forever</p>
                      <p className="text-red-600 text-xs">Never paying off the full balance</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-red-200">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">🔄</span>
                    <div>
                      <p className="font-semibold text-red-800">Debt to Pay Debt</p>
                      <p className="text-red-600 text-xs">Borrowing to pay other loans</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-yellow-800 mb-4">🧠 Quick Quiz: Good or Bad Debt?</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border">
                <p className="font-medium text-gray-800 mb-2">📱 Borrowing $800 for the latest iPhone when your current phone works fine</p>
                <p className="text-red-600 font-bold">❌ Bad Debt</p>
                <p className="text-red-500 text-sm">Want, not need + expensive interest</p>
              </div>
              <div className="bg-white p-4 rounded border">
                <p className="font-medium text-gray-800 mb-2">🎓 Taking a reasonable student loan for college</p>
                <p className="text-green-600 font-bold">✅ Good Debt</p>
                <p className="text-green-500 text-sm">Investment in future earning power</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">🎯 The Golden Rule:</h4>
            <p className="text-blue-700">
              Ask yourself: <strong>"Will this debt help me build a better future, or am I just buying something I want right now?"</strong>
              Good debt is an investment. Bad debt is just expensive shopping.
            </p>
          </div>
        </div>
      )
    },
    {
        id: 'credit-score-basics',
        title: "What's a Credit Score? 📊",
        type: 'tip',
        content: (
        <div>
        <p className="text-lg mb-4">
            A credit score is like a <strong>report card for your money behavior</strong>! It shows lenders how trustworthy you are.
        </p>
        
        <div className="bg-blue-100 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-blue-800 mb-4">📈 Credit Score Scale (300-850):</h4>
            <div className="space-y-3">
            <div className="bg-red-100 p-3 rounded border-l-4 border-red-500">
                <div className="flex justify-between items-center">
                <span className="font-bold text-red-800">300-579: Poor</span>
                <span className="text-red-600">😰 Very difficult to get loans</span>
                </div>
            </div>
            <div className="bg-orange-100 p-3 rounded border-l-4 border-orange-500">
                <div className="flex justify-between items-center">
                <span className="font-bold text-orange-800">580-669: Fair</span>
                <span className="text-orange-600">😐 High interest rates</span>
                </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded border-l-4 border-yellow-500">
                <div className="flex justify-between items-center">
                <span className="font-bold text-yellow-800">670-739: Good</span>
                <span className="text-yellow-600">🙂 Decent rates available</span>
                </div>
            </div>
            <div className="bg-green-100 p-3 rounded border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                <span className="font-bold text-green-800">740-799: Very Good</span>
                <span className="text-green-600">😊 Great rates and options</span>
                </div>
            </div>
            <div className="bg-blue-100 p-3 rounded border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                <span className="font-bold text-blue-800">800-850: Excellent</span>
                <span className="text-blue-600">🎉 Best rates and perks</span>
                </div>
            </div>
            </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-gray-800 mb-4">⚖️ What Affects Your Credit Score:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded text-center">
                <div className="text-3xl mb-2">⏰</div>
                <h5 className="font-bold text-green-800">Payment History</h5>
                <p className="text-green-600 text-sm">35% of score</p>
                <p className="text-green-500 text-xs">Pay on time = 👍 Good</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded text-center">
                <div className="text-3xl mb-2">💳</div>
                <h5 className="font-bold text-yellow-800">Credit Usage</h5>
                <p className="text-yellow-600 text-sm">30% of score</p>
                <p className="text-yellow-500 text-xs">Use &lt;30% of limit = 👍 Good</p>
            </div>
            <div className="bg-blue-100 p-4 rounded text-center">
                <div className="text-3xl mb-2">📅</div>
                <h5 className="font-bold text-blue-800">Credit History</h5>
                <p className="text-blue-600 text-sm">15% of score</p>
                <p className="text-blue-500 text-xs">Longer history = 👍 Good</p>
            </div>
            </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-bold text-purple-800 mb-2">🏆 Pro Tips for Building Good Credit:</h4>
            <ul className="text-purple-700 space-y-1">
            <li>• <strong>Always pay on time</strong> - even if it's just the minimum</li>
            <li>• <strong>Keep balances low</strong> - use less than 30% of your credit limit</li>
            <li>• <strong>Don't close old credit cards</strong> - longer history helps</li>
            <li>• <strong>Check your credit report</strong> - look for errors</li>
            </ul>
        </div>
        </div>
        )
    }
  ];

  // Debt Dominoes Game functions
  const makeGameChoice = (paymentMethod: 'cash' | 'credit' | 'loan') => {
    if (!currentEvent) return;

    const round = gameState.round;
    const amount = currentEvent.amount;
    let newState = { ...gameState };
    let consequence = '';

    switch (paymentMethod) {
      case 'cash':
        if (newState.cash >= amount) {
          newState.cash -= amount;
          consequence = `Paid $${amount} in cash. No debt added!`;
          newState.creditScore += 5; // Good financial behavior
        } else {
          consequence = `Not enough cash! Need $${amount - newState.cash} more.`;
          return; // Don't proceed if insufficient cash
        }
        break;
      case 'credit':
        const interest = Math.round(amount * 0.1); // 10% interest
        const totalCost = amount + interest;
        newState.debt += totalCost;
        newState.totalDebt += totalCost;
        consequence = `Used credit card. Will owe $${totalCost} ($${amount} + $${interest} interest)`;
       newState.creditScore -= 3; // Using credit impacts score slightly
       break;
     case 'loan':
       newState.cash += amount;
       newState.debt += Math.round(amount * 1.15); // 15% total cost for loan
       newState.totalDebt += Math.round(amount * 1.15);
       consequence = `Took a loan for $${amount}. Must repay $${Math.round(amount * 1.15)} total.`;
       newState.creditScore -= 8; // Loans impact score more
       break;
   }

   // Ensure credit score stays within bounds
   newState.creditScore = Math.max(300, Math.min(850, newState.creditScore));

   const choiceRecord = {
     round,
     event: currentEvent.title,
     choice: `${currentEvent.title} - $${amount}`,
     amount,
     paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
     consequence
   };

   setLastChoice({
     choice: choiceRecord.choice,
     paymentMethod: choiceRecord.paymentMethod,
     consequence
   });

   newState.choices.push(choiceRecord);
   setGameState(newState);
   setShowRoundResult(true);
   setCurrentEvent(null);
 };

 const nextGameRound = () => {
   if (gameState.round >= 5) {
     setDebtGameCompleted(true);
     setWeekProgress(prev => ({ ...prev, debtGame: true }));
   } else {
     setGameState(prev => ({ ...prev, round: prev.round + 1 }));
     setCurrentEvent(gameEvents[gameState.round]); // Set next event
   }
   setShowRoundResult(false);
   setLastChoice(null);
 };

 const resetDebtGame = () => {
   setGameState({
     round: 1,
     cash: 500,
     debt: 0,
     creditScore: 700,
     totalDebt: 0,
     choices: []
   });
   setCurrentEvent(gameEvents[0]); // Reset to first event
   setShowRoundResult(false);
   setLastChoice(null);
   setDebtGameCompleted(false);
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
   setLessonStep('debtGame');
 };

 const getProgressSteps = () => {
   const steps = [];
   if (weekProgress.lesson) steps.push('lesson');
   if (weekProgress.debtGame) steps.push('debtGame');
   if (weekProgress.quiz) steps.push('quiz');
   if (weekProgress.badge) steps.push('badge');
   return steps.length;
 };

 // Render functions
 const renderOverview = () => (
   <div className="max-w-4xl mx-auto">
     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
       <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 text-white">
         <div className="flex items-center justify-between">
           <div>
             <h2 className="text-2xl font-bold">Week 7: Credit and Debt Basics 🛡️</h2>
             <p className="text-red-100 mt-2">Learn about borrowing money and using credit responsibly!</p>
             <div className="flex items-center space-x-4 mt-3 text-sm">
               <div className="flex items-center">
                 <Users className="h-4 w-4 mr-1" />
                 <span>Ages 13-16</span>
               </div>
               <div className="flex items-center">
                 <Calendar className="h-4 w-4 mr-1" />
                 <span>35-40 minutes</span>
               </div>
             </div>
           </div>
           <Badge 
             badge="🛡️ Credit Guardian"
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
             color="orange"
             showSteps
             stepLabels={['Learn', 'Debt Game', 'Quiz', 'Badge']}
             animated
           />
         </div>

         <div className="grid grid-cols-4 gap-4 mb-6">
           <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.lesson ? 'bg-orange-100 text-orange-700' : 'bg-gray-100'}`}>
             <BookOpen className="h-5 w-5 mr-2" />
             <span className="text-sm font-medium">Learn</span>
             {weekProgress.lesson && <Check className="h-4 w-4 ml-auto" />}
           </div>
           <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.debtGame ? 'bg-orange-100 text-orange-700' : 'bg-gray-100'}`}>
             <CreditCard className="h-5 w-5 mr-2" />
             <span className="text-sm font-medium">Debt Game</span>
             {weekProgress.debtGame && <Check className="h-4 w-4 ml-auto" />}
           </div>
           <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.quiz ? 'bg-orange-100 text-orange-700' : 'bg-gray-100'}`}>
             <Star className="h-5 w-5 mr-2" />
             <span className="text-sm font-medium">Quiz</span>
             {weekProgress.quiz && <Check className="h-4 w-4 ml-auto" />}
           </div>
           <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.badge ? 'bg-orange-100 text-orange-700' : 'bg-gray-100'}`}>
             <Award className="h-5 w-5 mr-2" />
             <span className="text-sm font-medium">Badge</span>
             {weekProgress.badge && <Check className="h-4 w-4 ml-auto" />}
           </div>
         </div>

         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
           <h3 className="font-semibold text-orange-900 mb-2">🎯 What You'll Learn</h3>
           <p className="text-orange-700">Master credit and debt! Understand how credit cards work, distinguish good debt from bad debt, learn about credit scores, and practice responsible borrowing decisions.</p>
         </div>

         <div className="space-y-3">
           <button
             onClick={() => setLessonStep('lesson')}
             className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 flex items-center justify-center"
           >
             {weekProgress.lesson ? 'Review Credit & Debt' : 'Learn About Credit & Debt!'}
             <Shield className="h-5 w-5 ml-2" />
           </button>
           
           {weekProgress.lesson && (
             <button
               onClick={() => setLessonStep('debtGame')}
               className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center"
             >
               {weekProgress.debtGame ? 'Review Debt Dominoes' : 'Play Debt Dominoes Game'}
               <CreditCard className="h-5 w-5 ml-2" />
             </button>
           )}
           
           {weekProgress.debtGame && (
             <button
               onClick={() => setLessonStep('quiz')}
               className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center"
             >
               {weekProgress.quiz ? 'Review Quiz' : 'Take the Credit Quiz'}
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

 const renderDebtDominoesGame = () => (
   <div className="max-w-6xl mx-auto">
     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
       <div className="bg-gradient-to-r from-red-500 to-purple-500 p-6 text-white">
         <div className="flex items-center justify-between">
           <div>
             <h2 className="text-2xl font-bold">🎲 Debt Dominoes Challenge</h2>
             <p className="text-red-100 mt-2">Navigate 5 financial scenarios. Make smart credit decisions!</p>
           </div>
           <div className="flex items-center space-x-4">
             <button
               onClick={resetDebtGame}
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
         {debtGameCompleted && (
           <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
             <div className="text-4xl mb-2">🏁</div>
             <h3 className="text-xl font-bold text-blue-800 mb-2">Financial Challenge Complete!</h3>
             <p className="text-blue-700">
               Final Status: ${gameState.cash} cash | ${gameState.debt} debt | Credit Score: {gameState.creditScore}
             </p>
             <p className="text-blue-600 text-sm mt-2">
               {gameState.debt === 0 ? "🏆 Debt-free! Excellent financial management!" : 
                gameState.debt < 200 ? "💪 Good job keeping debt manageable!" : 
                "💡 Consider focusing on debt reduction strategies!"}
             </p>
           </div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
             {currentEvent && !showRoundResult && !debtGameCompleted ? (
               <div>
                 <h3 className="text-xl font-semibold text-gray-800 mb-2">Round {gameState.round} of 5</h3>
                 <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                   <div className="text-center mb-4">
                     <div className="text-6xl mb-3">{currentEvent.emoji}</div>
                     <h4 className="text-xl font-bold text-yellow-800">{currentEvent.title}</h4>
                     <p className="text-yellow-700">{currentEvent.description}</p>
                     <p className="text-2xl font-bold text-yellow-900 mt-2">Cost: ${currentEvent.amount}</p>
                   </div>
                 </div>
                 
                 <p className="text-gray-600 mb-6">How do you want to pay for this?</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <button
                     onClick={() => makeGameChoice('cash')}
                     disabled={gameState.cash < currentEvent.amount}
                     className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                       gameState.cash >= currentEvent.amount 
                         ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                         : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                     }`}
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">💵</div>
                       <h4 className="font-bold text-green-700 mb-2">Pay Cash</h4>
                       <p className="text-sm text-green-600 mb-2">Use your savings</p>
                       <p className="text-xs text-green-500">✅ No debt, good for credit score</p>
                       {gameState.cash < currentEvent.amount && (
                         <p className="text-xs text-red-500 mt-2">Need ${currentEvent.amount - gameState.cash} more</p>
                       )}
                     </div>
                   </button>

                   <button
                     onClick={() => makeGameChoice('credit')}
                     className="p-6 rounded-xl border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 transition-all transform hover:scale-105"
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">💳</div>
                       <h4 className="font-bold text-orange-700 mb-2">Credit Card</h4>
                       <p className="text-sm text-orange-600 mb-2">Pay later with interest</p>
                       <p className="text-xs text-orange-500">⚠️ +10% interest (${Math.round(currentEvent.amount * 0.1)})</p>
                     </div>
                   </button>

                   <button
                     onClick={() => makeGameChoice('loan')}
                     className="p-6 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-all transform hover:scale-105"
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">🏦</div>
                       <h4 className="font-bold text-red-700 mb-2">Take a Loan</h4>
                       <p className="text-sm text-red-600 mb-2">Get cash now, pay back more</p>
                       <p className="text-xs text-red-500">⚠️ 15% total cost (${Math.round(currentEvent.amount * 1.15)})</p>
                     </div>
                   </button>
                 </div>
               </div>
             ) : showRoundResult ? (
               <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                 <h3 className="text-xl font-bold text-blue-800 mb-4">Round {gameState.round} Result</h3>
                 <div className="text-4xl mb-4">
                   {lastChoice?.paymentMethod === 'Cash' ? '💵' : 
                    lastChoice?.paymentMethod === 'Credit' ? '💳' : '🏦'}
                 </div>
                 <p className="text-lg font-semibold text-blue-700 mb-2">
                   Payment Method: {lastChoice?.paymentMethod}
                 </p>
                 <p className="text-blue-600 mb-4">
                   {lastChoice?.consequence}
                 </p>
                 <button
                   onClick={nextGameRound}
                   className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                 >
                   {gameState.round >= 5 ? 'See Final Results' : 'Next Round'}
                 </button>
               </div>
             ) : (
               <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                 <h3 className="text-xl font-bold text-green-800 mb-4">🏁 Challenge Complete!</h3>
                 <div className="space-y-3 mb-6">
                   <div className="flex justify-between">
                     <span className="text-green-700">Final Cash:</span>
                     <span className="font-bold text-green-800">${gameState.cash}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-red-700">Current Debt:</span>
                     <span className="font-bold text-red-800">${gameState.debt}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-blue-700">Credit Score:</span>
                     <span className="font-bold text-blue-800">{gameState.creditScore}</span>
                   </div>
                   <div className="flex justify-between border-t pt-2">
                     <span className="text-gray-700">Net Worth:</span>
                     <span className="font-bold text-lg">${gameState.cash - gameState.debt}</span>
                   </div>
                 </div>
                 
                 <div className="bg-white p-4 rounded border border-green-300">
                   <h4 className="font-semibold text-green-800 mb-2">Your Financial Journey:</h4>
                   <div className="max-h-40 overflow-y-auto space-y-2">
                     {gameState.choices.map((choice, index) => (
                       <div key={index} className="text-sm">
                         <span className="font-medium text-green-700">Round {choice.round}:</span>
                         <span className="text-green-600 ml-1">{choice.event} - {choice.paymentMethod}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}
           </div>

           <div className="bg-gray-50 rounded-xl p-6">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Dashboard</h3>
             
             <div className="space-y-4 mb-6">
               <div className="bg-white p-4 rounded border">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-green-700">💵 Cash:</span>
                   <span className="font-bold text-green-800">${gameState.cash}</span>
                 </div>
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-red-700">💸 Current Debt:</span>
                   <span className="font-bold text-red-800">${gameState.debt}</span>
                 </div>
                 <div className="flex justify-between items-center border-t pt-2">
                   <span className="text-gray-700">💎 Net Worth:</span>
                   <span className="font-bold text-lg">${gameState.cash - gameState.debt}</span>
                 </div>
               </div>
               
               <div className={`p-3 rounded text-center ${
                 gameState.creditScore >= 740 ? 'bg-green-100' :
                 gameState.creditScore >= 670 ? 'bg-yellow-100' :
                 'bg-red-100'
               }`}>
                 <span className="text-sm font-medium">Credit Score</span>
                 <div className="text-2xl font-bold">{gameState.creditScore}</div>
                 <span className="text-xs">
                   {gameState.creditScore >= 740 ? '✅ Excellent' :
                    gameState.creditScore >= 670 ? '⚠️ Good' :
                    '❌ Needs Work'}
                 </span>
               </div>

               <div className="bg-blue-100 p-3 rounded">
                 <div className="text-center">
                   <span className="text-blue-700 text-sm">Round</span>
                   <div className="text-2xl font-bold text-blue-800">{gameState.round}</div>
                   <span className="text-blue-600 text-sm">of 5</span>
                 </div>
               </div>
             </div>

             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
               <h4 className="font-semibold text-yellow-800 mb-2">💡 Strategy Tips:</h4>
               <ul className="text-sm text-yellow-700 space-y-1">
                 <li>• Cash = No debt + Credit boost</li>
                 <li>• Credit cards add 10% cost</li>
                 <li>• Loans add 15% total cost</li>
                 <li>• High debt hurts credit score</li>
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

           {debtGameCompleted ? (
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
           <p className="text-yellow-100 text-lg">You've earned the Credit Guardian badge!</p>
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
           <div className="text-8xl mb-4">🛡️</div>
           <h3 className="text-2xl font-bold text-orange-800 mb-2">Credit Guardian</h3>
           <p className="text-orange-700 text-lg mb-4">
             You learned how credit and debt work — and how to use them responsibly, not recklessly!
           </p>
           <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
             <h4 className="font-semibold text-orange-800 mb-2">What you mastered:</h4>
             <div className="text-left space-y-2 text-orange-700">
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Understanding credit cards, loans, and how debt works</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Distinguishing between good debt and bad debt</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Learning about credit scores and responsible borrowing</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Making smart financial decisions under pressure</span>
               </div>
             </div>
           </div>
         </div>

         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
           <h4 className="text-xl font-bold text-blue-800 mb-3">🔮 Coming Next Week...</h4>
           <div className="flex items-center justify-center mb-3">
             <div className="text-4xl mr-4">📈</div>
             <div className="text-left">
               <h5 className="font-semibold text-blue-800">Week 8: Investment Fundamentals</h5>
               <p className="text-blue-700">Discover how to make your money work for you through investing!</p>
             </div>
           </div>
         </div>

         <div className="space-y-4">
           <button
             onClick={() => {
               setWeekProgress(prev => ({ ...prev, badge: true }));
               onComplete(7, 'Credit Guardian');
             }}
             className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center"
           >
             Continue to Week 8! 
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
           weekNumber={7}
           title="Credit and Debt Basics"
           sections={lessonSections}
           onComplete={handleLessonComplete}
           onBack={() => setLessonStep('overview')}
           color="orange"
         />
       );
     case 'debtGame':
       return renderDebtDominoesGame();
     case 'quiz':
       return (
         <QuizEngine
           questions={quizQuestions}
           onComplete={handleQuizComplete}
           minPassingScore={3}
           maxLives={3}
           showHints={true}
           allowRetry={true}
           color="orange"
         />
       );
     case 'badge':
       return renderBadgeCeremony();
     default:
       return renderOverview();
   }
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
     {renderCurrentStep()}
   </div>
 );
};

export default Week7Component;