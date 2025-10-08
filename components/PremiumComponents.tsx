// 🎨 고급 UI 컴포넌트 라이브러리
import React, { useState, useEffect, useRef } from 'react';

// 🌟 프리미엄 로딩 스피너
export const PremiumLoader: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dots' | 'spinner' | 'pulse';
  message?: string;
}> = ({ size = 'md', variant = 'spinner', message }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const loaderVariants = {
    spinner: (
      <div
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      ></div>
    ),
    dots: (
      <div className="flex space-x-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-blue-600 rounded-full animate-pulse`}
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    ),
    pulse: (
      <div
        className={`${sizeClasses[size]} bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full animate-pulse`}
      ></div>
    ),
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {loaderVariants[variant]}
      {message && <p className="mt-4 text-gray-600 text-sm font-medium animate-pulse">{message}</p>}
    </div>
  );
};

// 🚨 알림 토스트 시스템
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // 애니메이션 완료 후 제거
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    warning: 'bg-yellow-500 border-yellow-600',
    info: 'bg-blue-500 border-blue-600',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={`
      fixed top-4 right-4 z-50 min-w-80 p-4 rounded-2xl border-2 text-white shadow-2xl
      transition-all duration-300 transform backdrop-blur-sm
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${typeStyles[type]}
    `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl">{icons[type]}</span>
          <p className="font-semibold">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// 📊 프로그레스 바
export const ProgressBar: React.FC<{
  progress: number;
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  animated?: boolean;
  gradient?: boolean;
}> = ({
  progress,
  variant = 'linear',
  size = 'md',
  showPercentage = false,
  animated = true,
  gradient = true,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  if (variant === 'circular') {
    const sizeValues = { sm: 60, md: 80, lg: 120 };
    const strokeWidth = { sm: 4, md: 6, lg: 8 };
    const circleSize = sizeValues[size];
    const radius = (circleSize - strokeWidth[size]) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={circleSize}
          height={circleSize}
          className={
            animated ? 'transform rotate-90 transition-all duration-1000' : 'transform rotate-90'
          }
        >
          {/* Background circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth[size]}
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth[size]}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={animated ? 'transition-all duration-1000 ease-out' : ''}
          />
          {gradient && (
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          )}
        </svg>
        {showPercentage && (
          <span className="absolute text-sm font-bold text-gray-700">
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>
    );
  }

  // Linear progress bar
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`
            h-full rounded-full transition-all duration-1000 ease-out
            ${
              gradient ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' : 'bg-blue-500'
            }
          `}
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
      {showPercentage && (
        <div className="flex justify-between mt-1 text-sm text-gray-600">
          <span>진행률</span>
          <span className="font-semibold">{Math.round(clampedProgress)}%</span>
        </div>
      )}
    </div>
  );
};

// 🎭 모달 컴포넌트
export const PremiumModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}> = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
      fixed inset-0 z-50 flex items-center justify-center p-4
      bg-black/50 backdrop-blur-sm transition-opacity duration-300
      ${isOpen ? 'opacity-100' : 'opacity-0'}
    `}
    >
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto
          bg-white rounded-3xl shadow-2xl border border-gray-200
          transform transition-all duration-300
          ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// 🎨 그라데이션 카드
export const GradientCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  gradient?: 'blue' | 'purple' | 'pink' | 'green' | 'orange';
  hover?: boolean;
  glow?: boolean;
}> = ({ children, className = '', gradient = 'blue', hover = true, glow = false }) => {
  const gradientClasses = {
    blue: 'from-blue-500 via-blue-600 to-indigo-600',
    purple: 'from-purple-500 via-purple-600 to-indigo-600',
    pink: 'from-pink-500 via-purple-500 to-indigo-500',
    green: 'from-green-500 via-emerald-500 to-teal-500',
    orange: 'from-orange-500 via-red-500 to-pink-500',
  };

  return (
    <div
      className={`
      relative p-6 rounded-3xl bg-gradient-to-br ${gradientClasses[gradient]}
      shadow-xl border border-white/20 backdrop-blur-sm
      ${hover ? 'transform hover:scale-105 transition-all duration-300' : ''}
      ${glow ? 'shadow-2xl shadow-blue-500/25' : ''}
      ${className}
    `}
    >
      <div className="relative z-10 text-white">{children}</div>
      {/* Glow effect */}
      {glow && (
        <div
          className={`
          absolute inset-0 rounded-3xl bg-gradient-to-br ${gradientClasses[gradient]}
          blur-xl opacity-75 -z-10 scale-110
        `}
        ></div>
      )}
    </div>
  );
};

// 🎯 스켈레톤 로더
export const SkeletonLoader: React.FC<{
  type: 'text' | 'card' | 'image' | 'table';
  lines?: number;
  className?: string;
}> = ({ type, lines = 3, className = '' }) => {
  const baseClass = 'animate-pulse bg-gray-200 rounded';

  const skeletonTypes = {
    text: (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={`${baseClass} h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}></div>
        ))}
      </div>
    ),
    card: (
      <div className={`${baseClass} p-6 ${className}`}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-3 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    ),
    image: <div className={`${baseClass} aspect-video ${className}`}></div>,
    table: (
      <div className={`space-y-3 ${className}`}>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-8 bg-gray-300 rounded"></div>
          ))}
        </div>
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, j) => (
              <div key={j} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    ),
  };

  return skeletonTypes[type];
};
