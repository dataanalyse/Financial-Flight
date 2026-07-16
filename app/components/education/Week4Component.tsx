"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Check, Trophy, Star, ArrowRight, ArrowLeft, RotateCcw, X, Award, Calendar, Users, Calculator, DollarSign, PiggyBank, ShoppingCart, Wallet } from 'lucide-react';
import Badge from '../shared/Badge';
import ProgressBar from '../shared/ProgressBar';
import QuizEngine, { QuizQuestion } from '../shared/QuizEngine';
import LessonComponent, { LessonSection } from '../shared/LessonComponent';

interface Week4Props {
  onComplete: (weekNumber: number, badge: string) => void;
  onBack: () => void;
}

interface WeekProgress {
  lesson: boolean;
  simulation: boolean;
  budgetTool: boolean;
  quiz: boolean;
  badge: boolean;
}

interface BudgetItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: 'need' | 'want' | 'savings';
  selected: boolean;
}

interface DigitalBudget {
  income: number;
  needs: number;
  wants: number;
  savings: number;
  emergency: number;
}

const Week4Component: React.FC<Week4Props> = ({ onComplete, onBack }) => {
  const [lessonStep, setLessonStep] = useState('overview');
  const [simulationCompleted, setSimulationCompleted] = useState(false);
  const [budgetToolCompleted, setBudgetToolCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: boolean}>({});
  const [totalSpent, setTotalSpent] = useState(0);
  
  // Digital Budget Tool State
  const [digitalBudget, setDigitalBudget] = useState<DigitalBudget>({
    income: 100,
    needs: 50,
    wants: 30,
    savings: 15,
    emergency: 5
  });

  const [weekProgress, setWeekProgress] = useState<WeekProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('week4Progress');
      return saved ? JSON.parse(saved) : {
        lesson: false,
        simulation: false,
        budgetTool: false,
        quiz: false,
        badge: false
      };
    }
    return {
      lesson: false,
      simulation: false,
      budgetTool: false,
      quiz: false,
      badge: false
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('week4Progress', JSON.stringify(weekProgress));
    }
  }, [weekProgress]);

  // Budget simulation items
  const budgetItems: BudgetItem[] = [
    { id: 'textbook', name: 'Textbook', emoji: '📚', price: 20, category: 'need', selected: false },
    { id: 'pizza', name: 'Pizza Party', emoji: '🍕', price: 15, category: 'want', selected: false },
    { id: 'hat', name: 'Cool Hat', emoji: '🧢', price: 10, category: 'want', selected: false },
    { id: 'lunch', name: 'School Lunch', emoji: '🥪', price: 15, category: 'need', selected: false },
    { id: 'savings', name: 'Put in Savings', emoji: '🏦', price: 10, category: 'savings', selected: false },
    { id: 'juice', name: 'Juice Box', emoji: '🧃', price: 5, category: 'want', selected: false },
    { id: 'gift', name: 'Gift for Friend', emoji: '🎁', price: 10, category: 'want', selected: false },
    { id: 'emergency', name: 'Emergency Fund', emoji: '🆘', price: 5, category: 'savings', selected: false }
  ];

  // Quiz questions for Week 4
  const quizQuestions: QuizQuestion[] = [
    {
      question: "What is a budget?",
      options: [
        "A plan for how you spend and save your money",
        "A list of things you want to buy",
        "Money you get from your parents"
      ],
      correct: 0,
      explanation: "A budget is a plan that helps you decide how to use your money wisely - for spending, saving, and emergencies!",
      hint: "Think about what helps you organize and plan your money.",
      difficulty: 'easy'
    },
    {
      question: "What is a fixed expense?",
      options: [
        "Money you spend on fun things",
        "Money you must pay regularly, like lunch or bus fare",
        "Money you save for later"
      ],
      correct: 1,
      explanation: "Fixed expenses are things you MUST pay regularly - like school lunch, bus passes, or textbooks. They don't change much from month to month.",
      hint: "Think about expenses that are the same every month and you can't avoid.",
      difficulty: 'easy'
    },
    {
      question: "In the 50/30/20 rule, what does the 20% represent?",
      options: [
        "Money for wants and fun",
        "Money for needs and essentials",
        "Money for savings and emergencies"
      ],
      correct: 2,
      explanation: "The 20% in the 50/30/20 rule is for savings and emergency funds! This helps you prepare for the future and unexpected expenses.",
      hint: "This is the money you don't spend right away but keep for later.",
      difficulty: 'medium'
    },
    {
      question: "Why is it important to have an emergency fund?",
      options: [
        "To buy more video games",
        "To handle unexpected expenses like a broken phone",
        "To impress your friends"
      ],
      correct: 1,
      explanation: "An emergency fund helps you when unexpected things happen - like your bike breaking or needing school supplies you forgot. It keeps you prepared!",
      hint: "Think about what happens when something unexpected breaks or you need money urgently.",
      difficulty: 'medium'
    }
  ];

  // Lesson sections for Week 4
  const lessonSections: LessonSection[] = [
    {
      id: 'warm-up',
      title: 'Too Many Plans, Not Enough Cash! 💸',
      type: 'activity',
      content: (
        <div>
          <p className="text-lg mb-4">
            Imagine you just earned <strong>$50</strong> this week! 💰 But you have lots of plans...
          </p>
          <div className="bg-blue-100 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-blue-800 mb-4">🤔 Your Wishlist:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🎟️</div>
                <p className="font-semibold text-gray-800">Movie with Friends</p>
                <p className="text-lg font-bold text-blue-600">$15</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">👕</div>
                <p className="font-semibold text-gray-800">Cool New Hoodie</p>
                <p className="text-lg font-bold text-blue-600">$30</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">📱</div>
                <p className="font-semibold text-gray-800">Phone Recharge</p>
                <p className="text-lg font-bold text-blue-600">$10</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-red-800 mb-2">🧮 The Math Problem:</h4>
            <p className="text-red-700 mb-2">
              <strong>Total wants:</strong> $15 + $30 + $10 = $55
            </p>
            <p className="text-red-700 font-medium">
              <strong>But you only have:</strong> $50
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-bold text-orange-800 mb-2">🤔 Think About It:</h4>
            <ul className="text-orange-700 space-y-1">
              <li>• Can you afford everything?</li>
              <li>• Which things are needs vs wants?</li>
              <li>• Should you save any money?</li>
              <li>• What would YOU choose?</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'what-is-budget',
      title: 'What Is a Budget? 📊',
      type: 'example',
      content: (
        <div>
          <p className="text-lg mb-4">
            A <strong>budget</strong> is like a roadmap for your money! It's a plan that helps you decide how to spend and save.
          </p>
          
          <div className="bg-green-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-green-800 mb-4">🗂️ The 4 Budget Buckets:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">💵</span>
                  <h5 className="font-bold text-green-800">Income</h5>
                </div>
                <p className="text-green-700 text-sm">All the money you receive (allowance, gifts, jobs)</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">✅</span>
                  <h5 className="font-bold text-blue-800">Fixed Expenses</h5>
                </div>
                <p className="text-blue-700 text-sm">Must-pay items (lunch money, school supplies)</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">🌊</span>
                  <h5 className="font-bold text-purple-800">Variable Expenses</h5>
                </div>
                <p className="text-purple-700 text-sm">Flexible spending (snacks, entertainment, wants)</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">💰</span>
                  <h5 className="font-bold text-yellow-800">Savings & Emergency</h5>
                </div>
                <p className="text-yellow-700 text-sm">Money for goals and unexpected expenses</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'jordan-vs-maya',
      title: 'Tale of Two Budgeters: Jordan vs Maya 👥',
      type: 'story',
      content: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
              <h4 className="font-bold text-red-800 mb-3">😰 Jordan's Story</h4>
              <div className="space-y-2 mb-4">
                <p className="text-red-700"><strong>Monthly income:</strong> $40</p>
                <p className="text-red-700"><strong>Spending:</strong> $40 (everything!)</p>
                <p className="text-red-700"><strong>Savings:</strong> $0</p>
              </div>
              <div className="bg-white p-3 rounded border border-red-300">
                <p className="text-red-800 text-sm">
                  <strong>What happened:</strong> Jordan's bike tire popped! 🚲💨 
                  He had no money saved and had to ask his parents for help.
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-green-800 mb-3">😊 Maya's Story</h4>
              <div className="space-y-2 mb-4">
                <p className="text-green-700"><strong>Monthly income:</strong> $40</p>
                <p className="text-green-700"><strong>Spending:</strong> $30</p>
                <p className="text-green-700"><strong>Savings:</strong> $10</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-300">
                <p className="text-green-800 text-sm">
                  <strong>What happened:</strong> After 4 months, Maya had $40 saved! 🎧 
                  She bought the headphones she wanted without asking anyone.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">🧠 The Lesson:</h4>
            <p className="text-blue-700">
              Maya's budget gave her <strong>freedom and security</strong>! She could handle emergencies and buy what she wanted. 
              Jordan spent everything and had no safety net.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'income-vs-expenses',
      title: 'Income vs Expenses: The Money Balance ⚖️',
      type: 'example',
      content: (
        <div>
          <p className="text-lg mb-4">
            The <strong>golden rule</strong> of budgeting: Your expenses should be LESS than your income!
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-gray-800 mb-4">📊 Let's Check Jordan's Budget:</h4>
            <div className="bg-white p-4 rounded border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-green-700 mb-2">💵 Income:</h5>
                  <p className="text-2xl font-bold text-green-600">$60</p>
                </div>
                <div>
                  <h5 className="font-semibold text-red-700 mb-2">💸 Expenses:</h5>
                  <div className="text-red-600 space-y-1">
                    <p>Bus pass: $15</p>
                    <p>Lunch: $10</p>
                    <p>Video game: $30</p>
                    <p>Ice cream: $5</p>
                    <p className="font-bold border-t pt-1">Total: $60</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-yellow-800 mb-2">🤔 Your Turn to Think:</h4>
            <ul className="text-yellow-700 space-y-1">
              <li>• Does Jordan have enough money? (Yes, exactly enough)</li>
              <li>• Did he save anything? (Nope!)</li>
              <li>• What would YOU change?</li>
              <li>• How could he save $10?</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">💡 Smart Budget Tip:</h4>
            <p className="text-green-700">
              Try the <strong>50/30/20 rule</strong>: 50% for needs, 30% for wants, 20% for savings!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'budget-rules',
      title: 'The 50/30/20 Rule: Budget Like a Pro! 📏',
      type: 'tip',
      content: (
        <div>
          <p className="text-lg mb-4">
            Here's a simple formula that many adults use to budget their money:
          </p>
          
          <div className="bg-blue-100 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-blue-800 mb-4 text-center">🧮 The 50/30/20 Rule</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                <div className="text-3xl font-bold mb-2">50%</div>
                <h5 className="font-bold mb-1">NEEDS</h5>
                <p className="text-sm">Food, transport, school supplies</p>
              </div>
              <div className="bg-purple-500 text-white p-4 rounded-lg text-center">
                <div className="text-3xl font-bold mb-2">30%</div>
                <h5 className="font-bold mb-1">WANTS</h5>
                <p className="text-sm">Games, movies, treats</p>
              </div>
              <div className="bg-yellow-500 text-white p-4 rounded-lg text-center">
                <div className="text-3xl font-bold mb-2">20%</div>
                <h5 className="font-bold mb-1">SAVINGS</h5>
                <p className="text-sm">Future goals & emergencies</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-gray-800 mb-3">📊 Example with $100:</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-green-700">50% for Needs:</span>
                <span className="font-bold text-green-700">$50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-700">30% for Wants:</span>
                <span className="font-bold text-purple-700">$30</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-700">20% for Savings:</span>
                <span className="font-bold text-yellow-700">$20</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-bold text-orange-800 mb-2">🎯 Your Challenge:</h4>
            <p className="text-orange-700">
              If you had $80, how would you split it using the 50/30/20 rule? 
              (Hint: $40 needs, $24 wants, $16 savings!)
            </p>
          </div>
        </div>
      )
    }
  ];

  // Budget simulation functions
  const handleItemToggle = (itemId: string) => {
    const item = budgetItems.find(i => i.id === itemId);
    if (!item) return;

    const newSelected = { ...selectedItems };
    newSelected[itemId] = !newSelected[itemId];
    
    let newTotal = 0;
    budgetItems.forEach(budgetItem => {
      if (newSelected[budgetItem.id]) {
        newTotal += budgetItem.price;
      }
    });

    if (newTotal <= 80) {
      setSelectedItems(newSelected);
      setTotalSpent(newTotal);
      
      // Check if simulation is completed
      const hasNeed = budgetItems.some(item => 
        item.category === 'need' && newSelected[item.id]
      );
      const hasSavings = budgetItems.some(item => 
        item.category === 'savings' && newSelected[item.id]
      );
      
      if (hasNeed && hasSavings && newTotal > 0) {
        setSimulationCompleted(true);
        setWeekProgress(prev => ({ ...prev, simulation: true }));
      }
    }
  };

  const resetSimulation = () => {
    setSelectedItems({});
    setTotalSpent(0);
    setSimulationCompleted(false);
  };

  // Digital Budget Tool functions
  const updateBudgetCategory = (category: keyof DigitalBudget, value: number) => {
    setDigitalBudget(prev => ({ ...prev, [category]: value }));
  };

  const getTotalBudget = () => {
    return digitalBudget.needs + digitalBudget.wants + digitalBudget.savings + digitalBudget.emergency;
  };

  const saveBudget = () => {
    localStorage.setItem('userBudget', JSON.stringify(digitalBudget));
    setBudgetToolCompleted(true);
    setWeekProgress(prev => ({ ...prev, budgetTool: true }));
    alert('Budget saved! You can access it anytime from your dashboard.');
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
    setLessonStep('simulation');
  };

  const getProgressSteps = () => {
    const steps = [];
    if (weekProgress.lesson) steps.push('lesson');
    if (weekProgress.simulation) steps.push('simulation');
    if (weekProgress.budgetTool) steps.push('budgetTool');
    if (weekProgress.quiz) steps.push('quiz');
    if (weekProgress.badge) steps.push('badge');
    return steps.length;
  };

  // Render functions
  const renderOverview = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Week 4: Making a Budget 📊</h2>
              <p className="text-blue-100 mt-2">Create your first budget and learn to track your money!</p>
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
              badge="📊 Budget Boss"
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
              total={5} 
              color="blue"
              showSteps
              stepLabels={['Learn', 'Simulate', 'Budget Tool', 'Quiz', 'Badge']}
              animated
            />
          </div>

          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.lesson ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
              <BookOpen className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Learn</span>
              {weekProgress.lesson && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.simulation ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
              <Calculator className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Simulate</span>
              {weekProgress.simulation && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.budgetTool ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
              <Wallet className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Budget Tool</span>
              {weekProgress.budgetTool && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.quiz ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
              <Star className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Quiz</span>
              {weekProgress.quiz && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.badge ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
              <Award className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Badge</span>
              {weekProgress.badge && <Check className="h-4 w-4 ml-auto" />}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">🎯 What You'll Learn</h3>
            <p className="text-blue-700">Master the art of budgeting! Learn to plan your spending, balance needs vs wants, and create your own digital budget tool.</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setLessonStep('lesson')}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              {weekProgress.lesson ? 'Review Budget Lesson' : 'Start Learning About Budgets!'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            
            {weekProgress.lesson && (
              <button
                onClick={() => setLessonStep('simulation')}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all flex items-center justify-center"
              >
                {weekProgress.simulation ? 'Review Budget Simulation' : 'Try Budget Simulation Game'}
                <Calculator className="h-5 w-5 ml-2" />
              </button>
            )}
            
            {weekProgress.simulation && (
              <button
                onClick={() => setLessonStep('budgetTool')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center"
              >
                {weekProgress.budgetTool ? 'Review Digital Budget' : 'Create Your Digital Budget'}
                <Wallet className="h-5 w-5 ml-2" />
              </button>
            )}

            {weekProgress.budgetTool && (
              <button
                onClick={() => setLessonStep('quiz')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center"
              >
                {weekProgress.quiz ? 'Review Quiz' : 'Take the Budget Quiz'}
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

 const renderBudgetSimulation = () => (
   <div className="max-w-6xl mx-auto">
     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
       <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
         <div className="flex items-center justify-between">
           <h2 className="text-2xl font-bold">🎮 Budget Simulation Game</h2>
           <div className="flex items-center space-x-4">
             <button
               onClick={resetSimulation}
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
         <p className="text-green-100 mt-2">You have $80 to spend wisely! Build a balanced budget.</p>
       </div>

       <div className="p-8">
         {simulationCompleted && (
           <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
             <div className="text-4xl mb-2">🎉</div>
             <h3 className="text-xl font-bold text-green-800 mb-2">Great budgeting! You're thinking like a pro!</h3>
             <p className="text-green-700">You included needs AND savings - that's smart money management!</p>
           </div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose items for your budget:</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {budgetItems.map((item) => (
                 <div key={item.id} className="relative">
                   <div
                     className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                       selectedItems[item.id]
                         ? 'border-blue-400 bg-blue-50'
                         : 'border-gray-200 bg-white hover:border-blue-300'
                     }`}
                     onClick={() => handleItemToggle(item.id)}
                   >
                     <div className="text-center">
                       <div className="text-3xl mb-2">{item.emoji}</div>
                       <div className="font-semibold text-gray-800 text-sm mb-1">{item.name}</div>
                       <div className="text-lg font-bold text-blue-600">${item.price}</div>
                       <div className={`text-xs px-2 py-1 rounded-full mt-2 ${
                         item.category === 'need' ? 'bg-green-100 text-green-700' :
                         item.category === 'want' ? 'bg-purple-100 text-purple-700' :
                         'bg-yellow-100 text-yellow-700'
                       }`}>
                         {item.category === 'need' ? 'Need' : item.category === 'want' ? 'Want' : 'Savings'}
                       </div>
                     </div>
                     {selectedItems[item.id] && (
                       <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                         <Check className="h-4 w-4" />
                       </div>
                     )}
                   </div>
                 </div>
               ))}
             </div>
           </div>

           <div className="bg-gray-50 rounded-xl p-6">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Budget Summary</h3>
             
             <div className="space-y-4 mb-6">
               <div className="flex justify-between items-center">
                 <span className="text-gray-600">Available:</span>
                 <span className="text-2xl font-bold text-blue-600">$80</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-gray-600">Spent:</span>
                 <span className="text-2xl font-bold text-red-600">${totalSpent}</span>
               </div>
               <div className="flex justify-between items-center border-t pt-2">
                 <span className="text-gray-600">Remaining:</span>
                 <span className={`text-2xl font-bold ${80 - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                   ${80 - totalSpent}
                 </span>
               </div>
             </div>

             <div className="mb-6">
               <ProgressBar 
                 current={totalSpent} 
                 total={80} 
                 color={totalSpent <= 80 ? 'blue' : 'orange'}
                 showPercentage
               />
             </div>

             <div className="space-y-3">
               <div className="bg-white p-3 rounded border">
                 <div className="flex justify-between">
                   <span className="text-green-700">Needs:</span>
                   <span className="font-semibold">
                     ${budgetItems.filter(item => item.category === 'need' && selectedItems[item.id]).reduce((sum, item) => sum + item.price, 0)}
                   </span>
                 </div>
               </div>
               <div className="bg-white p-3 rounded border">
                 <div className="flex justify-between">
                   <span className="text-purple-700">Wants:</span>
                   <span className="font-semibold">
                     ${budgetItems.filter(item => item.category === 'want' && selectedItems[item.id]).reduce((sum, item) => sum + item.price, 0)}
                   </span>
                 </div>
               </div>
               <div className="bg-white p-3 rounded border">
                 <div className="flex justify-between">
                   <span className="text-yellow-700">Savings:</span>
                   <span className="font-semibold">
                     ${budgetItems.filter(item => item.category === 'savings' && selectedItems[item.id]).reduce((sum, item) => sum + item.price, 0)}
                   </span>
                 </div>
               </div>
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

           {simulationCompleted ? (
             <button
               onClick={() => setLessonStep('budgetTool')}
               className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
             >
               Create Digital Budget
               <Wallet className="h-5 w-5 ml-2" />
             </button>
           ) : (
             <button
               onClick={() => setLessonStep('budgetTool')}
               className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all"
             >
               Skip to Budget Tool
               <ArrowRight className="h-5 w-5 ml-2" />
             </button>
           )}
         </div>

         <div className="mt-6 p-4 bg-blue-50 rounded-lg">
           <h4 className="font-semibold text-blue-800 mb-2">🎯 Challenge Requirements:</h4>
           <ul className="text-sm text-blue-700 space-y-1">
             <li>• Include at least 1 NEED in your budget</li>
             <li>• Include some SAVINGS (emergency fund or savings goal)</li>
             <li>• Don't spend more than $80 total</li>
             <li>• Think about balancing needs, wants, and savings!</li>
           </ul>
         </div>
       </div>
     </div>
   </div>
 );

 const renderDigitalBudgetTool = () => (
   <div className="max-w-4xl mx-auto">
     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
       <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
         <div className="flex items-center justify-between">
           <div>
             <h2 className="text-2xl font-bold">💻 Your Digital Budget Tool</h2>
             <p className="text-purple-100 mt-2">Create and save your personal budget!</p>
           </div>
           <Wallet className="h-12 w-12 text-white opacity-80" />
         </div>
       </div>

       <div className="p-8">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 💵 Monthly Income
               </label>
               <input
                 type="number"
                 value={digitalBudget.income}
                 onChange={(e) => updateBudgetCategory('income', Number(e.target.value))}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                 placeholder="Enter your monthly income"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 ✅ Needs (essentials like food, transport)
               </label>
               <input
                 type="number"
                 value={digitalBudget.needs}
                 onChange={(e) => updateBudgetCategory('needs', Number(e.target.value))}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
               />
               <p className="text-sm text-gray-500 mt-1">
                 Recommended: {Math.round(digitalBudget.income * 0.5)} (50% of income)
               </p>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 🎮 Wants (entertainment, treats)
               </label>
               <input
                 type="number"
                 value={digitalBudget.wants}
                 onChange={(e) => updateBudgetCategory('wants', Number(e.target.value))}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
               />
               <p className="text-sm text-gray-500 mt-1">
                 Recommended: {Math.round(digitalBudget.income * 0.3)} (30% of income)
               </p>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 🎯 Savings (future goals)
               </label>
               <input
                 type="number"
                 value={digitalBudget.savings}
                 onChange={(e) => updateBudgetCategory('savings', Number(e.target.value))}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg"
               />
               <p className="text-sm text-gray-500 mt-1">
                 Recommended: {Math.round(digitalBudget.income * 0.15)} (15% of income)
               </p>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 🆘 Emergency Fund
               </label>
               <input
                 type="number"
                 value={digitalBudget.emergency}
                 onChange={(e) => updateBudgetCategory('emergency', Number(e.target.value))}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
               />
               <p className="text-sm text-gray-500 mt-1">
                 Recommended: {Math.round(digitalBudget.income * 0.05)} (5% of income)
               </p>
             </div>
           </div>

           <div className="bg-gray-50 rounded-xl p-6">
             <h3 className="text-xl font-semibold text-gray-800 mb-6">Budget Overview</h3>
             
             <div className="space-y-4 mb-6">
               <div className="flex justify-between items-center text-lg">
                 <span className="font-medium">Total Income:</span>
                 <span className="font-bold text-green-600">${digitalBudget.income}</span>
               </div>
               <div className="flex justify-between items-center text-lg">
                 <span className="font-medium">Total Planned:</span>
                 <span className={`font-bold ${getTotalBudget() <= digitalBudget.income ? 'text-blue-600' : 'text-red-600'}`}>
                   ${getTotalBudget()}
                 </span>
               </div>
               <div className="flex justify-between items-center text-lg border-t pt-4">
                 <span className="font-medium">Remaining:</span>
                 <span className={`font-bold ${digitalBudget.income - getTotalBudget() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                   ${digitalBudget.income - getTotalBudget()}
                 </span>
               </div>
             </div>

             <div className="space-y-3 mb-6">
               <div className="bg-white p-3 rounded border">
                 <div className="flex justify-between items-center">
                   <span className="text-green-700 font-medium">Needs:</span>
                   <span>${digitalBudget.needs}</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                   <div 
                     className="bg-green-500 h-2 rounded-full" 
                     style={{width: `${(digitalBudget.needs / digitalBudget.income) * 100}%`}}
                   ></div>
                 </div>
               </div>
               
               <div className="bg-white p-3 rounded border">
                 <div className="flex justify-between items-center">
                   <span className="text-purple-700 font-medium">Wants:</span>
                   <span>${digitalBudget.wants}</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                   <div 
                     className="bg-purple-500 h-2 rounded-full" 
                     style={{width: `${(digitalBudget.wants / digitalBudget.income) * 100}%`}}
                   ></div>
                 </div>
               </div>
               
               <div className="bg-white p-3 rounded border">
                 <div className="flex justify-between items-center">
                   <span className="text-yellow-700 font-medium">Savings:</span>
                   <span>${digitalBudget.savings}</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                   <div 
                     className="bg-yellow-500 h-2 rounded-full" 
                     style={{width: `${(digitalBudget.savings / digitalBudget.income) * 100}%`}}
                   ></div>
                 </div>
               </div>
               
               <div className="bg-white p-3 rounded border">
                 <div className="flex justify-between items-center">
                   <span className="text-red-700 font-medium">Emergency:</span>
                   <span>${digitalBudget.emergency}</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                   <div 
                     className="bg-red-500 h-2 rounded-full" 
                     style={{width: `${(digitalBudget.emergency / digitalBudget.income) * 100}%`}}
                   ></div>
                 </div>
               </div>
             </div>

             {getTotalBudget() <= digitalBudget.income ? (
               <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                 <p className="text-green-800 font-medium">✅ Great! Your budget is balanced!</p>
               </div>
             ) : (
               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                 <p className="text-red-800 font-medium">⚠️ You're over budget! Adjust your amounts.</p>
               </div>
             )}

             <button
               onClick={saveBudget}
               disabled={getTotalBudget() > digitalBudget.income}
               className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                 getTotalBudget() <= digitalBudget.income
                   ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transform hover:scale-105'
                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
               }`}
             >
               💾 Save My Budget
             </button>
           </div>
         </div>

         <div className="mt-8 flex justify-between items-center">
           <button
             onClick={() => setLessonStep('simulation')}
             className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
           >
             <ArrowLeft className="h-5 w-5 mr-2" />
             Back to Simulation
           </button>

           {budgetToolCompleted ? (
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
           <p className="text-yellow-100 text-lg">You've earned the Budget Boss badge!</p>
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
           <div className="text-8xl mb-4">📊</div>
           <h3 className="text-2xl font-bold text-orange-800 mb-2">Budget Boss</h3>
           <p className="text-orange-700 text-lg mb-4">
             You're officially a Budget Boss — you know how to spend, save, and plan like a pro!
           </p>
           <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
             <h4 className="font-semibold text-orange-800 mb-2">What you mastered:</h4>
             <div className="text-left space-y-2 text-orange-700">
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Understanding the 4 budget buckets (income, needs, wants, savings)</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Applying the 50/30/20 budget rule</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Balancing needs vs wants in spending decisions</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Creating your own digital budget tool</span>
               </div>
             </div>
           </div>
         </div>

         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
           <h4 className="text-xl font-bold text-blue-800 mb-3">🔮 Coming Next Week...</h4>
           <div className="flex items-center justify-center mb-3">
             <div className="text-4xl mr-4">🦸</div>
             <div className="text-left">
               <h5 className="font-semibold text-blue-800">Week 5: The Magic of Saving</h5>
               <p className="text-blue-700">Discover why saving money is like having superpowers!</p>
             </div>
           </div>
         </div>

         <div className="space-y-4">
           <button
             onClick={() => {
               setWeekProgress(prev => ({ ...prev, badge: true }));
               onComplete(4, 'Budget Boss');
             }}
             className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center"
           >
             Continue to Week 5! 
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
           weekNumber={4}
           title="Making a Budget"
           sections={lessonSections}
           onComplete={handleLessonComplete}
           onBack={() => setLessonStep('overview')}
           color="blue"
         />
       );
     case 'simulation':
       return renderBudgetSimulation();
     case 'budgetTool':
       return renderDigitalBudgetTool();
     case 'quiz':
       return (
         <QuizEngine
           questions={quizQuestions}
           onComplete={handleQuizComplete}
           minPassingScore={3}
           maxLives={3}
           showHints={true}
           allowRetry={true}
           color="blue"
         />
       );
     case 'badge':
       return renderBadgeCeremony();
     default:
       return renderOverview();
   }
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
     {renderCurrentStep()}
   </div>
 );
};

export default Week4Component;