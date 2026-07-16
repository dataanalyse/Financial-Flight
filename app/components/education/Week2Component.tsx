"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Check, Trophy, Star, ArrowRight, ArrowLeft, RotateCcw, X, Award, Calendar, Users, Briefcase } from 'lucide-react';
import Badge from '../shared/Badge';
import ProgressBar from '../shared/ProgressBar';
import QuizEngine, { QuizQuestion } from '../shared/QuizEngine';
import LessonComponent, { LessonSection } from '../shared/LessonComponent';

interface Week2Props {
  onComplete: (weekNumber: number, badge: string) => void;
  onBack: () => void;
}

interface WeekProgress {
  lesson: boolean;
  matching: boolean;
  quiz: boolean;
  badge: boolean;
}

const Week2Component: React.FC<Week2Props> = ({ onComplete, onBack }) => {
  const [lessonStep, setLessonStep] = useState('overview'); // overview, lesson, matching, quiz, badge
  const [matchingCompleted, setMatchingCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [jobMatches, setJobMatches] = useState<{[key: string]: string}>({});
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [weekProgress, setWeekProgress] = useState<WeekProgress>(() => {
    // Load progress from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('week2Progress');
      return saved ? JSON.parse(saved) : {
        lesson: false,
        matching: false,
        quiz: false,
        badge: false
      };
    }
    return {
      lesson: false,
      matching: false,
      quiz: false,
      badge: false
    };
  });

  // Save week progress to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('week2Progress', JSON.stringify(weekProgress));
    }
  }, [weekProgress]);

  // Job matching game data
  const jobs = [
    { id: 'doctor', name: '🧑‍⚕️ Doctor', description: 'Helps sick people get better' },
    { id: 'teacher', name: '👩‍🏫 Teacher', description: 'Helps students learn new things' },
    { id: 'chef', name: '🧑‍🍳 Chef', description: 'Cooks delicious food for people' },
    { id: 'builder', name: '👷 Builder', description: 'Builds houses and buildings' },
    { id: 'artist', name: '🎨 Artist', description: 'Creates beautiful paintings and art' },
    { id: 'programmer', name: '🧑‍💻 Programmer', description: 'Writes code for websites and apps' }
  ];

  const correctMatches: Record<string, string> = {
    'doctor': 'Helps sick people get better',
    'teacher': 'Helps students learn new things', 
    'chef': 'Cooks delicious food for people',
    'builder': 'Builds houses and buildings',
    'artist': 'Creates beautiful paintings and art',
    'programmer': 'Writes code for websites and apps'
  };

  // Quiz question pool — 4 drawn randomly each attempt
  const quizQuestions: QuizQuestion[] = [
    { question: "What is a job?", options: ["A kind of money", "Work you do for someone to earn money", "A skill you learn in school"], correct: 1, explanation: "A job is work you do for someone else (like a company) in exchange for money!", hint: "Think about what your parents do to earn money.", difficulty: 'easy' },
    { question: "Who is an entrepreneur?", options: ["Someone who fixes cars", "Someone who works for a company", "Someone who starts their own business"], correct: 2, explanation: "An entrepreneur is someone who starts their own business and takes risks to make money!", hint: "Think about someone who opens their own pizza shop.", difficulty: 'easy' },
    { question: "Which of these is a skill that could help you earn money?", options: ["Bicycle", "Drawing", "Money"], correct: 1, explanation: "Drawing is a skill! You could use it to design posters, make art, or create things people want to buy.", hint: "Which one is something you can DO or be good at?", difficulty: 'easy' },
    { question: "Why do some jobs pay more money than others?", options: ["Because some people are luckier", "Because some jobs need more training and skills", "Because some jobs are more fun"], correct: 1, explanation: "Jobs that require more education, training, or special skills usually pay more money!", hint: "Think about why a doctor might earn more than someone at a store.", difficulty: 'medium' },
    { question: "What is a salary?", options: ["A one-time payment for a task", "A fixed amount paid to an employee each year or month", "Money you earn from selling things"], correct: 1, explanation: "A salary is a set amount paid regularly — usually monthly or annually — regardless of exact hours worked. Many professional jobs use salaries!", hint: "Think about predictable, regular pay.", difficulty: 'easy' },
    { question: "What is the difference between active income and passive income?", options: ["Active income is always more money", "Active income requires ongoing work; passive income earns even when you rest", "Passive income is illegal"], correct: 1, explanation: "Active income = trading your time for money (a job). Passive income = money that keeps coming in after initial effort, like rental income or royalties!", hint: "Which one earns money while you sleep?", difficulty: 'medium' },
    { question: "A freelancer is best described as:", options: ["Someone who works for free", "Someone who sells services independently to multiple clients", "Someone who works in a free country"], correct: 1, explanation: "A freelancer works independently — not for one employer. They might design logos, write articles, or code websites for different clients!", hint: "Think about someone who picks their own clients and projects.", difficulty: 'medium' },
    { question: "What does 'minimum wage' mean?", options: ["The highest amount an employer can pay", "The lowest legal amount an employer must pay per hour", "The average wage in a country"], correct: 1, explanation: "Minimum wage is the legal floor — employers cannot pay workers less than this per hour. It's set by the government to protect workers!", hint: "It's the MINIMUM — the very least allowed.", difficulty: 'easy' },
    { question: "Which of these best describes 'commission'?", options: ["A flat monthly salary", "Earning a percentage of each sale you make", "A government tax on income"], correct: 1, explanation: "Commission is pay based on performance — salespeople often earn a percentage of everything they sell. The more you sell, the more you earn!", hint: "Think about a car salesperson who earns more when they sell more cars.", difficulty: 'medium' },
    { question: "Why might someone choose to start a business instead of getting a job?", options: ["It always makes more money", "To have more control, be their own boss, and pursue a passion", "Because jobs are too easy"], correct: 1, explanation: "Entrepreneurs start businesses for freedom, passion, and the potential to build something bigger — though it comes with risk too!", hint: "Think about what you lose when you work for someone else.", difficulty: 'medium' },
    { question: "What is a 'side hustle'?", options: ["Working illegally at night", "Extra work done outside of a main job to earn more money", "A type of investment"], correct: 1, explanation: "A side hustle is any extra money-making activity outside your main income — tutoring, reselling clothes, making content, dog walking, etc.", hint: "Think about earning extra money in your spare time.", difficulty: 'easy' },
    { question: "Which of these is an example of passive income for a teenager?", options: ["Babysitting on weekends", "Earning ad revenue from a YouTube channel you made", "Tutoring classmates after school"], correct: 1, explanation: "Once a YouTube video is made and monetized, it keeps earning ad revenue even when you're sleeping or at school — that's passive income!", hint: "Which one earns money without you actively working each time?", difficulty: 'hard' },
    { question: "What is a 'trade' (as in a trade job)?", options: ["Exchanging goods like in bartering", "A skilled manual occupation like plumbing or electrician work", "A stock market transaction"], correct: 1, explanation: "Trade jobs are skilled manual careers — like plumbers, electricians, carpenters, and mechanics. They often require apprenticeships and pay very well!", hint: "Think about the people who build and fix things in homes and buildings.", difficulty: 'medium' },
    { question: "Why is it valuable to learn multiple skills?", options: ["More skills means you can charge higher taxes", "Multiple skills make you more adaptable and open more career opportunities", "Skills are only useful if they're technical"], correct: 1, explanation: "The job market changes fast! Having multiple skills — like coding AND communication — makes you more valuable and resilient if one field changes.", hint: "Think about what happens if one type of job disappears — can you pivot?", difficulty: 'medium' },
    { question: "What does 'gross income' mean?", options: ["Income that smells bad", "Your total earnings before taxes are taken out", "Your earnings after all deductions"], correct: 1, explanation: "Gross income is what you earn BEFORE taxes and deductions. Your 'net income' (take-home pay) is what remains after tax is deducted!", hint: "Gross = the big number before anything is removed.", difficulty: 'hard' },
    { question: "If you enjoy art and want to earn money from it, which path makes the most sense?", options: ["Give up art — it never pays", "Develop your skill, build a portfolio, and look for design or illustration work", "Only sell art to family"], correct: 1, explanation: "Many careers connect passion and income — graphic design, animation, architecture, and more. Building skill + a portfolio opens real doors!", hint: "Think about how professional artists and designers get paid.", difficulty: 'medium' },
  ];

  // Lesson sections for Week 2
  const lessonSections: LessonSection[] = [
    {
      id: 'introduction',
      title: 'How Do People Get Money?',
      type: 'story',
      content: (
        <div>
          <p className="text-lg mb-4">
            Have you ever wondered how people get money to buy things? It doesn't grow on trees! 🌳
          </p>
          <p className="text-gray-700 mb-4">
            Most people <strong>earn money</strong> by doing work. But the way they earn it can be very different!
          </p>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">In this lesson, you'll learn:</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• What it means to <strong>earn money</strong></li>
              <li>• Different kinds of <strong>jobs</strong> and <strong>businesses</strong></li>
              <li>• How your <strong>skills and interests</strong> affect earnings</li>
              <li>• How kids like you can start <strong>earning too</strong>!</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'jobs-people-do',
      title: 'Jobs People Do',
      type: 'example',
      content: (
        <div>
          <p className="mb-4">
            People can earn money by working for someone else. These are called <strong>jobs</strong>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-lg text-center">
              <div className="text-2xl mb-2">🧑‍⚕️</div>
              <p className="font-semibold text-green-800">Doctor</p>
              <p className="text-sm text-green-600">Helps sick people</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-center">
              <div className="text-2xl mb-2">👩‍🏫</div>
              <p className="font-semibold text-blue-800">Teacher</p>
              <p className="text-sm text-blue-600">Helps students learn</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg text-center">
              <div className="text-2xl mb-2">🧑‍🍳</div>
              <p className="font-semibold text-purple-800">Chef</p>
              <p className="text-sm text-purple-600">Cooks food</p>
            </div>
          </div>
          <p className="text-gray-700">
            All of these jobs pay people <strong>money</strong> in exchange for their <strong>time and skills</strong>.
          </p>
        </div>
      )
    },
    {
      id: 'running-business',
      title: 'Running a Business',
      type: 'tip',
      content: (
        <div>
          <p className="mb-4">
            Some people don't work for someone else — they <strong>start their own business</strong>!
          </p>
          <div className="bg-orange-100 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-orange-800 mb-2">Examples of businesses:</h4>
            <ul className="text-orange-700 space-y-2">
              <li>🍕 A person who opens a <strong>pizza shop</strong></li>
              <li>👕 Someone who sells clothes online</li>
              <li>🍋 A kid who starts a <strong>lemonade stand</strong></li>
            </ul>
          </div>
          <p className="text-gray-700 mb-3">
            These people are called <strong>entrepreneurs</strong>. They earn money by selling something people want — a product or a service.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              💡 <strong>Tip:</strong> Businesses can be risky, but they also offer more freedom!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'skills-matter',
      title: 'What Skills Do You Have?',
      type: 'activity',
      content: (
        <div>
          <p className="mb-4">
            Whether you get a job or start a business, your <strong>skills</strong> matter!
          </p>
          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
            <h4 className="text-lg font-bold text-green-800 mb-4">Think about this:</h4>
            <div className="space-y-3 text-green-700">
              <p>• You're great at drawing ✏️ → Maybe you could design posters!</p>
              <p>• You love pets 🐶 → Maybe you can walk dogs for neighbors</p>
              <p>• You know how to code 🧑‍💻 → Someday you could build websites</p>
            </div>
          </div>
          <p className="text-gray-700 mt-4">
            🧭 The better your skills, the more <strong>valuable</strong> you become — and the more <strong>money</strong> you can earn.
          </p>
        </div>
      )
    },
    {
      id: 'kids-can-earn',
      title: 'Can Kids Earn Money Too?',
      type: 'story',
      content: (
        <div>
          <p className="text-lg mb-4 text-green-800 font-semibold">
            Yes! Kids can start small and learn big lessons. 🌟
          </p>
          <div className="bg-blue-100 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-blue-800 mb-3">Ideas for kids:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-700">
              <p>🧺 Help with chores for allowance</p>
              <p>🐶 Pet sitting or dog walking</p>
              <p>🧁 Selling homemade cupcakes</p>
              <p>🎨 Making cards for neighbors</p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">
              ⚠️ <strong>Important:</strong> Always ask a parent or adult before starting!
            </p>
          </div>
        </div>
      )
    }
  ];

  // Job matching functions
  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId);
  };

  const handleDescriptionSelect = (description: string) => {
    if (!selectedJob) return;

    const newMatches = { ...jobMatches, [selectedJob]: description };
    setJobMatches(newMatches);
    setSelectedJob(null);

    // Check if all matches are correct
    const allCorrect = Object.keys(correctMatches).every(jobId => 
      newMatches[jobId] === correctMatches[jobId]
    );

    if (allCorrect && Object.keys(newMatches).length === Object.keys(correctMatches).length) {
      setMatchingCompleted(true);
      setWeekProgress(prev => ({ ...prev, matching: true }));
    }
  };

  const resetMatching = () => {
    setJobMatches({});
    setSelectedJob(null);
    setMatchingCompleted(false);
  };

  // Quiz completion handler
  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizPassed(passed);
    if (passed) {
      setWeekProgress(prev => ({ ...prev, quiz: true }));
      setTimeout(() => {
        setLessonStep('badge');
      }, 1000);
    }
  };

  // Lesson completion handler
  const handleLessonComplete = () => {
    setWeekProgress(prev => ({ ...prev, lesson: true }));
    setLessonStep('matching');
  };

  const getProgressSteps = () => {
    const steps = [];
    if (weekProgress.lesson) steps.push('lesson');
    if (weekProgress.matching) steps.push('matching');
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
              <h2 className="text-2xl font-bold">Week 2: How People Earn Money 💼</h2>
              <p className="text-green-100 mt-2">Discover different ways people make money and start earning yourself!</p>
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
              badge="💼 Income Detective"
              earned={weekProgress.badge}
              size="large"
              animation="sparkle"
            />
          </div>
        </div>

        <div className="p-6">
          {/* Progress Overview */}
          <div className="mb-6">
            <ProgressBar 
              current={getProgressSteps()} 
              total={4} 
              color="green"
              showSteps
              stepLabels={['Learn', 'Match Jobs', 'Quiz', 'Badge']}
              animated
            />
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.lesson ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <BookOpen className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Learn</span>
              {weekProgress.lesson && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.matching ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <Briefcase className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Match Jobs</span>
              {weekProgress.matching && <Check className="h-4 w-4 ml-auto" />}
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

          {/* Learning Objective */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">🎯 What You'll Learn</h3>
            <p className="text-green-700">Understand different ways people earn money, the difference between jobs and businesses, and how skills impact earnings.</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setLessonStep('lesson')}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              {weekProgress.lesson ? 'Review Lesson' : 'Start Learning About Money!'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            
            {weekProgress.lesson && (
              <button
                onClick={() => setLessonStep('matching')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center"
              >
                {weekProgress.matching ? 'Review Job Matching' : 'Play Job Matching Game'}
                <Briefcase className="h-5 w-5 ml-2" />
              </button>
            )}
            
            {weekProgress.matching && (
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

  const renderJobMatching = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">🎯 Job Matching Game</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetMatching}
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
          <p className="text-blue-100 mt-2">Match each job with what they do! Click a job, then click its description.</p>
        </div>

        <div className="p-8">
          {matchingCompleted && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Perfect! You're a job expert!</h3>
              <p className="text-green-700">You correctly matched all the jobs with what they do!</p>
            </div>
          )}

          {/* Progress */}
          <div className="mb-6">
            <ProgressBar 
              current={Object.keys(jobMatches).length} 
              total={6} 
              color="blue"
              showPercentage
            />
          </div>

          {/* Selected Job Indicator */}
          {selectedJob && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">
                Selected: {jobs.find(j => j.id === selectedJob)?.name}
              </p>
              <p className="text-blue-600 text-sm">Now click the correct description below!</p>
            </div>
          )}

          {/* Jobs Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Jobs:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                    selectedJob === job.id
                      ? 'bg-blue-200 border-2 border-blue-400'
                      : jobMatches[job.id]
                        ? 'bg-green-100 border-2 border-green-400'
                        : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => !jobMatches[job.id] && handleJobSelect(job.id)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{job.name.split(' ')[0]}</div>
                    <h4 className="font-semibold text-sm text-gray-800">
                      {job.name.substring(2)}
                    </h4>
                    {jobMatches[job.id] && (
                      <p className="text-xs text-green-600 mt-2">✓ Matched!</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What do they do?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(correctMatches).map((description, index) => {
                const isMatched = Object.values(jobMatches).includes(description);
                return (
                  <button
                    key={index}
                    onClick={() => !isMatched && handleDescriptionSelect(description)}
                    disabled={isMatched}
                    className={`p-4 rounded-lg text-left transition-all ${
                      isMatched
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : selectedJob
                          ? 'bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                          : 'bg-white border-2 border-gray-200 text-gray-500'
                    }`}
                  >
                    {description}
                    {isMatched && <span className="ml-2 text-green-600">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
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
                {Object.keys(jobMatches).length} of 6 jobs matched
              </p>
              <div className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {matchingCompleted ? '✅ All Matched!' : '🎯 Keep matching!'}
              </div>
            </div>

            {matchingCompleted ? (
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

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🎮 How to Play:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Step 1:</strong> Click a job on the left to select it</li>
              <li>• <strong>Step 2:</strong> Click the correct description on the right</li>
              <li>• <strong>Goal:</strong> Match all 6 jobs correctly to win!</li>
              <li>• <strong>Hint:</strong> Think about what each person does in their job</li>
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
            <p className="text-yellow-100 text-lg">You've earned the Income Detective badge!</p>
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
            <div className="text-8xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-orange-800 mb-2">Income Detective</h3>
            <p className="text-orange-700 text-lg mb-4">
              You learned how people earn money through jobs and businesses!
            </p>
            <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">What you mastered:</h4>
              <div className="text-left space-y-2 text-orange-700">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>The difference between jobs and businesses</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>How skills affect how much you can earn</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Ways kids can start earning money too</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>What entrepreneurs do to make money</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <h4 className="text-xl font-bold text-blue-800 mb-3">🔮 Coming Next Week...</h4>
            <div className="flex items-center justify-center mb-3">
              <div className="text-4xl mr-4">🎯</div>
              <div className="text-left">
                <h5 className="font-semibold text-blue-800">Week 3: Needs vs Wants</h5>
                <p className="text-blue-700">Learn to tell the difference between what you need and what you want!</p>
              </div>
            </div>
          </div>

          {/* Complete Week Button */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setWeekProgress(prev => ({ ...prev, badge: true }));
                onComplete(2, 'Income Detective');
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Continue to Week 3! 
              <ArrowRight className="h-6 w-6 ml-2" />
            </button>
            
            <button
              onClick={onBack}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all"
            >
              Back to Course Overview
            </button>
          </div>

          {/* Share Achievement */}
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

  // Main render function
  const renderCurrentStep = () => {
    switch (lessonStep) {
      case 'overview':
        return renderOverview();
      case 'lesson':
        return (
          <LessonComponent
            weekNumber={2}
            title="How People Earn Money"
            sections={lessonSections}
            onComplete={handleLessonComplete}
            onBack={() => setLessonStep('overview')}
            color="green"
          />
        );
      case 'matching':
        return renderJobMatching();
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      {renderCurrentStep()}
    </div>
  );
};

export default Week2Component;