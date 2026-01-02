// 📱 모바일 UX 최적화 컴포넌트들
'use client';

import React, { useState, useEffect, useRef, memo } from 'react';

// 모바일 감지 훅
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
}

// 터치 제스처 훅
export function useSwipeGesture(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold = 50
) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    if (isRightSwipe && onSwipeRight) onSwipeRight();
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

// 모바일 친화적 버튼 컴포넌트
interface MobileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export const MobileButton = memo<MobileButtonProps>(({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = ''
}) => {
  // theme not required here; keep component visual unchanged
  
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus-ring active:scale-95 select-none';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  };
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100',
    outline: 'border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
});

MobileButton.displayName = 'MobileButton';

// 모바일 카드 컴포넌트
interface MobileCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
}

export const MobileCard = memo<MobileCardProps>(({
  children,
  onClick,
  className = '',
  interactive = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        card p-4 sm:p-6
        ${interactive ? 'cursor-pointer hover:shadow-medium active:scale-98 transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
});

MobileCard.displayName = 'MobileCard';

// 하단 고정 액션 바
interface BottomActionBarProps {
  children: React.ReactNode;
  className?: string;
}

export const BottomActionBar = memo<BottomActionBarProps>(({
  children,
  className = ''
}) => {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-40 
      bg-white dark:bg-gray-900 
      border-t border-gray-200 dark:border-gray-700
      p-4 pb-safe-area-inset-bottom
      shadow-lg
      ${className}
    `}>
      {children}
    </div>
  );
});

BottomActionBar.displayName = 'BottomActionBar';

// 풀스크린 모달 (모바일용)
interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const MobileModal = memo<MobileModalProps>(({
  isOpen,
  onClose,
  title,
  children
}) => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className={`
        relative h-full flex flex-col
        ${isMobile 
          ? 'bg-white dark:bg-gray-900' 
          : 'max-w-md mx-auto mt-16 mb-16 rounded-lg bg-white dark:bg-gray-900 shadow-2xl'
        }
      `}>
        {/* 헤더 */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
});

MobileModal.displayName = 'MobileModal';

// 터치 친화적 탭 컴포넌트
interface MobileTabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  defaultTab?: string;
}

export const MobileTabs = memo<MobileTabsProps>(({
  tabs,
  defaultTab
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;
  
  return (
    <div className="w-full">
      {/* 탭 헤더 */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-shrink-0 px-6 py-3 font-medium text-sm whitespace-nowrap transition-all duration-200
              min-h-[48px] flex items-center justify-center
              ${activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 탭 컨텐츠 */}
      <div className="pt-4">
        {activeTabContent}
      </div>
    </div>
  );
});

MobileTabs.displayName = 'MobileTabs';

// 스와이프 가능한 카드 컨테이너
interface SwipeableCardProps {
  cards: Array<{ id: string; content: React.ReactNode }>;
  className?: string;
}

export const SwipeableCards = memo<SwipeableCardProps>(({
  cards,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };
  
  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };
  
  const swipeHandlers = useSwipeGesture(nextCard, prevCard);
  
  return (
    <div className={`relative ${className}`}>
      {/* 카드 컨테이너 */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        {...swipeHandlers}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {cards.map((card) => (
            <div key={card.id} className="w-full flex-shrink-0">
              {card.content}
            </div>
          ))}
        </div>
      </div>
      
      {/* 인디케이터 */}
      <div className="flex justify-center mt-4 gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-200
              ${index === currentIndex 
                ? 'bg-blue-600 w-6' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
});

SwipeableCards.displayName = 'SwipeableCards';