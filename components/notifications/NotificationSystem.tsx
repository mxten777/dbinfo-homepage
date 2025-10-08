// 🔔 실시간 알림 시스템
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

// 알림 타입 정의
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  duration?: number; // ms, undefined면 수동 닫기
  action?: {
    label: string;
    callback: () => void;
  };
  isRead?: boolean;
  category?: 'system' | 'user' | 'marketing' | 'security';
}

// 알림 컨텍스트 타입
interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// 알림 ID 생성
const generateNotificationId = () => Date.now().toString() + Math.random().toString(36).substr(2, 5);

// 알림 프로바이더
interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateNotificationId(),
      timestamp: Date.now(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // 자동 제거 (duration이 설정된 경우)
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 데모용 알림 생성 (실제로는 WebSocket이나 Server-Sent Events 사용)
  useEffect(() => {
    const demoNotifications = [
      {
        type: 'success' as const,
        title: '시스템 업데이트',
        message: '새로운 기능이 추가되었습니다!',
        category: 'system' as const,
        duration: 5000
      },
      {
        type: 'info' as const,
        title: '새로운 메시지',
        message: '관리자로부터 새 메시지가 도착했습니다.',
        category: 'user' as const,
        action: {
          label: '확인',
          callback: () => console.log('메시지 확인')
        }
      }
    ];

    // 페이지 로드 후 5초 뒤에 데모 알림 표시
    const timer = setTimeout(() => {
      demoNotifications.forEach((notification, index) => {
        setTimeout(() => showNotification(notification), index * 2000);
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const value = {
    notifications,
    showNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// 알림 훅
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

// 개별 알림 컴포넌트
interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
  onMarkAsRead: () => void;
}

const NotificationItem = ({ notification, onClose, onMarkAsRead }: NotificationItemProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div
      className={`
        ${getBgColor()}
        ${isAnimating ? 'animate-slide-in-right' : 'animate-slide-out-right'}
        ${!notification.isRead ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        border rounded-lg p-4 mb-3 shadow-lg backdrop-blur-sm
        transition-all duration-300 hover:shadow-xl
      `}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {notification.title}
            </h4>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(notification.timestamp).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            
            <div className="flex gap-2">
              {!notification.isRead && (
                <button
                  onClick={onMarkAsRead}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  읽음 표시
                </button>
              )}
              
              {notification.action && (
                <button
                  onClick={() => {
                    notification.action?.callback();
                    handleClose();
                  }}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 알림 목록 컴포넌트
export const NotificationList = () => {
  const { notifications, removeNotification, markAsRead } = useNotification();

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17h5v5H9v-5zM15 7h5l-5-5v5zM9 7h5V2H9v5z" />
        </svg>
        <p>알림이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
          onMarkAsRead={() => markAsRead(notification.id)}
        />
      ))}
    </div>
  );
};

// 알림 토스트 컴포넌트 (화면 우상단)
export const NotificationToast = () => {
  const { notifications, removeNotification, markAsRead } = useNotification();
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  // 최근 3개 알림만 토스트로 표시
  useEffect(() => {
    const recentNotifications = notifications
      .filter(n => !n.isRead)
      .slice(0, 3);
    
    setVisibleNotifications(recentNotifications);
  }, [notifications]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm no-print">
      {visibleNotifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
          onMarkAsRead={() => markAsRead(notification.id)}
        />
      ))}
    </div>
  );
};

// 알림 벨 아이콘 (헤더용)
interface NotificationBellProps {
  onClick?: () => void;
}

export const NotificationBell = ({ onClick }: NotificationBellProps) => {
  const { unreadCount } = useNotification();

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 17h5l-5 5v-5zM10.268 21a2 2 0 003.464 0M7 8a5 5 0 0110 0v3.199a2 2 0 00.78 1.563l1.44 1.44A1 1 0 0118.83 16H5.17a1 1 0 01-.61-1.798l1.44-1.44A2 2 0 007 11.199V8z" 
        />
      </svg>
      
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
    </button>
  );
};