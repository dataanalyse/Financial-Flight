"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Trophy, Award } from 'lucide-react';

interface BadgeProps {
  badge: string;
  earned: boolean;
  animation?: 'bounce' | 'pulse' | 'sparkle' | 'glow';
  size?: 'small' | 'medium' | 'large';
  showCeremony?: boolean;
  onCeremonyComplete?: () => void;
}

const Badge: React.FC<BadgeProps> = ({ 
  badge, 
  earned, 
  animation = 'sparkle',
  size = 'medium',
  showCeremony = false,
  onCeremonyComplete 
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [ceremonyStep, setCeremonyStep] = useState(0);

  useEffect(() => {
    if (earned && !showAnimation) {
      setShowAnimation(true);
      if (showCeremony) {
        // Start ceremony sequence
        const timer = setTimeout(() => {
          setCeremonyStep(1);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [earned, showAnimation, showCeremony]);

  useEffect(() => {
    if (showCeremony && ceremonyStep === 1) {
      const timer = setTimeout(() => {
        setCeremonyStep(2);
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (ceremonyStep === 2 && onCeremonyComplete) {
      const timer = setTimeout(() => {
        onCeremonyComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ceremonyStep, showCeremony, onCeremonyComplete]);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-16 h-16 text-3xl';
      case 'medium':
        return 'w-24 h-24 text-5xl';
      case 'large':
        return 'w-32 h-32 text-7xl';
      default:
        return 'w-24 h-24 text-5xl';
    }
  };

  const getAnimationClasses = () => {
    if (!earned || !showAnimation) return '';
    
    switch (animation) {
      case 'bounce':
        return 'animate-bounce';
      case 'pulse':
        return 'animate-pulse';
      case 'sparkle':
        return 'animate-pulse';
      case 'glow':
        return 'animate-pulse ring-4 ring-yellow-300 ring-opacity-75';
      default:
        return 'animate-pulse';
    }
  };

  const extractEmoji = (badgeText: string) => {
    const emojiMatch = badgeText.match(/^(\p{Emoji}+)/u);
    return emojiMatch ? emojiMatch[1] : '🏆';
  };

  const extractName = (badgeText: string) => {
    return badgeText.replace(/^(\p{Emoji}+\s*)/u, '');
  };

  if (showCeremony) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-10 animate-pulse"></div>
          
          {/* Floating particles */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-4 left-4 text-yellow-400 animate-ping">✨</div>
            <div className="absolute top-8 right-8 text-yellow-400 animate-ping" style={{animationDelay: '0.5s'}}>⭐</div>
            <div className="absolute bottom-6 left-8 text-yellow-400 animate-ping" style={{animationDelay: '1s'}}>💫</div>
            <div className="absolute bottom-4 right-4 text-yellow-400 animate-ping" style={{animationDelay: '1.5s'}}>✨</div>
          </div>

          <div className="relative z-10">
            {ceremonyStep === 0 && (
              <div className="animate-fadeIn">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
                <p className="text-gray-600">You've earned a new badge!</p>
              </div>
            )}

            {ceremonyStep >= 1 && (
              <div className="animate-fadeIn">
                <div className={`mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-300 flex items-center justify-center ${getSizeClasses()} ${getAnimationClasses()}`}>
                  <span className="filter drop-shadow-lg">
                    {extractEmoji(badge)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-orange-800 mb-2">
                  {extractName(badge)}
                </h3>
                <p className="text-orange-700">Badge Earned!</p>
              </div>
            )}

            {ceremonyStep === 2 && (
              <div className="mt-4 animate-fadeIn">
                <div className="flex justify-center space-x-2">
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-spin" />
                  <span className="text-sm font-medium text-gray-600">Added to your collection!</span>
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-center">
      <div className={`
        rounded-full flex items-center justify-center border-2 transition-all duration-300
        ${earned 
          ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300 shadow-lg' 
          : 'bg-gray-100 border-gray-300'
        }
        ${getSizeClasses()}
        ${getAnimationClasses()}
      `}>
        <span className={`filter ${earned ? 'drop-shadow-lg' : 'grayscale opacity-50'}`}>
          {extractEmoji(badge)}
        </span>
        
        {/* Sparkle effects for earned badges */}
        {earned && animation === 'sparkle' && (
          <>
            <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-yellow-400 animate-ping" />
            <Star className="absolute -bottom-2 -left-2 h-4 w-4 text-yellow-400 animate-ping" style={{animationDelay: '0.5s'}} />
          </>
        )}
      </div>
      
      <div className="mt-2 text-center">
        <p className={`text-sm font-medium ${earned ? 'text-gray-900' : 'text-gray-500'}`}>
          {extractName(badge)}
        </p>
        {earned && (
          <div className="flex items-center justify-center mt-1">
            <Trophy className="h-3 w-3 text-yellow-600 mr-1" />
            <span className="text-xs text-yellow-600 font-medium">EARNED</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Badge;