// 🚀 성능 최적화 및 모니터링 유틸리티
import { analytics } from '../firebaseConfig';
import { logEvent } from 'firebase/analytics';

// 🎯 성능 측정 클래스
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private measurements: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  // ⏱️ 성능 측정 시작
  startMeasurement(name: string): void {
    this.measurements.set(name, performance.now());
  }

  // ⏹️ 성능 측정 완료 및 로깅
  endMeasurement(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`Performance measurement '${name}' not found`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measurements.delete(name);

    // Firebase Analytics에 성능 데이터 전송
    if (typeof analytics !== 'undefined') {
      logEvent(analytics, 'performance_measurement', {
        measurement_name: name,
        duration_ms: Math.round(duration),
        timestamp: new Date().toISOString()
      });
    }

    console.log(`🎯 Performance [${name}]: ${duration.toFixed(2)}ms`);
    return duration;
  }
}

// 🎯 페이지 로드 성능 측정
export const measurePageLoad = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      // 페이지 로드 시간
      pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      // DNS 조회 시간
      dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
      // 연결 시간
      connectionTime: navigation.connectEnd - navigation.connectStart,
      // 응답 시간
      responseTime: navigation.responseEnd - navigation.requestStart,
      // DOM 구성 시간
      domTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      // 렌더링 시간
      renderTime: navigation.loadEventEnd - navigation.domContentLoadedEventEnd
    };

    // Firebase Analytics에 전송
    if (typeof analytics !== 'undefined') {
      logEvent(analytics, 'page_performance', {
        ...metrics,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        connection_type: (navigator as any).connection?.effectiveType || 'unknown'
      });
    }

    console.log('📊 Page Performance Metrics:', metrics);
    return metrics;
  }
};

// 🎯 컴포넌트 렌더링 성능 데코레이터
export const withPerformanceTracking = <T extends (...args: any[]) => any>(
  fn: T,
  componentName: string
): T => {
  return ((...args: any[]) => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.startMeasurement(`component_${componentName}`);
    
    const result = fn(...args);
    
    // React 컴포넌트인 경우 useEffect로 완료 측정
    if (typeof result === 'object' && result.type) {
      setTimeout(() => {
        monitor.endMeasurement(`component_${componentName}`);
      }, 0);
    }
    
    return result;
  }) as T;
};

// 🎯 이미지 로딩 최적화
export const optimizeImageLoading = () => {
  // Lazy Loading 지원 확인
  if ('loading' in HTMLImageElement.prototype) {
    console.log('✅ Native lazy loading supported');
  } else {
    console.log('⚠️ Loading polyfill for lazy loading');
    // Intersection Observer 폴리필 로직
  }

  // WebP 지원 확인
  const canvas = document.createElement('canvas');
  const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  if (webpSupported) {
    document.documentElement.classList.add('webp-supported');
    console.log('✅ WebP format supported');
  } else {
    document.documentElement.classList.add('webp-not-supported');
    console.log('⚠️ WebP not supported, using fallback images');
  }
};

// 🎯 메모리 사용량 모니터링
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const memoryInfo = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };

    // 메모리 사용량이 80% 이상일 때 경고
    if (memoryInfo.usagePercentage > 80) {
      console.warn('⚠️ High memory usage detected:', memoryInfo);
      
      // Firebase Analytics에 메모리 경고 전송
      if (typeof analytics !== 'undefined') {
        logEvent(analytics, 'memory_warning', {
          ...memoryInfo,
          timestamp: new Date().toISOString()
        });
      }
    }

    return memoryInfo;
  }
};

// 🎯 네트워크 상태 모니터링
export const monitorNetworkStatus = () => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    const networkInfo = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };

    // 느린 연결 감지
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      console.warn('⚠️ Slow network detected, optimizing for low bandwidth');
      document.documentElement.classList.add('slow-network');
    }

    return networkInfo;
  }
};

// 🎯 Core Web Vitals 측정
export const measureCoreWebVitals = () => {
  // First Contentful Paint (FCP)
  new PerformanceObserver((entryList) => {
    const fcpEntry = entryList.getEntries()[0];
    console.log('🎯 First Contentful Paint:', fcpEntry.startTime);
    
    if (typeof analytics !== 'undefined') {
      logEvent(analytics, 'core_web_vitals', {
        metric: 'FCP',
        value: fcpEntry.startTime,
        timestamp: new Date().toISOString()
      });
    }
  }).observe({ entryTypes: ['paint'] });

  // Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    const lcpEntry = entryList.getEntries()[entryList.getEntries().length - 1];
    console.log('🎯 Largest Contentful Paint:', lcpEntry.startTime);
    
    if (typeof analytics !== 'undefined') {
      logEvent(analytics, 'core_web_vitals', {
        metric: 'LCP',
        value: lcpEntry.startTime,
        timestamp: new Date().toISOString()
      });
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID) - 실제 사용자 상호작용 시에만 측정됨
  new PerformanceObserver((entryList) => {
    const fidEntry = entryList.getEntries()[0] as any;
    console.log('🎯 First Input Delay:', fidEntry.processingStart - fidEntry.startTime);
    
    if (typeof analytics !== 'undefined') {
      logEvent(analytics, 'core_web_vitals', {
        metric: 'FID',
        value: fidEntry.processingStart - fidEntry.startTime,
        timestamp: new Date().toISOString()
      });
    }
  }).observe({ entryTypes: ['first-input'] });
};

// 🎯 초기화 함수
export const initializePerformanceMonitoring = () => {
  console.log('🚀 Initializing Performance Monitoring...');
  
  // 페이지 로드 완료 후 측정
  window.addEventListener('load', () => {
    measurePageLoad();
    measureCoreWebVitals();
    optimizeImageLoading();
    monitorMemoryUsage();
    monitorNetworkStatus();
  });

  // 주기적 메모리 모니터링
  setInterval(() => {
    monitorMemoryUsage();
  }, 30000); // 30초마다 체크

  console.log('✅ Performance Monitoring initialized');
};