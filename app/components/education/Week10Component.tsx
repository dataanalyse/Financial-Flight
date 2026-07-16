"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Check, Star, ArrowRight, ArrowLeft, RotateCcw, X, Award, Calendar, Users, Shield, Smartphone } from 'lucide-react';
import Badge from '../shared/Badge';
import ProgressBar from '../shared/ProgressBar';
import QuizEngine, { QuizQuestion } from '../shared/QuizEngine';
import LessonComponent, { LessonSection } from '../shared/LessonComponent';

interface Week10Props {
  onComplete: (weekNumber: number, badge: string) => void;
  onBack: () => void;
}

interface WeekProgress {
  lesson: boolean;
  scamGame: boolean;
  quiz: boolean;
  badge: boolean;
}

interface ScamScenario {
  id: number;
  scenario: string;
  emoji: string;
  isScam: boolean;
  explanation: string;
  tip: string;
}

const Week10Component: React.FC<Week10Props> = ({ onComplete, onBack }) => {
  const [lessonStep, setLessonStep] = useState('overview');
  const [scamGameCompleted, setScamGameCompleted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState<Array<{ chosen: boolean; correct: boolean } | null>>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const [weekProgress, setWeekProgress] = useState<WeekProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('week10Progress');
      return saved ? JSON.parse(saved) : { lesson: false, scamGame: false, quiz: false, badge: false };
    }
    return { lesson: false, scamGame: false, quiz: false, badge: false };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('week10Progress', JSON.stringify(weekProgress));
    }
  }, [weekProgress]);

  const scenarios: ScamScenario[] = [
    {
      id: 1,
      emoji: '📧',
      scenario: 'You get an email that says: "Congratulations! You\'ve won $1,000. Click here and enter your bank account number to claim your prize."',
      isScam: true,
      explanation: 'This is a classic scam! Legitimate prizes never ask for your bank account number by email. Clicking that link could steal your info or install malware.',
      tip: 'Real giveaways never need your banking details up front. If it sounds too good to be true, it is.',
    },
    {
      id: 2,
      emoji: '📱',
      scenario: 'Your friend sends you $10 on Venmo for covering their lunch, with a message: "Thanks for lunch 🍕". The notification came from the official Venmo app.',
      isScam: false,
      explanation: 'This is safe! You know the person, the amount is reasonable, and it came through the official app. Peer-to-peer payments from people you know are perfectly normal.',
      tip: 'P2P payments (Venmo, PayPal, Cash App) are safe when you know and trust the sender.',
    },
    {
      id: 3,
      emoji: '💬',
      scenario: 'A stranger texts you: "Hi, I accidentally sent you $200 on Cash App. Can you send it back to me?" You check and see $200 in your Cash App account.',
      isScam: true,
      explanation: 'This is a well-known scam! They send money using a stolen credit card, you send real money back, then the original payment gets reversed — leaving you $200 out of pocket.',
      tip: 'NEVER send money back to strangers who claim to have "accidentally" sent you funds. Report it to the app instead.',
    },
    {
      id: 4,
      emoji: '🏦',
      scenario: 'You log into your bank\'s official website (the URL shows "https://yourbank.com" and a lock icon) to check your balance.',
      isScam: false,
      explanation: 'This is safe! The official URL matches your bank, and the padlock (https) means the connection is encrypted. Always check these before entering login details.',
      tip: 'Always check for https:// and the correct domain name before logging in. Bookmark your bank\'s real site.',
    },
    {
      id: 5,
      emoji: '🎰',
      scenario: 'An Instagram ad says: "Invest just $100 and earn $5,000 in 7 days! DM us to start. 100% guaranteed returns!" with photos of luxury cars.',
      isScam: true,
      explanation: 'Guaranteed high returns in days are a hallmark of fraud — often a Ponzi scheme. No real investment can promise 5,000% returns in a week. Those luxury car photos are fake.',
      tip: 'Guaranteed returns don\'t exist in investing. Any "opportunity" promising them is trying to steal your money.',
    },
    {
      id: 6,
      emoji: '🛒',
      scenario: 'You buy something from Amazon using your saved payment method. The charge appears on your statement as "AMZN Mktp US" — the same as your past Amazon orders.',
      isScam: false,
      explanation: 'This is safe! "AMZN Mktp US" is Amazon\'s standard charge descriptor. Always compare new charges against your purchase history — this one matches.',
      tip: 'Review your bank statement monthly. If a charge doesn\'t match a purchase you made, report it immediately.',
    },
  ];

  const resetGame = () => {
    setCurrentScenario(0);
    setAnswers([]);
    setShowFeedback(false);
    setScamGameCompleted(false);
  };

  const handleAnswer = (chosenScam: boolean) => {
    const correct = chosenScam === scenarios[currentScenario].isScam;
    const newAnswers = [...answers, { chosen: chosenScam, correct }];
    setAnswers(newAnswers);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentScenario + 1 >= scenarios.length) {
      setScamGameCompleted(true);
      setWeekProgress(prev => ({ ...prev, scamGame: true }));
    } else {
      setCurrentScenario(prev => prev + 1);
    }
  };

  const getScore = () => answers.filter(a => a?.correct).length;

  // Quiz question pool — 4 drawn randomly each attempt
  const quizQuestions: QuizQuestion[] = [
    { question: "What should you NEVER share with strangers online?", options: ['Your favorite movie', 'Your bank account or Social Security number', 'Your city of residence'], correct: 1, explanation: "Bank account numbers, SSNs, passwords, and card numbers are for your eyes only. No legitimate company asks for these via text, email, or social media!", hint: 'What info could someone use to steal your identity or money?', difficulty: 'easy' },
    { question: "What is 'phishing'?", options: ["A type of online fishing game", "A fake message pretending to be from a trusted source to steal your info", "A way to earn money by clicking on ads"], correct: 1, explanation: "Phishing is scammers disguising themselves as banks or trusted companies to trick you into revealing passwords or financial info.", hint: 'Think about someone pretending to be your bank.', difficulty: 'medium' },
    { question: "A stranger sends you $200 on Cash App and asks you to send it back. What do you do?", options: ["Send the $200 back to be nice", "Don't send it — report it to Cash App", "Keep the money and say nothing"], correct: 1, explanation: "This is the 'accidental payment' scam! The original payment was likely fraudulent and will be reversed, leaving you out of pocket. Report it!", hint: 'What if the original payment was made with a stolen card?', difficulty: 'medium' },
    { question: "Which is the safest way to pay for things online?", options: ["Sending cash through the mail", "Wiring money directly from your bank", "Using a credit card or trusted payment service like PayPal"], correct: 2, explanation: "Credit cards and PayPal have buyer protection — you can dispute charges. Cash and wire transfers are irreversible if something goes wrong!", hint: 'Which method lets you get your money back if needed?', difficulty: 'medium' },
    { question: "You get a text saying 'Your account is locked. Click here to verify: amaz0n-secure.net.' What should you do?", options: ["Click the link immediately to unlock your account", "Ignore or report it — go directly to the real company's website", "Reply to the text with your password"], correct: 1, explanation: "This is a phishing text! 'Amaz0n-secure.net' is NOT Amazon. Always go directly to the real website by typing it yourself — never click suspicious links.", hint: "Notice the fake URL — real companies don't use modified domain names like 'amaz0n'.", difficulty: 'medium' },
    { question: "What is 'two-factor authentication' (2FA)?", options: ["Using two passwords", "A security layer requiring a second verification step beyond just a password", "Logging in from two devices"], correct: 1, explanation: "2FA adds an extra step — like a code texted to your phone — so even if someone steals your password, they can't access your account without the second factor!", hint: "Two factors = something you know (password) + something you have (your phone).", difficulty: 'medium' },
    { question: "Which password is the STRONGEST?", options: ["password123", "MyBirthday1215", "Kx#9mP!2rQv$"], correct: 2, explanation: "Long passwords mixing uppercase, lowercase, numbers, and symbols are hardest to crack. Avoid obvious words, birthdays, or simple patterns!", hint: "Which looks the hardest to guess or brute-force?", difficulty: 'easy' },
    { question: "What is identity theft?", options: ["Copying someone's style or fashion", "When someone steals your personal info to commit fraud in your name", "Forgetting your own password"], correct: 1, explanation: "Identity theft is when criminals use your personal info (SSN, card numbers, etc.) to open accounts, make purchases, or take loans in your name — devastating financially!", hint: "Think about someone using YOUR information to pretend to be you.", difficulty: 'medium' },
    { question: "An Instagram ad offers '500% returns in 7 days — guaranteed!' This is most likely:", options: ["A great investment opportunity", "A scam — guaranteed high returns don't exist", "A government program for teens"], correct: 1, explanation: "No investment guarantees 500% returns in a week. This is almost certainly a Ponzi scheme or fraud. If it sounds too good to be true, it always is!", hint: "Guaranteed high returns are the #1 red flag of financial fraud.", difficulty: 'easy' },
    { question: "What is a 'data breach'?", options: ["When your phone breaks", "When hackers steal personal information from a company's database", "When you break the rules at a bank"], correct: 1, explanation: "Data breaches happen when hackers access a company's database and steal customer info — emails, passwords, card numbers. Always use unique passwords for each site!", hint: "Think about a company's database being hacked and customer info stolen.", difficulty: 'medium' },
    { question: "What does 'https' in a website URL tell you?", options: ["The site is free to use", "The connection is encrypted and more secure", "The site was built in HTML"], correct: 1, explanation: "HTTPS means the connection between you and the website is encrypted — your data is much safer. Always check for https:// before entering payment info!", hint: "The 's' stands for 'secure.'", difficulty: 'easy' },
    { question: "Someone offers you a job online that requires you to receive payments and forward them to another account. This is:", options: ["A legitimate payment processing job", "A money mule scam — you'd be helping move stolen money", "A normal banking service job"], correct: 1, explanation: "This is a money mule scam! Criminals use you to move stolen money, making YOU legally liable. It's illegal even if you didn't know the money was stolen.", hint: "Why would a legitimate employer need you to receive and forward someone else's money?", difficulty: 'hard' },
    { question: "What should you do if you suspect your bank account has been hacked?", options: ["Wait to see if unauthorized charges appear", "Contact your bank immediately, change passwords, and monitor all accounts", "Delete the bank app and forget about it"], correct: 1, explanation: "Act fast! Contact your bank immediately — they can freeze your account, investigate fraudulent transactions, and help you recover. Time is critical with financial fraud!", hint: "Speed matters — every hour of delay can mean more stolen money.", difficulty: 'medium' },
    { question: "What is 'social engineering' in the context of scams?", options: ["Using social media to market products", "Manipulating people psychologically to reveal information or send money", "Building a social media following for profit"], correct: 1, explanation: "Social engineering exploits human psychology — urgency, fear, trust, or greed — to manipulate people into giving up money or information. It's the most common scam technique!", hint: "It's about manipulating people, not hacking computers.", difficulty: 'hard' },
    { question: "You use the same password on 20 websites. Why is this dangerous?", options: ["It's not dangerous — efficiency is good", "If one site is breached, hackers can access all 20 accounts", "Websites share passwords with each other"], correct: 1, explanation: "Password reuse is extremely risky! One data breach can unlock all your accounts. Use a password manager to create and store unique passwords for every site!", hint: "What happens to all your other accounts if one site gets hacked and reveals your password?", difficulty: 'medium' },
    { question: "What is the best way for a teen to stay safe with digital payments?", options: ["Avoid all digital payments forever", "Use trusted apps, enable 2FA, never share credentials, and monitor statements regularly", "Only pay using gift cards to stay anonymous"], correct: 1, explanation: "Digital payments are safe when used properly: trusted apps, 2FA enabled, private credentials, and regular statement reviews catch fraud early!", hint: "Think about all the security habits that protect you in the digital world.", difficulty: 'medium' },
  ];

  const lessonSections: LessonSection[] = [
    {
      id: 'digital-intro',
      title: 'Your Money Has Gone Digital — Are You Ready? 📱',
      type: 'story',
      content: (
        <div>
          <div className="bg-blue-50 p-6 rounded-lg mb-4">
            <p className="text-lg text-blue-800 mb-4">
              Think about the last time you saw someone pay with cash at a store. Rare, right?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {[
                { emoji: '📱', label: 'Apple/Google Pay', sub: 'Tap to pay' },
                { emoji: '💳', label: 'Debit/Credit Card', sub: 'Chip or tap' },
                { emoji: '🏦', label: 'Online Banking', sub: 'From your phone' },
                { emoji: '📲', label: 'Venmo / PayPal', sub: 'Send to friends' },
                { emoji: '🛒', label: 'Amazon / Shopping', sub: 'One-click buy' },
                { emoji: '₿', label: 'Crypto', sub: 'Digital currency' },
              ].map(({ emoji, label, sub }) => (
                <div key={label} className="bg-white p-3 rounded-lg text-center border border-blue-200">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <p className="font-semibold text-blue-800 text-sm">{label}</p>
                  <p className="text-blue-600 text-xs">{sub}</p>
                </div>
              ))}
            </div>
            <p className="text-blue-700">The way money moves has completely changed. This is mostly amazing — but it also comes with new risks you need to know about.</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-green-800 mb-3">✅ The Benefits of Digital Money:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: '⚡', text: 'Instant transfers anywhere in the world' },
                { icon: '📊', text: 'Easy to track every dollar you spend' },
                { icon: '🔒', text: 'Safer than carrying cash around' },
                { icon: '🛍️', text: 'Buy anything from anywhere, anytime' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center bg-white p-3 rounded border border-green-200">
                  <span className="text-xl mr-3">{icon}</span>
                  <p className="text-green-700 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-bold text-red-800 mb-3">⚠️ The Risks You Need to Know:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: '🎣', text: 'Phishing scams disguised as banks or friends' },
                { icon: '🔓', text: 'Data breaches can expose your card details' },
                { icon: '💸', text: 'Instant payments are hard to reverse if you make a mistake' },
                { icon: '🕵️', text: 'Scammers specifically target teens online' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center bg-white p-3 rounded border border-red-200">
                  <span className="text-xl mr-3">{icon}</span>
                  <p className="text-red-700 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'payment-apps',
      title: 'Payment Apps: How They Work & When to Use Them 💳',
      type: 'example',
      content: (
        <div>
          <p className="text-lg mb-4">Payment apps have changed how friends split bills and pay each other. Here's what you need to know about the most popular ones.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[
              { name: 'Venmo', emoji: '💙', color: 'blue', age: '18+ (13+ with parent)', best: 'Splitting costs with friends', warning: 'Default payments are PUBLIC — change to private in settings!' },
              { name: 'PayPal', emoji: '💛', color: 'yellow', age: '18+ (13+ with parent)', best: 'Online shopping & buyer protection', warning: 'Keep your PayPal email private to avoid spam' },
              { name: 'Cash App', emoji: '💚', color: 'green', age: '13+ with parent approval', best: 'Quick transfers, teen-friendly', warning: 'No chargeback protection — treat like cash' },
              { name: 'Apple/Google Pay', emoji: '📱', color: 'purple', age: 'Any age with device', best: 'Tap-to-pay in stores, very secure', warning: 'Set a strong passcode on your device' },
            ].map(({ name, emoji, color, age, best, warning }) => (
              <div key={name} className={`bg-${color}-50 p-5 rounded-lg border-2 border-${color}-200`}>
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">{emoji}</span>
                  <div>
                    <h4 className={`font-bold text-${color}-800`}>{name}</h4>
                    <p className={`text-${color}-600 text-xs`}>Age: {age}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-green-100 p-2 rounded text-xs text-green-800">✅ Best for: {best}</div>
                  <div className="bg-red-100 p-2 rounded text-xs text-red-800">⚠️ Watch out: {warning}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h4 className="font-bold text-yellow-800 mb-4">🛡️ Golden Rules for All Payment Apps:</h4>
            <div className="space-y-3">
              {[
                { num: '1', rule: 'Only send money to people you know in real life' },
                { num: '2', rule: 'Double-check the username before hitting send — typos cost money' },
                { num: '3', rule: 'Never transfer money under pressure or urgency ("send NOW!")' },
                { num: '4', rule: 'Treat digital payments like handing someone cash — it\'s usually irreversible' },
                { num: '5', rule: 'Review your transaction history weekly for anything you don\'t recognize' },
              ].map(({ num, rule }) => (
                <div key={num} className="flex items-start bg-white p-3 rounded border border-yellow-300">
                  <div className="bg-yellow-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">{num}</div>
                  <p className="text-yellow-800 text-sm">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'scams',
      title: 'Scam Spotter: The Tricks They Use on Teens 🕵️',
      type: 'warning',
      content: (
        <div>
          <div className="bg-red-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-red-800 mb-4">🚨 The 5 Most Common Scams Targeting Teens:</h4>
            <div className="space-y-4">
              {[
                {
                  name: 'The Fake Prize', emoji: '🏆', color: 'orange',
                  how: '"You won! Just pay a small fee to claim your $500 prize."',
                  why: 'Real prizes never require a payment first. The fee is the scam.',
                },
                {
                  name: 'The "Accidental" Payment', emoji: '💸', color: 'red',
                  how: '"I sent you $200 by mistake. Can you send it back?"',
                  why: 'The original transfer was fraudulent and will be reversed. Your "refund" is the only real loss.',
                },
                {
                  name: 'The Job Offer', emoji: '💼', color: 'blue',
                  how: '"Work from home! Earn $500/day. Just buy our starter kit first."',
                  why: 'Legitimate employers pay YOU — they never ask for money upfront.',
                },
                {
                  name: 'The Investment Miracle', emoji: '📈', color: 'purple',
                  how: '"Turn $100 into $1,000 in a week — guaranteed returns!"',
                  why: 'No investment guarantees returns. This is always a Ponzi scheme or outright theft.',
                },
                {
                  name: 'Phishing', emoji: '🎣', color: 'teal',
                  how: '"Your account has been compromised. Click here to verify your password."',
                  why: 'The link is fake. Your bank or app will NEVER ask for your password via email or text.',
                },
              ].map(({ name, emoji, color, how, why }) => (
                <div key={name} className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200`}>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{emoji}</span>
                    <h5 className={`font-bold text-${color}-800`}>{name}</h5>
                  </div>
                  <p className={`text-${color}-700 text-sm mb-1 italic`}>"{how}"</p>
                  <p className={`text-${color}-600 text-sm`}>⚡ <strong>Why it's a scam:</strong> {why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'stay-safe',
      title: 'How to Stay Safe: Your Digital Security Checklist 🔒',
      type: 'tip',
      content: (
        <div>
          <div className="bg-green-50 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-green-800 mb-4">✅ Your Digital Money Safety Checklist:</h4>
            <div className="space-y-3">
              {[
                { category: 'Passwords', icon: '🔑', tips: ['Use a unique password for every financial account', 'Make it 12+ characters with numbers and symbols', 'Use a password manager (your phone\'s built-in one works great)'] },
                { category: 'Two-Factor Authentication', icon: '📲', tips: ['Turn on 2FA for your bank, PayPal, and email', '2FA sends a code to your phone so even stolen passwords can\'t get in', 'Use an authenticator app instead of SMS if possible'] },
                { category: 'Device Security', icon: '📱', tips: ['Set a strong PIN or use Face ID on your phone', 'Never use public Wi-Fi to access financial apps', 'Keep your phone\'s software updated — updates patch security holes'] },
                { category: 'Spotting Fakes', icon: '🔍', tips: ['Check email sender addresses carefully (not just the display name)', 'Look for https:// and a padlock before entering card details', 'When in doubt, go directly to the official website — don\'t click links in emails'] },
              ].map(({ category, icon, tips }) => (
                <div key={category} className="bg-white p-4 rounded-lg border border-green-200">
                  <h5 className="font-bold text-green-800 mb-2">{icon} {category}</h5>
                  <ul className="space-y-1">
                    {tips.map(tip => (
                      <li key={tip} className="flex items-start text-green-700 text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-blue-800 mb-3">🚨 If Something Goes Wrong:</h4>
            <div className="space-y-2">
              {[
                { step: '1', text: 'Freeze your card immediately in your bank\'s app' },
                { step: '2', text: 'Change your password right away from a safe device' },
                { step: '3', text: 'Report it to your bank and the payment app\'s support' },
                { step: '4', text: 'Tell a parent or trusted adult — don\'t handle it alone' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start bg-white p-3 rounded border border-blue-200">
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">{step}</span>
                  <p className="text-blue-800 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">💡 The #1 Rule of Digital Money Safety:</h4>
            <p className="text-yellow-700 text-lg font-medium">
              If it creates urgency, seems too good to be true, or asks for sensitive info — STOP and verify through official channels before doing anything.
            </p>
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
    setLessonStep('scamGame');
  };

  const getProgressSteps = () => {
    return [weekProgress.lesson, weekProgress.scamGame, weekProgress.quiz, weekProgress.badge].filter(Boolean).length;
  };

  const renderOverview = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Week 10: Money in the Digital Age 🚀</h2>
              <p className="text-indigo-100 mt-2">Navigate digital banking, payment apps, and online scams safely!</p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <div className="flex items-center"><Users className="h-4 w-4 mr-1" /><span>Ages 13-16</span></div>
                <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /><span>30-35 minutes</span></div>
              </div>
            </div>
            <Badge badge="🚀 Digital Finance Master" earned={weekProgress.badge} size="large" animation="sparkle" />
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <ProgressBar current={getProgressSteps()} total={4} color="blue" showSteps stepLabels={['Learn', 'Scam Spotter', 'Quiz', 'Badge']} animated />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { key: 'lesson', icon: BookOpen, label: 'Learn' },
              { key: 'scamGame', icon: Shield, label: 'Scam Spotter' },
              { key: 'quiz', icon: Star, label: 'Quiz' },
              { key: 'badge', icon: Award, label: 'Badge' },
            ].map(({ key, icon: Icon, label }) => (
              <div key={key} className={`flex items-center p-3 rounded-lg transition-all ${(weekProgress as any)[key] ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}>
                <Icon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{label}</span>
                {(weekProgress as any)[key] && <Check className="h-4 w-4 ml-auto" />}
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-indigo-900 mb-2">🎯 What You'll Learn</h3>
            <p className="text-indigo-700">How digital payments work, how to use payment apps safely, how to spot the most common scams targeting teens, and what to do if something goes wrong.</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setLessonStep('lesson')}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              {weekProgress.lesson ? 'Review Digital Money Lesson' : 'Start Digital Finance Lesson!'}
              <Smartphone className="h-5 w-5 ml-2" />
            </button>
            {weekProgress.lesson && (
              <button
                onClick={() => setLessonStep('scamGame')}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all flex items-center justify-center"
              >
                {weekProgress.scamGame ? 'Review Scam Spotter' : 'Play Scam Spotter Game'}
                <Shield className="h-5 w-5 ml-2" />
              </button>
            )}
            {weekProgress.scamGame && (
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

  const renderScamGame = () => {
    const score = getScore();

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">🕵️ Scam Spotter Challenge</h2>
                <p className="text-red-100 mt-1">Can you tell what's safe and what's a scam?</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={resetGame} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all">
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
              <ProgressBar current={answers.length} total={scenarios.length} color="orange" showPercentage />
            </div>

            {scamGameCompleted ? (
              <div className="text-center">
                <div className={`p-6 rounded-2xl mb-6 ${score >= 5 ? 'bg-green-50 border-2 border-green-300' : score >= 4 ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-orange-50 border-2 border-orange-300'}`}>
                  <div className="text-5xl mb-3">{score >= 5 ? '🏆' : score >= 4 ? '🛡️' : '📚'}</div>
                  <h3 className={`text-2xl font-bold mb-2 ${score >= 5 ? 'text-green-800' : score >= 4 ? 'text-yellow-800' : 'text-orange-800'}`}>
                    {score >= 5 ? 'Scam Detective!' : score >= 4 ? 'Good Eye!' : 'Keep Practicing!'}
                  </h3>
                  <p className={`text-lg mb-4 ${score >= 5 ? 'text-green-700' : score >= 4 ? 'text-yellow-700' : 'text-orange-700'}`}>
                    You spotted {score} out of {scenarios.length} correctly!
                  </p>
                  <div className="grid grid-cols-6 gap-2 justify-center mb-4">
                    {answers.map((a, i) => (
                      <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${a?.correct ? 'bg-green-500' : 'bg-red-500'}`}>
                        {a?.correct ? '✓' : '✗'}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button onClick={resetGame} className="bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all">
                    Try Again
                  </button>
                  <button
                    onClick={() => setLessonStep('quiz')}
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center"
                  >
                    Take the Quiz <Star className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <span className="text-sm text-gray-500 font-medium">Scenario {currentScenario + 1} of {scenarios.length}</span>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
                  <div className="text-5xl mb-4">{scenarios[currentScenario].emoji}</div>
                  <p className="text-gray-800 text-lg leading-relaxed">{scenarios[currentScenario].scenario}</p>
                </div>

                {!showFeedback ? (
                  <div>
                    <p className="text-center text-gray-600 mb-4 font-medium">Is this Safe or a Scam?</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleAnswer(false)}
                        className="py-6 rounded-xl border-2 border-green-300 bg-green-50 hover:border-green-500 hover:bg-green-100 transition-all transform hover:scale-105 flex flex-col items-center"
                      >
                        <span className="text-4xl mb-2">✅</span>
                        <span className="font-bold text-green-800 text-lg">SAFE</span>
                      </button>
                      <button
                        onClick={() => handleAnswer(true)}
                        className="py-6 rounded-xl border-2 border-red-300 bg-red-50 hover:border-red-500 hover:bg-red-100 transition-all transform hover:scale-105 flex flex-col items-center"
                      >
                        <span className="text-4xl mb-2">🚨</span>
                        <span className="font-bold text-red-800 text-lg">SCAM</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {(() => {
                      const lastAnswer = answers[answers.length - 1];
                      const isCorrect = lastAnswer?.correct;
                      return (
                        <div className={`p-5 rounded-xl border-2 mb-4 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                          <div className="flex items-center mb-3">
                            <span className="text-2xl mr-2">{isCorrect ? '✅' : '❌'}</span>
                            <h4 className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                              {isCorrect ? 'Correct!' : `Actually, this was a ${scenarios[currentScenario].isScam ? 'SCAM' : 'safe'} scenario.`}
                            </h4>
                          </div>
                          <p className={`mb-3 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{scenarios[currentScenario].explanation}</p>
                          <div className="bg-white p-3 rounded border border-yellow-300">
                            <p className="text-yellow-800 text-sm"><strong>💡 Remember:</strong> {scenarios[currentScenario].tip}</p>
                          </div>
                        </div>
                      );
                    })()}
                    <button
                      onClick={handleNext}
                      className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-blue-600 transition-all"
                    >
                      {currentScenario + 1 >= scenarios.length ? 'See My Score →' : 'Next Scenario →'}
                    </button>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button onClick={() => setLessonStep('lesson')} className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all">
                    <ArrowLeft className="h-5 w-5 mr-2" /> Back to Lesson
                  </button>
                  <button
                    onClick={() => {
                      setWeekProgress(prev => ({ ...prev, scamGame: true }));
                      setLessonStep('quiz');
                    }}
                    className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all"
                  >
                    Skip to Quiz <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
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
            <p className="text-yellow-100 text-lg">You've earned the Digital Finance Master badge!</p>
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
            <div className="text-8xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-orange-800 mb-2">Digital Finance Master</h3>
            <p className="text-orange-700 text-lg mb-4">You can navigate digital money safely and spot scams before they get you!</p>
            <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">What you mastered:</h4>
              <div className="text-left space-y-2 text-orange-700">
                {[
                  'How modern digital payments work',
                  'Safe use of payment apps like Venmo, PayPal, and Cash App',
                  'The 5 most common scams targeting teens',
                  'Your personal digital security checklist',
                ].map(item => (
                  <div key={item} className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6 mb-6">
            <div className="text-5xl mb-3">🎓</div>
            <h4 className="text-2xl font-bold text-green-800 mb-2">Course Complete!</h4>
            <p className="text-green-700 text-lg">
              You've finished all 10 weeks of Financial Wisdom for Teens. You now know more about money than most adults!
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setWeekProgress(prev => ({ ...prev, badge: true }));
                onComplete(10, 'Digital Finance Master');
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Complete the Course! 🎉 <ArrowRight className="h-6 w-6 ml-2" />
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
            weekNumber={10}
            title="Money in the Digital Age"
            sections={lessonSections}
            onComplete={handleLessonComplete}
            onBack={() => setLessonStep('overview')}
            color="blue"
          />
        );
      case 'scamGame': return renderScamGame();
      case 'quiz':
        return (
          <QuizEngine
            questions={quizQuestions}
            onComplete={handleQuizComplete}
            minPassingScore={3}
            maxLives={3}
            showHints
            allowRetry
            color="blue"
          />
        );
      case 'badge': return renderBadgeCeremony();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      {renderCurrentStep()}
    </div>
  );
};

export default Week10Component;
