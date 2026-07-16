"use client";

import React from 'react';
import { Check, Star, Clock } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  size?: 'small' | 'medium' | 'large';
  showSteps?: boolean;
  stepLabels?: string[];
  animated?: boolean;
  showIcon?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showPercentage = true,
  color = 'blue',
  size = 'medium',
  showSteps = false,
  stepLabels = [],
  animated = true,
  showIcon = true
}) => {
  const percentage = Math.round((current / total) * 100);
  
  const getColorClasses = () => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        light: 'bg-blue-100',
        text: 'text-blue-700',
        ring: 'ring-blue-300'
      },
      green: {
        bg: 'bg-green-500',
        light: 'bg-green-100',
        text: 'text-green-700',
        ring: 'ring-green-300'
      },
      purple: {
        bg: 'bg-purple-500',
        light: 'bg-purple-100',
        text: 'text-purple-700',
        ring: 'ring-purple-300'
      },
      orange: {
        bg: 'bg-orange-500',
        light: 'bg-orange-100',
        text: 'text-orange-700',
        ring: 'ring-orange-300'
      },
      pink: {
        bg: 'bg-pink-500',
        light: 'bg-pink-100',
        text: 'text-pink-700',
        ring: 'ring-pink-300'
      }
    };
    return colors[color];
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return { height: 'h-2', text: 'text-sm' };
      case 'medium':
        return { height: 'h-3', text: 'text-base' };
      case 'large':
        return { height: 'h-4', text: 'text-lg' };
      default:
        return { height: 'h-3', text: 'text-base' };
    }
  };

  const colorClasses = getColorClasses();
  const sizeClasses = getSizeClasses();

  if (showSteps) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {showIcon && <Star className={`h-5 w-5 ${colorClasses.text} mr-2`} />}
            <span className={`font-medium ${colorClasses.text} ${sizeClasses.text}`}>
              Progress: {current} of {total} steps
            </span>
          </div>
          {showPercentage && (
            <span className={`font-bold ${colorClasses.text} ${sizeClasses.text}`}>
              {percentage}%
            </span>
          )}
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between">
          {Array.from({ length: total }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber <= current;
            const isCurrent = stepNumber === current + 1;
            const stepLabel = stepLabels[index] || `Step ${stepNumber}`;

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${isCompleted 
                    ? `${colorClasses.bg} border-transparent text-white shadow-lg`
                    : isCurrent
                      ? `border-2 ${colorClasses.ring} bg-white ${colorClasses.text} ring-2 ${colorClasses.ring} ring-opacity-50`
                      : 'border-gray-300 bg-gray-100 text-gray-500'
                  }
                  ${animated && isCompleted ? 'animate-pulse' : ''}
                `}>
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{stepNumber}</span>
                  )}
                </div>

                {/* Step Label */}
                <span className={`
                  mt-2 text-xs text-center px-1
                  ${isCompleted ? colorClasses.text : 'text-gray-500'}
                  ${isCurrent ? 'font-semibold' : 'font-medium'}
                `}>
                  {stepLabel}
                </span>

                {/* Connection Line */}
                {index < total - 1 && (
                  <div className={`
                    absolute top-4 w-full h-0.5 -z-10 transition-all duration-500
                    ${stepNumber <= current ? colorClasses.bg : 'bg-gray-300'}
                  `} style={{ 
                    left: '50%', 
                    width: `calc(100% / ${total} - 2rem)`,
                    marginLeft: '1rem'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {showIcon && <Clock className={`h-4 w-4 ${colorClasses.text} mr-2`} />}
          <span className={`font-medium ${colorClasses.text} ${sizeClasses.text}`}>
            Progress
          </span>
        </div>
        {showPercentage && (
          <span className={`font-bold ${colorClasses.text} ${sizeClasses.text}`}>
            {percentage}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses.height} overflow-hidden`}>
        <div 
          className={`
            ${colorClasses.bg} ${sizeClasses.height} rounded-full transition-all duration-500 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          {animated && (
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-25 animate-shimmer" />
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">
          {current} of {total} completed
        </span>
        {percentage === 100 && (
          <div className="flex items-center text-green-600">
            <Check className="h-3 w-3 mr-1" />
            <span className="text-xs font-medium">Complete!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;