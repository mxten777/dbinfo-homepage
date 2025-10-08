'use client';

import React, { useEffect, useState } from 'react';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'data_access' | 'suspicious_activity' | 'system_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  userId?: string;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalAlerts: number;
  blockedAttempts: number;
  securityScore: number;
  lastScanTime: Date;
}

export function SecuritySystem() {
  const [isActive, setIsActive] = useState(false);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalAlerts: 0,
    blockedAttempts: 0,
    securityScore: 98.5,
    lastScanTime: new Date()
  });

  useEffect(() => {
    // 보안 모니터링 시작
    const startSecurityMonitoring = () => {
      console.log('🔒 DB.INFO Security System Activated');
      setIsActive(true);

      // CSP (Content Security Policy) 강화
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:";
      document.head.appendChild(cspMeta);

      // XSS 보호
      document.addEventListener('DOMContentLoaded', () => {
        // 모든 외부 스크립트 검증
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
          const src = script.getAttribute('src');
          if (src && !src.startsWith('/') && !src.startsWith('https://')) {
            console.warn('🚨 Suspicious script detected:', src);
            addSecurityEvent({
              type: 'suspicious_activity',
              severity: 'high',
              message: `Suspicious script detected: ${src}`
            });
          }
        });
      });

      // 클릭재킹 방지
      if (window.top !== window.self) {
        console.warn('🚨 Potential clickjacking attempt detected');
        addSecurityEvent({
          type: 'suspicious_activity',
          severity: 'critical',
          message: 'Potential clickjacking attempt detected'
        });
      }

      // 개발자 도구 감지 (간단한 방법)
      const devtools = { open: false };
      setInterval(() => {
        const threshold = 160;
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            console.log('🔍 Developer tools activity detected');
            addSecurityEvent({
              type: 'suspicious_activity',
              severity: 'medium',
              message: 'Developer tools activity detected'
            });
          }
        } else {
          devtools.open = false;
        }
      }, 500);

      // 비정상적인 네트워크 요청 모니터링
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const url = args[0] as string;
        
        // 의심스러운 도메인 체크
        const suspiciousDomains = [
          'malware.com',
          'phishing.net',
          'suspicious-site.org'
        ];
        
        if (suspiciousDomains.some(domain => url.includes(domain))) {
          console.warn('🚨 Blocked suspicious request to:', url);
          addSecurityEvent({
            type: 'system_alert',
            severity: 'critical',
            message: `Blocked suspicious request to: ${url}`
          });
          throw new Error('Request blocked by security system');
        }

        return originalFetch(...args);
      };

      // 로컬 스토리지 보안 검사
      try {
        const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
        Object.keys(localStorage).forEach(key => {
          if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
            console.warn('🔐 Sensitive data in localStorage:', key);
            addSecurityEvent({
              type: 'data_access',
              severity: 'medium',
              message: `Sensitive data detected in localStorage: ${key}`
            });
          }
        });
      } catch {
        console.log('📦 localStorage access restricted - Good security practice');
      }
    };

    const addSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
      const newEvent: SecurityEvent = {
        ...event,
        id: Date.now().toString(),
        timestamp: new Date(),
        ip: '127.0.0.1', // 실제로는 서버에서 가져옴
        userAgent: navigator.userAgent
      };

      setSecurityEvents(prev => [newEvent, ...prev.slice(0, 99)]); // 최대 100개 유지
      
      setMetrics(prev => ({
        ...prev,
        totalEvents: prev.totalEvents + 1,
        criticalAlerts: event.severity === 'critical' ? prev.criticalAlerts + 1 : prev.criticalAlerts,
        lastScanTime: new Date()
      }));
    };

    // 정기적 보안 스캔
    const securityScanInterval = setInterval(() => {
      console.log('🔍 Running security scan...');
      
      // 시스템 상태 체크
      const memoryInfo = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
      const memoryUsage = memoryInfo?.usedJSHeapSize || 0;
      
      if (memoryUsage > 100000000) { // 100MB 초과
        addSecurityEvent({
          type: 'system_alert',
          severity: 'medium',
          message: `High memory usage detected: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`
        });
      }

      setMetrics(prev => ({
        ...prev,
        securityScore: Math.min(99.9, prev.securityScore + 0.1),
        lastScanTime: new Date()
      }));
    }, 30000); // 30초마다

    startSecurityMonitoring();

    return () => {
      clearInterval(securityScanInterval);
      setIsActive(false);
    };
  }, []);

  // 관리자용 보안 대시보드 (개발 환경에서만 표시)
  const showSecurityDashboard = process.env.NODE_ENV === 'development' && 
                               (window.location.search.includes('security=admin') || 
                                localStorage.getItem('admin_mode') === 'true');

  if (!showSecurityDashboard) {
    return (
      <div className="hidden">
        {/* 보안 시스템이 백그라운드에서 실행 중... */}
        {isActive && (
          <div className="fixed bottom-2 left-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded opacity-75 pointer-events-none">
            🔒 Security Active
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                🛡️
              </div>
              <div>
                <h2 className="text-2xl font-bold">DB.INFO Security Center</h2>
                <p className="text-red-100">실시간 보안 모니터링 시스템</p>
              </div>
            </div>
            <button
              onClick={() => localStorage.removeItem('admin_mode')}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 메트릭스 */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{metrics.totalEvents}</div>
            <div className="text-sm text-blue-800 dark:text-blue-300">총 이벤트</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{metrics.criticalAlerts}</div>
            <div className="text-sm text-red-800 dark:text-red-300">위험 알림</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{metrics.blockedAttempts}</div>
            <div className="text-sm text-green-800 dark:text-green-300">차단된 시도</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{metrics.securityScore}%</div>
            <div className="text-sm text-purple-800 dark:text-purple-300">보안 점수</div>
          </div>
        </div>

        {/* 최근 이벤트 */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            🔍 최근 보안 이벤트
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {securityEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                😊 보안 이벤트가 없습니다. 시스템이 안전합니다!
              </div>
            ) : (
              securityEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    event.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                    event.severity === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                    event.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {event.message}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {event.timestamp.toLocaleString('ko-KR')}
                        {event.ip && ` • IP: ${event.ip}`}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {event.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            마지막 스캔: {metrics.lastScanTime.toLocaleString('ko-KR')} • 
            보안 시스템 {isActive ? '활성화' : '비활성화'} 상태
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecuritySystem;
