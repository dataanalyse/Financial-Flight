"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Check, Trophy, Star, ArrowRight, ArrowLeft, RotateCcw, X, Award, Calendar, Users, Target } from 'lucide-react';
import Badge from '../shared/Badge';
import ProgressBar from '../shared/ProgressBar';
import QuizEngine, { QuizQuestion } from '../shared/QuizEngine';
import LessonComponent, { LessonSection } from '../shared/LessonComponent';

interface Week3Props {
  onComplete: (weekNumber: number, badge: string) => void;
  onBack: () => void;
}

interface WeekProgress {
  lesson: boolean;
  sorting: boolean;
  quiz: boolean;
  badge: boolean;
}

const Week3Component: React.FC<Week3Props> = ({ onComplete, onBack }) => {
  const [lessonStep, setLessonStep] = useState('overview');
  const [sortingCompleted, setSortingCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [sortedItems, setSortedItems] = useState<{[key: string]: 'needs' | 'wants' | null}>({});
  const [availableItems, setAvailableItems] = useState<string[]>([
    'bed', 'juice', 'textbooks', 'airpods', 'water', 'pizza', 'soap', 'pet', 'bike', 'medicine'
  ]);
  const [weekProgress, setWeekProgress] = useState<WeekProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('week3Progress');
      return saved ? JSON.parse(saved) : {
        lesson: false,
        sorting: false,
        quiz: false,
        badge: false
      };
    }
    return {
      lesson: false,
      sorting: false,
      quiz: false,
      badge: false
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('week3Progress', JSON.stringify(weekProgress));
    }
  }, [weekProgress]);

  const items = {
    bed: { name: '🛏️ Bed', description: 'A place to sleep and rest' },
    juice: { name: '🧃 Juice Box', description: 'A tasty drink for lunch' },
    textbooks: { name: '📚 Textbooks', description: 'Books needed for school' },
    airpods: { name: '🎧 AirPods', description: 'Wireless headphones for music' },
    water: { name: '🚰 Water', description: 'Essential for staying hydrated' },
    pizza: { name: '🍕 Pizza', description: 'Delicious food for dinner' },
    soap: { name: '🧼 Soap', description: 'For washing hands and staying clean' },
    pet: { name: '🐶 Pet Dog', description: 'A furry companion and friend' },
    bike: { name: '🚲 Bike', description: 'Transportation or fun activity' },
    medicine: { name: '💊 Medicine', description: 'Healthcare when you\'re sick' }
  };

  const correctAnswers: Record<string, 'needs' | 'wants'> = {
    bed: 'needs',
    juice: 'wants',
    textbooks: 'needs',
    airpods: 'wants',
    water: 'needs',
    pizza: 'wants',
    soap: 'needs',
    pet: 'wants',
    bike: 'wants',
    medicine: 'needs'
  };

  // Quiz question pool — 4 drawn randomly each attempt
  const quizQuestions: QuizQuestion[] = [
    { question: "True or False: A smartphone is always a need.", options: ["True - everyone needs a phone", "False - it depends on your situation", "True - you can't live without one"], correct: 1, explanation: "A smartphone could be a need (for work or emergencies) or a want (for games and social media). Context matters!", hint: "Think about whether you could survive and stay healthy without one.", difficulty: 'medium' },
    { question: "If you have $10 and need lunch, what's the smart choice?", options: ["Buy expensive snacks you love", "Buy a healthy, filling meal", "Save the money for later"], correct: 1, explanation: "When you need something essential like food, prioritize a healthy meal over wants!", hint: "You NEED lunch — what satisfies that need best?", difficulty: 'easy' },
    { question: "What's the main difference between needs and wants?", options: ["Needs are expensive, wants are cheap", "Needs are for survival, wants are for enjoyment", "Needs are boring, wants are fun"], correct: 1, explanation: "Needs are essential for survival and health, while wants make life more enjoyable but aren't necessary!", hint: "Think about what happens if you don't have each one.", difficulty: 'easy' },
    { question: "Which of these could be EITHER a need or a want?", options: ["A bicycle", "Drinking water", "Video games"], correct: 0, explanation: "A bicycle could be a need (only transportation to school) or a want (just for fun)! Context determines the category.", hint: "Think about different situations where the same item serves different purposes.", difficulty: 'medium' },
    { question: "Which of these is ALWAYS a need?", options: ["Brand-new sneakers", "Clean drinking water", "Wireless earbuds"], correct: 1, explanation: "Clean water is essential for life — no human can survive without it. Sneakers and earbuds are wants for most people!", hint: "Which one do you literally need to stay alive?", difficulty: 'easy' },
    { question: "You get $50 for your birthday. What's the smartest approach?", options: ["Spend it all on wants immediately", "Cover any needs first, save some, then spend the rest on wants", "Put it all in savings and never enjoy it"], correct: 1, explanation: "Smart money management balances needs, savings, AND wants — it's not all-or-nothing! Enjoy some while planning ahead.", hint: "Think about which approach leaves you feeling good financially AND enjoying life.", difficulty: 'medium' },
    { question: "Your friend says 'I NEED the new gaming console.' Is that accurate?", options: ["Yes, it's a genuine need", "No, it's a want — gaming consoles are not essential for survival", "Only if the old one is broken"], correct: 1, explanation: "Gaming consoles are wants — they're fun but not required for health or survival. Using 'need' for wants is a common money mistake!", hint: "Ask: would you be unhealthy or unable to function without it?", difficulty: 'easy' },
    { question: "What is 'opportunity cost'?", options: ["The price of a new opportunity", "What you give up when you choose one option over another", "The cost of missing school"], correct: 1, explanation: "Every money decision has an opportunity cost — if you spend $50 on a game, that's $50 you can't save or spend on something else!", hint: "Think about the trade-off you make with every purchase.", difficulty: 'hard' },
    { question: "Which of these is an example of a 'need' for a student?", options: ["New headphones for music", "Textbooks for class", "A gaming PC"], correct: 1, explanation: "Textbooks are needed for education — they serve an essential purpose. Headphones and gaming PCs are wants for most students!", hint: "Which one is required to do what you're supposed to do as a student?", difficulty: 'easy' },
    { question: "Why is it important to separate needs from wants when budgeting?", options: ["To make budgeting more complicated", "To ensure essential things are covered before spending on extras", "Needs and wants should never be separated"], correct: 1, explanation: "Covering needs first makes sure you're safe and healthy. After that, any leftover money can go to wants and savings!", hint: "Which should you prioritize if money is tight?", difficulty: 'medium' },
    { question: "A family spends $2,000/month on rent, $300 on food, and $200 on streaming subscriptions. What is a want?", options: ["Rent", "Food", "Streaming subscriptions"], correct: 2, explanation: "Rent and food are needs — essential for shelter and survival. Streaming subscriptions are wants — enjoyable but not necessary to live!", hint: "Which one could you cut without affecting health or safety?", difficulty: 'medium' },
    { question: "What does 'impulse buying' mean?", options: ["Buying things very quickly online", "Buying something unplanned based on emotion, not need", "Buying things in bulk to save money"], correct: 1, explanation: "Impulse buying is purchasing on emotion or temptation without thinking it through. It's a major budget-buster!", hint: "Think about buying something you hadn't planned to buy after seeing it.", difficulty: 'medium' },
    { question: "How can you tell if something is a want vs. a need?", options: ["Wants are always more expensive", "Ask: would I be unsafe or unhealthy without this?", "Wants are things you buy at the mall"], correct: 1, explanation: "The key question is whether you truly NEED it for health or safety. If the answer is no, it's probably a want — even if it feels urgent!", hint: "Strip away emotion and ask the survival question.", difficulty: 'medium' },
    { question: "Which is the best reason to limit spending on wants?", options: ["To never enjoy anything", "To have money left over for savings and unexpected needs", "Because wants are always wrong"], correct: 1, explanation: "Limiting wants isn't about deprivation — it's about having money available for savings, emergencies, and future goals!", hint: "Think about what you gain by NOT spending everything on fun stuff.", difficulty: 'medium' },
    { question: "Medicine when you're sick is an example of:", options: ["A want", "A need", "A luxury"], correct: 1, explanation: "Medicine when sick is a definite need — it's required for health and recovery. This is very different from optional supplements or vitamins!", hint: "Is staying healthy a want or a need?", difficulty: 'easy' },
    { question: "Your internet plan at home is used for school AND gaming. Is it a need or want?", options: ["Pure want", "Pure need", "Both — it serves essential and non-essential purposes"], correct: 2, explanation: "Some things can be both! Internet for school is a need, but using it for gaming is a want. In budgeting, you'd count it as a need since it's essential for school.", hint: "Can it serve both essential and non-essential purposes at the same time?", difficulty: 'hard' },
  ];

  const lessonSections: LessonSection[] = [
    {
      id: 'warm-up',
      title: 'Desert Island Challenge! 🏝️',
      type: 'activity',
      content: (
        <div>
          <p className="text-lg mb-4">
            Imagine you're stranded on a desert island! 🏝️ You can choose only <strong>3 items</strong> to help you survive.
          </p>
          <div className="bg-blue-100 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-blue-800 mb-4">🤔 Think about it:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl mb-1">🍎</div>
                <span className="text-sm">Food</span>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl mb-1">🚰</div>
                <span className="text-sm">Water</span>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl mb-1">🏠</div>
                <span className="text-sm">Shelter</span>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl mb-1">🎮</div>
                <span className="text-sm">Video Game</span>
              </div>
            </div>
          </div>
          <p className="text-gray-700 mb-3">
            Which 3 would you choose? Notice how some items are <strong>essential for survival</strong> while others are just nice to have?
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800">
              💡 This is the key difference we'll learn about today - <strong>needs vs wants</strong>!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'what-are-needs',
      title: 'What Are Needs? 🎯',
      type: 'example',
      content: (
        <div>
          <p className="text-lg mb-4">
            <strong>Needs</strong> are things you must have to live safely and healthily. Without them, you could get sick or hurt!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🍎</div>
              <p className="font-semibold text-green-800">Food</p>
              <p className="text-sm text-green-600">Energy to live</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🏠</div>
              <p className="font-semibold text-green-800">Shelter</p>
              <p className="text-sm text-green-600">Protection & warmth</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">👕</div>
              <p className="font-semibold text-green-800">Clothing</p>
              <p className="text-sm text-green-600">Stay warm & modest</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🚰</div>
              <p className="font-semibold text-green-800">Water</p>
              <p className="text-sm text-green-600">Stay hydrated</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">💊</div>
              <p className="font-semibold text-green-800">Healthcare</p>
              <p className="text-sm text-green-600">Stay healthy</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🧼</div>
              <p className="font-semibold text-green-800">Hygiene</p>
              <p className="text-sm text-green-600">Stay clean & healthy</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium">
              🎯 <strong>Quick Check:</strong> Stand up if you used at least 3 of these needs today!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'what-are-wants',
      title: 'What Are Wants? ✨',
      type: 'example',
      content: (
        <div>
          <p className="text-lg mb-4">
            <strong>Wants</strong> are things that make life more fun, comfortable, or enjoyable - but you can live without them!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🎮</div>
              <p className="font-semibold text-purple-800">Video Games</p>
              <p className="text-sm text-purple-600">Fun & entertainment</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🧋</div>
              <p className="font-semibold text-purple-800">Bubble Tea</p>
              <p className="text-sm text-purple-600">Tasty treat</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">👟</div>
              <p className="font-semibold text-purple-800">Designer Shoes</p>
              <p className="text-sm text-purple-600">Look fashionable</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">📱</div>
              <p className="font-semibold text-purple-800">New Phone</p>
              <p className="text-sm text-purple-600">Latest features</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Wants aren't bad! They make life enjoyable. The key is understanding the difference so you can make smart money choices.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💭 Quick Reflection:</h4>
            <p className="text-blue-700">What's your most recent want purchase? Did you have to give up something else for it?</p>
          </div>
        </div>
      )
    },
    {
      id: 'jordan-story',
      title: 'Story Time: Jordan\'s $50 Dilemma 💰',
      type: 'story',
      content: (
        <div>
          <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200 mb-4">
            <p className="text-lg text-orange-800 mb-4">
              <strong>Meet Jordan!</strong> He just got his $50 monthly allowance and needs to make some choices...
            </p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold text-green-700 mb-3">✅ Jordan's NEEDS ($30 total):</h4>
              <div className="space-y-2 text-green-800">
                <div className="flex justify-between items-center">
                  <span>🚌 Bus pass for school</span>
                  <span className="font-semibold">$15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>📚 School supplies</span>
                  <span className="font-semibold">$10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🥪 Lunch money</span>
                  <span className="font-semibold">$5</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-purple-700 mb-3">💜 Jordan's WANTS ($30 total):</h4>
              <div className="space-y-2 text-purple-800">
                <div className="flex justify-between items-center">
                  <span>👕 Cool new hoodie</span>
                  <span className="font-semibold">$20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🍔 Fast food with friends</span>
                  <span className="font-semibold">$10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-bold text-red-800 mb-2">🤔 The Problem:</h4>
            <p className="text-red-700 mb-3">
              Jordan wants everything, but his needs + wants = $60, and he only has $50!
            </p>
            <p className="text-red-700 font-medium">
              What should Jordan do? What would YOU choose?
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'smart-choices',
      title: 'Making Smart Money Choices 🧠',
      type: 'tip',
      content: (
        <div>
          <p className="mb-4">
            The smart approach is: <strong>Needs first, wants second!</strong>
          </p>
          
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-green-800 mb-3">✅ Jordan's Smart Choice:</h4>
            <div className="space-y-2 text-green-700">
              <p>1. Pay for all needs first: $30</p>
              <p>2. Remaining money: $50 - $30 = $20</p>
              <p>3. Choose the hoodie ($20) OR save $10 + fast food ($10)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2">💡 Option A:</h5>
              <p className="text-blue-700">Get the hoodie now, skip fast food</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2">💡 Option B:</h5>
              <p className="text-blue-700">Enjoy fast food, save $10 toward hoodie</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">⚠️ What if Jordan bought the hoodie first?</h4>
            <p className="text-yellow-700">
              He'd have only $30 left - exactly enough for needs, but no flexibility for emergencies or other wants!
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleItemDrop = (itemId: string, category: 'needs' | 'wants') => {
    const newSorted = { ...sortedItems, [itemId]: category };
    setSortedItems(newSorted);
    setAvailableItems(availableItems.filter(id => id !== itemId));

    if (availableItems.length === 1) {
      const allCorrect = Object.keys(newSorted).every(itemId => 
        newSorted[itemId] === correctAnswers[itemId]
      );
      if (allCorrect && newSorted[itemId] === correctAnswers[itemId]) {
        setSortingCompleted(true);
        setWeekProgress(prev => ({ ...prev, sorting: true }));
      }
    }
  };

  const resetSorting = () => {
    setSortedItems({});
    setAvailableItems(['bed', 'juice', 'textbooks', 'airpods', 'water', 'pizza', 'soap', 'pet', 'bike', 'medicine']);
    setSortingCompleted(false);
  };

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
    setLessonStep('sorting');
  };

  const getProgressSteps = () => {
    const steps = [];
    if (weekProgress.lesson) steps.push('lesson');
    if (weekProgress.sorting) steps.push('sorting');
    if (weekProgress.quiz) steps.push('quiz');
    if (weekProgress.badge) steps.push('badge');
    return steps.length;
  };

  const renderOverview = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Week 3: Needs vs Wants 🎯</h2>
              <p className="text-green-100 mt-2">Learn to tell the difference between what you need and what you want!</p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Ages 13-16</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>15-20 minutes</span>
                </div>
              </div>
            </div>
            <Badge 
              badge="🎯 Smart Shopper"
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
              stepLabels={['Learn', 'Sort Items', 'Quiz', 'Badge']}
              animated
            />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.lesson ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <BookOpen className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Learn</span>
              {weekProgress.lesson && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.sorting ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <Target className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Sort Items</span>
              {weekProgress.sorting && <Check className="h-4 w-4 ml-auto" />}
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
            <p className="text-green-700">Master the difference between needs and wants, and make smart spending decisions that prioritize what's truly important.</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setLessonStep('lesson')}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              {weekProgress.lesson ? 'Review Lesson' : 'Start Learning About Needs vs Wants!'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            
            {weekProgress.lesson && (
              <button
                onClick={() => setLessonStep('sorting')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center"
              >
                {weekProgress.sorting ? 'Review Sorting Game' : 'Play Needs vs Wants Game'}
                <Target className="h-5 w-5 ml-2" />
              </button>
            )}
            
            {weekProgress.sorting && (
              <button
                onClick={() => setLessonStep('quiz')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center"
              >
                {weekProgress.quiz ? 'Review Quiz' : 'Take the Quiz'}
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

  const renderSortingGame = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">🎯 Sort It Out: Needs vs Wants!</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetSorting}
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
          <p className="text-green-100 mt-2">Click Need or Want for each item below!</p>
        </div>

        <div className="p-8">
          {sortingCompleted && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Excellent sorting! You're a smart spender!</h3>
              <p className="text-green-700">You correctly identified all needs and wants!</p>
            </div>
          )}

          <div className="mb-6">
            <ProgressBar 
              current={Object.keys(sortedItems).length} 
              total={10} 
              color="green"
              showPercentage
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4 text-center">✅ NEEDS</h3>
              <p className="text-green-700 text-center mb-4 text-sm">Essential for survival & health</p>
              <div className="min-h-[300px] space-y-3">
                {Object.entries(sortedItems)
                  .filter(([_, category]) => category === 'needs')
                  .map(([itemId, _]) => (
                    <div key={itemId} className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="text-center">
                        <div className="text-2xl mb-1">{items[itemId as keyof typeof items].name.split(' ')[0]}</div>
                        <div className="font-medium text-gray-800 text-sm">
                          {items[itemId as keyof typeof items].name.substring(2)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4 text-center">💜 WANTS</h3>
              <p className="text-purple-700 text-center mb-4 text-sm">Nice to have, but not essential</p>
              <div className="min-h-[300px] space-y-3">
                {Object.entries(sortedItems)
                  .filter(([_, category]) => category === 'wants')
                  .map(([itemId, _]) => (
                    <div key={itemId} className="bg-white p-3 rounded-lg border border-purple-200">
                      <div className="text-center">
                        <div className="text-2xl mb-1">{items[itemId as keyof typeof items].name.split(' ')[0]}</div>
                        <div className="font-medium text-gray-800 text-sm">
                          {items[itemId as keyof typeof items].name.substring(2)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
             </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Click Need or Want for each item:</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {availableItems.map((itemId) => (
                <div key={itemId} className="relative">
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-all transform hover:scale-105 shadow-sm">
                    <div className="text-center">
                      <div className="text-3xl mb-2">{items[itemId as keyof typeof items].name.split(' ')[0]}</div>
                      <div className="font-semibold text-gray-800 text-sm mb-1">
                        {items[itemId as keyof typeof items].name.substring(2)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {items[itemId as keyof typeof items].description}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleItemDrop(itemId, 'needs')}
                      className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-green-600 transition-colors"
                    >
                      Need
                    </button>
                    <button
                      onClick={() => handleItemDrop(itemId, 'wants')}
                      className="flex-1 bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-purple-600 transition-colors"
                    >
                      Want
                    </button>
                  </div>
                </div>
              ))}
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

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">
                {Object.keys(sortedItems).length} of 10 items sorted
              </p>
              <div className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {sortingCompleted ? '✅ All Sorted!' : '🎯 Keep sorting!'}
              </div>
            </div>

            {sortingCompleted ? (
              <button
                onClick={() => setLessonStep('quiz')}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
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

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🎮 How to Play:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Look at each item and think: "Do I NEED this to survive and be healthy?"</li>
              <li>• Click <strong>"Need"</strong> if it's essential for survival</li>
              <li>• Click <strong>"Want"</strong> if it's nice to have but not essential</li>
              <li>• <strong>Tricky items:</strong> Some could be either - think about different situations!</li>
            </ul>
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
            <p className="text-yellow-100 text-lg">You've earned the Smart Shopper badge!</p>
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
            <div className="text-8xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-orange-800 mb-2">Smart Shopper</h3>
            <p className="text-orange-700 text-lg mb-4">
              You mastered the difference between needs and wants!
            </p>
            <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">What you mastered:</h4>
              <div className="text-left space-y-2 text-orange-700">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Identifying needs vs wants in everyday items</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Prioritizing needs when making spending decisions</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Understanding that some items can be either need or want</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Making balanced choices with limited money</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <h4 className="text-xl font-bold text-blue-800 mb-3">🔮 Coming Next Week...</h4>
            <div className="flex items-center justify-center mb-3">
              <div className="text-4xl mr-4">📊</div>
              <div className="text-left">
                <h5 className="font-semibold text-blue-800">Week 4: Making a Budget</h5>
                <p className="text-blue-700">Create your first budget and learn to track your money!</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setWeekProgress(prev => ({ ...prev, badge: true }));
                onComplete(3, 'Smart Shopper');
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Continue to Week 4! 
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
            weekNumber={3}
            title="Needs vs Wants"
            sections={lessonSections}
            onComplete={handleLessonComplete}
            onBack={() => setLessonStep('overview')}
            color="green"
          />
        );
      case 'sorting':
        return renderSortingGame();
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      {renderCurrentStep()}
    </div>
  );
};

export default Week3Component; 