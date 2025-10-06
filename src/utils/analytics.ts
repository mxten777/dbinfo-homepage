// 📊 사용자 경험 분석 및 추적 유틸리티
import { analytics } from '../firebaseConfig';
import { logEvent, setUserProperties } from 'firebase/analytics';

// 🎯 사용자 행동 추적 클래스
export class UserBehaviorTracker {
  private static instance: UserBehaviorTracker;
  private sessionStartTime: number = Date.now();
  private pageViews: string[] = [];
  private clickEvents: number = 0;
  private scrollDepth: number = 0;

  static getInstance(): UserBehaviorTracker {
    if (!this.instance) {
      this.instance = new UserBehaviorTracker();
    }
    return this.instance;
  }

  // 📄 페이지 뷰 추적
  trackPageView(pageName: string, path: string): void {
    this.pageViews.push(pageName);
    
    if (typeof analytics !== 'undefined') {
      logEvent(analytics, 'page_view', {
        page_name: pageName,
        page_path: path,
        timestamp: new Date().toISOString(),
        session_duration: Date.now() - this.sessionStartTime
      });
    }
    
    console.log(`📄 Page View: ${pageName} (${path})`);
  }

  // 🖱️ 클릭 이벤트 추적
  trackClick(elementType: string, elementId?: string, elementText?: string): void {
    this.clickEvents++;
    
    if (typeof analytics !== 'undefined') {
      logEvent(analytics, 'click_event', {
        element_type: elementType,
        element_id: elementId || 'unknown',
        element_text: elementText?.substring(0, 50) || '',
        click_count: this.clickEvents,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🖱️ Click: ${elementType}${elementId ? ` (#${elementId})` : ''}${elementText ? ` ("${elementText}")` : ''}`);
  }

  // 📜 스크롤 깊이 추적
  trackScrollDepth(): void {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.round((scrolled / maxScroll) * 100);
    
    if (scrollPercentage > this.scrollDepth && scrollPercentage % 25 === 0) {
      this.scrollDepth = scrollPercentage;
      
      if (typeof analytics !== 'undefined') {
        logEvent(analytics, 'scroll_depth', {
          scroll_percentage: scrollPercentage,
          page_height: document.documentElement.scrollHeight,
          viewport_height: window.innerHeight,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log(`📜 Scroll Depth: ${scrollPercentage}%`);
    }
  }

  // ⏱️ 세션 시간 추적
  getSessionDuration(): number {
    return Date.now() - this.sessionStartTime;
  }

  // 🎯 사용자 특성 설정
  setUserProperties(properties: Record<string, any>): void {
    if (typeof analytics !== 'undefined') {
      setUserProperties(analytics, properties);
    }
  }
}

// 🎯 A/B 테스트 관리
export class ABTestManager {
  private static tests: Map<string, string> = new Map();

  static assignUserToTest(testName: string, variants: string[]): string {
    const existingVariant = this.tests.get(testName);
    if (existingVariant) return existingVariant;

    // 사용자 ID 기반 일관된 배정 (여기서는 localStorage 사용)
    const userId = localStorage.getItem('user_id') || Math.random().toString(36);
    if (!localStorage.getItem('user_id')) {
      localStorage.setItem('user_id', userId);
    }

    // 해시 기반 일관된 랜덤 배정
    let hash = 0;
    const str = userId + testName;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
    }
    
    const variant = variants[Math.abs(hash) % variants.length];
    this.tests.set(testName, variant);

    // Analytics에 A/B 테스트 배정 기록
    if (typeof analytics !== 'undefined') {
      logEvent(analytics, 'ab_test_assignment', {
        test_name: testName,
        variant: variant,
        user_id: userId,
        timestamp: new Date().toISOString()
      });
    }

    console.log(`🧪 A/B Test [${testName}]: User assigned to variant "${variant}"`);
    return variant;
  }

  static getVariant(testName: string): string | null {
    return this.tests.get(testName) || null;
  }
}

// 🎯 에러 추적
export const trackError = (error: Error, context?: string): void => {
  console.error('❌ Error tracked:', error.message, context);
  
  if (typeof analytics !== 'undefined') {
    logEvent(analytics, 'error_occurred', {
      error_message: error.message,
      error_stack: error.stack?.substring(0, 500) || '',
      error_context: context || '',
      page_url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }
};

// 🎯 폼 분석
export const trackFormInteraction = (formName: string, action: 'start' | 'submit' | 'abandon', field?: string): void => {
  if (typeof analytics !== 'undefined') {
    logEvent(analytics, 'form_interaction', {
      form_name: formName,
      action: action,
      field_name: field || '',
      timestamp: new Date().toISOString()
    });
  }
  
  console.log(`📝 Form [${formName}]: ${action}${field ? ` - ${field}` : ''}`);
};

// 🎯 검색 추적
export const trackSearch = (searchTerm: string, resultCount: number, category?: string): void => {
  if (typeof analytics !== 'undefined') {
    logEvent(analytics, 'search_performed', {
      search_term: searchTerm,
      result_count: resultCount,
      search_category: category || '',
      timestamp: new Date().toISOString()
    });
  }
  
  console.log(`🔍 Search: "${searchTerm}" (${resultCount} results)${category ? ` in ${category}` : ''}`);
};

// 🎯 비즈니스 메트릭 추적
export const trackBusinessMetric = (metric: string, value: number, unit?: string): void => {
  if (typeof analytics !== 'undefined') {
    logEvent(analytics, 'business_metric', {
      metric_name: metric,
      metric_value: value,
      metric_unit: unit || '',
      timestamp: new Date().toISOString()
    });
  }
  
  console.log(`📈 Business Metric [${metric}]: ${value}${unit ? ` ${unit}` : ''}`);
};

// 🎯 자동 이벤트 리스너 설정
export const setupAutomaticTracking = (): void => {
  console.log('🎯 Setting up automatic user behavior tracking...');
  
  const tracker = UserBehaviorTracker.getInstance();

  // 클릭 이벤트 자동 추적
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const elementType = target.tagName.toLowerCase();
    const elementId = target.id;
    const elementText = target.textContent?.trim();
    
    // 특정 요소들만 추적 (버튼, 링크 등)
    if (['button', 'a', 'input'].includes(elementType) || target.getAttribute('role') === 'button') {
      tracker.trackClick(elementType, elementId, elementText);
    }
  });

  // 스크롤 이벤트 추적 (throttled)
  let scrollTimeout: any;
  document.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      tracker.trackScrollDepth();
    }, 250);
  });

  // 페이지 이탈 시 세션 종료 추적
  window.addEventListener('beforeunload', () => {
    const sessionDuration = tracker.getSessionDuration();
    if (typeof analytics !== 'undefined') {
      logEvent(analytics, 'session_end', {
        session_duration: sessionDuration,
        page_views_count: tracker['pageViews'].length,
        click_events_count: tracker['clickEvents'],
        max_scroll_depth: tracker['scrollDepth'],
        timestamp: new Date().toISOString()
      });
    }
  });

  // 폼 필드 focus/blur 추적
  document.addEventListener('focusin', (event) => {
    const target = event.target as HTMLElement;
    if (['input', 'textarea', 'select'].includes(target.tagName.toLowerCase())) {
      const formName = target.closest('form')?.getAttribute('name') || 'unnamed_form';
      const fieldName = target.getAttribute('name') || target.getAttribute('id') || 'unnamed_field';
      trackFormInteraction(formName, 'start', fieldName);
    }
  });

  console.log('✅ Automatic tracking initialized');
};

// 🎯 사용자 세그멘테이션
export const identifyUserSegment = (): string => {
  const userAgent = navigator.userAgent;
  const screenWidth = window.screen.width;
  const connectionType = (navigator as any).connection?.effectiveType || 'unknown';
  
  let segment = 'default';
  
  // 디바이스 기반 세그멘테이션
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    segment = screenWidth > 768 ? 'mobile_tablet' : 'mobile_phone';
  } else {
    segment = screenWidth > 1920 ? 'desktop_large' : 'desktop_standard';
  }
  
  // 연결 속도 기반 세그멘테이션
  if (connectionType === 'slow-2g' || connectionType === '2g') {
    segment += '_slow_network';
  }
  
  return segment;
};

// 🎯 초기화 함수
export const initializeAnalytics = (): void => {
  console.log('📊 Initializing Analytics...');
  
  // 사용자 세그먼트 식별
  const userSegment = identifyUserSegment();
  UserBehaviorTracker.getInstance().setUserProperties({
    user_segment: userSegment,
    session_start: new Date().toISOString()
  });
  
  // 자동 추적 설정
  setupAutomaticTracking();
  
  console.log('✅ Analytics initialized for segment:', userSegment);
};