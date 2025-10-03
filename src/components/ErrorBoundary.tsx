import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50" role="alert" aria-live="assertive">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md border border-red-200">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">관리자 페이지 에러</h2>
            <p className="text-gray-600 mb-4">관리자 화면 렌더링 중 오류가 발생했습니다.<br/>콘솔의 에러 메시지를 확인해 주세요.</p>
            {this.state.error && (
              <pre className="bg-red-50 text-red-700 text-xs rounded p-2 mb-4 overflow-x-auto" aria-label="에러 메시지">{String(this.state.error)}</pre>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow hover:scale-105 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
              aria-label="홈으로 돌아가기"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
