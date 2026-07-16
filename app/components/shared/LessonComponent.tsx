"use client";

import React, { useState } from 'react';
import { BookOpen, Play, Volume2, ArrowRight, ArrowLeft, X, CheckCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';

export interface LessonSection {
  id: string;
  title: string;
  content: React.ReactNode;
  type: 'text' | 'story' | 'example' | 'tip' | 'warning' | 'activity';
  audioUrl?: string;
}

interface LessonComponentProps {
  weekNumber: number;
  title: string;
  sections: LessonSection[];
  onComplete: () => void;
  onBack: () => void;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
}

const LessonComponent: React.FC<LessonComponentProps> = ({
  weekNumber,
  title,
  sections,
  onComplete,
  onBack,
  color = 'blue'
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const getColorClasses = () => {
    const colors = {
      blue: { 
        primary: 'blue-500', 
        light: 'blue-50', 
        dark: 'blue-700',
        gradient: 'from-blue-500 to-blue-600'
      },
      green: { 
        primary: 'green-500', 
        light: 'green-50', 
        dark: 'green-700',
        gradient: 'from-green-500 to-green-600'
      },
      purple: { 
        primary: 'purple-500', 
        light: 'purple-50', 
        dark: 'purple-700',
        gradient: 'from-purple-500 to-purple-600'
      },
      orange: { 
        primary: 'orange-500', 
        light: 'orange-50', 
        dark: 'orange-700',
        gradient: 'from-orange-500 to-orange-600'
      },
      pink: { 
        primary: 'pink-500', 
        light: 'pink-50', 
        dark: 'pink-700',
        gradient: 'from-pink-500 to-pink-600'
      }
    };
    return colors[color];
  };

  const colorClasses = getColorClasses();

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'story': return '📖';
      case 'example': return '💡';
      case 'tip': return '💰';
      case 'warning': return '⚠️';
      case 'activity': return '🎮';
      default: return '📚';
    }
  };

  const getSectionStyle = (type: string) => {
    switch (type) {
      case 'story':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-400';
      case 'example':
        return 'bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-yellow-400';
      case 'tip':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-400';
      case 'warning':
        return 'bg-gradient-to-br from-red-50 to-pink-50 border-l-4 border-red-400';
      case 'activity':
        return 'bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400';
      default:
        return `bg-gradient-to-br from-${colorClasses.light} to-white border-l-4 border-${colorClasses.primary}`;
    }
  };

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const goToNextSection = () => {
    // Auto-complete current section when going to next
    markSectionComplete(sections[currentSection].id);
    
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      onComplete();
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const playAudio = (audioUrl: string) => {
    if ('speechSynthesis' in window && !audioUrl) {
      // Use text-to-speech if no audio URL provided
      const section = sections[currentSection];
      const textContent = extractTextContent(section.content);
      const utterance = new SpeechSynthesisUtterance(textContent);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    } else if (audioUrl) {
      // Play actual audio file
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const extractTextContent = (content: React.ReactNode): string => {
    if (typeof content === 'string') return content;
    if (React.isValidElement(content)) {
      return extractTextContent((content.props as any).children);
    }
    if (Array.isArray(content)) {
      return content.map(extractTextContent).join(' ');
    }
    return '';
  };

  const section = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Clean Header */}
        <div className="bg-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-blue-100 mt-1">Week {weekNumber}</p>
            </div>
            <button
              onClick={onBack}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Simple Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Section {currentSection + 1} of {sections.length}</span>
              <span className="text-sm text-gray-600">{Math.round(((currentSection + 1) / sections.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Clean Section Content */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {section.title}
            </h3>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-gray-700">
              {section.content}
            </div>

            {/* Simple completion */}
            {!completedSections.includes(section.id) && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => markSectionComplete(section.id)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  ✓ Mark Complete
                </button>
              </div>
            )}

            {/* Completed indicator */}
            {completedSections.includes(section.id) && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Section completed</span>
                </div>
              </div>
            )}
          </div>

          {/* Simple Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={goToPreviousSection}
              disabled={currentSection === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentSection === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ← Previous
            </button>

            <button
              onClick={goToNextSection}
              disabled={!completedSections.includes(section.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                !completedSections.includes(section.id)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isLastSection
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isLastSection ? 'Complete Lesson' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonComponent;