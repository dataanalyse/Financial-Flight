"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Check, Star, ArrowRight, ArrowLeft, RotateCcw, X, Award, Calendar, Users, Target } from 'lucide-react';
import Badge from '../shared/Badge';
import ProgressBar from '../shared/ProgressBar';
import QuizEngine, { QuizQuestion } from '../shared/QuizEngine';
import LessonComponent, { LessonSection } from '../shared/LessonComponent';

interface Week9Props {
  onComplete: (weekNumber: number, badge: string) => void;
  onBack: () => void;
}

interface WeekProgress {
  lesson: boolean;
  goalGame: boolean;
  quiz: boolean;
  badge: boolean;
}

interface SMARTGoal {
  category: string;
  categoryEmoji: string;
  amount: number;
  timeframe: string;
  timeframeWeeks: number;
  action: string;
}

const Week9Component: React.FC<Week9Props> = ({ onComplete, onBack }) => {
  const [lessonStep, setLessonStep] = useState('overview');
  const [goalGameCompleted, setGoalGameCompleted] = useState(false);
  const [gameStep, setGameStep] = useState(0);
  const [smartGoal, setSMARTGoal] = useState<SMARTGoal>({
    category: '',
    categoryEmoji: '',
    amount: 0,
    timeframe: '',
    timeframeWeeks: 0,
    action: '',
  });

  const [weekProgress, setWeekProgress] = useState<WeekProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('week9Progress');
      return saved ? JSON.parse(saved) : { lesson: false, goalGame: false, quiz: false, badge: false };
    }
    return { lesson: false, goalGame: false, quiz: false, badge: false };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('week9Progress', JSON.stringify(weekProgress));
    }
  }, [weekProgress]);

  const goalCategories = [
    { id: 'item', label: 'Save for something I want', emoji: '🎮', example: 'Phone, console, clothes, headphones' },
    { id: 'emergency', label: 'Build an emergency fund', emoji: '🛡️', example: 'Money for unexpected costs' },
    { id: 'earn', label: 'Earn extra money', emoji: '💼', example: 'Side hustle or part-time job' },
    { id: 'education', label: 'Save for education', emoji: '🎓', example: 'College fund, course, or books' },
  ];

  const amountOptions = [
    { value: 50, label: '$50', tag: 'Quick win!' },
    { value: 100, label: '$100', tag: 'Great start' },
    { value: 250, label: '$250', tag: 'Challenge mode' },
    { value: 500, label: '$500', tag: 'Big goal!' },
  ];

  const timeframeOptions = [
    { value: '1 month', weeks: 4, label: '1 Month', tag: 'Sprint!' },
    { value: '3 months', weeks: 12, label: '3 Months', tag: 'Short-term' },
    { value: '6 months', weeks: 24, label: '6 Months', tag: 'Medium-term' },
    { value: '1 year', weeks: 52, label: '1 Year', tag: 'Long haul' },
  ];

  const actionOptions = [
    { id: 'weekly-save', label: 'Set aside a fixed amount every week' },
    { id: 'track', label: 'Track spending daily and cut small treats' },
    { id: 'earn', label: 'Do extra chores or sell things I no longer need' },
    { id: 'automate', label: 'Automate transfers to a savings account each week' },
  ];

  const getWeeklyAmount = () => {
    if (!smartGoal.amount || !smartGoal.timeframeWeeks) return 0;
    return Math.ceil(smartGoal.amount / smartGoal.timeframeWeeks);
  };

  const resetGoalBuilder = () => {
    setGameStep(0);
    setSMARTGoal({ category: '', categoryEmoji: '', amount: 0, timeframe: '', timeframeWeeks: 0, action: '' });
    setGoalGameCompleted(false);
  };

  // Quiz question pool — 4 drawn randomly each attempt
  const quizQuestions: QuizQuestion[] = [
    { question: "What does the 'M' in SMART goals stand for?", options: ['Motivated', 'Measurable', 'Money-focused'], correct: 1, explanation: "Measurable! Your goal needs a number so you know when you've hit it. 'Save $200' is measurable — 'save money' is not!", hint: 'How would you know when you reached your goal?', difficulty: 'easy' },
    { question: "Which is the BEST example of a SMART financial goal?", options: ["I want to save some money", "I will save $150 in 3 months by setting aside $50 each month", "I'll try to spend less this year"], correct: 1, explanation: "Option B is SMART — Specific, Measurable ($150), with a clear plan, and Time-bound (3 months)!", hint: 'Which one tells you exactly what, how much, and when?', difficulty: 'easy' },
    { question: "You set a goal to save $300 in 2 months but only saved $200. What should you do?", options: ["Give up — you failed", "Adjust the timeline or amount and keep going", "Pretend the goal never existed"], correct: 1, explanation: "Goals are flexible guides, not punishments! Adjusting and continuing is smart. Progress beats zero.", hint: 'What would an encouraging friend say?', difficulty: 'medium' },
    { question: "Why is setting a DEADLINE on a financial goal important?", options: ["It creates urgency and stops procrastination", "Deadlines are not needed for money goals", "To stress yourself out"], correct: 0, explanation: "A deadline turns a wish into a real plan! Without one, it's easy to keep saying 'I'll start next month...' indefinitely.", hint: 'Think about how school deadlines affect your work.', difficulty: 'easy' },
    { question: "What does the 'S' in SMART stand for?", options: ['Smart', 'Specific', 'Saving-focused'], correct: 1, explanation: "Specific! A vague goal like 'save money' gives you nothing to aim for. 'Save $500 for a laptop by December' is specific and actionable!", hint: "The more detail, the better — who, what, when, how much.", difficulty: 'easy' },
    { question: "What does the 'A' in SMART stand for?", options: ['Amazing', 'Achievable', 'Automatic'], correct: 1, explanation: "Achievable! Your goal should stretch you but still be realistic. Saving $10,000 in one month on $0 income isn't achievable — but $50/week might be!", hint: "Can you actually accomplish this with your current situation?", difficulty: 'easy' },
    { question: "What does 'T' stand for in SMART goals?", options: ['Trackable', 'Time-bound', 'Total'], correct: 1, explanation: "Time-bound! Every financial goal needs a deadline. Without one, there's no urgency and goals drift forever.", hint: "Goals need a 'by when' — a specific end date.", difficulty: 'easy' },
    { question: "Which of these is a SHORT-TERM financial goal?", options: ["Saving for retirement in 40 years", "Saving $80 for new shoes by next month", "Paying off a 30-year mortgage"], correct: 1, explanation: "Short-term goals are achievable within weeks to a few months. Saving $80 for shoes next month is a perfect short-term goal!", hint: "Think about something you can accomplish very soon.", difficulty: 'easy' },
    { question: "What is the best way to track progress on a savings goal?", options: ["Remember it mentally without writing anything down", "Use a savings tracker, app, or spreadsheet to record progress regularly", "Only check your balance at the end"], correct: 1, explanation: "Tracking regularly keeps you motivated and lets you spot problems early. Seeing progress (even small) is one of the most powerful motivators!", hint: "Out of sight, out of mind — tracking keeps goals visible.", difficulty: 'medium' },
    { question: "To save $240 in 6 months, how much do you need to save each month?", options: ["$30", "$40", "$50"], correct: 1, explanation: "$240 ÷ 6 months = $40/month. Breaking big goals into monthly or weekly amounts makes them much more manageable!", hint: "Divide the total amount by the number of months.", difficulty: 'easy' },
    { question: "What is the biggest reason people fail to reach their financial goals?", options: ["Goals are impossible to reach", "They set vague goals without a plan and give up after one setback", "Banks prevent people from saving"], correct: 1, explanation: "Vague goals + no plan + giving up too soon = almost guaranteed failure. Specific goals with written plans and resilience through setbacks succeed!", hint: "Think about the three main failure points: clarity, plan, persistence.", difficulty: 'medium' },
    { question: "Why is it helpful to write your financial goals down?", options: ["Writing makes goals legally binding", "Written goals are significantly more likely to be achieved than mental ones", "It doesn't help — goals are goals either way"], correct: 1, explanation: "Research shows written goals are dramatically more likely to be achieved. Writing commits your intention and creates a reference to return to!", hint: "Think about how writing something down changes your commitment to it.", difficulty: 'medium' },
    { question: "What is a 'stretch goal'?", options: ["A goal you can reach easily", "A challenging goal that pushes you beyond your comfort zone", "A goal about physical fitness and money"], correct: 1, explanation: "Stretch goals push you harder than comfortable — like doubling your normal savings rate for a month. They're motivating when you achieve them!", hint: "Think about a goal that makes you say 'that would be tough but amazing.'", difficulty: 'medium' },
    { question: "You want to buy a $360 gaming setup. You earn $30/week. What is the minimum weeks needed to save for it?", options: ["10 weeks", "12 weeks", "15 weeks"], correct: 1, explanation: "$360 ÷ $30/week = 12 weeks. Planning the math helps you know exactly when you can reach your goal!", hint: "Divide the total cost by your weekly earnings.", difficulty: 'medium' },
    { question: "What does 'financial planning' mean?", options: ["Planning a party with a budget", "Setting money goals and creating a strategy to achieve them over time", "Having a financial adviser do everything"], correct: 1, explanation: "Financial planning is taking control of your money future — setting goals, budgeting, saving, investing, and reviewing your progress regularly!", hint: "Think about planning your money life intentionally.", difficulty: 'medium' },
    { question: "Which mindset best helps achieve financial goals?", options: ["'I'll save when I have more money someday'", "'I'll start small today and build consistently over time'", "'Goals are just for adults — I'll worry later'"], correct: 1, explanation: "Starting small and consistently is how wealth is built. 'Someday' never comes — starting today, even with $5, beats waiting forever!", hint: "Which mindset creates action vs. indefinite delay?", difficulty: 'medium' },
  ];

  const lessonSections: LessonSection[] = [
    {
      id: 'goal-story',
      title: 'Why Most Goals Fail Before They Even Start 😬',
      type: 'story',
      content: (
        <div>
          <div className="bg-red-50 p-6 rounded-lg mb-4">
            <p className="text-lg text-red-800 mb-4">
              <strong>Meet Jordan.</strong> Jordan wants to save money. Their plan? "I'm going to save money." 💭
            </p>
            <div className="bg-white p-4 rounded-lg mb-4 border border-red-200">
              <div className="space-y-3">
                <p className="text-red-700"><strong>January:</strong> "I'll start saving soon..."</p>
                <p className="text-red-700"><strong>April:</strong> "Things are expensive right now, maybe next month..."</p>
                <p className="text-red-700"><strong>December:</strong> "I never saved anything. Where did it all go?" 😩</p>
              </div>
            </div>
            <p className="text-red-700 font-medium">Jordan's problem wasn't laziness — it was a VAGUE goal with no plan.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg mb-4">
            <p className="text-lg text-green-800 mb-4">
              <strong>Now meet Alex.</strong> Same dream, different approach.
            </p>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="space-y-3">
                <p className="text-green-700"><strong>Goal:</strong> "Save $300 for new headphones by March 31st by putting $25 aside every week."</p>
                <p className="text-green-700"><strong>January:</strong> Saved $100 ✅</p>
                <p className="text-green-700"><strong>February:</strong> Saved $200 ✅</p>
                <p className="text-green-700"><strong>March:</strong> Hit $300 — bought those headphones! 🎧🎉</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">💡 The Difference?</h4>
            <p className="text-blue-700">Alex used a <strong>SMART goal</strong> — a structured plan that makes success almost automatic. That's exactly what you'll build today.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'smart-framework',
      title: 'The SMART Framework: Your Goal-Setting Superpower 🎯',
      type: 'example',
      content: (
        <div>
          <p className="text-lg mb-4">SMART is an acronym. Each letter is a rule that turns a vague wish into an achievable plan.</p>
          <div className="space-y-4 mb-6">
            {[
              { letter: 'S', name: 'Specific', color: 'blue', desc: 'Know exactly WHAT you\'re saving for.', bad: '"Save money"', good: '"Save for new AirPods"' },
              { letter: 'M', name: 'Measurable', color: 'green', desc: 'Put a NUMBER on it so you know when you\'ve succeeded.', bad: '"Save a lot"', good: '"Save $179"' },
              { letter: 'A', name: 'Achievable', color: 'purple', desc: 'Challenging but realistic — push yourself without setting up failure.', bad: '"Save $10,000 this week"', good: '"Save $179 in 4 months"' },
              { letter: 'R', name: 'Relevant', color: 'orange', desc: 'It matters to YOU and connects to your bigger goals.', bad: null, good: '"AirPods will help me study and enjoy music"' },
              { letter: 'T', name: 'Time-bound', color: 'red', desc: 'A DEADLINE stops you from saying "I\'ll start tomorrow" forever.', bad: '"Someday..."', good: '"By September 30th"' },
            ].map(({ letter, name, color, desc, bad, good }) => (
              <div key={letter} className={`bg-${color}-50 p-5 rounded-lg border-l-4 border-${color}-500`}>
                <div className="flex items-center mb-2">
                  <div className={`bg-${color}-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3`}>{letter}</div>
                  <h4 className={`font-bold text-${color}-800 text-lg`}>{name}</h4>
                </div>
                <p className={`text-${color}-700 mb-3`}>{desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bad && <div className="bg-red-100 p-3 rounded"><p className="text-red-700 text-sm">❌ {bad}</p></div>}
                  <div className="bg-green-100 p-3 rounded"><p className="text-green-700 text-sm">✅ {good}</p></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-800 mb-2">🏆 A Complete SMART Goal:</h4>
            <p className="text-yellow-700 text-lg font-medium">
              "I will save $179 for AirPods by September 30th by setting aside $45 each month and skipping one takeout meal per week."
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'goal-types',
      title: 'Short-Term vs Long-Term Goals: You Need Both! ⏱️',
      type: 'tip',
      content: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">⚡</div>
                <h4 className="font-bold text-blue-800">Short-Term Goals</h4>
                <p className="text-blue-600 text-sm">Days → 1 year</p>
              </div>
              <ul className="text-blue-700 text-sm space-y-1 mb-3">
                <li>• Quick wins build confidence</li>
                <li>• Train your saving habits</li>
                <li>• Give you momentum</li>
              </ul>
              <div className="bg-blue-100 p-3 rounded">
                <p className="text-blue-700 font-medium mb-1 text-sm">Teen examples:</p>
                <ul className="text-blue-600 text-xs space-y-1">
                  <li>• Save $50 for new clothes (6 weeks)</li>
                  <li>• Earn $100 doing odd jobs (1 month)</li>
                  <li>• No impulse buys for 2 weeks</li>
                </ul>
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🚀</div>
                <h4 className="font-bold text-purple-800">Long-Term Goals</h4>
                <p className="text-purple-600 text-sm">1 year → decades</p>
              </div>
              <ul className="text-purple-700 text-sm space-y-1 mb-3">
                <li>• Build real wealth over time</li>
                <li>• Give your life direction</li>
                <li>• Harness compound interest</li>
              </ul>
              <div className="bg-purple-100 p-3 rounded">
                <p className="text-purple-700 font-medium mb-1 text-sm">Teen examples:</p>
                <ul className="text-purple-600 text-xs space-y-1">
                  <li>• Save $2,000 for college (2 years)</li>
                  <li>• Build $500 emergency fund (1 year)</li>
                  <li>• Start investing $25/month at 16</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-green-800 mb-4">🪜 The Goal Ladder Strategy:</h4>
            <div className="space-y-3">
              {[
                { num: 1, color: 'green', title: 'This week: Track every dollar I spend', sub: 'Mini-goal → builds awareness' },
                { num: 2, color: 'green', title: 'This month: Save $50', sub: 'Short-term → quick win' },
                { num: 3, color: 'blue', title: 'This year: Build a $500 emergency fund', sub: 'Medium-term → security' },
                { num: 4, color: 'purple', title: 'Next 5 years: Invest $1,000+', sub: 'Long-term → wealth building' },
              ].map(({ num, color, title, sub }) => (
                <div key={num} className="flex items-center bg-white p-3 rounded border border-green-300">
                  <div className={`bg-${color}-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0`}>{num}</div>
                  <div>
                    <p className={`font-medium text-${color}-800`}>{title}</p>
                    <p className={`text-${color}-600 text-sm`}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Pro Tip:</h4>
            <p className="text-yellow-700">Always have at least ONE short-term and ONE long-term goal running at the same time. Short-term wins keep you motivated for the long-term work!</p>
          </div>
        </div>
      ),
    },
    {
      id: 'action-plan',
      title: 'Turning Goals Into Action: Your Weekly Plan 📅',
      type: 'activity',
      content: (
        <div>
          <div className="bg-indigo-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-indigo-800 mb-3">🛠️ The Three Levers You Can Pull</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { emoji: '💰', title: 'Earn More', color: 'green', items: ['Babysit or pet-sit', 'Sell unused items', 'Do extra chores', 'Tutor younger kids'] },
                { emoji: '✂️', title: 'Spend Less', color: 'blue', items: ['Cut subscriptions', 'Cook instead of takeout', 'Wait 24hrs before buying', 'Use coupons/sales'] },
                { emoji: '🔄', title: 'Automate It', color: 'purple', items: ['Auto-transfer to savings', 'Set phone reminders', 'Use a savings app', 'Set up spending alerts'] },
              ].map(({ emoji, title, color, items }) => (
                <div key={title} className={`bg-${color}-50 p-4 rounded-lg text-center`}>
                  <div className="text-3xl mb-2">{emoji}</div>
                  <h5 className={`font-bold text-${color}-800 mb-2`}>{title}</h5>
                  <ul className={`text-${color}-700 text-sm space-y-1 text-left`}>
                    {items.map(i => <li key={i}>• {i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-yellow-800 mb-3">🏆 What To Do When You Fall Behind:</h4>
            <div className="space-y-2">
              {[
                { step: 1, text: "Don't panic or quit — falling behind is completely normal." },
                { step: 2, text: "Figure out WHY — unexpected expense, or just didn't stick to the plan?" },
                { step: 3, text: "Adjust the timeline or goal amount. Not the dream!" },
                { step: 4, text: "Get back on track with a fresh weekly plan." },
              ].map(({ step, text }) => (
                <div key={step} className="bg-white p-3 rounded border border-yellow-300 flex items-start">
                  <span className="bg-yellow-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">{step}</span>
                  <p className="text-yellow-800">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">🎯 Up Next: Build YOUR Goal!</h4>
            <p className="text-blue-700">In the activity, you'll use these principles to create a real SMART financial goal — with your own numbers, your own timeline, and your own action plan.</p>
          </div>
        </div>
      ),
    },
  ];

  const handleQuizComplete = (score: number, passed: boolean) => {
    if (passed) {
      setWeekProgress(prev => ({ ...prev, quiz: true }));
      setTimeout(() => setLessonStep('badge'), 1000);
    }
  };

  const handleLessonComplete = () => {
    setWeekProgress(prev => ({ ...prev, lesson: true }));
    setLessonStep('goalGame');
  };

  const getProgressSteps = () => {
    return [weekProgress.lesson, weekProgress.goalGame, weekProgress.quiz, weekProgress.badge].filter(Boolean).length;
  };

  const renderOverview = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Week 9: Financial Goals & Planning 🎯</h2>
              <p className="text-teal-100 mt-2">Learn to set SMART goals and build real action plans for your money!</p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <div className="flex items-center"><Users className="h-4 w-4 mr-1" /><span>Ages 13-16</span></div>
                <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /><span>25-30 minutes</span></div>
              </div>
            </div>
            <Badge badge="🎯 Goal Getter" earned={weekProgress.badge} size="large" animation="sparkle" />
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <ProgressBar current={getProgressSteps()} total={4} color="green" showSteps stepLabels={['Learn', 'Goal Builder', 'Quiz', 'Badge']} animated />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { key: 'lesson', icon: BookOpen, label: 'Learn' },
              { key: 'goalGame', icon: Target, label: 'Goal Builder' },
              { key: 'quiz', icon: Star, label: 'Quiz' },
              { key: 'badge', icon: Award, label: 'Badge' },
            ].map(({ key, icon: Icon, label }) => (
              <div key={key} className={`flex items-center p-3 rounded-lg transition-all ${(weekProgress as any)[key] ? 'bg-teal-100 text-teal-700' : 'bg-gray-100'}`}>
                <Icon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{label}</span>
                {(weekProgress as any)[key] && <Check className="h-4 w-4 ml-auto" />}
              </div>
            ))}
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-teal-900 mb-2">🎯 What You'll Learn</h3>
            <p className="text-teal-700">Create SMART financial goals that actually work. You'll learn the framework, build a real goal in the activity, and understand how to turn big dreams into daily actions.</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setLessonStep('lesson')}
              className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-green-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              {weekProgress.lesson ? 'Review Goal-Setting Lesson' : 'Start Learning About Goals!'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            {weekProgress.lesson && (
              <button
                onClick={() => setLessonStep('goalGame')}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center"
              >
                {weekProgress.goalGame ? 'Review SMART Goal Builder' : 'Build Your SMART Goal'}
                <Target className="h-5 w-5 ml-2" />
              </button>
            )}
            {weekProgress.goalGame && (
              <button
                onClick={() => setLessonStep('quiz')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center"
              >
                {weekProgress.quiz ? 'Review Quiz' : 'Take the Quiz'}
                <Star className="h-5 w-5 ml-2" />
              </button>
            )}
            <button onClick={onBack} className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all">
              Back to Course Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoalGame = () => {
    const weeklyNeeded = getWeeklyAmount();

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-green-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">🎯 SMART Goal Builder</h2>
                <p className="text-teal-100 mt-1">Build your own real financial goal, step by step</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={resetGoalBuilder} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all">
                  <RotateCcw className="h-5 w-5" />
                </button>
                <button onClick={() => setLessonStep('overview')} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <ProgressBar current={gameStep} total={4} color="green" showPercentage />
            </div>

            {goalGameCompleted ? (
              <div className="text-center">
                <div className="bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-300 rounded-2xl p-8 mb-6">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-teal-800 mb-2">Your SMART Goal Card</h3>
                  <p className="text-teal-600 mb-6">Print this, save it as a screenshot, or write it down somewhere visible!</p>

                  <div className="bg-white rounded-xl p-6 border-2 border-teal-200 text-left space-y-4">
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white text-xs font-bold rounded px-2 py-1 mr-3 mt-0.5 whitespace-nowrap">SPECIFIC</span>
                      <p className="text-gray-800 font-medium">{smartGoal.categoryEmoji} {smartGoal.category}</p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-green-500 text-white text-xs font-bold rounded px-2 py-1 mr-3 mt-0.5 whitespace-nowrap">MEASURABLE</span>
                      <p className="text-gray-800 font-medium">Save <strong>${smartGoal.amount}</strong></p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-purple-500 text-white text-xs font-bold rounded px-2 py-1 mr-3 mt-0.5 whitespace-nowrap">ACHIEVABLE</span>
                      <p className="text-gray-800 font-medium">~${weeklyNeeded}/week — that's doable!</p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-orange-500 text-white text-xs font-bold rounded px-2 py-1 mr-3 mt-0.5 whitespace-nowrap">RELEVANT</span>
                      <p className="text-gray-800 font-medium">This goal matters to me personally</p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-red-500 text-white text-xs font-bold rounded px-2 py-1 mr-3 mt-0.5 whitespace-nowrap">TIME-BOUND</span>
                      <p className="text-gray-800 font-medium">In <strong>{smartGoal.timeframe}</strong></p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-teal-500 text-white text-xs font-bold rounded px-2 py-1 mr-3 mt-0.5 whitespace-nowrap">ACTION</span>
                      <p className="text-gray-800 font-medium">{smartGoal.action}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button onClick={resetGoalBuilder} className="bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all">
                    Build Another Goal
                  </button>
                  <button
                    onClick={() => {
                      setWeekProgress(prev => ({ ...prev, goalGame: true }));
                      setLessonStep('quiz');
                    }}
                    className="bg-gradient-to-r from-teal-500 to-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-teal-600 hover:to-green-600 transition-all transform hover:scale-105 flex items-center"
                  >
                    Take the Quiz <Star className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {gameStep === 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Step 1 of 4: What's your goal?</h3>
                    <p className="text-gray-600 mb-6">Pick the category that fits what you want to achieve. This is the <strong>Specific</strong> part of SMART.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {goalCategories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSMARTGoal(prev => ({ ...prev, category: cat.label, categoryEmoji: cat.emoji }));
                            setGameStep(1);
                          }}
                          className="p-5 rounded-xl border-2 border-teal-200 bg-teal-50 hover:border-teal-500 hover:bg-teal-100 transition-all transform hover:scale-105 text-left"
                        >
                          <div className="text-3xl mb-2">{cat.emoji}</div>
                          <h4 className="font-bold text-teal-800 mb-1">{cat.label}</h4>
                          <p className="text-teal-600 text-sm">{cat.example}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {gameStep === 1 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Step 2 of 4: How much do you want to save?</h3>
                    <p className="text-gray-600 mb-6">Pick an amount. This is the <strong>Measurable</strong> part of SMART — giving your goal a real number.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {amountOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSMARTGoal(prev => ({ ...prev, amount: opt.value }));
                            setGameStep(2);
                          }}
                          className="p-5 rounded-xl border-2 border-green-200 bg-green-50 hover:border-green-500 hover:bg-green-100 transition-all transform hover:scale-105 text-center"
                        >
                          <div className="text-2xl font-bold text-green-800 mb-1">{opt.label}</div>
                          <div className="text-xs text-green-600 bg-green-100 rounded-full px-2 py-0.5 inline-block">{opt.tag}</div>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setGameStep(0)} className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                  </div>
                )}

                {gameStep === 2 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Step 3 of 4: When do you want to hit this goal?</h3>
                    <p className="text-gray-600 mb-6">Choose a timeframe. This is the <strong>Time-bound</strong> part of SMART — a deadline creates urgency.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {timeframeOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSMARTGoal(prev => ({ ...prev, timeframe: opt.value, timeframeWeeks: opt.weeks }));
                            setGameStep(3);
                          }}
                          className="p-5 rounded-xl border-2 border-blue-200 bg-blue-50 hover:border-blue-500 hover:bg-blue-100 transition-all transform hover:scale-105 text-center"
                        >
                          <div className="text-xl font-bold text-blue-800 mb-1">{opt.label}</div>
                          <div className="text-xs text-blue-600 bg-blue-100 rounded-full px-2 py-0.5 inline-block">{opt.tag}</div>
                        </button>
                      ))}
                    </div>
                    {smartGoal.amount > 0 && (
                      <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-sm text-yellow-800">
                        💡 To save <strong>${smartGoal.amount}</strong>, you'll need roughly <strong>${Math.ceil(smartGoal.amount / (timeframeOptions.find(t => t.value === smartGoal.timeframe)?.weeks || 4))}/week</strong>. Choose a timeline that feels achievable!
                      </div>
                    )}
                    <button onClick={() => setGameStep(1)} className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                  </div>
                )}

                {gameStep === 3 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Step 4 of 4: How will you get there?</h3>
                    <p className="text-gray-600 mb-2">Pick your primary action. You'll need to save about <strong>${weeklyNeeded}/week</strong> to hit your goal.</p>
                    <p className="text-gray-500 text-sm mb-6">This is the <strong>Achievable</strong> part — a concrete plan makes the goal real.</p>
                    <div className="space-y-3 mb-6">
                      {actionOptions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSMARTGoal(prev => ({ ...prev, action: opt.label }));
                            setGoalGameCompleted(true);
                            setGameStep(4);
                          }}
                          className="w-full p-4 rounded-xl border-2 border-purple-200 bg-purple-50 hover:border-purple-500 hover:bg-purple-100 transition-all text-left font-medium text-purple-800"
                        >
                          ✅ {opt.label}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setGameStep(2)} className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                  </div>
                )}
              </div>
            )}

            {!goalGameCompleted && (
              <div className="mt-8 flex justify-between items-center">
                <button onClick={() => setLessonStep('lesson')} className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all">
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back to Lesson
                </button>
                <button
                  onClick={() => {
                    setWeekProgress(prev => ({ ...prev, goalGame: true }));
                    setLessonStep('quiz');
                  }}
                  className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all"
                >
                  Skip to Quiz <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBadgeCeremony = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-75 animate-pulse"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
            <p className="text-yellow-100 text-lg">You've earned the Goal Getter badge!</p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 left-4 text-yellow-300 animate-ping">✨</div>
            <div className="absolute top-8 right-8 text-yellow-300 animate-ping" style={{ animationDelay: '0.5s' }}>⭐</div>
            <div className="absolute bottom-6 left-8 text-yellow-300 animate-ping" style={{ animationDelay: '1s' }}>💫</div>
            <div className="absolute bottom-4 right-4 text-yellow-300 animate-ping" style={{ animationDelay: '1.5s' }}>✨</div>
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-300 rounded-2xl p-6 mb-6">
            <div className="text-8xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-orange-800 mb-2">Goal Getter</h3>
            <p className="text-orange-700 text-lg mb-4">You've learned to turn vague dreams into real, achievable financial plans!</p>
            <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">What you mastered:</h4>
              <div className="text-left space-y-2 text-orange-700">
                {[
                  'Why vague goals almost always fail',
                  'The 5-part SMART goal framework',
                  'The difference between short-term and long-term goals',
                  'How to build a weekly action plan to reach your goal',
                ].map(item => (
                  <div key={item} className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <h4 className="text-xl font-bold text-blue-800 mb-3">🔮 Coming Next Week...</h4>
            <div className="flex items-center justify-center mb-3">
              <div className="text-4xl mr-4">📱</div>
              <div className="text-left">
                <h5 className="font-semibold text-blue-800">Week 10: Money in the Digital Age</h5>
                <p className="text-blue-700">Navigate digital banking, payment apps, and stay safe from online scams!</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setWeekProgress(prev => ({ ...prev, badge: true }));
                onComplete(9, 'Goal Getter');
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Continue to Week 10! <ArrowRight className="h-6 w-6 ml-2" />
            </button>
            <button onClick={onBack} className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all">
              Back to Course Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (lessonStep) {
      case 'overview': return renderOverview();
      case 'lesson':
        return (
          <LessonComponent
            weekNumber={9}
            title="Financial Goals & Planning"
            sections={lessonSections}
            onComplete={handleLessonComplete}
            onBack={() => setLessonStep('overview')}
            color="green"
          />
        );
      case 'goalGame': return renderGoalGame();
      case 'quiz':
        return (
          <QuizEngine
            questions={quizQuestions}
            onComplete={handleQuizComplete}
            minPassingScore={3}
            maxLives={3}
            showHints
            allowRetry
            color="green"
          />
        );
      case 'badge': return renderBadgeCeremony();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-100 p-4">
      {renderCurrentStep()}
    </div>
  );
};

export default Week9Component;
