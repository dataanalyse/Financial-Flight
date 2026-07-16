"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Star, Flame, ArrowRight, BookOpen, Check, Award, Zap, Target, Shield, Lock } from "lucide-react";
import Week1Component from "./components/education/Week1Component";
import Week2Component from "./components/education/Week2Component";
import Week3Component from "./components/education/Week3Component";
import Week4Component from "./components/education/Week4Component";
import Week5Component from "./components/education/Week5Component";
import Week6Component from "./components/education/Week6Component";
import Week7Component from "./components/education/Week7Component";
import Week8Component from "./components/education/Week8Component";
import Week9Component from "./components/education/Week9Component";
import Week10Component from "./components/education/Week10Component";

// ─── Types ───────────────────────────────────────────────────────────────────

type View = "landing" | "hub" | "week";

interface PlayerData {
  name: string;
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedWeeks: number[];
  earnedBadges: { [key: number]: string };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const XP_PER_WEEK = 150;

const LEVELS = [
  { min: 0,    max: 149,  name: "Money Newbie",       emoji: "🌱", color: "green"  },
  { min: 150,  max: 449,  name: "Budget Builder",     emoji: "📊", color: "blue"   },
  { min: 450,  max: 899,  name: "Savings Star",       emoji: "⭐", color: "yellow" },
  { min: 900,  max: 1349, name: "Investment Explorer", emoji: "🚀", color: "purple" },
  { min: 1350, max: 9999, name: "Finance Master",     emoji: "🏆", color: "orange" },
];

const WEEKS = [
  { week: 1,  title: "What is Money?",             emoji: "💰", badge: "💰 Money Explorer",      difficulty: "Beginner",     time: "15-20 min" },
  { week: 2,  title: "How People Earn Money",       emoji: "💼", badge: "💼 Income Detective",    difficulty: "Beginner",     time: "20-25 min" },
  { week: 3,  title: "Needs vs Wants",              emoji: "🎯", badge: "🎯 Smart Shopper",       difficulty: "Beginner",     time: "15-20 min" },
  { week: 4,  title: "Making a Budget",             emoji: "📊", badge: "📊 Budget Boss",         difficulty: "Intermediate", time: "25-30 min" },
  { week: 5,  title: "The Magic of Saving",         emoji: "🦸", badge: "🦸 Savings Hero",        difficulty: "Intermediate", time: "20-25 min" },
  { week: 6,  title: "Understanding Interest",      emoji: "🌱", badge: "🌱 Growth Guru",         difficulty: "Intermediate", time: "25-30 min" },
  { week: 7,  title: "Credit and Debt Basics",      emoji: "🛡️", badge: "🛡️ Credit Guardian",    difficulty: "Advanced",     time: "25-30 min" },
  { week: 8,  title: "Investment Fundamentals",     emoji: "📈", badge: "📈 Investment Explorer", difficulty: "Advanced",     time: "30-35 min" },
  { week: 9,  title: "Financial Goals & Planning",  emoji: "🎯", badge: "🎯 Goal Getter",         difficulty: "Advanced",     time: "25-30 min" },
  { week: 10, title: "Money in the Digital Age",    emoji: "🚀", badge: "🚀 Digital Finance Master", difficulty: "Advanced",  time: "30-35 min" },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner:     "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced:     "bg-red-100 text-red-800",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLevel(xp: number) {
  return LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0];
}

function getLevelProgress(xp: number) {
  const level = getLevel(xp);
  const range = level.max - level.min;
  const progress = xp - level.min;
  return Math.min(100, Math.round((progress / range) * 100));
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function loadPlayer(): PlayerData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("finkids_player");
  return raw ? JSON.parse(raw) : null;
}

function savePlayer(data: PlayerData) {
  localStorage.setItem("finkids_player", JSON.stringify(data));
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function FinKidsAcademy() {
  const [view, setView]               = useState<View>("landing");
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [nameInput, setNameInput]     = useState("");
  const [player, setPlayer]           = useState<PlayerData | null>(null);
  const [showXPPopup, setShowXPPopup] = useState(false);

  // Load player on mount
  useEffect(() => {
    const saved = loadPlayer();
    if (saved) {
      // Streak: reset to 0 if more than 1 day has passed
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      if (saved.lastActiveDate && saved.lastActiveDate < yStr) {
        saved.streak = 0;
      }
      setPlayer(saved);
      setView("hub");
    }
  }, []);

  const handleStart = () => {
    const name = nameInput.trim() || "Explorer";
    const newPlayer: PlayerData = {
      name,
      xp: 0,
      streak: 1,
      lastActiveDate: todayStr(),
      completedWeeks: [],
      earnedBadges: {},
    };
    savePlayer(newPlayer);
    setPlayer(newPlayer);
    setView("hub");
  };

  const handleWeekComplete = (weekNumber: number, badge: string) => {
    if (!player) return;

    const alreadyDone = player.completedWeeks.includes(weekNumber);
    const newXP = alreadyDone ? player.xp : player.xp + XP_PER_WEEK;
    const isNewDay = player.lastActiveDate !== todayStr();
    const newStreak = isNewDay ? player.streak + 1 : player.streak;

    const updated: PlayerData = {
      ...player,
      xp: newXP,
      streak: newStreak,
      lastActiveDate: todayStr(),
      completedWeeks: alreadyDone
        ? player.completedWeeks
        : [...player.completedWeeks, weekNumber],
      earnedBadges: { ...player.earnedBadges, [weekNumber]: badge },
    };

    savePlayer(updated);
    setPlayer(updated);
    setCurrentWeek(null);
    setView("hub");

    if (!alreadyDone) {
      setShowXPPopup(true);
      setTimeout(() => setShowXPPopup(false), 3000);
    }
  };

  const handleBackToCourse = () => {
    setCurrentWeek(null);
    setView("hub");
  };

  // ── Landing ────────────────────────────────────────────────────────────────

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          {/* Logo */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-3xl mb-4">
              <span className="text-5xl">🎓</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-lg">
              Financial Flight
            </h1>
            <p className="text-xl text-blue-100 font-medium">
              Learn money habits fast. Level up your future. 🚀
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex justify-center gap-6 mb-8">
            {[
              { icon: "📚", label: "10 Weeks" },
              { icon: "🏆", label: "10 Badges" },
              { icon: "🎯", label: "Ages 13-16" },
              { icon: "⚡", label: "Free Forever" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center text-white">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-semibold mt-1 text-blue-100">{label}</span>
              </div>
            ))}
          </div>

          {/* Onboarding card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to begin? 🌟</h2>
            <p className="text-gray-500 mb-6">Enter your name and start your journey to becoming a money master!</p>
            <input
              type="text"
              placeholder="What's your name?"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl text-lg focus:outline-none focus:border-purple-500 mb-4 text-center font-medium"
              maxLength={20}
            />
            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              Start My Journey <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Badge preview */}
          <div className="bg-white bg-opacity-15 rounded-2xl p-4">
            <p className="text-white text-sm font-semibold mb-3">Badges you'll earn along the way:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {WEEKS.map((w) => (
                <span key={w.week} className="bg-white bg-opacity-20 text-white text-xs rounded-full px-3 py-1">
                  {w.badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Week view ──────────────────────────────────────────────────────────────

  if (view === "week" && currentWeek !== null) {
    const props = { onComplete: handleWeekComplete, onBack: handleBackToCourse };
    if (currentWeek === 1)  return <Week1Component  {...props} />;
    if (currentWeek === 2)  return <Week2Component  {...props} />;
    if (currentWeek === 3)  return <Week3Component  {...props} />;
    if (currentWeek === 4)  return <Week4Component  {...props} />;
    if (currentWeek === 5)  return <Week5Component  {...props} />;
    if (currentWeek === 6)  return <Week6Component  {...props} />;
    if (currentWeek === 7)  return <Week7Component  {...props} />;
    if (currentWeek === 8)  return <Week8Component  {...props} />;
    if (currentWeek === 9)  return <Week9Component  {...props} />;
    if (currentWeek === 10) return <Week10Component {...props} />;
  }

  // ── Hub ────────────────────────────────────────────────────────────────────

  if (!player) return null;

  const level          = getLevel(player.xp);
  const levelProgress  = getLevelProgress(player.xp);
  const nextWeek       = WEEKS.find((w) => !player.completedWeeks.includes(w.week));
  const totalCompleted = player.completedWeeks.length;
  const courseComplete = totalCompleted === WEEKS.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* XP popup */}
      {showXPPopup && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-yellow-900 font-bold text-lg px-6 py-3 rounded-2xl shadow-2xl animate-bounce flex items-center gap-2">
          <Zap className="h-5 w-5" /> +{XP_PER_WEEK} XP earned!
        </div>
      )}

      {/* Top nav */}
      <nav className="sticky top-0 z-40 bg-black bg-opacity-40 backdrop-blur-md border-b border-white border-opacity-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-white font-extrabold text-lg hidden sm:block">Financial Flight</span>
          </div>

          {/* XP bar */}
          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-yellow-400 text-xs font-bold">{level.emoji} {level.name}</span>
              <span className="text-white text-xs font-semibold">{player.xp} XP</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1 bg-orange-500 bg-opacity-20 border border-orange-500 border-opacity-30 rounded-xl px-3 py-1">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="text-orange-300 font-bold text-sm">{player.streak}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Welcome / course complete banner */}
        {courseComplete ? (
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-8 mb-8 text-center shadow-2xl">
            <div className="text-6xl mb-3">🏆</div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Course Complete, {player.name}!</h2>
            <p className="text-yellow-100 text-lg mb-4">You've earned all 10 badges and {player.xp} XP. You're a Finance Master! 🎓</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.values(player.earnedBadges).map((badge, i) => (
                <span key={i} className="bg-white bg-opacity-25 text-white text-sm font-semibold rounded-full px-3 py-1">{badge}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            {/* Greeting */}
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-white mb-1">
                Hey, {player.name}! 👋
              </h2>
              <p className="text-slate-400 text-lg">
                {totalCompleted === 0
                  ? "Your journey starts now. Let's go! 🚀"
                  : `You've completed ${totalCompleted} of 10 weeks. Keep it up!`}
              </p>
            </div>

            {/* Continue card */}
            {nextWeek && (
              <button
                onClick={() => { setCurrentWeek(nextWeek.week); setView("week"); }}
                className="flex items-center gap-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl px-6 py-4 shadow-xl transition-all transform hover:scale-105 min-w-[260px]"
              >
                <div className="text-4xl">{nextWeek.emoji}</div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-purple-200 uppercase tracking-wide mb-0.5">Continue</div>
                  <div className="font-bold text-lg leading-tight">Week {nextWeek.week}</div>
                  <div className="text-sm text-purple-200">{nextWeek.title}</div>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto" />
              </button>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Zap className="h-5 w-5 text-yellow-400" />, label: "Total XP",  value: `${player.xp} XP`,   bg: "from-yellow-500/10 to-orange-500/10",  border: "border-yellow-500/20" },
            { icon: <Star className="h-5 w-5 text-purple-400" />, label: "Level",    value: level.name,          bg: "from-purple-500/10 to-blue-500/10",    border: "border-purple-500/20" },
            { icon: <Flame className="h-5 w-5 text-orange-400" />,label: "Streak",   value: `${player.streak} days`, bg: "from-orange-500/10 to-red-500/10", border: "border-orange-500/20" },
            { icon: <Trophy className="h-5 w-5 text-green-400" />,label: "Badges",   value: `${totalCompleted}/10`,  bg: "from-green-500/10 to-teal-500/10", border: "border-green-500/20"  },
          ].map(({ icon, label, value, bg, border }) => (
            <div key={label} className={`bg-gradient-to-br ${bg} border ${border} rounded-2xl p-4`}>
              <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</span>
              </div>
              <div className="text-white font-bold text-lg">{value}</div>
            </div>
          ))}
        </div>

        {/* Earned badges showcase */}
        {Object.keys(player.earnedBadges).length > 0 && (
          <div className="rounded-2xl p-6 mb-8" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)", border: "2px solid rgba(167,139,250,0.35)" }}>
            {/* Header */}
            <div className="mb-5 text-center">
              <h3 className="text-2xl font-extrabold text-white tracking-wide inline-flex items-center gap-2">
                🎉 Badges Collected 🎉
              </h3>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-transparent to-purple-400" />
                <span className="text-lg">😄✨😄</span>
                <div className="h-0.5 w-12 rounded-full bg-gradient-to-l from-transparent to-purple-400" />
              </div>
            </div>

            {/* Badge pills */}
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.values(player.earnedBadges).map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 font-bold text-sm shadow-lg"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "#fff", boxShadow: "0 0 12px rgba(245,158,11,0.45)" }}
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Week grid */}
        <div>
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" /> All 10 Weeks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WEEKS.map((w) => {
              const completed = player.completedWeeks.includes(w.week);

              return (
                <button
                  key={w.week}
                  onClick={() => { setCurrentWeek(w.week); setView("week"); }}
                  className={`text-left rounded-2xl overflow-hidden transition-all transform hover:scale-105 shadow-lg group ${
                    completed
                      ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30"
                      : "bg-white bg-opacity-5 border border-white border-opacity-10 hover:border-purple-500/50"
                  }`}
                >
                  {/* Card header */}
                  <div className={`p-4 flex items-center justify-between ${
                    completed
                      ? "bg-green-500/20"
                      : "bg-gradient-to-r from-purple-600/30 to-blue-600/30"
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{completed ? "✅" : w.emoji}</span>
                      <div>
                        <div className="text-white font-bold text-sm">Week {w.week}</div>
                        <div className="text-slate-300 text-xs">{w.title}</div>
                      </div>
                    </div>
                    {completed && <Check className="h-5 w-5 text-green-400" />}
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[w.difficulty]}`}>
                        {w.difficulty}
                      </span>
                      <span className="text-slate-400 text-xs">{w.time}</span>
                    </div>

                    {/* Badge preview */}
                    <div className="bg-black bg-opacity-20 rounded-lg px-3 py-2 mb-3">
                      <div className="text-slate-400 text-xs mb-0.5">Earn:</div>
                      <div className="text-white text-sm font-semibold">{w.badge}</div>
                    </div>

                    {/* XP tag */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                        <Zap className="h-3 w-3" /> +{XP_PER_WEEK} XP
                      </span>
                      <span className={`text-xs font-semibold ${completed ? "text-green-400" : "text-purple-300 group-hover:text-white"}`}>
                        {completed ? "Review →" : "Start →"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>Financial Flight — Built to give every teen a financial head start. 💙</p>
        </div>
      </div>
    </div>
  );
}
