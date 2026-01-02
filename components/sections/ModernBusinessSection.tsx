'use client';

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
    id: 'ai-dataset',
    title: 'AI DataSet Platform',
    subtitle: '인공지능 데이터셋 플랫폼',
    shortDescription: 'AI 개발을 위한 고품질 데이터셋 통합 플랫폼',
    detailDescription: `
      AI 개발을 위한 고품질 데이터셋을 쉽고 빠르게 확보하는 통합 데이터 플랫폼입니다.
      인공지능 학습에 필요한 데이터를 수집 → 정제 → 검증 → 제공까지 한 번에 처리하며,
      웹 기반 + API 기반 데이터 마켓플레이스를 제공합니다.
    `,
    image: '/api/placeholder/600/400',
    icon: '🤖',
    features: [
      '데이터 수집/정제/가공 자동화',
      '대용량 데이터 라벨링 및 품질 관리',
      '다양한 도메인별 데이터셋 제공',
      'API 기반 실시간 데이터 접근',
      '데이터 검증 및 품질 보증',
      '맞춤형 데이터 생성 서비스'
    ],
    benefits: [
      'AI 개발 시간 70% 단축',
      '데이터 품질 95% 보장',
      '개발 비용 50% 절감',
      '다양한 AI 모델 지원'
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'Apache Spark', 'Elasticsearch', 'Kubernetes'],
    casestudies: [
      {
        title: 'AI 스타트업 A사',
        description: '자율주행 학습용 데이터셋 구축',
        results: ['데이터 품질 98% 달성', '개발 기간 50% 단축', '모델 성능 15% 향상'],
      },
      {
        title: '제조업 B사',
        description: '제품 품질 검사 AI 데이터셋 구축',
        results: ['불량률 감소 90%', '검사 속도 10배 향상', '인력 비용 60% 절감'],
      },
    ],
    pricing: {
      basic: '월 100만원부터',
      premium: '월 300만원부터',
      enterprise: '별도 견적',
    },
  },
  {
    id: 'si-integration',
    title: 'SI (System Integration)',
    subtitle: '체계적인 정보시스템 통합구축',
    shortDescription: '정보화 전략수립부터 시스템 운영까지 전 과정 통합 서비스',
    detailDescription: `
      정보화 전략수립, 업무분석/설계/구축, 시스템 운영까지 전 과정 통합 서비스를 제공합니다.
      금융·공공기관 등 다양한 SI사업 수행 경험을 바탕으로 고품질 솔루션을 제공하며,
      정보화 전략, 아키텍처 설계, DB설계, 솔루션 제공, H/W, S/W, 네트워크 등 기반기술 통합 및 통합 유지보수까지 제공합니다.
    `,
    image: '/api/placeholder/600/400',
    icon: '🏢',
    features: [
      '정보화 전략 수립 및 컨설팅',
      '업무 분석/설계/구축',
      '시스템 아키텍처 설계',
      'DB 설계 및 최적화',
      'H/W, S/W, 네트워크 통합',
      '레거시 시스템 현대화',
      '통합 유지보수 서비스'
    ],
    benefits: [
      '디지털 전환 가속화',
      '시스템 통합 효율성 향상',
      '운영비용 30% 절감',
      '업무 프로세스 최적화'
    ],
    technologies: ['Java/Spring', 'Oracle/PostgreSQL', 'Linux/Windows Server', 'Kubernetes', 'AWS/Azure'],
    casestudies: [
      {
        title: '금융기관 C사',
        description: '차세대 뱅킹 시스템 통합 구축',
        results: ['거래 처리 속도 300% 향상', '시스템 안정성 99.9%', '운영비용 40% 절감'],
      },
      {
        title: '공공기관 D사',
        description: '전자정부 시스템 현대화',
        results: ['민원 처리 시간 50% 단축', '시스템 통합률 95%', '시민 만족도 90%'],
      },
    ],
    pricing: {
      basic: '3억원부터',
      premium: '10억원부터',
      enterprise: '별도 견적',
    },
  },
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    subtitle: '통합 전자상거래 솔루션',
    shortDescription: '온라인 비즈니스 성공을 위한 완전한 이커머스 플랫폼',
    detailDescription: `
      모든 규모의 비즈니스를 위한 확장 가능한 이커머스 솔루션을 제공합니다.
      상품 관리, 주문 처리, 결제 시스템, 재고 관리, 배송 추적까지 
      온라인 쇼핑몰 운영에 필요한 모든 기능을 통합 제공하며,
      모바일 최적화와 SEO를 통해 매출 극대화를 지원합니다.
    `,
    image: '/api/placeholder/600/400',
    icon: '🛒',
    features: [
      '통합 상품 관리 시스템',
      '다양한 결제 수단 연동',
      '실시간 재고 관리',
      '주문 및 배송 추적',
      '고객 관리 (CRM) 시스템',
      '모바일 앱 연동',
      'SEO 최적화 및 마케팅 도구'
    ],
    benefits: [
      '매출 증가 평균 40%',
      '운영 효율성 60% 향상',
      '고객 만족도 95% 달성',
      '관리 비용 50% 절감'
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Stripe', 'AWS', 'Redis'],
    casestudies: [
      {
        title: '패션 브랜드 E사',
        description: '온라인 쇼핑몰 구축 및 운영 최적화',
        results: ['온라인 매출 200% 증가', '주문 처리 시간 80% 단축', '고객 재구매율 70%'],
      },
      {
        title: '식품 유통업체 F사',
        description: 'B2B/B2C 통합 이커머스 플랫폼',
        results: ['거래량 300% 증가', '운영비용 45% 절감', '고객사 만족도 92%'],
      },
    ],
    pricing: {
      basic: '2,000만원부터',
      premium: '5,000만원부터',
      enterprise: '별도 견적',
    },
  },
  {
    id: 'ai-chatbot',
    title: 'AI ChatBot Service',
    subtitle: '지능형 고객서비스 챗봇',
    shortDescription: 'GPT 기반 자연어 처리로 24/7 고객 응대 자동화',
    detailDescription: `
      최신 GPT 기술을 활용한 지능형 챗봇으로 고객 문의를 실시간으로 처리합니다.
      자연어 이해 능력이 뛰어나 복잡한 업무도 자동화할 수 있으며,
      지속적인 학습을 통해 서비스 품질이 점진적으로 향상됩니다.
    `,
    image: '/api/placeholder/600/400',
    icon: '💬',
    features: [
      'GPT-4 기반 자연어 처리',
      '다국어 지원 (한국어, 영어, 중국어, 일본어)',
      '음성 인식 및 TTS 기능',
      '기존 시스템과의 API 연동',
      '실시간 학습 및 성능 개선',
      '관리자 대시보드 및 분석 리포트'
    ],
    benefits: [
      '고객 응답 시간 90% 단축',
      '상담 인력 비용 60% 절감',
      '24/7 무중단 서비스',
      '고객 만족도 85% 향상'
    ],
    technologies: ['Python', 'OpenAI GPT-4', 'FastAPI', 'MongoDB', 'WebSocket', 'Azure'],
    casestudies: [
      {
        title: '통신사 G사',
        description: '고객센터 챗봇 시스템 구축',
        results: ['상담 해결률 85%', '응답시간 3초 이내', '운영비용 70% 절감'],
      },
      {
        title: '보험회사 H사',
        description: '보험 상담 및 청구 처리 자동화',
        results: ['처리 시간 90% 단축', '정확도 95% 달성', '고객만족도 88%'],
      },
    ],
    pricing: {
      basic: '월 50만원부터',
      premium: '월 150만원부터',
      enterprise: '별도 견적',
    },
  },
  {
    id: 'demand-prediction',
    title: 'Demand Prediction',
    subtitle: '수요 예측 AI 솔루션',
    shortDescription: '빅데이터와 머신러닝으로 정확한 수요 예측 및 최적화',
    detailDescription: `
      빅데이터 분석과 머신러닝 알고리즘을 활용하여 정확한 수요 예측을 제공합니다.
      과거 데이터, 시장 트렌드, 외부 요인을 종합 분석하여
      재고 최적화, 생산 계획 수립, 마케팅 전략 수립을 지원합니다.
    `,
    image: '/api/placeholder/600/400',
    icon: '📊',
    features: [
      '시계열 데이터 분석',
      '다변량 예측 모델',
      '실시간 수요 모니터링',
      '시나리오별 예측 분석',
      '자동 알림 및 리포트',
      'API 기반 연동 서비스'
    ],
    benefits: [
      '예측 정확도 90% 이상',
      '재고 비용 35% 절감',
      '매출 기회 손실 25% 감소',
      '운영 효율성 50% 향상'
    ],
    technologies: ['Python', 'TensorFlow', 'Scikit-learn', 'Apache Kafka', 'InfluxDB', 'Grafana'],
    casestudies: [
      {
        title: '리테일 체인 I사',
        description: '매장별 상품 수요 예측 시스템',
        results: ['예측 정확도 92%', '재고 회전율 40% 개선', '매출 증가 18%'],
      },
      {
        title: '제조업 J사',
        description: '원자재 수요 예측 및 조달 최적화',
        results: ['조달 비용 30% 절감', '생산 효율 25% 향상', '품절률 80% 감소'],
      },
    ],
    pricing: {
      basic: '월 200만원부터',
      premium: '월 500만원부터',
      enterprise: '별도 견적',
    },
  },
  {
    id: 'rnd-center',
    title: 'R&D Center',
    subtitle: '연구개발 및 기술혁신',
    shortDescription: '차세대 기술 연구개발 및 혁신 솔루션 개발',
    detailDescription: `
      최신 기술 트렌드를 선도하는 연구개발을 통해 혁신적인 솔루션을 개발합니다.
      AI, 블록체인, IoT, 빅데이터 등 차세대 기술을 활용한
      맞춤형 솔루션 개발과 기술 컨설팅을 제공합니다.
    `,
    image: '/api/placeholder/600/400',
    icon: '🔬',
    features: [
      '차세대 기술 연구개발',
      'AI/ML 알고리즘 개발',
      '블록체인 솔루션 개발',
      'IoT 플랫폼 구축',
      '빅데이터 분석 시스템',
      '기술 특허 출원 지원'
    ],
    benefits: [
      '기술 경쟁력 확보',
      '혁신 솔루션 개발',
      '시장 선점 기회 창출',
      '장기적 성장 동력 확보'
    ],
    technologies: ['Python', 'R', 'TensorFlow', 'PyTorch', 'Blockchain', 'IoT', 'Cloud Computing'],
    casestudies: [
      {
        title: '스마트팩토리 K사',
        description: 'IoT 기반 생산 최적화 솔루션 개발',
        results: ['생산성 45% 향상', '에너지 비용 30% 절감', '품질 불량률 90% 감소'],
      },
      {
        title: '핀테크 L사',
        description: '블록체인 기반 결제 시스템 개발',
        results: ['거래 수수료 70% 절감', '처리 속도 10배 향상', '보안성 99.9% 달성'],
      },
    ],
    pricing: {
      basic: '프로젝트별 견적',
      premium: '월 1,000만원부터',
      enterprise: '별도 협의',
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
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isExpanded]);

  return (
    <EnhancedAnimate variant="slideUp" delay={index * 200}>
      <div
        id={item.id}
        ref={cardRef}
        className={`
          relative overflow-hidden bg-white rounded-3xl border-2 transition-all duration-700 cursor-pointer scroll-mt-20
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
                    window.open('tel:02-2025-8511', '_self');
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
  }, [smartTracking]);

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