import React, { useState, useRef, useEffect } from 'react';
import { EnhancedAnimate } from '../animations';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { 
  UnifiedSectionHeader, 
  UnifiedCTASection 
} from '../UnifiedComponents';
import { useSmartTracking } from '@/lib/advancedAnalytics';

interface BusinessItemProps {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  detailDescription: string;
  image: string;
  icon: string;
  features: string[];
  benefits: string[];
  technologies: string[];
  casestudies?: {
    title: string;
    description: string;
    results: string[];
  }[];
  pricing?: {
    basic: string;
    premium: string;
    enterprise: string;
  };
}

const modernBusinessData: BusinessItemProps[] = [
  {
    id: 'erp-system',
    title: 'ERP 통합 시스템',
    subtitle: '기업 자원 관리의 새로운 표준',
    shortDescription: '전사적 자원관리를 통한 업무 효율성 극대화',
    detailDescription: `
      클라우드 기반 ERP 시스템으로 기업의 모든 업무 프로세스를 통합 관리합니다.
      재무, 인사, 생산, 영업, 구매 등 핵심 업무를 하나의 플랫폼에서 효율적으로 운영할 수 있으며,
      실시간 데이터 분석을 통해 신속한 의사결정을 지원합니다.
    `,
    image: '/api/placeholder/600/400',
    icon: '🏢',
    features: [
      '실시간 재무 관리 및 회계 처리',
      '통합 인사관리 시스템 (급여, 출퇴근, 평가)',
      '공급망 관리 및 재고 최적화',
      '영업 기회 관리 및 고객 관계 관리',
      '비즈니스 인텔리전스 대시보드',
      '모바일 앱 지원으로 언제 어디서나 접근',
    ],
    benefits: [
      '업무 효율성 40% 향상',
      '데이터 정확성 95% 달성',
      '의사결정 속도 3배 향상',
      '운영비용 30% 절감',
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
    casestudies: [
      {
        title: '중견 제조업체 A사',
        description: '생산 계획부터 출하까지 전 과정 디지털화',
        results: ['생산성 35% 향상', '재고비용 25% 절감', '납기 준수율 98%'],
      },
      {
        title: '유통업체 B사',
        description: '매장-창고-본사 실시간 연동 시스템 구축',
        results: ['매출 증가 22%', '재고 회전율 40% 개선', '고객 만족도 90%'],
      },
    ],
    pricing: {
      basic: '월 50만원부터',
      premium: '월 150만원부터',
      enterprise: '별도 견적',
    },
  },
  {
    id: 'ai-chatbot',
    title: 'AI 챗봇 솔루션',
    subtitle: '지능형 고객 서비스의 혁신',
    shortDescription: '24시간 무중단 고객 상담 및 업무 자동화',
    detailDescription: `
      최신 GPT 기술을 활용한 지능형 챗봇으로 고객 문의를 실시간으로 처리합니다.
      자연어 이해 능력이 뛰어나 복잡한 업무도 자동화할 수 있으며,
      지속적인 학습을 통해 서비스 품질이 점진적으로 향상됩니다.
    `,
    image: '/api/placeholder/600/400',
    icon: '🤖',
    features: [
      'GPT-4 기반 자연어 처리',
      '다국어 지원 (한국어, 영어, 중국어, 일본어)',
      '음성 인식 및 TTS 기능',
      '기존 시스템과의 API 연동',
      '실시간 학습 및 성능 개선',
      '관리자 대시보드 및 분석 리포트',
    ],
    benefits: [
      '고객 응답 시간 90% 단축',
      '상담 인력 비용 60% 절감',
      '24/7 무중단 서비스',
      '고객 만족도 85% 향상',
    ],
    technologies: ['Python', 'OpenAI GPT-4', 'FastAPI', 'MongoDB', 'WebSocket', 'Azure'],
    casestudies: [
      {
        title: '온라인 쇼핑몰 C사',
        description: '주문, 배송, 반품 문의 자동화',
        results: ['문의 해결률 88%', '응답시간 5초 이내', '고객만족도 4.7/5.0'],
      },
      {
        title: '금융서비스 D사',
        description: '대출 상담 및 상품 안내 자동화',
        results: ['상담 완료율 75%', '신규 고객 30% 증가', 'NPS 점수 65점'],
      },
    ],
    pricing: {
      basic: '월 30만원부터',
      premium: '월 80만원부터',
      enterprise: '별도 견적',
    },
  },
  {
    id: 'mobile-app',
    title: '모바일 앱 개발',
    subtitle: '크로스 플랫폼 네이티브 앱',
    shortDescription: 'iOS/Android 동시 개발로 시장 진입 시간 단축',
    detailDescription: `
      React Native와 Flutter를 활용한 크로스 플랫폼 개발로 
      iOS와 Android 앱을 동시에 제작합니다.
      네이티브 수준의 성능과 사용자 경험을 제공하면서도
      개발 비용과 시간을 대폭 절약할 수 있습니다.
    `,
    image: '/api/placeholder/600/400',
    icon: '📱',
    features: [
      'iOS/Android 크로스 플랫폼 개발',
      '네이티브 수준의 성능 최적화',
      '푸시 알림 및 백그라운드 동기화',
      '오프라인 모드 지원',
      '생체 인증 및 보안 기능',
      '앱스토어 배포 및 관리',
    ],
    benefits: [
      '개발 비용 50% 절감',
      '출시 기간 40% 단축',
      '유지보수 효율성 극대화',
      '일관된 사용자 경험 제공',
    ],
    technologies: ['React Native', 'Flutter', 'Firebase', 'Redux', 'TypeScript', 'Jest'],
    casestudies: [
      {
        title: '배달 서비스 E사',
        description: '실시간 주문 추적 및 결제 시스템',
        results: ['주문 증가 45%', '배달 시간 20% 단축', '사용자 재이용률 80%'],
      },
      {
        title: '헬스케어 F사',
        description: '개인 건강 관리 및 의료진 상담 앱',
        results: ['사용자 만족도 92%', '일일 활성 사용자 70%', '의료진 참여율 85%'],
      },
    ],
    pricing: {
      basic: '1,500만원부터',
      premium: '3,000만원부터',
      enterprise: '별도 견적',
    },
  },
  {
    id: 'web-platform',
    title: '웹 플랫폼 구축',
    subtitle: '확장 가능한 웹 서비스',
    shortDescription: '대용량 트래픽 처리 가능한 고성능 웹 플랫폼',
    detailDescription: `
      마이크로서비스 아키텍처 기반의 확장 가능한 웹 플랫폼을 구축합니다.
      클라우드 네이티브 기술을 활용하여 높은 가용성과 성능을 보장하며,
      DevOps 파이프라인을 통한 지속적 배포로 빠른 기능 업데이트가 가능합니다.
    `,
    image: '/api/placeholder/600/400',
    icon: '🌐',
    features: [
      '마이크로서비스 아키텍처 설계',
      '클라우드 기반 인프라 구축',
      'CI/CD 파이프라인 자동화',
      '실시간 모니터링 및 로깅',
      'Auto Scaling 및 Load Balancing',
      '보안 강화 및 컴플라이언스',
    ],
    benefits: [
      '99.9% 서비스 가용성',
      '트래픽 급증 시 자동 확장',
      '개발 생산성 60% 향상',
      '운영비용 최적화',
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'Kubernetes', 'PostgreSQL', 'Redis'],
    casestudies: [
      {
        title: '이커머스 G사',
        description: '대규모 온라인 쇼핑몰 플랫폼 구축',
        results: ['동시접속자 10만명 처리', '페이지 로딩 2초 이내', '전환율 25% 향상'],
      },
      {
        title: '교육 플랫폼 H사',
        description: '온라인 강의 및 학습 관리 시스템',
        results: ['학습자 50만명 서비스', '강의 완주율 78%', '만족도 4.8/5.0'],
      },
    ],
    pricing: {
      basic: '2,000만원부터',
      premium: '5,000만원부터',
      enterprise: '별도 견적',
    },
  },
  {
    id: 'data-analytics',
    title: '데이터 분석 플랫폼',
    subtitle: '비즈니스 인텔리전스의 핵심',
    shortDescription: '빅데이터 수집, 분석, 시각화를 통한 인사이트 도출',
    detailDescription: `
      기업의 다양한 데이터 소스를 통합하여 실시간 분석이 가능한 플랫폼을 제공합니다.
      머신러닝과 AI를 활용한 예측 분석으로 미래 트렌드를 예측하고,
      직관적인 대시보드를 통해 데이터 기반 의사결정을 지원합니다.
    `,
    image: '/api/placeholder/600/400',
    icon: '📊',
    features: [
      '다중 데이터 소스 연동',
      '실시간 데이터 파이프라인',
      '머신러닝 기반 예측 분석',
      '인터랙티브 대시보드',
      '자동 리포트 생성',
      'API 기반 데이터 제공',
    ],
    benefits: [
      '의사결정 속도 5배 향상',
      '예측 정확도 90% 달성',
      '데이터 처리 시간 80% 단축',
      'ROI 200% 이상 달성',
    ],
    technologies: ['Python', 'Apache Spark', 'Elasticsearch', 'Kibana', 'TensorFlow', 'AWS'],
    casestudies: [
      {
        title: '리테일 I사',
        description: '매출 예측 및 재고 최적화 시스템',
        results: ['예측 정확도 88%', '재고비용 35% 절감', '매출 증가 18%'],
      },
      {
        title: '제조업 J사',
        description: '설비 예지보전 및 품질관리 시스템',
        results: ['설비 가동률 95%', '불량률 70% 감소', '유지보수 비용 40% 절감'],
      },
    ],
    pricing: {
      basic: '월 100만원부터',
      premium: '월 300만원부터',
      enterprise: '별도 견적',
    },
  },
];

const BusinessCard: React.FC<{
  item: BusinessItemProps;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}> = ({ item, isExpanded, onToggle, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isExpanded]);

  return (
    <EnhancedAnimate variant="slideUp" delay={index * 200}>
      <div
        ref={cardRef}
        className={`
          relative overflow-hidden bg-white rounded-3xl border-2 transition-all duration-700 cursor-pointer
          ${
            isExpanded
              ? 'border-blue-500 shadow-2xl scale-105 bg-gradient-to-br from-blue-50 to-indigo-50'
              : 'border-gray-200 shadow-lg hover:shadow-xl hover:border-blue-300'
          }
        `}
        onClick={onToggle}
      >
        {/* 카드 헤더 - 모바일 최적화 */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg flex-shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 leading-tight">{item.title}</h3>
                <p className="text-sm sm:text-base text-blue-600 font-semibold leading-snug">{item.subtitle}</p>
              </div>
            </div>
            <div
              className={`transform transition-transform duration-300 ml-2 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
            >
              <ChevronDownIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-500" />
            </div>
          </div>

          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">{item.shortDescription}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            {item.features.slice(0, 4).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 sm:p-0">
                <ChevronRightIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-gray-700 font-medium leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 확장된 콘텐츠 */}
        <div
          className={`
          overflow-hidden transition-all duration-700
          ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        `}
        >
          <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="pt-4 sm:pt-6 lg:pt-8 space-y-4 sm:space-y-6 lg:space-y-8">
              {/* 상세 설명 */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">🎯 서비스 개요</h4>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {item.detailDescription}
                </p>
              </div>

              {/* 주요 기능 */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">⚡ 주요 기능</h4>
                <div className="grid gap-2 sm:gap-3 lg:grid-cols-2">
                  {item.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-gray-700 font-medium leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 핵심 이점 */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">📈 핵심 이점</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {item.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="text-center p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200"
                    >
                      <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">✓</div>
                      <p className="text-xs sm:text-sm font-semibold text-green-800 leading-snug">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 기술 스택 */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">🔧 사용 기술</h4>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-100 text-indigo-800 rounded-full text-xs sm:text-sm font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 성공 사례 */}
              {item.casestudies && (
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">🏆 성공 사례</h4>
                  <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                    {item.casestudies.map((study, idx) => (
                      <div
                        key={idx}
                        className="p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-200"
                      >
                        <h5 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{study.title}</h5>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">{study.description}</p>
                        <div className="space-y-2">
                          {study.results.map((result, ridx) => (
                            <div key={ridx} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span className="text-xs sm:text-sm font-medium text-gray-700 leading-snug">{result}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 가격 정보 */}
              {item.pricing && (
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">💰 가격 정보</h4>
                  <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
                    <div className="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h5 className="text-sm sm:text-base font-bold text-blue-900 mb-2">Basic</h5>
                      <p className="text-lg sm:text-xl font-bold text-blue-600">{item.pricing.basic}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <h5 className="text-sm sm:text-base font-bold text-purple-900 mb-2">Premium</h5>
                      <p className="text-lg sm:text-xl font-bold text-purple-600">{item.pricing.premium}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h5 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Enterprise</h5>
                      <p className="text-lg sm:text-xl font-bold text-gray-600">{item.pricing.enterprise}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 액션 버튼 - 모바일 최적화 */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:flex-1 px-4 py-3 sm:px-6 bg-blue-600 text-white rounded-xl text-sm sm:text-base font-bold hover:bg-blue-700 transition-colors duration-300 min-h-[44px] touch-manipulation"
                >
                  🚀 프로젝트 문의하기
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('tel:02-1234-5678', '_self');
                  }}
                  className="w-full sm:flex-1 px-4 py-3 sm:px-6 bg-gray-200 text-gray-800 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-300 transition-colors duration-300 min-h-[44px] touch-manipulation"
                >
                  📞 전화 상담받기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EnhancedAnimate>
  );
};

const ModernBusinessSection: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const smartTracking = useSmartTracking();

  useEffect(() => {
    smartTracking.trackPageView('Modern Business Section');
  }, []);

  const handleCardToggle = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
    smartTracking.trackClick('business_card_toggle', { 
      cardId, 
      action: expandedCard === cardId ? 'collapse' : 'expand' 
    });
  };

  return (
    <section id="business" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 섹션 헤더 */}
        <EnhancedAnimate variant="slideUp">
          <UnifiedSectionHeader
            badge="Business Areas"
            title="주요 사업 영역"
            description="디지털 전환 시대에 맞는 혁신적인 솔루션으로 고객의 비즈니스 성장을 가속화합니다"
          />
        </EnhancedAnimate>

        {/* 비즈니스 카드 목록 */}
        <div className="space-y-6">
          {modernBusinessData.map((item, index) => (
            <BusinessCard
              key={item.id}
              item={item}
              isExpanded={expandedCard === item.id}
              onToggle={() => handleCardToggle(item.id)}
              index={index}
            />
          ))}
        </div>

        {/* 하단 CTA */}
        <EnhancedAnimate variant="scaleIn" delay={800}>
          <UnifiedCTASection
            title="맞춤형 솔루션이 필요하신가요?"
            description="귀하의 비즈니스에 최적화된 솔루션을 제안해드립니다"
            primaryButton={{
              text: "📋 무료 상담 신청",
              onClick: () => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            secondaryButton={{
              text: "📅 미팅 예약하기", 
              onClick: () => window.open('https://calendly.com/your-link', '_blank')
            }}
            className="mt-16"
          />
        </EnhancedAnimate>
      </div>
    </section>
  );
};

export default ModernBusinessSection;
