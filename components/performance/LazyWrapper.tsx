// 🚀 성능 최적화된 컴포넌트 래퍼들
'use client';

import { memo, Suspense, lazy, ComponentType, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// 로딩 컴포넌트 타입들
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
}

// 로딩 스피너 컴포넌트
const LoadingSpinner = memo<LoadingSpinnerProps>(({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const colorClasses = {
    blue: 'border-blue-600 border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  return (
    <div className={`${sizeClasses[size]} border-4 ${colorClasses[color]} rounded-full animate-spin`}></div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// 스켈레톤 로더
export const SkeletonLoader = memo(({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>
));

SkeletonLoader.displayName = 'SkeletonLoader';

// 카드 스켈레톤
export const CardSkeleton = memo(() => (
  <div className="animate-pulse">
    <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="bg-gray-300 h-4 rounded w-3/4"></div>
      <div className="bg-gray-300 h-4 rounded w-1/2"></div>
      <div className="bg-gray-300 h-8 rounded w-1/4"></div>
    </div>
  </div>
));

CardSkeleton.displayName = 'CardSkeleton';

// 에러 폴백 컴포넌트
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
  message?: string;
}

const ErrorFallback = memo<ErrorFallbackProps>(({ 
  error, 
  resetErrorBoundary,
  title = "컴포넌트 로드 오류",
  message = "컴포넌트를 불러오는 중 문제가 발생했습니다."
}) => (
  <div className="min-h-48 flex items-center justify-center bg-red-50 rounded-lg border border-red-200 p-6">
    <div className="text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-4">{message}</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
      >
        다시 시도
      </button>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-red-600">개발자 정보</summary>
          <pre className="mt-2 p-2 bg-red-100 text-xs overflow-auto text-red-800 rounded">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  </div>
));

ErrorFallback.displayName = 'ErrorFallback';

// 지연 로딩 래퍼
interface LazyWrapperProps {
  fallback?: ComponentType;
  errorTitle?: string;
  errorMessage?: string;
  className?: string;
  children: ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
}

export const LazyWrapper = memo<LazyWrapperProps>(({ 
  fallback: Fallback = () => <LoadingSpinner />,
  errorTitle,
  errorMessage,
  className = '',
  children: Component,
  props = {}
}) => (
  <ErrorBoundary
    FallbackComponent={({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
      <ErrorFallback
        error={error}
        resetErrorBoundary={resetErrorBoundary}
        title={errorTitle}
        message={errorMessage}
      />
    )}
  >
    <Suspense fallback={
      <div className={`flex items-center justify-center min-h-48 ${className}`}>
        <Fallback />
      </div>
    }>
      <Component {...props} />
    </Suspense>
  </ErrorBoundary>
));

LazyWrapper.displayName = 'LazyWrapper';

// Next.js 최적화된 이미지 컴포넌트
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export const LazyImage = memo<LazyImageProps>(({ 
  src, 
  alt, 
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'empty',
  blurDataURL
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className="w-full h-full object-cover"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

// 섹션 지연 로딩 래퍼
export const LazySection = memo<{
  children: React.ReactNode;
  className?: string;
  fallbackHeight?: string;
}>(({ children, className = '', fallbackHeight = 'min-h-96' }) => (
  <Suspense fallback={
    <div className={`${fallbackHeight} flex items-center justify-center bg-gray-50 ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">콘텐츠를 로드하는 중...</p>
      </div>
    </div>
  }>
    {children}
  </Suspense>
));

LazySection.displayName = 'LazySection';

// 성능 모니터링 래퍼 (개발 모드에서만)
export const PerformanceWrapper = memo<{
  name: string;
  children: React.ReactNode;
}>(({ name, children }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        console.log(`🚀 ${name} 렌더링 시간: ${(endTime - startTime).toFixed(2)}ms`);
      };
    }
  }, [name]);

  return <>{children}</>;
});

PerformanceWrapper.displayName = 'PerformanceWrapper';

export { LoadingSpinner };
export default LazyWrapper;