"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Check, Trophy, Star, ArrowRight, ArrowLeft, RotateCcw, X, Award, Calendar, Users, TrendingUp, Building2, Coins, DollarSign, Brain, Zap, Target, Rocket, PieChart, BarChart3, LineChart } from 'lucide-react';
import Badge from '../shared/Badge';
import ProgressBar from '../shared/ProgressBar';
import QuizEngine, { QuizQuestion } from '../shared/QuizEngine';
import LessonComponent, { LessonSection } from '../shared/LessonComponent';

interface Week8Props {
  onComplete: (weekNumber: number, badge: string) => void;
  onBack: () => void;
}

interface WeekProgress {
  lesson: boolean;
  investorGame: boolean;
  quiz: boolean;
  badge: boolean;
}

interface InvestorGameState {
  round: number;
  totalMoney: number;
  portfolio: {
    techStartup: number;
    governmentBond: number;
    realEstate: number;
    etfFund: number;
  };
  marketEvents: Array<{
    round: number;
    event: string;
    description: string;
    effects: {
      techStartup: number;
      governmentBond: number;
      realEstate: number;
      etfFund: number;
    };
  }>;
  playerChoices: Array<{
    round: number;
    investment: string;
    amount: number;
    reasoning: string;
    outcome: string;
  }>;
}

const Week8Component: React.FC<Week8Props> = ({ onComplete, onBack }) => {
  const [lessonStep, setLessonStep] = useState('overview');
  const [investorGameCompleted, setInvestorGameCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  
  // Investor Island Game State
  const [gameState, setGameState] = useState<InvestorGameState>({
    round: 1,
    totalMoney: 500,
    portfolio: {
      techStartup: 0,
      governmentBond: 0,
      realEstate: 0,
      etfFund: 0
    },
    marketEvents: [],
    playerChoices: []
  });
  
  const [currentMarketEvent, setCurrentMarketEvent] = useState<{
    title: string;
    description: string;
    effects: any;
    emoji: string;
  } | null>(null);
  
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [lastChoice, setLastChoice] = useState<{
    investment: string;
    amount: number;
    outcome: string;
    portfolioChange: number;
  } | null>(null);

  // Market events for each round
  const marketEvents = [
    {
      title: "Tech Boom Year",
      description: "New AI breakthrough causes tech stocks to surge!",
      effects: { techStartup: 0.25, governmentBond: 0.02, realEstate: 0.05, etfFund: 0.08 },
      emoji: "🚀"
    },
    {
      title: "Interest Rate Changes",
      description: "Central bank adjusts interest rates, affecting all markets",
      effects: { techStartup: -0.05, governmentBond: 0.04, realEstate: 0.03, etfFund: 0.02 },
      emoji: "📊"
    },
    {
      title: "Housing Market Surge",
      description: "Real estate prices climb as demand increases",
      effects: { techStartup: 0.02, governmentBond: 0.03, realEstate: 0.15, etfFund: 0.06 },
      emoji: "🏠"
    },
    {
      title: "Market Correction",
      description: "Markets adjust after period of growth",
      effects: { techStartup: -0.15, governmentBond: 0.03, realEstate: -0.05, etfFund: -0.08 },
      emoji: "📉"
    },
    {
      title: "Economic Recovery",
      description: "Strong economic data boosts investor confidence",
      effects: { techStartup: 0.12, governmentBond: 0.03, realEstate: 0.08, etfFund: 0.10 },
      emoji: "📈"
    }
  ];

  const [weekProgress, setWeekProgress] = useState<WeekProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('week8Progress');
      return saved ? JSON.parse(saved) : {
        lesson: false,
        investorGame: false,
        quiz: false,
        badge: false
      };
    }
    return {
      lesson: false,
      investorGame: false,
      quiz: false,
      badge: false
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('week8Progress', JSON.stringify(weekProgress));
    }
  }, [weekProgress]);

  // Initialize market event for current round
  useEffect(() => {
    if (gameState.round <= 5 && !currentMarketEvent && !showRoundResult && !investorGameCompleted) {
      setCurrentMarketEvent(marketEvents[gameState.round - 1]);
    }
  }, [gameState.round, currentMarketEvent, showRoundResult, investorGameCompleted]);

  // Quiz questions for Week 8
  const quizQuestions: QuizQuestion[] = [
    {
      question: "What is the main goal of investing?",
      options: [
        "Keep money completely safe",
        "Grow money over time to build wealth",
        "Spend money on things you want"
      ],
      correct: 1,
      explanation: "Investing is about growing your money over time! While saving keeps money safe, investing gives it the chance to multiply and build real wealth.",
      hint: "Think about what you want your money to do in the future.",
      difficulty: 'easy'
    },
    {
      question: "Which investment typically has the highest risk but also highest potential reward?",
      options: [
        "Government bonds",
        "Individual company stocks",
        "Savings accounts"
      ],
      correct: 1,
      explanation: "Individual stocks can be very risky because one company's fortunes can change quickly, but they also offer the highest growth potential!",
      hint: "Think about which investment can change the most dramatically.",
      difficulty: 'medium'
    },
    {
      question: "Why is starting to invest early so powerful?",
      options: [
        "You have more money when you're young",
        "Compound interest has more time to work",
        "Investments are cheaper when you're young"
      ],
      correct: 1,
      explanation: "Time is your superpower! Compound interest means your money earns money, and then that money earns money too. The longer this happens, the more dramatic the growth!",
      hint: "Think about how compound interest works over many years.",
      difficulty: 'medium'
    },
    {
      question: "What does 'diversification' mean in investing?",
      options: [
        "Putting all your money in one great investment",
        "Spreading your money across different types of investments",
        "Only investing in companies you personally like"
      ],
      correct: 1,
      explanation: "Don't put all your eggs in one basket! Diversification spreads risk so if one investment does poorly, others might do well.",
      hint: "Think about the phrase 'don't put all your eggs in one basket.'",
      difficulty: 'medium'
    }
  ];

  // Lesson sections for Week 8 - much more detailed like Week 7
  const lessonSections: LessonSection[] = [
    {
      id: 'birthday-money-challenge',
      title: 'The $100 Birthday Money Challenge 🎂',
      type: 'activity',
      content: (
        <div>
          <div className="bg-purple-100 p-6 rounded-lg mb-4">
            <p className="text-lg text-purple-800 mb-4">
              <strong>Imagine this scenario:</strong> Your grandparents just gave you $100 for your birthday! 🎉
            </p>
            <div className="bg-white p-4 rounded-lg mb-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">💰</div>
                <p className="font-bold text-purple-600 text-xl">You have $100 in cash!</p>
                <p className="text-gray-600">What should you do with it?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border border-blue-300">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🏦</div>
                  <h4 className="font-bold text-blue-700">Option A: Save It</h4>
                </div>
                <p className="text-blue-600 text-center text-sm">Put it in a savings account earning 1% interest per year</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-orange-300">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🛍️</div>
                  <h4 className="font-bold text-orange-700">Option B: Spend It</h4>
                </div>
                <p className="text-orange-600 text-center text-sm">Buy that new video game or clothes you've been wanting</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-300">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">📈</div>
                  <h4 className="font-bold text-green-700">Option C: Invest It</h4>
                </div>
                <p className="text-green-600 text-center text-sm">Buy shares in companies like Apple, Disney, or Tesla</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border-2 border-purple-200 mb-4">
            <h4 className="font-bold text-purple-800 mb-4">🕒 Fast Forward 10 Years: The Results Are In!</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="p-3 text-left">Option</th>
                    <th className="p-3 text-center">Starting Amount</th>
                    <th className="p-3 text-center">After 10 Years</th>
                    <th className="p-3 text-center">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">🏦 Savings (1%)</td>
                    <td className="p-3 text-center">$100</td>
                    <td className="p-3 text-center text-blue-600">$110</td>
                    <td className="p-3 text-center text-blue-600">+$10</td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="p-3 font-medium">🛍️ Spending</td>
                    <td className="p-3 text-center">$100</td>
                    <td className="p-3 text-center text-orange-600">$0</td>
                    <td className="p-3 text-center text-orange-600">-$100</td>
                  </tr>
                  <tr className="bg-green-100">
                    <td className="p-3 font-medium">📈 Investing (7% avg)</td>
                    <td className="p-3 text-center">$100</td>
                    <td className="p-3 text-center text-green-600 font-bold text-lg">$197</td>
                    <td className="p-3 text-center text-green-600 font-bold">+$97</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-lg p-3">
                <span className="text-green-800 font-medium">🚀 Investing nearly DOUBLED your money!</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-yellow-800 mb-3">🤔 Discussion Time:</h4>
            <ul className="text-yellow-700 space-y-2">
              <li>• Which option surprised you the most?</li>
              <li>• Would the spending option have made you happy for 10 years?</li>
              <li>• What if you could do a mix - spend some, save some, invest some?</li>
              <li>• How might your choice change if this was $1,000 instead of $100?</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">💡 The Big Insight:</h4>
            <p className="text-blue-700">
              <strong>Your money can work FOR you!</strong> When you invest, you're not just storing money - 
              you're giving it a job. And that job is to grow and make you wealthier over time. 
              The earlier you start, the harder your money works!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'what-is-investing-deep',
      title: 'What Is Investing Really? (And Why Should You Care?) 🧠',
      type: 'example',
      content: (
        <div>
          <div className="bg-blue-100 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-blue-800 mb-3">🎯 The Simple Truth:</h4>
            <p className="text-blue-700 text-lg mb-3">
              <strong>Investing</strong> means buying something you believe will be worth MORE money in the future.
            </p>
            <div className="bg-white p-4 rounded border border-blue-300">
              <p className="text-blue-600">
                Instead of your money just sitting there doing nothing, investing puts it to work! 
                You become an owner of businesses, real estate, or other assets that can grow in value.
              </p>
            </div>
          </div>
          
          <div className="bg-white border-2 border-purple-200 rounded-lg p-6 mb-4">
            <h4 className="font-bold text-purple-800 mb-4">📊 Saving vs Investing: The Ultimate Showdown</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="p-3 text-left font-bold">Category</th>
                    <th className="p-3 text-center">Saving 💰</th>
                    <th className="p-3 text-center">Investing 📈</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Safety</td>
                    <td className="p-3 text-center">
                      <div className="text-green-600 font-bold">Very Safe ✅</div>
                      <div className="text-xs text-green-500">FDIC protected</div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="text-yellow-600 font-bold">Some Risk ⚠️</div>
                      <div className="text-xs text-yellow-500">Can go up or down</div>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="p-3 font-medium">Growth Potential</td>
                    <td className="p-3 text-center">
                      <div className="text-blue-600">Low 🌱</div>
                      <div className="text-xs text-blue-500">1-2% per year</div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="text-green-600 font-bold">High 🚀</div>
                      <div className="text-xs text-green-500">5-10% average</div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Access to Money</td>
                    <td className="p-3 text-center">
                      <div className="text-green-600">Immediate ⚡</div>
                      <div className="text-xs text-green-500">ATM anytime</div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="text-orange-600">Delayed 🕐</div>
                      <div className="text-xs text-orange-500">May take days to sell</div>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="p-3 font-medium">Best For</td>
                    <td className="p-3 text-center">
                      <div className="text-blue-600">Emergency fund</div>
                      <div className="text-xs text-blue-500">Short-term goals</div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="text-green-600">Building wealth</div>
                      <div className="text-xs text-green-500">Long-term goals</div>
                    </td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="p-3 font-medium">Time Frame</td>
                    <td className="p-3 text-center">
                      <div className="text-blue-600">Any time ⌛</div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="text-green-600">5+ years ⏳</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h5 className="font-bold text-green-800 mb-3">🏆 When Investing Wins:</h5>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• You don't need the money for 5+ years</li>
                <li>• You want to build serious wealth</li>
                <li>• You can handle some ups and downs</li>
                <li>• You have an emergency fund already</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="font-bold text-blue-800 mb-3">🛡️ When Saving Wins:</h5>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• You need money within 2 years</li>
                <li>• Building your emergency fund</li>
                <li>• Can't afford to lose any money</li>
                <li>• Peace of mind is most important</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-800 mb-3">🎮 Quick Decision Game:</h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-yellow-300">
                <p className="text-yellow-700 mb-2"><strong>Scenario 1:</strong> You want to buy a car in 2 years</p>
                <p className="text-green-600 font-medium">💡 Best choice: Save it! Too short for investing.</p>
              </div>
              <div className="bg-white p-3 rounded border border-yellow-300">
                <p className="text-yellow-700 mb-2"><strong>Scenario 2:</strong> You want to be rich when you're 30</p>
                <p className="text-green-600 font-medium">💡 Best choice: Invest it! Long-term wealth building.</p>
              </div>
              <div className="bg-white p-3 rounded border border-yellow-300">
                <p className="text-yellow-700 mb-2"><strong>Scenario 3:</strong> You need money for emergencies</p>
                <p className="text-green-600 font-medium">💡 Best choice: Save it! Need immediate access.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'risk-reward-adventure',
      title: 'The Risk & Reward Adventure! 🎢',
      type: 'story',
      content: (
        <div>
          <div className="bg-red-50 p-6 rounded-lg mb-4">
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">🎢</div>
              <h4 className="font-bold text-red-800">Welcome to Investment Amusement Park!</h4>
            </div>
            <p className="text-red-700 text-center mb-4">
              Every investment is like a different ride. Some are gentle and safe, others are wild and exciting! 
              The more thrilling the ride, the bigger the potential reward... but also the bigger the risk!
            </p>
          </div>
          
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-4">
            <h4 className="font-bold text-gray-800 mb-4">🎠 Choose Your Investment Adventure!</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">🎠</div>
                  <h5 className="font-bold text-green-800">The Merry-Go-Round</h5>
                  <p className="text-green-600 text-sm">Government Bonds</p>
                </div>
                <div className="space-y-2 text-green-700 text-sm">
                  <p><strong>The Ride:</strong> Gentle, predictable, safe</p>
                  <p><strong>Risk:</strong> Very Low 🟢</p>
                  <p><strong>Reward:</strong> Small but steady (2-4%)</p>
                  <p><strong>Good for:</strong> Cautious investors</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">🎡</div>
                  <h5 className="font-bold text-blue-800">The Ferris Wheel</h5>
                  <p className="text-blue-600 text-sm">Real Estate</p>
                </div>
                <div className="space-y-2 text-blue-700 text-sm">
                  <p><strong>The Ride:</strong> Slow but steady climbs</p>
                  <p><strong>Risk:</strong> Medium 🟡</p>
                  <p><strong>Reward:</strong> Moderate growth (5-8%)</p>
                  <p><strong>Good for:</strong> Patient investors</p>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">🎢</div>
                  <h5 className="font-bold text-purple-800">The Roller Coaster</h5>
                  <p className="text-purple-600 text-sm">Stock Market</p>
                </div>
                <div className="space-y-2 text-purple-700 text-sm">
                  <p><strong>The Ride:</strong> Lots of ups and downs!</p>
                  <p><strong>Risk:</strong> High 🟠</p>
                  <p><strong>Reward:</strong> High potential (8-12%)</p>
                  <p><strong>Good for:</strong> Thrill-seekers</p>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">🚀</div>
                  <h5 className="font-bold text-red-800">The Space Launch</h5>
                  <p className="text-red-600 text-sm">Cryptocurrency</p>
                </div>
                <div className="space-y-2 text-red-700 text-sm">
                  <p><strong>The Ride:</strong> Extreme highs and lows</p>
                  <p><strong>Risk:</strong> Very High 🔴</p>
                  <p><strong>Reward:</strong> Massive potential (or loss!)</p>
                  <p><strong>Good for:</strong> Daredevils only</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-yellow-800 mb-4">🎯 The Golden Rule of Risk & Reward:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded border border-yellow-300 text-center">
                <div className="text-3xl mb-2">⚖️</div>
                <h5 className="font-bold text-yellow-700">Higher Risk =</h5>
                <p className="text-yellow-600 text-sm">Higher potential reward<br/>(but also higher potential loss)</p>
              </div>
              <div className="bg-white p-4 rounded border border-yellow-300 text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h5 className="font-bold text-yellow-700">Lower Risk =</h5>
                <p className="text-yellow-600 text-sm">Lower, but more predictable returns</p>
              </div>
              <div className="bg-white p-4 rounded border border-yellow-300 text-center">
                <div className="text-3xl mb-2">🎪</div>
                <h5 className="font-bold text-yellow-700">Smart Strategy =</h5>
                <p className="text-yellow-600 text-sm">Mix different rides for the perfect experience!</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-purple-800 mb-3">🤔 Choose Your Adventure Questions:</h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-purple-300">
                <p className="text-purple-700 mb-2"><strong>Question 1:</strong> You have $1,000 and won't need it for 10 years. Which ride do you choose?</p>
                <p className="text-purple-600 text-sm">Think about: Your age, comfort with risk, and long-term goals.</p>
              </div>
              <div className="bg-white p-3 rounded border border-purple-300">
                <p className="text-purple-700 mb-2"><strong>Question 2:</strong> What if you were 50 years old vs 15 years old?</p>
                <p className="text-purple-600 text-sm">How might your age change your choice and why?</p>
              </div>
              <div className="bg-white p-3 rounded border border-purple-300">
                <p className="text-purple-700 mb-2"><strong>Question 3:</strong> Would you rather have a guaranteed $50 or a 50% chance at $200?</p>
                <p className="text-purple-600 text-sm">This reveals your personal risk tolerance!</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">🎪 The Smart Investor's Secret:</h4>
            <p className="text-blue-700">
              You don't have to choose just ONE ride! Smart investors mix different investments - 
              some safe merry-go-rounds, some exciting roller coasters. This is called 
              <strong> diversification</strong>, and it's like having the perfect day at the amusement park! 🎢🎠🎡
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'investment-types-deep',
      title: 'Your Investment Toolkit: 4 Powerful Options! 🧰',
      type: 'tip',
      content: (
        <div>
          <p className="text-lg mb-4">
            Ready to become an investment expert? Here are the 4 main ways to invest your money, 
            each with its ownsuperpowers and best use cases!
         </p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
           <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
             <div className="text-center mb-4">
               <div className="text-4xl mb-2">📈</div>
               <h4 className="font-bold text-blue-800">1. STOCKS</h4>
               <p className="text-blue-600 text-sm">Own a piece of a company</p>
             </div>
             <div className="bg-white p-4 rounded border border-blue-300 mb-3">
               <p className="text-blue-700 mb-2"><strong>What it really means:</strong></p>
               <p className="text-blue-600 text-sm mb-3">
                 When you buy Apple stock, you literally own a tiny piece of Apple! 
                 If Apple does well, your piece becomes more valuable.
               </p>
               <p className="text-blue-700 mb-2"><strong>Real example:</strong></p>
               <p className="text-blue-600 text-sm">
                 One share of Apple in 2010: $30<br/>
                 Same share in 2023: $190<br/>
                 <strong>That's over 6x growth! 🚀</strong>
               </p>
             </div>
             <div className="bg-blue-100 p-3 rounded">
               <div className="text-xs text-blue-700">
                 <strong>Risk Level:</strong> Medium to High 🔶<br/>
                 <strong>Best for:</strong> Long-term growth<br/>
                 <strong>Fun fact:</strong> Warren Buffett made billions from stocks!
               </div>
             </div>
           </div>

           <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
             <div className="text-center mb-4">
               <div className="text-4xl mb-2">📜</div>
               <h4 className="font-bold text-green-800">2. BONDS</h4>
               <p className="text-green-600 text-sm">Loan money and earn interest</p>
             </div>
             <div className="bg-white p-4 rounded border border-green-300 mb-3">
               <p className="text-green-700 mb-2"><strong>What it really means:</strong></p>
               <p className="text-green-600 text-sm mb-3">
                 You're like a bank! You lend money to the government or companies, 
                 and they pay you back with interest.
               </p>
               <p className="text-green-700 mb-2"><strong>Real example:</strong></p>
               <p className="text-green-600 text-sm">
                 Lend $1,000 to US Government for 10 years<br/>
                 Get back: $1,000 + $300 interest<br/>
                 <strong>Safe and steady! 🛡️</strong>
               </p>
             </div>
             <div className="bg-green-100 p-3 rounded">
               <div className="text-xs text-green-700">
                 <strong>Risk Level:</strong> Low 🟢<br/>
                 <strong>Best for:</strong> Steady income<br/>
                 <strong>Fun fact:</strong> Even kids can buy government bonds!
               </div>
             </div>
           </div>

           <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
             <div className="text-center mb-4">
               <div className="text-4xl mb-2">🏡</div>
               <h4 className="font-bold text-orange-800">3. REAL ESTATE</h4>
               <p className="text-orange-600 text-sm">Own property that can grow in value</p>
             </div>
             <div className="bg-white p-4 rounded border border-orange-300 mb-3">
               <p className="text-orange-700 mb-2"><strong>What it really means:</strong></p>
               <p className="text-orange-600 text-sm mb-3">
                 Buy houses, apartments, or land. Make money when the property 
                 becomes more valuable or rent it to others.
               </p>
               <p className="text-orange-700 mb-2"><strong>Real example:</strong></p>
               <p className="text-orange-600 text-sm">
                 House bought in 2000: $200,000<br/>
                 Same house in 2023: $400,000<br/>
                 <strong>Plus rental income every month! 🏠</strong>
               </p>
             </div>
             <div className="bg-orange-100 p-3 rounded">
               <div className="text-xs text-orange-700">
                 <strong>Risk Level:</strong> Medium 🟡<br/>
                 <strong>Best for:</strong> Long-term wealth<br/>
                 <strong>Fun fact:</strong> People need places to live!
               </div>
             </div>
           </div>

           <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
             <div className="text-center mb-4">
               <div className="text-4xl mb-2">🧺</div>
               <h4 className="font-bold text-purple-800">4. FUNDS (ETFs/Mutual)</h4>
               <p className="text-purple-600 text-sm">A basket of many investments</p>
             </div>
             <div className="bg-white p-4 rounded border border-purple-300 mb-3">
               <p className="text-purple-700 mb-2"><strong>What it really means:</strong></p>
               <p className="text-purple-600 text-sm mb-3">
                 Instead of picking one company, you buy a piece of HUNDREDS of companies 
                 all at once! It's like a sampler pack.
               </p>
               <p className="text-purple-700 mb-2"><strong>Real example:</strong></p>
               <p className="text-purple-600 text-sm">
                 S&P 500 fund = pieces of Apple, Google, Microsoft, etc.<br/>
                 One purchase = instant diversification<br/>
                 <strong>Perfect for beginners! 🌟</strong>
               </p>
             </div>
             <div className="bg-purple-100 p-3 rounded">
               <div className="text-xs text-purple-700">
                 <strong>Risk Level:</strong> Low to Medium 🟡<br/>
                 <strong>Best for:</strong> Beginners, busy people<br/>
                 <strong>Fun fact:</strong> Warren Buffett recommends these!
               </div>
             </div>
           </div>
         </div>

         <div className="bg-gray-50 p-6 rounded-lg mb-4">
           <h4 className="font-bold text-gray-800 mb-4">🎯 Quick Quiz: Match the Investor!</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded border">
               <p className="font-medium text-gray-800 mb-2">👵 Grandma (70 years old, needs steady income)</p>
               <p className="text-green-600 font-bold">Best choice: Bonds 📜</p>
               <p className="text-green-500 text-sm">Safe and provides regular payments</p>
             </div>
             <div className="bg-white p-4 rounded border">
               <p className="font-medium text-gray-800 mb-2">🧑‍🎓 College Student (20 years old, investing for 40+ years)</p>
               <p className="text-blue-600 font-bold">Best choice: Stock Funds 📈</p>
               <p className="text-blue-500 text-sm">Time to ride out ups and downs for big growth</p>
             </div>
             <div className="bg-white p-4 rounded border">
               <p className="font-medium text-gray-800 mb-2">👨‍💼 Working Parent (35 years old, wants balance)</p>
               <p className="text-purple-600 font-bold">Best choice: Mixed Fund 🧺</p>
               <p className="text-purple-500 text-sm">Diversified for steady growth with some safety</p>
             </div>
             <div className="bg-white p-4 rounded border">
               <p className="font-medium text-gray-800 mb-2">🎮 You (Teen, just starting, small amount)</p>
               <p className="text-orange-600 font-bold">Best choice: ETF Fund 🌟</p>
               <p className="text-orange-500 text-sm">Learn with low risk, automatic diversification</p>
             </div>
           </div>
         </div>

         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
           <h4 className="font-bold text-yellow-800 mb-2">🧠 Pro Investor Secret:</h4>
           <p className="text-yellow-700">
             You don't have to choose just ONE! A smart portfolio might be: 
             <strong>60% stock funds + 30% bond funds + 10% real estate</strong>. 
             This gives you growth potential with some safety. As you get older and closer to needing the money, 
             you shift to safer investments. It's like adjusting your strategy in a video game! 🎮
           </p>
         </div>
       </div>
     )
   },
   {
     id: 'time-superpower-detailed',
     title: 'Time: Your Ultimate Investment Superpower! ⚡',
     type: 'tip',
     content: (
       <div>
         <div className="bg-blue-100 p-6 rounded-lg mb-4">
           <div className="text-center mb-4">
             <div className="text-6xl mb-3">⏰</div>
             <h4 className="font-bold text-blue-800">Why Being Young Is Your Secret Weapon!</h4>
           </div>
           <p className="text-blue-700 text-center text-lg">
             Adults would give anything to have what you have right now: <strong>TIME</strong>. 
             It's the most powerful force in investing, and you have decades of it!
           </p>
         </div>
         
         <div className="bg-white border-2 border-green-200 rounded-lg p-6 mb-4">
           <h4 className="font-bold text-green-800 mb-4">🔥 The Compound Interest Snowball Effect</h4>
           <div className="bg-green-50 p-4 rounded border border-green-300 mb-4">
             <p className="text-green-700 mb-3">
               <strong>Meet Sarah and Mike - The Tale of Two Investors:</strong>
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded border border-green-400">
                 <h5 className="font-bold text-green-800 mb-2">🚀 Early Bird Sarah</h5>
                 <ul className="text-green-700 text-sm space-y-1">
                   <li>• Starts investing at age 16</li>
                   <li>• Invests $100/month for 10 years</li>
                   <li>• Then STOPS (total invested: $12,000)</li>
                   <li>• Lets money grow until age 65</li>
                 </ul>
               </div>
               <div className="bg-white p-4 rounded border border-orange-400">
                 <h5 className="font-bold text-orange-800 mb-2">🐌 Late Starter Mike</h5>
                 <ul className="text-orange-700 text-sm space-y-1">
                   <li>• Starts investing at age 26</li>
                   <li>• Invests $100/month for 39 years</li>
                   <li>• Never stops (total invested: $46,800)</li>
                   <li>• Invests until age 65</li>
                 </ul>
               </div>
             </div>
           </div>
           
           <div className="bg-white p-4 rounded border-2 border-yellow-400">
             <h5 className="font-bold text-yellow-800 mb-3 text-center">🏆 The Shocking Results at Age 65:</h5>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="text-center p-4 bg-green-100 rounded">
                 <div className="text-2xl font-bold text-green-800">Sarah (Early Bird)</div>
                 <div className="text-lg text-green-600">Invested: $12,000</div>
                 <div className="text-3xl font-bold text-green-800">Final: $1,019,160</div>
                 <div className="text-green-600 text-sm">Started early, stopped at 26</div>
               </div>
               <div className="text-center p-4 bg-orange-100 rounded">
                 <div className="text-2xl font-bold text-orange-800">Mike (Late Starter)</div>
                 <div className="text-lg text-orange-600">Invested: $46,800</div>
                 <div className="text-3xl font-bold text-orange-800">Final: $773,772</div>
                 <div className="text-orange-600 text-sm">Started late, never stopped</div>
               </div>
             </div>
             <div className="text-center mt-4 p-3 bg-yellow-100 rounded">
               <p className="font-bold text-yellow-800">
                 Sarah invested LESS money but ended up with MORE! 🤯<br/>
                 That's the power of starting early!
               </p>
             </div>
           </div>
         </div>

         <div className="bg-purple-50 p-6 rounded-lg mb-4">
           <h4 className="font-bold text-purple-800 mb-4">🎯 Your Age Is Your Advantage!</h4>
           <div className="space-y-4">
             <div className="bg-white p-4 rounded border border-purple-300">
               <h5 className="font-bold text-purple-700 mb-2">🧒 If you start at 16 with just $50/month:</h5>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                 <div className="bg-purple-100 p-2 rounded">
                   <div className="font-bold text-purple-800">Age 25</div>
                   <div className="text-sm text-purple-600">$7,600</div>
                 </div>
                 <div className="bg-purple-100 p-2 rounded">
                   <div className="font-bold text-purple-800">Age 35</div>
                   <div className="text-sm text-purple-600">$23,000</div>
                 </div>
                 <div className="bg-purple-100 p-2 rounded">
                   <div className="font-bold text-purple-800">Age 45</div>
                   <div className="text-sm text-purple-600">$67,000</div>
                 </div>
                 <div className="bg-green-100 p-2 rounded border-2 border-green-400">
                   <div className="font-bold text-green-800">Age 65</div>
                   <div className="text-sm text-green-600 font-bold">$509,000!</div>
                 </div>
               </div>
             </div>
             
             <div className="bg-white p-4 rounded border border-red-300">
               <h5 className="font-bold text-red-700 mb-2">😰 If you wait until 25 with the same $50/month:</h5>
               <div className="text-center p-3 bg-red-100 rounded">
                 <div className="font-bold text-red-800">Age 65: Only $247,000</div>
                 <div className="text-red-600 text-sm">You lost $262,000 by waiting 9 years!</div>
               </div>
             </div>
           </div>
         </div>

         <div className="bg-yellow-50 p-4 rounded-lg mb-4">
           <h4 className="font-bold text-yellow-800 mb-3">🧮 The Magic Formula:</h4>
           <div className="bg-white p-4 rounded border border-yellow-300">
             <div className="text-center mb-3">
               <div className="text-2xl font-bold text-yellow-700">Small Amount × Long Time = HUGE Money</div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
               <div className="bg-yellow-100 p-3 rounded">
                 <div className="text-3xl mb-1">💰</div>
                 <div className="font-bold text-yellow-800">$25/month</div>
                 <div className="text-yellow-600 text-sm">Less than Netflix!</div>
               </div>
               <div className="bg-yellow-100 p-3 rounded">
                 <div className="text-3xl mb-1">⏰</div>
                 <div className="font-bold text-yellow-800">50 years</div>
                 <div className="text-yellow-600 text-sm">Your secret weapon</div>
               </div>
               <div className="bg-green-100 p-3 rounded border-2 border-green-400">
                 <div className="text-3xl mb-1">🏆</div>
                 <div className="font-bold text-green-800">$254,000</div>
                 <div className="text-green-600 text-sm">Your future wealth!</div>
               </div>
             </div>
           </div>
         </div>

         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
           <h4 className="font-bold text-blue-800 mb-2">💪 Your Mission (If You Choose to Accept It):</h4>
           <div className="space-y-2 text-blue-700">
             <p>• <strong>Start NOW</strong> - even with pocket change</p>
             <p>• <strong>Stay consistent</strong> - small amounts add up</p>
             <p>• <strong>Think long-term</strong> - your future self will thank you</p>
             <p>• <strong>Don't wait</strong> - every year you delay costs thousands!</p>
           </div>
           <div className="mt-3 p-3 bg-blue-100 rounded">
             <p className="text-blue-800 font-medium text-center">
               🎯 Even $10-20 per month starting now beats $200/month starting at 30!
             </p>
           </div>
         </div>
       </div>
     )
   }
 ];

 // Investor Island Game functions
 const makeInvestmentChoice = (investmentType: 'techStartup' | 'governmentBond' | 'realEstate' | 'etfFund', amount: number) => {
   if (gameState.totalMoney < amount || !currentMarketEvent) return;

   const event = currentMarketEvent;
   const returnRate = event.effects[investmentType];
   const portfolioChange = amount * returnRate;
   const newValue = amount + portfolioChange;

   const newState = { ...gameState };
   newState.totalMoney -= amount;
   newState.portfolio[investmentType] += newValue;
   
   const choice = {
     round: gameState.round,
     investment: investmentType.charAt(0).toUpperCase() + investmentType.slice(1).replace(/([A-Z])/g, ' $1'),
     amount,
     reasoning: `Invested in ${investmentType} during ${event.title}`,
     outcome: `${returnRate >= 0 ? 'Gained' : 'Lost'} ${Math.abs(portfolioChange).toFixed(2)} (${(returnRate * 100).toFixed(1)}%)`
   };

   newState.playerChoices.push(choice);
   
   setLastChoice({
     investment: choice.investment,
     amount,
     outcome: choice.outcome,
     portfolioChange
   });

   setGameState(newState);
   setShowRoundResult(true);
   setCurrentMarketEvent(null);
 };

 const nextGameRound = () => {
   if (gameState.round >= 5) {
     setInvestorGameCompleted(true);
     setWeekProgress(prev => ({ ...prev, investorGame: true }));
   } else {
     setGameState(prev => ({ ...prev, round: prev.round + 1 }));
     setCurrentMarketEvent(marketEvents[gameState.round]);
   }
   setShowRoundResult(false);
   setLastChoice(null);
 };

 const resetInvestorGame = () => {
   setGameState({
     round: 1,
     totalMoney: 500,
     portfolio: {
       techStartup: 0,
       governmentBond: 0,
       realEstate: 0,
       etfFund: 0
     },
     marketEvents: [],
     playerChoices: []
   });
   setCurrentMarketEvent(marketEvents[0]);
   setShowRoundResult(false);
   setLastChoice(null);
   setInvestorGameCompleted(false);
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
   setLessonStep('investorGame');
 };

 const getProgressSteps = () => {
   const steps = [];
   if (weekProgress.lesson) steps.push('lesson');
   if (weekProgress.investorGame) steps.push('investorGame');
   if (weekProgress.quiz) steps.push('quiz');
   if (weekProgress.badge) steps.push('badge');
   return steps.length;
 };

 const getTotalPortfolioValue = () => {
   return Object.values(gameState.portfolio).reduce((sum, value) => sum + value, 0);
 };

 // Render functions
 const renderOverview = () => (
   <div className="max-w-4xl mx-auto">
     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
       <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 text-white">
         <div className="flex items-center justify-between">
           <div>
             <h2 className="text-2xl font-bold">Week 8: Investment Fundamentals 🚀</h2>
             <p className="text-purple-100 mt-2">Discover how to make your money work for you through investing!</p>
             <div className="flex items-center space-x-4 mt-3 text-sm">
               <div className="flex items-center">
                 <Users className="h-4 w-4 mr-1" />
                 <span>Ages 13-16</span>
               </div>
               <div className="flex items-center">
                 <Calendar className="h-4 w-4 mr-1" />
                 <span>30-35 minutes</span>
               </div>
             </div>
           </div>
           <Badge 
             badge="🧠 Future Investor"
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
             stepLabels={['Learn', 'Investor Island', 'Quiz', 'Badge']}
             animated
           />
         </div>

         <div className="grid grid-cols-4 gap-4 mb-6">
           <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.lesson ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>
             <BookOpen className="h-5 w-5 mr-2" />
             <span className="text-sm font-medium">Learn</span>
             {weekProgress.lesson && <Check className="h-4 w-4 ml-auto" />}
           </div>
           <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.investorGame ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>
             <TrendingUp className="h-5 w-5 mr-2" />
             <span className="text-sm font-medium">Investor Island</span>
             {weekProgress.investorGame && <Check className="h-4 w-4 ml-auto" />}
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
           <p className="text-purple-700">Master the basics of investing! Learn how money can grow over time, understand different types of investments, and practice making smart investment decisions.</p>
         </div>

         <div className="space-y-3">
           <button
             onClick={() => setLessonStep('lesson')}
             className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center justify-center"
           >
             {weekProgress.lesson ? 'Review Investment Basics' : 'Learn About Investing!'}
             <Rocket className="h-5 w-5 ml-2" />
           </button>
           
           {weekProgress.lesson && (
             <button
               onClick={() => setLessonStep('investorGame')}
               className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all flex items-center justify-center"
             >
               {weekProgress.investorGame ? 'Review Investor Island' : 'Play Investor Island Game'}
               <TrendingUp className="h-5 w-5 ml-2" />
             </button>
           )}
           
           {weekProgress.investorGame && (
             <button
               onClick={() => setLessonStep('quiz')}
               className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center"
             >
               {weekProgress.quiz ? 'Review Quiz' : 'Take the Investment Quiz'}
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

 const renderInvestorIslandGame = () => (
   <div className="max-w-6xl mx-auto">
     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
       <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
         <div className="flex items-center justify-between">
           <div>
             <h2 className="text-2xl font-bold">🏝️ Investor Island Challenge</h2>
             <p className="text-blue-100 mt-2">Navigate 5 years of market events with your $500 portfolio. Make smart investment choices!</p>
           </div>
           <div className="flex items-center space-x-4">
             <button
               onClick={resetInvestorGame}
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
         {investorGameCompleted && (
           <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
             <div className="text-4xl mb-2">🏁</div>
             <h3 className="text-xl font-bold text-green-800 mb-2">Investment Journey Complete!</h3>
             <p className="text-green-700">
               Final Portfolio Value: ${(gameState.totalMoney + getTotalPortfolioValue()).toFixed(2)}
             </p>
             <p className="text-green-600 text-sm mt-2">
               {getTotalPortfolioValue() + gameState.totalMoney > 500 ? "🏆 Your investments grew! Great job navigating the markets!" : "💡 Markets can be unpredictable!Keep learning about long-term investing strategies!"}
             </p>
           </div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
             {currentMarketEvent && !showRoundResult && !investorGameCompleted ? (
               <div>
                 <h3 className="text-xl font-semibold text-gray-800 mb-2">Year {gameState.round} of 5</h3>
                 <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                   <div className="text-center mb-4">
                     <div className="text-6xl mb-3">{currentMarketEvent.emoji}</div>
                     <h4 className="text-xl font-bold text-yellow-800">{currentMarketEvent.title}</h4>
                     <p className="text-yellow-700">{currentMarketEvent.description}</p>
                   </div>
                   
                   <div className="bg-white p-4 rounded-lg border border-yellow-300">
                     <h5 className="font-bold text-yellow-800 mb-3">📊 This Year's Market Effects:</h5>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                       <div className="text-center">
                         <div className="font-medium text-red-700">🚀 Tech Startup</div>
                         <div className={`font-bold ${currentMarketEvent.effects.techStartup >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                           {currentMarketEvent.effects.techStartup >= 0 ? '+' : ''}{(currentMarketEvent.effects.techStartup * 100).toFixed(1)}%
                         </div>
                       </div>
                       <div className="text-center">
                         <div className="font-medium text-green-700">📜 Gov Bonds</div>
                         <div className={`font-bold ${currentMarketEvent.effects.governmentBond >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                           {currentMarketEvent.effects.governmentBond >= 0 ? '+' : ''}{(currentMarketEvent.effects.governmentBond * 100).toFixed(1)}%
                         </div>
                       </div>
                       <div className="text-center">
                         <div className="font-medium text-blue-700">🏡 Real Estate</div>
                         <div className={`font-bold ${currentMarketEvent.effects.realEstate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                           {currentMarketEvent.effects.realEstate >= 0 ? '+' : ''}{(currentMarketEvent.effects.realEstate * 100).toFixed(1)}%
                         </div>
                       </div>
                       <div className="text-center">
                         <div className="font-medium text-purple-700">🧺 ETF Fund</div>
                         <div className={`font-bold ${currentMarketEvent.effects.etfFund >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                           {currentMarketEvent.effects.etfFund >= 0 ? '+' : ''}{(currentMarketEvent.effects.etfFund * 100).toFixed(1)}%
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 <p className="text-gray-600 mb-6">Where will you invest $100 this year?</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <button
                     onClick={() => makeInvestmentChoice('techStartup', 100)}
                     disabled={gameState.totalMoney < 100}
                     className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                       gameState.totalMoney >= 100 
                         ? 'border-red-200 bg-red-50 hover:bg-red-100' 
                         : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                     }`}
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">🚀</div>
                       <h4 className="font-bold text-red-700 mb-2">Tech Startup</h4>
                       <p className="text-sm text-red-600 mb-2">High risk, high potential reward</p>
                       <p className="text-xs text-red-500">
                         This year: {currentMarketEvent.effects.techStartup >= 0 ? '+' : ''}{(currentMarketEvent.effects.techStartup * 100).toFixed(1)}%
                       </p>
                       {gameState.totalMoney < 100 && <p className="text-xs text-red-500 mt-2">Need $100 to invest</p>}
                     </div>
                   </button>

                   <button
                     onClick={() => makeInvestmentChoice('governmentBond', 100)}
                     disabled={gameState.totalMoney < 100}
                     className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                       gameState.totalMoney >= 100 
                         ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                         : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                     }`}
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">📜</div>
                       <h4 className="font-bold text-green-700 mb-2">Government Bond</h4>
                       <p className="text-sm text-green-600 mb-2">Safe and predictable</p>
                       <p className="text-xs text-green-500">
                         This year: {currentMarketEvent.effects.governmentBond >= 0 ? '+' : ''}{(currentMarketEvent.effects.governmentBond * 100).toFixed(1)}%
                       </p>
                       {gameState.totalMoney < 100 && <p className="text-xs text-red-500 mt-2">Need $100 to invest</p>}
                     </div>
                   </button>

                   <button
                     onClick={() => makeInvestmentChoice('realEstate', 100)}
                     disabled={gameState.totalMoney < 100}
                     className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                       gameState.totalMoney >= 100 
                         ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' 
                         : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                     }`}
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">🏡</div>
                       <h4 className="font-bold text-blue-700 mb-2">Real Estate</h4>
                       <p className="text-sm text-blue-600 mb-2">Medium risk, steady growth</p>
                       <p className="text-xs text-blue-500">
                         This year: {currentMarketEvent.effects.realEstate >= 0 ? '+' : ''}{(currentMarketEvent.effects.realEstate * 100).toFixed(1)}%
                       </p>
                       {gameState.totalMoney < 100 && <p className="text-xs text-red-500 mt-2">Need $100 to invest</p>}
                     </div>
                   </button>

                   <button
                     onClick={() => makeInvestmentChoice('etfFund', 100)}
                     disabled={gameState.totalMoney < 100}
                     className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                       gameState.totalMoney >= 100 
                         ? 'border-purple-200 bg-purple-50 hover:bg-purple-100' 
                         : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                     }`}
                   >
                     <div className="text-center">
                       <div className="text-4xl mb-3">🧺</div>
                       <h4 className="font-bold text-purple-700 mb-2">ETF Fund</h4>
                       <p className="text-sm text-purple-600 mb-2">Balanced diversification</p>
                       <p className="text-xs text-purple-500">
                         This year: {currentMarketEvent.effects.etfFund >= 0 ? '+' : ''}{(currentMarketEvent.effects.etfFund * 100).toFixed(1)}%
                       </p>
                       {gameState.totalMoney < 100 && <p className="text-xs text-red-500 mt-2">Need $100 to invest</p>}
                     </div>
                   </button>
                 </div>

                 {gameState.totalMoney >= 100 && (
                   <div className="mt-6 text-center">
                     <button
                       onClick={nextGameRound}
                       className="bg-gray-500 text-white py-2 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all"
                     >
                       Skip This Year (Hold Cash)
                     </button>
                   </div>
                 )}
               </div>
             ) : showRoundResult ? (
               <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                 <h3 className="text-xl font-bold text-blue-800 mb-4">Year {gameState.round} Investment Result</h3>
                 <div className="text-4xl mb-4">
                   {lastChoice?.investment.includes('Tech') ? '🚀' : 
                    lastChoice?.investment.includes('Bond') ? '📜' : 
                    lastChoice?.investment.includes('Estate') ? '🏡' : '🧺'}
                 </div>
                 <p className="text-lg font-semibold text-blue-700 mb-2">
                   Invested ${lastChoice?.amount} in {lastChoice?.investment}
                 </p>
                 <p className="text-blue-600 mb-4">
                   {lastChoice?.outcome}
                 </p>
                 <div className={`inline-block px-4 py-2 rounded-lg font-bold ${
                   (lastChoice?.portfolioChange || 0) >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                 }`}>
                   {(lastChoice?.portfolioChange || 0) >= 0 ? '+' : ''}${lastChoice?.portfolioChange.toFixed(2)}
                 </div>
                 <div className="mt-4">
                   <button
                     onClick={nextGameRound}
                     className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                   >
                     {gameState.round >= 5 ? 'See Final Results' : 'Continue to Next Year'}
                   </button>
                 </div>
               </div>
             ) : (
               <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                 <h3 className="text-xl font-bold text-green-800 mb-4">🏁 5-Year Investment Journey Complete!</h3>
                 <div className="space-y-3 mb-6">
                   <div className="flex justify-between">
                     <span className="text-green-700">Cash Remaining:</span>
                     <span className="font-bold text-green-800">${gameState.totalMoney.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-blue-700">Portfolio Value:</span>
                     <span className="font-bold text-blue-800">${getTotalPortfolioValue().toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between border-t pt-2">
                     <span className="text-gray-700">Total Worth:</span>
                     <span className="font-bold text-lg">${(gameState.totalMoney + getTotalPortfolioValue()).toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-700">Total Return:</span>
                     <span className={`font-bold ${getTotalPortfolioValue() + gameState.totalMoney >= 500 ? 'text-green-600' : 'text-red-600'}`}>
                       {getTotalPortfolioValue() + gameState.totalMoney >= 500 ? '+' : ''}${(getTotalPortfolioValue() + gameState.totalMoney - 500).toFixed(2)}
                       ({(((getTotalPortfolioValue() + gameState.totalMoney - 500) / 500) * 100).toFixed(1)}%)
                     </span>
                   </div>
                 </div>
                 
                 <div className="bg-white p-4 rounded border border-green-300">
                   <h4 className="font-semibold text-green-800 mb-2">Your Investment Journey:</h4>
                   <div className="max-h-40 overflow-y-auto space-y-1">
                     {gameState.playerChoices.map((choice, index) => (
                       <div key={index} className="text-sm text-green-700 flex justify-between">
                         <span>Year {choice.round}: {choice.investment} ${choice.amount}</span>
                         <span className="text-blue-600">{choice.outcome}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}
           </div>

           <div className="bg-gray-50 rounded-xl p-6">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Portfolio Dashboard</h3>
             
             <div className="space-y-4 mb-6">
               <div className="bg-white p-4 rounded border">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-blue-700">💵 Available Cash:</span>
                   <span className="font-bold text-blue-800">${gameState.totalMoney.toFixed(2)}</span>
                 </div>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-red-600">🚀 Tech Startup:</span>
                     <span className="font-medium">${gameState.portfolio.techStartup.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-green-600">📜 Gov Bonds:</span>
                     <span className="font-medium">${gameState.portfolio.governmentBond.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-blue-600">🏡 Real Estate:</span>
                     <span className="font-medium">${gameState.portfolio.realEstate.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-purple-600">🧺 ETF Fund:</span>
                     <span className="font-medium">${gameState.portfolio.etfFund.toFixed(2)}</span>
                   </div>
                 </div>
               </div>
               
               <div className="bg-green-100 p-3 rounded">
                 <div className="text-center">
                   <span className="text-green-700 text-sm">Total Portfolio Value</span>
                   <div className="text-2xl font-bold text-green-800">
                     ${(gameState.totalMoney + getTotalPortfolioValue()).toFixed(2)}
                   </div>
                 </div>
               </div>

               <div className="bg-blue-100 p-3 rounded">
                 <div className="text-center">
                   <span className="text-blue-700 text-sm">Investment Year</span>
                   <div className="text-2xl font-bold text-blue-800">{gameState.round}</div>
                   <span className="text-blue-600 text-sm">of 5</span>
                 </div>
               </div>
             </div>

             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
               <h4 className="font-semibold text-yellow-800 mb-2">💡 Strategy Tips:</h4>
               <ul className="text-sm text-yellow-700 space-y-1">
                 <li>• Diversify across different investments</li>
                 <li>• Consider market conditions</li>
                 <li>• High risk can mean high reward</li>
                 <li>• Think long-term, not just one year</li>
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

           {investorGameCompleted ? (
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
           <p className="text-yellow-100 text-lg">You've earned the Future Investor badge!</p>
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
           <div className="text-8xl mb-4">🧠</div>
           <h3 className="text-2xl font-bold text-orange-800 mb-2">Future Investor</h3>
           <p className="text-orange-700 text-lg mb-4">
             You've learned how investments work — and why time is your superpower!
           </p>
           <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
             <h4 className="font-semibold text-orange-800 mb-2">What you mastered:</h4>
             <div className="text-left space-y-2 text-orange-700">
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Understanding how money can grow through investing</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Learning about different types of investments and their risks</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Discovering why starting early gives you a huge advantage</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-600 mr-2" />
                 <span>Making smart investment decisions through market changes</span>
               </div>
             </div>
           </div>
         </div>

         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
           <h4 className="text-xl font-bold text-blue-800 mb-3">🔮 Coming Next Week...</h4>
           <div className="flex items-center justify-center mb-3">
             <div className="text-4xl mr-4">🛡️</div>
             <div className="text-left">
               <h5 className="font-semibold text-blue-800">Week 9: Spending Traps and Smart Shopping</h5>
               <p className="text-blue-700">Learn to spot ads that trick you and become a smart shopper!</p>
             </div>
           </div>
         </div>

         <div className="space-y-4">
           <button
             onClick={() => {
               setWeekProgress(prev => ({ ...prev, badge: true }));
               onComplete(8, 'Future Investor');
             }}
             className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center"
           >
             Continue to Week 9! 
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
           weekNumber={8}
           title="Investment Fundamentals"
           sections={lessonSections}
           onComplete={handleLessonComplete}
           onBack={() => setLessonStep('overview')}
           color="purple"
         />
       );
     case 'investorGame':
       return renderInvestorIslandGame();
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
   <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
     {renderCurrentStep()}
   </div>
 );
};

export default Week8Component;