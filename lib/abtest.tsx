// 🧪 A/B 테스팅 시스템
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// A/B 테스트 타입 정의
interface ABTest {
  id: string;
  name: string;
  variants: Record<string, ABVariant>;
  defaultVariant: string;
  trafficAllocation: number; // 0-1 사이의 값 (테스트에 참여할 사용자 비율)
  isActive: boolean;
}

interface ABVariant {
  id: string;
  name: string;
  weight: number; // 가중치 (0-1 사이)
  config: Record<string, unknown>; // 변형별 설정값들
}

// 컨텍스트 타입
interface ABTestContextType {
  getVariant: (testId: string) => string | null;
  trackConversion: (testId: string, event: string) => void;
  getConfig: (testId: string, key: string, defaultValue?: unknown) => unknown;
  isInTest: (testId: string) => boolean;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

// 사용자 ID 생성 (쿠키 또는 로컬스토리지 기반)
function generateUserId(): string {
  if (typeof window === 'undefined') return 'server-user';
  
  let userId = localStorage.getItem('ab-test-user-id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('ab-test-user-id', userId);
  }
  return userId;
}

// 해시 함수 (사용자 ID를 기반으로 일관된 변형 할당)
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  return Math.abs(hash);
}

// 변형 할당 로직
function assignVariant(testId: string, userId: string, test: ABTest): string | null {
  // 트래픽 할당 체크
  const userHash = hashCode(userId + testId);
  const trafficSlot = (userHash % 1000) / 1000; // 0-1 범위
  
  if (trafficSlot > test.trafficAllocation) {
    return null; // 테스트 대상이 아님
  }
  
  // 변형 할당
  const variantHash = hashCode(userId + testId + 'variant');
  const variantSlot = (variantHash % 1000) / 1000;
  
  let cumulativeWeight = 0;
  for (const [variantId, variant] of Object.entries(test.variants)) {
    cumulativeWeight += variant.weight;
    if (variantSlot <= cumulativeWeight) {
      return variantId;
    }
  }
  
  return test.defaultVariant;
}

// 기본 테스트 설정
const defaultTests: Record<string, ABTest> = {
  'hero-button-text': {
    id: 'hero-button-text',
    name: '히어로 섹션 버튼 텍스트 테스트',
    variants: {
      control: {
        id: 'control',
        name: '기본 버튼',
        weight: 0.5,
        config: {
          primaryButtonText: '📋 무료 상담 받기',
          secondaryButtonText: '📊 포트폴리오 보기'
        }
      },
      variant_a: {
        id: 'variant_a',
        name: '행동 지향 버튼',
        weight: 0.5,
        config: {
          primaryButtonText: '🚀 지금 시작하기',
          secondaryButtonText: '💡 아이디어 상담받기'
        }
      }
    },
    defaultVariant: 'control',
    trafficAllocation: 0.8, // 80% 사용자 대상
    isActive: true
  },
  
  'pricing-display': {
    id: 'pricing-display',
    name: '가격 표시 방식 테스트',
    variants: {
      control: {
        id: 'control',
        name: '기존 가격 표시',
        weight: 0.33,
        config: {
          showDiscount: false,
          priceFormat: 'monthly',
          urgencyText: ''
        }
      },
      discount: {
        id: 'discount',
        name: '할인 강조',
        weight: 0.33,
        config: {
          showDiscount: true,
          priceFormat: 'monthly',
          urgencyText: '🔥 한정시간 특가!'
        }
      },
      annual: {
        id: 'annual',
        name: '연간 할인 강조',
        weight: 0.34,
        config: {
          showDiscount: true,
          priceFormat: 'annual',
          urgencyText: '💰 연간 결제시 20% 할인!'
        }
      }
    },
    defaultVariant: 'control',
    trafficAllocation: 1.0,
    isActive: true
  }
};

// A/B 테스트 프로바이더
interface ABTestProviderProps {
  children: ReactNode;
  tests?: Record<string, ABTest>;
}

export const ABTestProvider = ({ children, tests = defaultTests }: ABTestProviderProps) => {
  const [userId] = useState(() => generateUserId());
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  useEffect(() => {
    // 사용자별 테스트 변형 할당
    const newAssignments: Record<string, string> = {};
    
    Object.values(tests).forEach(test => {
      if (test.isActive) {
        const variant = assignVariant(test.id, userId, test);
        if (variant) {
          newAssignments[test.id] = variant;
          
          // 분석 추적
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'ab_test_assignment', {
              test_id: test.id,
              variant_id: variant,
              user_id: userId
            });
          }
        }
      }
    });
    
    setAssignments(newAssignments);
  }, [tests, userId]);

  const getVariant = (testId: string): string | null => {
    return assignments[testId] || null;
  };

  const trackConversion = (testId: string, event: string) => {
    const variant = assignments[testId];
    if (!variant) return;

    // 로컬 스토리지에 전환 기록
    const key = `ab-conversion-${testId}-${variant}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({
      event,
      timestamp: Date.now()
    });
    localStorage.setItem(key, JSON.stringify(existing));

    // 분석 도구에 전송
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ab_test_conversion', {
        test_id: testId,
        variant_id: variant,
        conversion_event: event,
        user_id: userId
      });
    }

    console.log(`🧪 A/B Test Conversion: ${testId} (${variant}) - ${event}`);
  };

  const getConfig = (testId: string, key: string, defaultValue?: unknown): unknown => {
    const variant = assignments[testId];
    if (!variant || !tests[testId]) return defaultValue;
    
    const variantConfig = tests[testId].variants[variant]?.config;
    return variantConfig?.[key] ?? defaultValue;
  };

  const isInTest = (testId: string): boolean => {
    return testId in assignments;
  };

  const value = {
    getVariant,
    trackConversion,
    getConfig,
    isInTest
  };

  return (
    <ABTestContext.Provider value={value}>
      {children}
    </ABTestContext.Provider>
  );
};

// A/B 테스트 훅
export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider');
  }
  return context;
};

// A/B 테스트 컴포넌트 래퍼
interface ABTestWrapperProps {
  testId: string;
  children: (variant: string | null, config: Record<string, unknown>) => ReactNode;
  fallback?: ReactNode;
}

export const ABTestWrapper = ({ testId, children, fallback }: ABTestWrapperProps) => {
  const { getVariant, getConfig } = useABTest();
  const variant = getVariant(testId);
  
  if (!variant) {
    return <>{fallback}</>;
  }
  
  const config = getConfig(testId, '', {}) as Record<string, unknown>;
  return <>{children(variant, config)}</>;
};

// 조건부 A/B 테스트 컴포넌트
interface ConditionalABProps {
  testId: string;
  variant: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const ConditionalAB = ({ testId, variant, children, fallback }: ConditionalABProps) => {
  const { getVariant } = useABTest();
  const currentVariant = getVariant(testId);
  
  if (currentVariant === variant) {
    return <>{children}</>;
  }
  
  return <>{fallback || null}</>;
};

// A/B 테스트 결과 추적 컴포넌트
export const ABTestTracker = () => {
  const { trackConversion } = useABTest();
  
  useEffect(() => {
    // 페이지 뷰 추적
    trackConversion('hero-button-text', 'page_view');
    trackConversion('pricing-display', 'page_view');
  }, [trackConversion]);
  
  return null;
};

// 개발자 도구 (개발 모드에서만)
export const ABTestDevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getVariant, trackConversion } = useABTest();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed top-4 left-4 z-50 no-print">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        🧪 A/B Tests
      </button>
      
      {isOpen && (
        <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-80">
          <h3 className="font-semibold mb-3">Active A/B Tests</h3>
          
          <div className="space-y-3">
            {Object.keys(defaultTests).map(testId => {
              const variant = getVariant(testId);
              return (
                <div key={testId} className="text-sm">
                  <div className="font-medium">{testId}</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Variant: {variant || 'Control Group'}
                  </div>
                  <button
                    onClick={() => trackConversion(testId, 'manual_conversion')}
                    className="mt-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded"
                  >
                    Track Conversion
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// 전역 타입 확장 (gtag)
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}