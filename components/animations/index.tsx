import React, { useEffect, useState, useRef } from 'react';

// 🎭 애니메이션 variants
export const ANIMATION_VARIANTS = {
  // 📍 기본 방향성 애니메이션
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },

  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },

  slideDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
  },

  slideLeft: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
  },

  slideRight: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },

  // 🎯 스케일 애니메이션
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },

  // 🌀 회전 애니메이션
  rotateIn: {
    initial: { opacity: 0, rotate: -10, scale: 0.9 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
  },

  // 📚 스태거 애니메이션
  staggerContainer: {
    initial: {},
    animate: {},
  },

  staggerChild: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },

  // ✨ 특수 효과
  bounce: {
    initial: { y: 0 },
    animate: { y: 0 },
  },

  pulse: {
    initial: { scale: 1 },
    animate: { scale: 1 },
  },
} as const;

// 🎨 향상된 애니메이션 컴포넌트 (Intersection Observer 기반)
interface EnhancedAnimateProps {
  children: React.ReactNode;
  variant?: keyof typeof ANIMATION_VARIANTS;
  delay?: number;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export const EnhancedAnimate: React.FC<EnhancedAnimateProps> = ({
  children,
  variant = 'slideUp',
  delay = 0,
  className = '',
  threshold = 0.1,
  triggerOnce = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasTriggered(true);
          }, delay);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold, triggerOnce, hasTriggered]);

  const animation = ANIMATION_VARIANTS[variant];
  const animationStyle: any = isVisible ? animation.animate : animation.initial;

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-600 ease-out ${className}`}
      style={{
        opacity: animationStyle.opacity || 0,
        transform: `
          translateX(${animationStyle.x || 0}px) 
          translateY(${animationStyle.y || 0}px) 
          scale(${animationStyle.scale || 1}) 
          rotate(${animationStyle.rotate || 0}deg)
        `,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// 🎪 스태거 컨테이너 컴포넌트
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={elementRef} className={className}>
      {React.Children.map(children, (child, index) => (
        <EnhancedAnimate
          key={index}
          variant="staggerChild"
          delay={isVisible ? index * staggerDelay : 0}
        >
          {child}
        </EnhancedAnimate>
      ))}
    </div>
  );
};

// 🎯 호버 애니메이션 유틸리티
export const HOVER_EFFECTS = {
  lift: 'hover:scale-105 hover:-translate-y-2 transition-transform duration-300',
  glow: 'hover:shadow-2xl hover:shadow-blue-500/25 transition-shadow duration-300',
  rotate: 'hover:rotate-3 transition-transform duration-300',
  bounce: 'hover:animate-bounce',
  pulse: 'hover:animate-pulse',
} as const;

// 🎨 CSS 클래스 기반 애니메이션 (성능 최적화)
export const CSS_ANIMATIONS = {
  // 진입 애니메이션
  fadeInUp: 'animate-[fadeInUp_0.6s_ease-out]',
  fadeInDown: 'animate-[fadeInDown_0.6s_ease-out]',
  fadeInLeft: 'animate-[fadeInLeft_0.6s_ease-out]',
  fadeInRight: 'animate-[fadeInRight_0.6s_ease-out]',

  // 스케일 애니메이션
  zoomIn: 'animate-[zoomIn_0.6s_ease-out]',
  zoomOut: 'animate-[zoomOut_0.6s_ease-out]',

  // 회전 애니메이션
  rotateIn: 'animate-[rotateIn_0.8s_ease-out]',

  // 지연 클래스
  delay: {
    100: 'animation-delay-100',
    200: 'animation-delay-200',
    300: 'animation-delay-300',
    500: 'animation-delay-500',
  },
} as const;
