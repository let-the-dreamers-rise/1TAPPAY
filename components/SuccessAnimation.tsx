'use client';

/**
 * SuccessAnimation Component
 * 
 * Animated success feedback after payment completion.
 * Auto-dismisses after 3 seconds and calls onComplete callback.
 */

import { useEffect } from 'react';

interface SuccessAnimationProps {
  message: string;
  onComplete?: () => void;
}

export function SuccessAnimation({ message, onComplete }: SuccessAnimationProps) {
  useEffect(() => {
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
      {/* Success Checkmark Animation */}
      <div className="relative mb-8">
        {/* Outer Circle */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center animate-scale-in shadow-2xl">
          {/* Inner Circle */}
          <div className="w-28 h-28 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
            {/* Checkmark */}
            <svg 
              className="w-16 h-16 text-green-500 animate-draw-check" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Confetti Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: '50%',
                top: '50%',
                backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][i % 4],
                animationDelay: `${i * 0.1}s`,
                transform: `rotate(${i * 30}deg) translateY(-60px)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 animate-slide-up">
          {message}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Your transaction has been processed successfully
        </p>
      </div>

      {/* Success Icon with Pulse */}
      <div className="mt-8 flex items-center gap-2 text-green-600 dark:text-green-400 animate-pulse-slow">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">
          Redirecting...
        </span>
      </div>
    </div>
  );
}
