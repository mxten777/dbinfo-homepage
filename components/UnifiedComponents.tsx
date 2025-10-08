// 🎨 DB.INFO 통합 UI 컴포넌트 시스템
import React from 'react';

// 📐 표준화된 디자인 토큰
export const DESIGN_TOKENS = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      500: '#eab308',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
    },
  },
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px  
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
    '3xl': '6rem',   // 96px
  },
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out', 
    slow: '500ms ease-in-out',
  },
} as const;

// 🎨 통합된 버튼 컴포넌트
export interface UnifiedButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const UnifiedButton: React.FC<UnifiedButtonProps> = ({
  variant = 'primary',
  size = 'md', 
  children,
  onClick,
  className = '',
  disabled = false,
  fullWidth = false,
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-bold rounded-xl
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    min-h-[44px] touch-manipulation
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-indigo-600 text-white
      hover:from-blue-700 hover:to-indigo-700 hover:scale-105
      focus:ring-blue-500 shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-white text-blue-600 border-2 border-blue-200
      hover:bg-blue-50 hover:border-blue-300 hover:scale-105
      focus:ring-blue-500 shadow-md hover:shadow-lg
    `,
    outline: `
      border-2 border-current text-blue-600 bg-transparent
      hover:bg-blue-600 hover:text-white hover:scale-105
      focus:ring-blue-500
    `,
    ghost: `
      text-blue-600 bg-transparent
      hover:bg-blue-50 hover:scale-105
      focus:ring-blue-500
    `,
  };

  const sizes = {
    sm: 'px-3 py-2 sm:px-4 text-xs sm:text-sm gap-1.5 sm:gap-2',
    md: 'px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base gap-2',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg gap-2 sm:gap-3', 
    xl: 'px-8 py-4 sm:px-10 sm:py-5 text-lg sm:text-xl gap-3 sm:gap-4',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// 🏷️ 통합된 배지 컴포넌트
export interface UnifiedBadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const UnifiedBadge: React.FC<UnifiedBadgeProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
}) => {
  const baseStyles = `
    inline-flex items-center font-semibold rounded-full
    transition-all duration-300 ease-in-out
  `;

  const variants = {
    primary: 'bg-blue-100 text-blue-800 border border-blue-200',
    secondary: 'bg-purple-100 text-purple-800 border border-purple-200', 
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm gap-1 sm:gap-1.5',
    lg: 'px-3 py-2 sm:px-4 text-sm sm:text-base gap-1.5 sm:gap-2',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

// 📦 통합된 카드 컴포넌트
export interface UnifiedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hover = false,
}) => {
  const baseStyles = `
    rounded-2xl transition-all duration-300 ease-in-out
    ${onClick ? 'cursor-pointer' : ''}
    ${hover ? 'hover:scale-105 hover:shadow-xl' : ''}
  `;

  const variants = {
    default: 'bg-white shadow-lg border border-gray-200',
    elevated: 'bg-white shadow-xl border-0',
    outlined: 'bg-white border-2 border-gray-200 shadow-sm',
    glass: 'bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-lg',
  };

  const paddings = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8', 
    xl: 'p-8 sm:p-10',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// 📋 통합된 섹션 헤더 컴포넌트
export interface UnifiedSectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export const UnifiedSectionHeader: React.FC<UnifiedSectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  description,
  centered = true,
  className = '',
}) => {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-8 sm:mb-12 lg:mb-16 ${className}`}>
      {badge && (
        <UnifiedBadge variant="primary" size="md" className="mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl mr-1.5 sm:mr-2">💼</span>
          {badge}
        </UnifiedBadge>
      )}
      
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
        {title}
      </h2>
      
      {subtitle && (
        <h3 className="text-lg sm:text-xl md:text-2xl text-blue-600 font-semibold mb-3 sm:mb-4">
          {subtitle}
        </h3>
      )}
      
      {description && (
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
          {description}
        </p>
      )}
    </div>
  );
};

// 🎯 통합된 CTA 섹션 컴포넌트
export interface UnifiedCTASectionProps {
  title: string;
  description: string;
  primaryButton: {
    text: string;
    onClick: () => void;
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

export const UnifiedCTASection: React.FC<UnifiedCTASectionProps> = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  className = '',
}) => {
  return (
    <div className={`text-center p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl text-white ${className}`}>
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">{title}</h3>
      <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <UnifiedButton
          variant="secondary"
          size="lg"
          onClick={primaryButton.onClick}
          className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
        >
          {primaryButton.text}
        </UnifiedButton>
        
        {secondaryButton && (
          <UnifiedButton
            variant="outline"
            size="lg"
            onClick={secondaryButton.onClick}
            className="border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto"
          >
            {secondaryButton.text}
          </UnifiedButton>
        )}
      </div>
    </div>
  );
};

// 📊 통합된 스탯 카드 컴포넌트
export interface UnifiedStatCardProps {
  value: string;
  label: string;
  icon?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const UnifiedStatCard: React.FC<UnifiedStatCardProps> = ({
  value,
  label,
  icon,
  trend,
  className = '',
}) => {
  return (
    <UnifiedCard variant="glass" padding="lg" className={`text-center ${className}`}>
      {icon && (
        <div className="text-4xl mb-4">{icon}</div>
      )}
      
      <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
        {value}
      </div>
      
      <div className="text-gray-600 font-medium mb-2">
        {label}
      </div>
      
      {trend && (
        <div className={`text-sm font-semibold ${
          trend.isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend.isPositive ? '↗' : '↘'} {trend.value}
        </div>
      )}
    </UnifiedCard>
  );
};