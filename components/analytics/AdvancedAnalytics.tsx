// 📊 고급 애널리틱스 대시보드
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme';

// 애널리틱스 데이터 타입
interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTime: number;
  bounceRate: number;
  conversions: number;
  revenue: number;
  timestamp: number;
}

interface PageAnalytics {
  page: string;
  views: number;
  uniqueViews: number;
  averageTime: number;
  bounceRate: number;
}

interface UserFlow {
  from: string;
  to: string;
  count: number;
  percentage: number;
}

interface RealtimeMetrics {
  activeUsers: number;
  pageViews: number;
  topPages: Array<{ page: string; views: number }>;
  userLocations: Array<{ country: string; users: number }>;
  devices: Array<{ device: string; percentage: number }>;
}

// 모든 애널리틱스 데이터 관리
interface AnalyticsState {
  overview: AnalyticsData[];
  pageAnalytics: PageAnalytics[];
  userFlow: UserFlow[];
  realtime: RealtimeMetrics;
  isLoading: boolean;
  error: string | null;
}

// 데모 데이터 생성
const generateDemoData = (): AnalyticsState => {
  const now = Date.now();
  const overviewData: AnalyticsData[] = [];
  
  // 지난 30일 데이터 생성
  for (let i = 29; i >= 0; i--) {
    const date = now - (i * 24 * 60 * 60 * 1000);
    overviewData.push({
      pageViews: Math.floor(Math.random() * 1000) + 500,
      uniqueVisitors: Math.floor(Math.random() * 300) + 200,
      averageTime: Math.floor(Math.random() * 180) + 60,
      bounceRate: Math.random() * 0.4 + 0.3,
      conversions: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      timestamp: date
    });
  }

  const pageAnalytics: PageAnalytics[] = [
    { page: '/', views: 15420, uniqueViews: 12340, averageTime: 145, bounceRate: 0.32 },
    { page: '/services', views: 8930, uniqueViews: 7650, averageTime: 210, bounceRate: 0.28 },
    { page: '/about', views: 5670, uniqueViews: 4890, averageTime: 180, bounceRate: 0.35 },
    { page: '/contact', views: 4230, uniqueViews: 3980, averageTime: 95, bounceRate: 0.45 },
    { page: '/portfolio', views: 3890, uniqueViews: 3210, averageTime: 250, bounceRate: 0.25 }
  ];

  const userFlow: UserFlow[] = [
    { from: '/', to: '/services', count: 1234, percentage: 0.35 },
    { from: '/', to: '/about', count: 892, percentage: 0.25 },
    { from: '/services', to: '/contact', count: 456, percentage: 0.18 },
    { from: '/about', to: '/contact', count: 234, percentage: 0.12 },
    { from: '/', to: '/portfolio', count: 189, percentage: 0.08 }
  ];

  const realtime: RealtimeMetrics = {
    activeUsers: Math.floor(Math.random() * 50) + 20,
    pageViews: Math.floor(Math.random() * 100) + 50,
    topPages: [
      { page: '/', views: 23 },
      { page: '/services', views: 18 },
      { page: '/about', views: 12 },
      { page: '/contact', views: 8 }
    ],
    userLocations: [
      { country: '한국', users: 45 },
      { country: '미국', users: 12 },
      { country: '일본', users: 8 },
      { country: '중국', users: 6 }
    ],
    devices: [
      { device: '데스크톱', percentage: 65 },
      { device: '모바일', percentage: 30 },
      { device: '태블릿', percentage: 5 }
    ]
  };

  return {
    overview: overviewData,
    pageAnalytics,
    userFlow,
    realtime,
    isLoading: false,
    error: null
  };
};

// 메트릭 카드 컴포넌트
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const MetricCard = ({ title, value, change, icon, color = 'blue' }: MetricCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'red':
        return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'yellow':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7v10H7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17l-10-10M7 7v10h10" />
                </svg>
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${getColorClasses()}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// 차트 컴포넌트 (간단한 라인 차트)
interface SimpleLineChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
}

const SimpleLineChart = ({ data, labels, color = '#3B82F6', height = 200 }: SimpleLineChartProps) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxValue - value) / range) * 80 + 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          className="drop-shadow-sm"
        />
        {/* 데이터 포인트 */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = ((maxValue - value) / range) * 80 + 10;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1"
              fill={color}
              className="opacity-80"
            />
          );
        })}
      </svg>
    </div>
  );
};

// 도넛 차트 컴포넌트
interface DonutChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
}

const DonutChart = ({ data, size = 120 }: DonutChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const radius = size * 0.4;
            const circumference = 2 * Math.PI * radius;
            const strokeDasharray = `${circumference * percentage} ${circumference}`;
            const strokeDashoffset = -circumference * (currentAngle / 360);
            
            currentAngle += angle;
            
            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={size * 0.15}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 실시간 지표 컴포넌트
const RealtimeMetrics = ({ data }: { data: RealtimeMetrics }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      실시간 현황
    </h3>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{data.activeUsers}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">활성 사용자</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{data.pageViews}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">페이지뷰</div>
      </div>
    </div>
    
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">인기 페이지</h4>
        <div className="space-y-1">
          {data.topPages.map((page, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{page.page}</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{page.views}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">접속 지역</h4>
        <div className="space-y-1">
          {data.userLocations.slice(0, 3).map((location, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{location.country}</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{location.users}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 메인 애널리틱스 대시보드
export const AdvancedAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsState | null>(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져옴
    const data = generateDemoData();
    setAnalytics(data);
    
    // 실시간 데이터 업데이트 시뮬레이션
    const interval = setInterval(() => {
      setAnalytics(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          realtime: {
            ...prev.realtime,
            activeUsers: Math.floor(Math.random() * 50) + 20,
            pageViews: Math.floor(Math.random() * 100) + 50
          }
        };
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, [timeRange]);

  const overviewMetrics = useMemo(() => {
    if (!analytics?.overview.length) return null;
    
    const latest = analytics.overview[analytics.overview.length - 1];
    const previous = analytics.overview[analytics.overview.length - 2];
    
    if (!previous) return null;
    
    return {
      pageViews: {
        value: latest.pageViews.toLocaleString(),
        change: ((latest.pageViews - previous.pageViews) / previous.pageViews * 100).toFixed(1)
      },
      uniqueVisitors: {
        value: latest.uniqueVisitors.toLocaleString(),
        change: ((latest.uniqueVisitors - previous.uniqueVisitors) / previous.uniqueVisitors * 100).toFixed(1)
      },
      averageTime: {
        value: `${Math.floor(latest.averageTime / 60)}분 ${latest.averageTime % 60}초`,
        change: ((latest.averageTime - previous.averageTime) / previous.averageTime * 100).toFixed(1)
      },
      conversions: {
        value: latest.conversions.toLocaleString(),
        change: ((latest.conversions - previous.conversions) / previous.conversions * 100).toFixed(1)
      }
    };
  }, [analytics]);

  if (!analytics || analytics.isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  const deviceData = analytics.realtime.devices.map(device => ({
    label: device.device,
    value: device.percentage,
    color: device.device === '데스크톱' ? '#3B82F6' : device.device === '모바일' ? '#10B981' : '#F59E0B'
  }));

  return (
    <div className="space-y-6">
      {/* 시간 범위 선택 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          📊 애널리틱스 대시보드
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">지난 7일</option>
          <option value="30d">지난 30일</option>
          <option value="90d">지난 90일</option>
        </select>
      </div>

      {/* 주요 지표 카드 */}
      {overviewMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="페이지뷰"
            value={overviewMetrics.pageViews.value}
            change={parseFloat(overviewMetrics.pageViews.change)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
            color="blue"
          />
          
          <MetricCard
            title="순방문자"
            value={overviewMetrics.uniqueVisitors.value}
            change={parseFloat(overviewMetrics.uniqueVisitors.change)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            color="green"
          />
          
          <MetricCard
            title="평균 체류시간"
            value={overviewMetrics.averageTime.value}
            change={parseFloat(overviewMetrics.averageTime.change)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="yellow"
          />
          
          <MetricCard
            title="전환수"
            value={overviewMetrics.conversions.value}
            change={parseFloat(overviewMetrics.conversions.change)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            color="purple"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 트래픽 트렌드 */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            트래픽 트렌드
          </h3>
          <SimpleLineChart
            data={analytics.overview.map(d => d.pageViews)}
            color="#3B82F6"
            height={300}
          />
        </div>

        {/* 실시간 현황 */}
        <RealtimeMetrics data={analytics.realtime} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 디바이스 분석 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            디바이스별 접속
          </h3>
          <div className="flex justify-center">
            <DonutChart data={deviceData} />
          </div>
        </div>

        {/* 페이지별 성과 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            페이지별 성과
          </h3>
          <div className="space-y-3">
            {analytics.pageAnalytics.map((page, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{page.page}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {page.views.toLocaleString()} views
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div>체류: {Math.floor(page.averageTime / 60)}분</div>
                  <div>순방문: {page.uniqueViews.toLocaleString()}</div>
                  <div>이탈률: {(page.bounceRate * 100).toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};