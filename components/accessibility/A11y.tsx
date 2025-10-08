// ♿ 접근성 강화 컴포넌트들
'use client';

import React, { useState, useEffect, useRef, memo, createContext, useContext } from 'react';

// 접근성 컨텍스트
interface AccessibilityContextType {
  announcements: string[];
  announce: (message: string) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// 접근성 훅
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

// 접근성 프로바이더
interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider = memo<AccessibilityProviderProps>(({ children }) => {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // 시스템 설정 감지
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const announce = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 3000);
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const value = {
    announcements,
    announce,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    setReducedMotion
  };

  return (
    <AccessibilityContext.Provider value={value}>
      <div className={highContrast ? 'high-contrast' : ''}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
});

AccessibilityProvider.displayName = 'AccessibilityProvider';

// 스크린 리더용 알림 컴포넌트
export const ScreenReaderAnnouncements = memo(() => {
  const { announcements } = useAccessibility();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcements.map((announcement, index) => (
        <div key={index}>{announcement}</div>
      ))}
    </div>
  );
});

ScreenReaderAnnouncements.displayName = 'ScreenReaderAnnouncements';

// 키보드 네비게이션 훅
export function useKeyboardNavigation(
  items: string[],
  onSelect?: (index: number) => void
) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && onSelect) {
            onSelect(focusedIndex);
          }
          break;
        case 'Escape':
          setFocusedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, items.length, onSelect]);

  return { focusedIndex, setFocusedIndex, containerRef };
}

// 접근성 버튼 컴포넌트
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AccessibleButton = memo<AccessibleButtonProps>(({
  children,
  onClick,
  ariaLabel,
  ariaDescribedBy,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const { announce, reducedMotion } = useAccessibility();

  const handleClick = () => {
    if (onClick) {
      onClick();
      announce(`버튼이 활성화되었습니다: ${ariaLabel || '버튼'}`);
    }
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 focus:bg-red-700 text-white'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]'
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`
        font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${!reducedMotion ? 'hover:scale-105 active:scale-95 transition-transform' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

// 스킵 네비게이션 컴포넌트
export const SkipNavigation = memo(() => {
  const skipTargets = [
    { href: '#main-content', label: '본문으로 바로가기' },
    { href: '#navigation', label: '네비게이션으로 바로가기' },
    { href: '#footer', label: '푸터로 바로가기' }
  ];

  return (
    <nav className="sr-only focus-within:not-sr-only" aria-label="건너뛰기 링크">
      <div className="fixed top-0 left-0 z-50 p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
        {skipTargets.map((target) => (
          <a
            key={target.href}
            href={target.href}
            className="block mb-2 last:mb-0 px-4 py-2 text-blue-600 dark:text-blue-400 underline hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {target.label}
          </a>
        ))}
      </div>
    </nav>
  );
});

SkipNavigation.displayName = 'SkipNavigation';

// 접근성 툴바
export const AccessibilityToolbar = memo(() => {
  const { highContrast, toggleHighContrast, reducedMotion, setReducedMotion, announce } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleContrast = () => {
    toggleHighContrast();
    announce(highContrast ? '고대비 모드가 해제되었습니다' : '고대비 모드가 활성화되었습니다');
  };

  const handleToggleMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    announce(newValue ? '애니메이션이 줄어들었습니다' : '애니메이션이 복원되었습니다');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 no-print">
      <div className={`transition-all duration-300 ${isOpen ? 'mb-4' : ''}`}>
        {isOpen && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-2 w-64">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">접근성 설정</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={handleToggleContrast}
                  className="rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">고대비 모드</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={handleToggleMotion}
                  className="rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">애니메이션 줄이기</span>
              </label>
            </div>
          </div>
        )}
      </div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="접근성 설정 열기"
        aria-expanded={isOpen}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </button>
    </div>
  );
});

AccessibilityToolbar.displayName = 'AccessibilityToolbar';

// 포커스 트랩 컴포넌트
interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
}

export const FocusTrap = memo<FocusTrapProps>(({ children, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    firstElement?.focus();
    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
});

FocusTrap.displayName = 'FocusTrap';