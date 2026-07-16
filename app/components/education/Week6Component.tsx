"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Check, Trophy, Star, ArrowRight, ArrowLeft, RotateCcw, X, Award, Calendar, Users, TrendingUp, Building2, Coins, DollarSign, Brain } from 'lucide-react';
import Badge from '../shared/Badge';
import ProgressBar from '../shared/ProgressBar';
import QuizEngine, { QuizQuestion } from '../shared/QuizEngine';
import LessonComponent, { LessonSection } from '../shared/LessonComponent';

interface Week6Props {
  onComplete: (weekNumber: number, badge: string) => void;
  onBack: () => void;
}

interface WeekProgress {
  lesson: boolean;
  interestGame: boolean;
  quiz: boolean;
  badge: boolean;
}

interface GameState {
  round: number;
  totalMoney: number;
  savedMoney: number;
  borrowedMoney: number;
  interestEarned: number;
  interestPaid: number;
  choices: Array<{round: number, action: string, amount: number, result: string}>;
}

const Week6Component: React.FC<Week6Props> = ({ onComplete, onBack }) => {
  const [lessonStep, setLessonStep] = useState('overview');
  const [interestGameCompleted, setInterestGameCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  
  // Interest Game State
  const [gameState, setGameState] = useState<GameState>({
    round: 1,
    totalMoney: 200,
    savedMoney: 0,
    borrowedMoney: 0,
    interestEarned: 0,
    interestPaid: 0,
    choices: []
  });
  
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [lastChoice, setLastChoice] = useState<{action: string, amount: number, result: string} | null>(null);

  const [weekProgress, setWeekProgress] = useState<WeekProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('week6Progress');
      return saved ? JSON.parse(saved) : {
        lesson: false,
        interestGame: false,
        quiz: false,
        badge: false
      };
    }
    return {
      lesson: false,
      interestGame: false,
      quiz: false,
      badge: false
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('week6Progress', JSON.stringify(weekProgress));
    }
  }, [weekProgress]);

  // Quiz question pool — 4 drawn randomly each attempt
  const quizQuestions: QuizQuestion[] = [
    { question: "What is interest?", options: ["Free money from the government", "Extra money earned when saving or paid when borrowing", "A type of tax on your income"], correct: 1, explanation: "Interest is extra money! You earn it when you save (bank pays you) and pay it when you borrow (you pay the bank).", hint: "Think about what happens when you put money in a bank or borrow.", difficulty: 'easy' },
    { question: "If you borrow $100 at 10% interest, how much do you owe?", options: ["$100", "$110", "$90"], correct: 1, explanation: "You owe the original $100 PLUS 10% interest ($10) = $110 total!", hint: "You pay back the original amount plus the interest charge.", difficulty: 'easy' },
    { question: "What's the key difference between simple and compound interest?", options: ["Simple interest is easier to calculate", "Compound interest earns interest on previous interest earned", "Simple interest pays more money"], correct: 1, explanation: "Compound interest is magic! You earn interest on your original money AND on interest already earned. It grows exponentially!", hint: "Think about earning rewards on your rewards.", difficulty: 'medium' },
    { question: "Which earns more money over 5 years at the same rate?", options: ["Simple interest", "Compound interest", "They earn exactly the same"], correct: 1, explanation: "Compound interest always earns more over time because your interest starts earning interest too — it's a money snowball!", hint: "Which one lets your interest earn more interest?", difficulty: 'medium' },
    { question: "What is APR?", options: ["Annual Profit Rate — how much profit banks make", "Annual Percentage Rate — the yearly cost of borrowing money", "A type of bank account"], correct: 1, explanation: "APR is the Annual Percentage Rate — it tells you the yearly cost of a loan or credit card. Lower APR = cheaper to borrow!", hint: "It's the rate you pay when you borrow.", difficulty: 'medium' },
    { question: "You save $500 at 5% simple interest for 2 years. How much interest do you earn?", options: ["$25", "$50", "$500"], correct: 1, explanation: "Simple interest: $500 × 5% = $25/year × 2 years = $50 total interest earned!", hint: "Calculate 5% of $500, then multiply by 2 years.", difficulty: 'medium' },
    { question: "Which is better for SAVING money?", options: ["Simple interest account", "Compound interest account", "They're equally good"], correct: 1, explanation: "Compound interest is better for savings because you earn interest on your growing balance, not just the original deposit. Your money grows faster!", hint: "More growth over time is always better when saving.", difficulty: 'easy' },
    { question: "Which is worse for BORROWING money?", options: ["Simple interest loan", "Compound interest loan", "They're equally bad"], correct: 1, explanation: "Compound interest on debt is dangerous because you owe interest on interest — debt can spiral quickly! Always prefer simple interest when borrowing.", hint: "Interest on interest hurts when you're the one paying.", difficulty: 'medium' },
    { question: "If a credit card charges 20% APR and you carry a $500 balance all year, roughly how much interest do you pay?", options: ["$20", "$100", "$500"], correct: 1, explanation: "20% of $500 = $100 in interest over a year. That's a very expensive way to borrow — credit card debt can be crushing!", hint: "Calculate 20% of $500.", difficulty: 'medium' },
    { question: "How does the bank use your deposited money?", options: ["Keeps it locked in a vault just for you", "Lends it to other customers and pays you interest for using it", "Invests it in the stock market for you"], correct: 1, explanation: "Banks are intermediaries — they take your deposits and lend them to other people at higher rates, paying you a portion as savings interest!", hint: "Think about what banks do with the money you deposit.", difficulty: 'hard' },
    { question: "What does 'compounding frequency' mean?", options: ["How often you check your bank account", "How often interest is calculated and added to your balance", "The frequency of bank fees"], correct: 1, explanation: "Compounding frequency is how often interest is added — daily, monthly, or yearly. More frequent compounding = more interest earned over time!", hint: "Think about whether interest is added every day vs. once a year.", difficulty: 'hard' },
    { question: "You invest $1,000 at 7% compound interest for 10 years. Your money approximately:", options: ["Doubles", "Stays the same", "Triples"], correct: 0, explanation: "At 7% compound interest, money roughly doubles in 10 years (Rule of 72: 72÷7≈10 years). $1,000 becomes about $2,000!", hint: "Use the Rule of 72: 72 ÷ 7 = about 10 years to double.", difficulty: 'hard' },
    { question: "What is a loan?", options: ["Money a bank gives you that you don't have to repay", "Money you borrow that must be repaid with interest", "A type of savings plan"], correct: 1, explanation: "A loan is borrowed money you must repay over time, plus interest. The interest is the bank's fee for lending you money!", hint: "Loans are always temporary — they must be paid back.", difficulty: 'easy' },
    { question: "Why is it important to understand interest before borrowing?", options: ["It isn't important — just borrow what you need", "So you know the true total cost of what you're borrowing", "To impress the bank manager"], correct: 1, explanation: "Interest can make something cost much more than the original price. Understanding it helps you decide if borrowing is worth it and which loan is cheapest!", hint: "The sticker price isn't the full price when borrowing.", difficulty: 'medium' },
    { question: "What happens if you only pay the minimum payment on a credit card each month?", options: ["You pay it off quickly", "The balance stays high and interest keeps growing, costing you much more", "The bank rewards you with lower rates"], correct: 1, explanation: "Minimum payments barely cover interest — the principal barely shrinks, and interest keeps accumulating. A $1,000 balance could take years and cost double to pay off!", hint: "Think about what happens when interest is added faster than you're paying.", difficulty: 'hard' },
    { question: "Which loan scenario costs you LESS overall?", options: ["$1,000 loan at 20% APR for 1 year", "$1,000 loan at 5% APR for 1 year", "Both cost the same"], correct: 1, explanation: "Lower APR = lower cost! At 5% you pay $50 in interest vs. $200 at 20%. Always compare APRs when choosing between loans!", hint: "Lower interest rate = less money you pay back.", difficulty: 'medium' },
  ];

  // Lesson sections for Week 6
  const lessonSections: LessonSection[] = [
    {
      id: 'opening-thought',
      title: 'Would You Lend Me $100? 🤔',
      type: 'activity',
      content: (
        <div>
          <div className="bg-blue-100 p-6 rounded-lg mb-4">
            <p className="text-lg text-blue-800 mb-4">
              <strong>Imagine this scenario:</strong> I need to borrow $100 from you today, and I promise to give it back next week.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-red-300">
                <h4 className="font-bold text-red-700 mb-2">Option A:</h4>
                <p className="text-red-600">I give you back exactly $100 next week</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-300">
                <h4 className="font-bold text-green-700 mb-2">Option B:</h4>
                <p className="text-green-600">I give you back $110 next week</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-yellow-800 mb-3">🤔 Think About It:</h4>
            <ul className="text-yellow-700 space-y-2">
              <li>• Which option would you choose and why?</li>
              <li>• Why might you want to be paid back MORE than you gave?</li>
              <li>• What if I never paid you back at all?</li>
              <li>• What risks are you taking by lending money?</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              💡 <strong>The Big Idea:</strong> Charging extra money (like that $10) is called <strong>INTEREST</strong>! 
              It protects the lender and rewards them for taking the risk of lending their money.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'what-is-interest',
      title: 'What Is Interest? 💰',
      type: 'example',
      content: (
        <div>
          <p className="text-lg mb-4">
            <strong>Interest</strong> is extra money that moves between savers and borrowers. It works both ways!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">💰</div>
                <h4 className="font-bold text-green-800">When You SAVE</h4>
              </div>
              <div className="bg-white p-4 rounded border border-green-300">
                <p className="text-green-700 mb-2"><strong>Example:</strong></p>
                <p className="text-green-600">You put $100 in a bank</p>
                <p className="text-green-600">Bank pays you $5 after 1 year</p>
                <p className="font-bold text-green-800">You EARNED $5 interest! 🎉</p>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🏦</div>
                <h4 className="font-bold text-red-800">When You BORROW</h4>
              </div>
              <div className="bg-white p-4 rounded border border-red-300">
                <p className="text-red-700 mb-2"><strong>Example:</strong></p>
                <p className="text-red-600">You borrow $100 for concert ticket</p>
                <p className="text-red-600">You pay back $110 later</p>
                <p className="font-bold text-red-800">You PAID $10 interest! 💸</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-4">🧠 Quick Activity: Interest or Not?</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl mb-1">🏦</div>
                <p className="text-sm font-medium">Savings Account</p>
                <p className="text-xs text-green-600">Earn Interest ✓</p>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl mb-1">💳</div>
                <p className="text-sm font-medium">Credit Card</p>
                <p className="text-xs text-red-600">Pay Interest ✗</p>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl mb-1">🎮</div>
                <p className="text-sm font-medium">Buy Video Game</p>
                <p className="text-xs text-gray-600">No Interest</p>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl mb-1">🎒</div>
                <p className="text-sm font-medium">Student Loan</p>
                <p className="text-xs text-red-600">Pay Interest ✗</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'simple-vs-compound',
      title: 'Simple vs Compound Interest: The Showdown! 🥊',
      type: 'example',
      content: (
        <div>
          <p className="text-lg mb-4">
            Not all interest is created equal! Let's see the difference between simple and compound interest.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
              <h4 className="font-bold text-yellow-800 mb-4">🪙 Simple Interest</h4>
              <p className="text-yellow-700 mb-3">You earn interest only on your original money.</p>
              <div className="bg-white p-4 rounded border border-yellow-400">
                <p className="font-bold text-yellow-800 mb-2">$100 at 10% per year:</p>
                <div className="space-y-1 text-yellow-700">
                  <div className="flex justify-between">
                    <span>Year 1:</span>
                    <span>$100 + $10 = $110</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year 2:</span>
                    <span>$110 + $10 = $120</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year 3:</span>
                    <span>$120 + $10 = $130</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 font-bold">
                    <span>Total Interest:</span>
                    <span>$30</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
              <h4 className="font-bold text-green-800 mb-4">🌱 Compound Interest</h4>
              <p className="text-green-700 mb-3">You earn interest on your money AND on previous interest!</p>
              <div className="bg-white p-4 rounded border border-green-400">
                <p className="font-bold text-green-800 mb-2">$100 at 10% per year:</p>
                <div className="space-y-1 text-green-700">
                  <div className="flex justify-between">
                    <span>Year 1:</span>
                    <span>$100 + $10 = $110</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year 2:</span>
                    <span>$110 + $11 = $121</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year 3:</span>
                    <span>$121 + $12.10 = $133.10</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 font-bold">
                    <span>Total Interest:</span>
                    <span className="text-green-600">$33.10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-purple-800 mb-3">📈 The Magic Grows Over Time!</h4>
            <p className="text-purple-700 mb-3">
              The difference seems small at first, but watch what happens over 10 years:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border border-purple-300 text-center">
                <h5 className="font-bold text-yellow-700">Simple Interest</h5>
                <p className="text-2xl font-bold text-yellow-600">$200</p>
                <p className="text-sm text-yellow-600">($100 interest earned)</p>
              </div>
              <div className="bg-white p-4 rounded border border-purple-300 text-center">
                <h5 className="font-bold text-green-700">Compound Interest</h5>
                <p className="text-2xl font-bold text-green-600">$259</p>
                <p className="text-sm text-green-600">($159 interest earned)</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">🧩 Quick Challenge:</h4>
            <p className="text-blue-700">
              If you leave $100 at 5% compound interest for 10 years, how much will you have? 
              <br/><strong>Answer:</strong> About $163! That's $63 in free money just for waiting! 🎉
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'how-banks-work',
      title: 'How Do Banks Really Work? 🏦',
      type: 'story',
      content: (
        <div>
          <p className="text-lg mb-4">
            Ever wonder what banks actually DO with your money? Let's find out! 🕵️
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-gray-800 mb-4">🎭 Bank Roleplay: The Three Players</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="text-4xl mb-2">😊</div>
                <h5 className="font-bold text-green-800">The Saver</h5>
                <p className="text-green-600 text-sm">Deposits $100 in the bank</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <div className="text-4xl mb-2">🏦</div>
                <h5 className="font-bold text-blue-800">The Bank</h5>
                <p className="text-blue-600 text-sm">The middleman making deals</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg text-center">
                <div className="text-4xl mb-2">🙋</div>
                <h5 className="font-bold text-orange-800">The Borrower</h5>
                <p className="text-orange-600 text-sm">Needs $100 for a loan</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-300 rounded-lg p-6 mb-4">
            <h4 className="font-bold text-blue-800 mb-4">💼 How The Bank Makes Money:</h4>
            <div className="space-y-3">
              <div className="flex items-center bg-green-50 p-3 rounded">
                <span className="text-2xl mr-3">1️⃣</span>
                <p className="text-green-800">Saver deposits <strong>$100</strong> → Bank promises <strong>5% interest</strong> ($5)</p>
              </div>
              <div className="flex items-center bg-orange-50 p-3 rounded">
                <span className="text-2xl mr-3">2️⃣</span>
                <p className="text-orange-800">Bank loans that <strong>$100</strong> to borrower → Charges <strong>10% interest</strong> ($10)</p>
              </div>
              <div className="flex items-center bg-blue-50 p-3 rounded">
                <span className="text-2xl mr-3">3️⃣</span>
                <p className="text-blue-800">Bank collects $10, pays saver $5 → Keeps <strong>$5 profit</strong>! 💰</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-yellow-800 mb-2">🤔 Discussion Questions:</h4>
            <ul className="text-yellow-700 space-y-1">
              <li>• Is it fair that banks keep some profit?</li>
              <li>• Why do banks need to make money?</li>
              <li>• What services do banks provide besides storing money?</li>
              <li>• What would happen if there were no banks?</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              💡 <strong>The Truth:</strong> Banks are middlemen! They connect people who have extra money (savers) 
              with people who need money (borrowers). Everyone benefits, and the bank earns a small profit for providing this service.
            </p>
          </div>
        </div>
      )
    }
  ];

  // Interest Game functions
  const makeGameChoice = (action: 'save' | 'spend' | 'borrow') => {
    const round = gameState.round;
    let newState = { ...gameState };
    let result = '';

    switch (action) {
      case 'save':
        if (newState.totalMoney >= 50) {
          newState.totalMoney -= 50;
          newState.savedMoney += 50;
          const interest = newState.savedMoney * 0.05; // 5% on all saved money
          newState.interestEarned += interest;
          newState.savedMoney += interest;
          result = `Saved $50 + earned $${interest.toFixed(2)} interest!`;
        }
        break;
      case 'spend':
        if (newState.totalMoney >= 50) {
          newState.totalMoney -= 50;
          result = 'Spent $50 on something fun!';
        }
        break;
      case 'borrow':
        newState.totalMoney += 50;
        newState.borrowedMoney += 55; // Must repay $55 ($50 + $5 interest)
        newState.interestPaid += 5;
        result = 'Borrowed $50 (must repay $55 next round)';
        break;
    }

    // Handle debt repayment
    if (newState.borrowedMoney > 0 && newState.totalMoney >= newState.borrowedMoney) {
      newState.totalMoney -= newState.borrowedMoney;
      newState.borrowedMoney = 0;
    }

    const choiceRecord = {
      round,
      action: action.charAt(0).toUpperCase() + action.slice(1),
      amount: 50,
      result
    };

    setLastChoice(choiceRecord);
    setShowRoundResult(true);

    newState.choices.push(choiceRecord);
    setGameState(newState);
  };

  const nextGameRound = () => {
    if (gameState.round >= 5) {
      setInterestGameCompleted(true);
      setWeekProgress(prev => ({ ...prev, interestGame: true }));
    } else {
      setGameState(prev => ({ ...prev, round: prev.round + 1 }));
    }
    setShowRoundResult(false);
    setLastChoice(null);
  };

  const resetInterestGame = () => {
    setGameState({
      round: 1,
      totalMoney: 200,
      savedMoney: 0,
      borrowedMoney: 0,
      interestEarned: 0,
      interestPaid: 0,
      choices: []
    });
    setShowRoundResult(false);
    setLastChoice(null);
    setInterestGameCompleted(false);
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
    setLessonStep('interestGame');
  };

  const getProgressSteps = () => {
    const steps = [];
    if (weekProgress.lesson) steps.push('lesson');
    if (weekProgress.interestGame) steps.push('interestGame');
    if (weekProgress.quiz) steps.push('quiz');
    if (weekProgress.badge) steps.push('badge');
    return steps.length;
  };

  // Render functions
  const renderOverview = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Week 6: Understanding Interest 🌱</h2>
              <p className="text-green-100 mt-2">Learn how money can grow over time through compound interest!</p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Ages 13-16</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>25-30 minutes</span>
                </div>
              </div>
            </div>
            <Badge 
              badge="🌱 Growth Guru"
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
              color="green"
              showSteps
              stepLabels={['Learn', 'Interest Game', 'Quiz', 'Badge']}
              animated
            />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.lesson ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <BookOpen className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Learn</span>
              {weekProgress.lesson && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.interestGame ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Interest Game</span>
              {weekProgress.interestGame && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.quiz ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <Star className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Quiz</span>
              {weekProgress.quiz && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.badge ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <Award className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Badge</span>
              {weekProgress.badge && <Check className="h-4 w-4 ml-auto" />}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">🎯 What You'll Learn</h3>
            <p className="text-green-700">Master the power of interest! Understand how banks work, the difference between simple and compound interest, and make smart financial decisions.</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setLessonStep('lesson')}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              {weekProgress.lesson ? 'Review Interest Lesson' : 'Learn About Interest!'}
              <TrendingUp className="h-5 w-5 ml-2" />
            </button>
            
            {weekProgress.lesson && (
              <button
                onClick={() => setLessonStep('interestGame')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center"
              >
                {weekProgress.interestGame ? 'Review Interest Game' : 'Play Borrow, Save, or Spend Game'}
                <Coins className="h-5 w-5 ml-2" />
              </button>
            )}
            
            {weekProgress.interestGame && (
              <button
                onClick={() => setLessonStep('quiz')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center"
              >
                {weekProgress.quiz ? 'Review Quiz' : 'Take the Interest Quiz'}
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

  const renderInterestGame = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">💰Borrow, Save, or Spend Game</h2>
             <p className="text-blue-100 mt-2">Manage $200 over 5 rounds. Make smart financial choices!</p>
           </div>
           <div className="flex items-center space-x-4">
             <button
               onClick={resetInterestGame}
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
         {interestGameCompleted && (
           <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
             <div className="text-4xl mb-2">🎉</div>
             <h3 className="text-xl font-bold text-green-800 mb-2">Financial Challenge Complete!</h3>
             <p className="text-green-700">
               Final money: ${(gameState.totalMoney + gameState.savedMoney).toFixed(2)} | 
               Interest earned: ${gameState.interestEarned.toFixed(2)} | 
               Interest paid: ${gameState.interestPaid.toFixed(2)}
             </p>
             <p className="text-green-600 text-sm mt-2">
               {gameState.interestEarned > gameState.interestPaid ? "🏆 You earned more interest than you paid! Smart saver!" : "💡 Consider saving more to earn interest instead of paying it!"}
             </p>
           </div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
             {!showRoundResult && !interestGameCompleted ? (
               <div>
                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Round {gameState.round} of 5</h3>
                 <p className="text-gray-600 mb-6">Choose your financial action for this round:</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <button
                     onClick={() => makeGameChoice('save')}
                     disabled={gameState.totalMoney < 50}
                     className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                       gameState.totalMoney >= 50 
                         ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                         : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                     }`}
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">💰</div>
                       <h4 className="font-bold text-green-700 mb-2">Save $50</h4>
                       <p className="text-sm text-green-600">Earn 5% interest on all savings</p>
                       {gameState.totalMoney < 50 && <p className="text-xs text-red-500 mt-2">Need $50 to save</p>}
                     </div>
                   </button>

                   <button
                     onClick={() => makeGameChoice('spend')}
                     disabled={gameState.totalMoney < 50}
                     className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                       gameState.totalMoney >= 50 
                         ? 'border-purple-200 bg-purple-50 hover:bg-purple-100' 
                         : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                     }`}
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">🛍️</div>
                       <h4 className="font-bold text-purple-700 mb-2">Spend $50</h4>
                       <p className="text-sm text-purple-600">Buy something fun right now</p>
                       {gameState.totalMoney < 50 && <p className="text-xs text-red-500 mt-2">Need $50 to spend</p>}
                     </div>
                   </button>

                   <button
                     onClick={() => makeGameChoice('borrow')}
                     className="p-6 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-all transform hover:scale-105"
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">🏦</div>
                       <h4 className="font-bold text-red-700 mb-2">Borrow $50</h4>
                       <p className="text-sm text-red-600">Must repay $55 (10% interest)</p>
                     </div>
                   </button>
                 </div>
               </div>
             ) : showRoundResult ? (
               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                 <h3 className="text-xl font-bold text-yellow-800 mb-4">Round {gameState.round} Result</h3>
                 <div className="text-4xl mb-4">
                   {lastChoice?.action === 'Save' ? '💰' : 
                    lastChoice?.action === 'Spend' ? '🛍️' : '🏦'}
                 </div>
                 <p className="text-lg font-semibold text-yellow-700 mb-4">
                   {lastChoice?.result}
                 </p>
                 {gameState.borrowedMoney > 0 && (
                   <div className="bg-red-100 p-3 rounded-lg mb-4">
                     <p className="text-red-700 font-medium">
                       ⚠️ Outstanding debt: ${gameState.borrowedMoney.toFixed(2)}
                     </p>
                   </div>
                 )}
                 <button
                   onClick={nextGameRound}
                   className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
                 >
                   {gameState.round >= 5 ? 'See Final Results' : 'Next Round'}
                 </button>
               </div>
             ) : (
               <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                 <h3 className="text-xl font-bold text-blue-800 mb-4">🏁 Game Complete!</h3>
                 <div className="space-y-3 mb-6">
                   <div className="flex justify-between">
                     <span className="text-blue-700">Cash on Hand:</span>
                     <span className="font-bold text-blue-800">${gameState.totalMoney.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-green-700">Money Saved:</span>
                     <span className="font-bold text-green-800">${gameState.savedMoney.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-green-700">Interest Earned:</span>
                     <span className="font-bold text-green-800">${gameState.interestEarned.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-red-700">Interest Paid:</span>
                     <span className="font-bold text-red-800">${gameState.interestPaid.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between border-t pt-2">
                     <span className="text-gray-700">Total Worth:</span>
                     <span className="font-bold text-lg">${(gameState.totalMoney + gameState.savedMoney).toFixed(2)}</span>
                   </div>
                 </div>
                 
                 <div className="bg-white p-4 rounded border border-blue-300">
                   <h4 className="font-semibold text-blue-800 mb-2">Your Financial Journey:</h4>
                   <div className="max-h-40 overflow-y-auto space-y-1">
                     {gameState.choices.map((choice, index) => (
                       <div key={index} className="text-sm text-blue-700">
                         Round {choice.round}: {choice.result}
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
                   <span className="text-blue-700">💵 Cash:</span>
                   <span className="font-bold text-blue-800">${gameState.totalMoney.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-green-700">💰 Saved:</span>
                   <span className="font-bold text-green-800">${gameState.savedMoney.toFixed(2)}</span>
                 </div>
                 {gameState.borrowedMoney > 0 && (
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-red-700">🏦 Debt:</span>
                     <span className="font-bold text-red-800">${gameState.borrowedMoney.toFixed(2)}</span>
                   </div>
                 )}
                 <div className="flex justify-between items-center border-t pt-2">
                   <span className="text-gray-700">💎 Net Worth:</span>
                   <span className="font-bold text-lg">${(gameState.totalMoney + gameState.savedMoney - gameState.borrowedMoney).toFixed(2)}</span>
                 </div>
               </div>
               
               <div className="bg-green-100 p-3 rounded">
                 <div className="text-center">
                   <span className="text-green-700 text-sm">Interest Earned</span>
                   <div className="text-2xl font-bold text-green-800">${gameState.interestEarned.toFixed(2)}</div>
                 </div>
               </div>

               <div className="bg-red-100 p-3 rounded">
                 <div className="text-center">
                   <span className="text-red-700 text-sm">Interest Paid</span>
                   <div className="text-2xl font-bold text-red-800">${gameState.interestPaid.toFixed(2)}</div>
                 </div>
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
                 <li>• Saving earns you interest</li>
                 <li>• Borrowing costs you interest</li>
                 <li>• Interest compounds over time</li>
                 <li>• Think long-term!</li>
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

           {interestGameCompleted ? (
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
           <p className="text-yellow-100 text-lg">You've earned the Growth Guru badge!</p>
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
           <div className="text-8xl mb-4">🌱</div>
           <h3 className="text-2xl font-bold text-orange-800 mb-2">Growth Guru</h3>
           <p className="text-orange-700 text-lg mb-4">
             You've unlocked the secrets of interest — and you'll never look at saving or borrowing the same way again!
           </p>
           <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
             <h4 className="font-semibold text-orange-800 mb-2">What you mastered:</h4>
             <div className="text-left space-y-2 text-orange-700">
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Understanding how interest works for savers and borrowers</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Learning the difference between simple and compound interest</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Discovering how banks make money as middlemen</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Making smart decisions about borrowing, saving, and spending</span>
               </div>
             </div>
           </div>
         </div>

         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
           <h4 className="text-xl font-bold text-blue-800 mb-3">🔮 Coming Next Week...</h4>
           <div className="flex items-center justify-center mb-3">
             <div className="text-4xl mr-4">🛡️</div>
             <div className="text-left">
               <h5 className="font-semibold text-blue-800">Week 7: Credit and Debt Basics</h5>
               <p className="text-blue-700">Learn about borrowing money and using credit responsibly!</p>
             </div>
           </div>
         </div>

         <div className="space-y-4">
           <button
             onClick={() => {
               setWeekProgress(prev => ({ ...prev, badge: true }));
               onComplete(6, 'Growth Guru');
             }}
             className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center"
           >
             Continue to Week 7! 
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
           weekNumber={6}
           title="Understanding Interest"
           sections={lessonSections}
           onComplete={handleLessonComplete}
           onBack={() => setLessonStep('overview')}
           color="green"
         />
       );
     case 'interestGame':
       return renderInterestGame();
     case 'quiz':
       return (
         <QuizEngine
           questions={quizQuestions}
           onComplete={handleQuizComplete}
           minPassingScore={3}
           maxLives={3}
           showHints={true}
           allowRetry={true}
           color="green"
         />
       );
     case 'badge':
       return renderBadgeCeremony();
     default:
       return renderOverview();
   }
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
     {renderCurrentStep()}
   </div>
 );
};

export default Week6Component;