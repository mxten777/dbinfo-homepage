// 🔐 클라이언트 사이드 보안 유틸리티
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// 🛡️ Input Sanitization
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
};

// 🛡️ 이메일 검증
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitizeInput(email));
};

// 🛡️ 비밀번호 강도 검증
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 포함해야 합니다');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 🛡️ 관리자 권한 확인
export const checkAdminPermission = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    return adminDoc.exists();
  } catch (error) {
    console.error('Admin permission check failed:', error);
    return false;
  }
};

// 🛡️ XSS 방어를 위한 안전한 HTML 렌더링
export const safeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// 🛡️ SQL Injection 방어 (Firestore는 NoSQL이지만 유사한 공격 방어)
export const sanitizeFirestoreQuery = (query: string): string => {
  if (!query || typeof query !== 'string') return '';
  
  return query
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[;\\]/g, '') // Remove semicolons and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .trim()
    .slice(0, 100); // Limit length
};

// 🛡️ 파일 업로드 검증
export const validateFileUpload = (file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
}): { isValid: boolean; error?: string } => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'] } = options;
  
  // 파일 크기 검증
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `파일 크기가 너무 큽니다. 최대 ${Math.round(maxSize / 1024 / 1024)}MB까지 가능합니다.`
    };
  }
  
  // 파일 타입 검증
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `지원하지 않는 파일 형식입니다. 허용 형식: ${allowedTypes.join(', ')}`
    };
  }
  
  // 파일명 검증 (특수문자, 스크립트 방어)
  if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
    return {
      isValid: false,
      error: '파일명에 특수문자가 포함되어 있습니다.'
    };
  }
  
  return { isValid: true };
};

// 🛡️ 날짜 검증
export const validateDateRange = (startDate: string, endDate: string): {
  isValid: boolean;
  error?: string;
} => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: '올바른 날짜 형식이 아닙니다.' };
  }
  
  if (start >= end) {
    return { isValid: false, error: '시작일은 종료일보다 이전이어야 합니다.' };
  }
  
  if (start < today) {
    return { isValid: false, error: '시작일은 오늘 이후여야 합니다.' };
  }
  
  return { isValid: true };
};

// 🛡️ 연차 신청 검증
export const validateLeaveRequest = (data: {
  startDate: string;
  endDate: string;
  reason: string;
  type: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // 날짜 검증
  const dateValidation = validateDateRange(data.startDate, data.endDate);
  if (!dateValidation.isValid) {
    errors.push(dateValidation.error!);
  }
  
  // 사유 검증
  const sanitizedReason = sanitizeInput(data.reason);
  if (sanitizedReason.length < 2) {
    errors.push('사유는 최소 2자 이상 입력해주세요.');
  }
  
  if (sanitizedReason.length > 500) {
    errors.push('사유는 최대 500자까지 입력 가능합니다.');
  }
  
  // 연차 타입 검증
  const validTypes = ['연차', '반차', '병가', '경조사'];
  if (!validTypes.includes(data.type)) {
    errors.push('올바른 연차 타입을 선택해주세요.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 🛡️ Rate Limiting (클라이언트 사이드)
class RateLimiter {
  private attempts = new Map<string, number[]>();
  
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // 윈도우 밖의 시도들 제거
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// 🛡️ 세션 타임아웃 관리
export class SessionManager {
  private static instance: SessionManager;
  private timeoutId: NodeJS.Timeout | null = null;
  private readonly TIMEOUT_DURATION = 30 * 60 * 1000; // 30분
  
  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }
  
  startSession(onTimeout: () => void): void {
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      onTimeout();
      this.clearSession();
    }, this.TIMEOUT_DURATION);
  }
  
  refreshSession(onTimeout: () => void): void {
    this.startSession(onTimeout);
  }
  
  clearSession(): void {
    this.clearTimeout();
  }
  
  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

// 🛡️ 보안 헤더 설정 (개발 가이드)
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://firebase.googleapis.com https://firestore.googleapis.com;",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// 🛡️ 민감한 정보 마스킹
export const maskSensitiveData = (data: string, type: 'email' | 'phone' | 'id'): string => {
  switch (type) {
    case 'email':
      const [local, domain] = data.split('@');
      if (!domain) return '***';
      return `${local.slice(0, 2)}***@${domain}`;
    
    case 'phone':
      if (data.length < 4) return '***';
      return `${data.slice(0, 3)}****${data.slice(-4)}`;
    
    case 'id':
      if (data.length < 4) return '***';
      return `${data.slice(0, 2)}***${data.slice(-2)}`;
    
    default:
      return '***';
  }
};