'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 ErrorBoundary caught an error:', error, errorInfo);
    }

    // 커스텀 에러 핸들러
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 프로덕션에서는 에러 모니터링 서비스로 전송
    this.logErrorToService(error);

    this.setState({ errorInfo });
  }

  private logErrorToService = (error: Error) => {
    if (process.env.NODE_ENV === 'production') {
      // 실제 프로덕션에서는 Sentry, LogRocket 등 사용
      console.error('Production error:', error.message);
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 폴백 UI 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div
          className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
              {/* 에러 아이콘 */}
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">앗! 문제가 발생했습니다</h2>
              <p className="text-gray-600 mb-6">
                예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
              </p>

              {/* 개발 환경에서만 에러 상세 정보 표시 */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2 hover:text-gray-900">
                    🔧 개발자 정보 보기
                  </summary>
                  <div className="bg-gray-50 rounded-lg p-4 text-xs font-mono text-gray-600 overflow-auto max-h-32">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* 액션 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="오류 상태를 초기화하고 다시 시도"
                >
                  다시 시도
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="페이지를 새로고침합니다"
                >
                  페이지 새로고침
                </button>
              </div>

              {/* 홈으로 가기 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => (window.location.href = '/')}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 focus:outline-none focus:underline"
                  aria-label="홈페이지로 이동합니다"
                >
                  🏠 홈으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

// 🎯 비즈니스 섹션용 특화 에러 바운더리
export const BusinessSectionErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 text-center my-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-red-800 mb-2">서비스 정보 로딩 오류</h3>
        <p className="text-sm text-red-600 mb-4">
          비즈니스 서비스 정보를 불러올 수 없습니다.
          <br />
          네트워크 연결을 확인해주세요.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="페이지 새로고침"
        >
          🔄 새로고침
        </button>
      </div>
    }
    onError={(error, errorInfo) => {
      console.error('BusinessSection Error:', error, errorInfo);
    }}
  >
    {children}
  </ErrorBoundary>
);

// 🎯 모달용 특화 에러 바운더리
export const ModalErrorBoundary: React.FC<{ children: ReactNode; onClose?: () => void }> = ({
  children,
  onClose,
}) => (
  <ErrorBoundary
    fallback={
      <div className="p-8 text-center bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-2">모달 로딩 오류</h3>
        <p className="text-red-600 mb-6">모달 내용을 불러오는 중 오류가 발생했습니다.</p>
        <div className="flex gap-3 justify-center">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="모달 닫기"
            >
              닫기
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="페이지 새로고침"
          >
            새로고침
          </button>
        </div>
      </div>
    }
    onError={(error, errorInfo) => {
      console.error('Modal Error:', error, errorInfo);
    }}
  >
    {children}
  </ErrorBoundary>
);

// 🎯 폼용 특화 에러 바운더리
export const FormErrorBoundary: React.FC<{ children: ReactNode; formName?: string }> = ({
  children,
  formName = '폼',
}) => (
  <ErrorBoundary
    fallback={
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{formName} 로딩 오류</h3>
            <div className="mt-1 text-sm text-red-700">
              <p>폼을 불러오는 중 문제가 발생했습니다. 페이지를 새로고침해주세요.</p>
            </div>
          </div>
        </div>
      </div>
    }
    onError={(error, errorInfo) => {
      console.error(`Form Error (${formName}):`, error, errorInfo);
    }}
  >
    {children}
  </ErrorBoundary>
);
