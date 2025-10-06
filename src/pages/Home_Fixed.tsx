import React, { useState, useEffect } from 'react';
import BusinessSection from '../components/BusinessSection';
import FadeSlideIn from '../components/FadeSlideIn';
import { BusinessSectionErrorBoundary } from '../components/ErrorBoundary';

// 🎨 프리미엄 스타일 시스템 (극대화된 가독성)
const PREMIUM_STYLES = {
  hero: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden",
  card: "rounded-3xl shadow-2xl border-2 border-white/50 backdrop-blur-xl bg-white/90 shadow-black/20",
  button: {
    primary: "group px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 border-2 border-blue-400/70",
    secondary: "px-8 py-4 rounded-2xl border-2 border-white/70 text-white font-semibold hover:bg-white/30 transform hover:scale-105 transition-all duration-300 bg-white/20 shadow-xl backdrop-blur-xl"
  },
  text: {
    hero: "text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-white via-blue-50 to-purple-50 bg-clip-text text-transparent drop-shadow-2xl [text-shadow:_0_0_40px_rgba(255,255,255,0.8)]",
    subtitle: "text-xl sm:text-2xl md:text-3xl text-white font-black drop-shadow-2xl [text-shadow:_0_0_30px_rgba(255,255,255,0.9)]",
    description: "text-lg text-white leading-relaxed drop-shadow-xl [text-shadow:_0_0_20px_rgba(255,255,255,0.8)] font-semibold"
  }
} as const;

// 🌟 통계 카운터 컴포넌트
const CounterCard: React.FC<{
  end: number;
  label: string;
  suffix?: string;
  delay?: number;
}> = ({ end, label, suffix = "", delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [isVisible, end]);

  return (
    <div className="bg-white/95 rounded-3xl shadow-2xl border-2 border-white/70 backdrop-blur-xl p-6 text-center group hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
      <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
        {count}{suffix}
      </div>
      <div className="text-gray-700 font-bold text-sm md:text-base">{label}</div>
    </div>
  );
};

// 🎯 특징 카드 컴포넌트
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}> = ({ icon, title, description, color }) => (
  <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-8 group hover:shadow-3xl transition-all duration-500 hover:-translate-y-4">
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
      {icon}
    </div>
    <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300 font-semibold">
      {description}
    </p>
  </div>
);

// 🏢 회사 소개 섹션
const AboutSection: React.FC = () => (
  <section className="py-32 bg-white relative overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-6">
      <FadeSlideIn direction="up" delay={0.2}>
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 border-2 border-blue-600 rounded-full text-white text-sm font-bold mb-6 shadow-2xl">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            About DB.INFO
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            혁신적인 IT 솔루션으로<br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              미래를 창조합니다
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-semibold">
            DB.INFO는 AI, 빅데이터, 클라우드 기술을 기반으로<br />
            기업의 디지털 혁신을 선도하는 <strong className="text-blue-600">IT 전문 기업</strong>입니다.
          </p>
        </div>
      </FadeSlideIn>

      {/* 통계 카운터 */}
      <FadeSlideIn direction="up" delay={0.4}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <CounterCard end={13} label="사업 경력" suffix="년+" delay={200} />
          <CounterCard end={150} label="프로젝트 수행" suffix="+" delay={400} />
          <CounterCard end={50} label="파트너사" suffix="+" delay={600} />
          <CounterCard end={98} label="고객 만족도" suffix="%" delay={800} />
        </div>
      </FadeSlideIn>

      {/* 특징 카드들 */}
      <FadeSlideIn direction="up" delay={0.6}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            title="검증된 전문성"
            description="13년간의 SI 경험과 금융, 공공, 제조업 등 다양한 도메인에서 검증된 기술력을 보유하고 있습니다."
            color="from-green-500 to-emerald-600"
          />
          <FeatureCard
            icon={<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg>}
            title="고객 중심 서비스"
            description="고객의 비즈니스 목표를 이해하고, 맞춤형 솔루션을 통해 실질적인 가치를 창출합니다."
            color="from-blue-500 to-cyan-600"
          />
          <FeatureCard
            icon={<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>}
            title="혁신 기술 선도"
            description="AI, 머신러닝, 클라우드 등 최신 기술 트렌드를 선도하며 지속적인 R&D 투자를 진행합니다."
            color="from-purple-500 to-pink-600"
          />
        </div>
      </FadeSlideIn>
    </div>
  </section>
);

// 🚀 사업 영역 섹션
const BusinessAreasSection: React.FC = () => (
  <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-6">
      <FadeSlideIn direction="up" delay={0.2}>
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-700 border-2 border-indigo-600 rounded-full text-white text-sm font-bold mb-6 shadow-2xl">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Business Areas
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            전문 사업 영역
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-semibold">
            다양한 산업 분야에서 축적된 전문성을 바탕으로<br />
            고객에게 최적화된 <strong className="text-indigo-600">IT 솔루션</strong>을 제공합니다.
          </p>
        </div>
      </FadeSlideIn>

      <div className="space-y-12">
        <FadeSlideIn direction="up" delay={0.8}>
          <BusinessSectionErrorBoundary>
            <BusinessSection 
              id="ai-dataset"
              title="AI DataSet Platform"
              subtitle="인공지능 데이터셋 플랫폼"
              description1="AIDataHub – AI 개발을 위한 고품질 데이터셋을 쉽고 빠르게 확보하는 통합 데이터 플랫폼"
              description2={
                <span>
                  인공지능 학습에 필요한 데이터를 수집 → 정제 → 검증 → 제공까지 한 번에<br />
                  <strong className="text-blue-600">웹 기반 + API 기반 데이터 마켓플레이스</strong>
                </span>
              }
              features={[
                "데이터 수집/정제/가공 자동화",
                "대용량 데이터 라벨링 및 품질 관리",
                "AI 학습 데이터셋 제공",
                "API 기반 데이터 마켓플레이스",
                "AI 개발사, 연구기관, 공공기관 대상"
              ]}
              detailInfo={{
                purpose: "인공지능 학습에 필요한 데이터를 수집 → 정제 → 검증 → 제공까지 한 번에",
                form: "웹 플랫폼 + API 서비스 + 데이터 마켓플레이스",
                target: "과학자, 연구기관, 공공기관, 스타트업",
                keyFeatures: [
                  "자동화된 데이터 파이프라인",
                  "AI 기반 품질 검증",
                  "다양한 데이터 포맷 지원",
                  "실시간 데이터 업데이트"
                ],
                techStack: [
                  "Python/Django",
                  "React.js",
                  "PostgreSQL",
                  "Docker/Kubernetes"
                ]
              }}
            />
          </BusinessSectionErrorBoundary>
        </FadeSlideIn>

        <FadeSlideIn direction="up" delay={1.0}>
          <BusinessSectionErrorBoundary>
            <BusinessSection 
              id="si-integration"
              title="SI (System Integration)"
              subtitle="시스템 통합 구축"
              description1="정보화 전략수립, 업무분석/설계/구축, 시스템 운영까지 전 과정 통합 서비스"
              description2={
                <span>
                  기업의 디지털 트랜스포메이션을 위한 종합 IT 서비스<br />
                  <strong className="text-green-600">컨설팅부터 운영까지 One-Stop 서비스</strong>
                </span>
              }
              features={[
                "정보화 전략 수립 및 ISP",
                "업무 분석/설계/구축",
                "레거시 시스템 현대화",
                "클라우드 마이그레이션",
                "시스템 운영 및 유지보수"
              ]}
              detailInfo={{
                purpose: "기업의 디지털 혁신과 업무 효율성 극대화를 위한 통합 IT 솔루션",
                form: "전 과정 통합 서비스 (컨설팅부터 운영까지)",
                target: "금융기관, 공공기관, 대기업",
                keyFeatures: [
                  "엔터프라이즈 아키텍처 설계",
                  "레거시 시스템 현대화",
                  "클라우드 마이그레이션",
                  "24/7 운영 지원"
                ],
                techStack: [
                  "Java/Spring",
                  "Oracle/PostgreSQL",
                  "AWS/Azure",
                  "Kubernetes"
                ],
                additionalInfo: "신한은행, 하나은행, 우리은행 등 주요 금융기관과 13년간의 파트너십을 통해 검증된 SI 전문성을 보유하고 있습니다."
              }}
            />
          </BusinessSectionErrorBoundary>
        </FadeSlideIn>

        <FadeSlideIn direction="up" delay={1.2}>
          <BusinessSectionErrorBoundary>
            <BusinessSection 
              id="e-commerce"
              title="E-Commerce Platform"
              subtitle="전자상거래 플랫폼 구축"
              description1="온라인 비즈니스 성공을 위한 고성능 이커머스 솔루션"
              description2={
                <span>
                  완성도 높은 전자상거래 플랫폼 구축 및 운영<br />
                  <strong className="text-red-600">반응형 모바일 최적화</strong>
                </span>
              }
              features={[
                "반응형 웹/모바일 최적화",
                "결제 시스템 연동",
                "실시간 재고 관리",
                "고객 관리 시스템(CRM)",
                "데이터 분석 및 리포트"
              ]}
              detailInfo={{
                purpose: "온라인 비즈니스 성공을 위한 종합 이커머스 솔루션",
                form: "웹 플랫폼 + 모바일 앱 + 관리자 시스템",
                target: "리테일 기업, 스타트업, 중소기업, 대기업",
                keyFeatures: [
                  "반응형 모바일 최적화",
                  "다중 결제 게이트웨이 연동",
                  "실시간 재고 관리",
                  "고객 행동 분석 및 추천 엔진"
                ],
                techStack: [
                  "React/Next.js",
                  "Node.js/Express",
                  "MongoDB/Redis",
                  "AWS/GCP"
                ]
              }}
            />
          </BusinessSectionErrorBoundary>
        </FadeSlideIn>

        <FadeSlideIn direction="up" delay={1.4}>
          <BusinessSectionErrorBoundary>
            <BusinessSection 
              id="ai-chatbot"
              title="AI ChatBot Service"
              subtitle="챗봇/상담 자동화"
              description1="AI 기술을 활용한 고객 서비스 자동화 및 업무 효율성 극대화"
              description2={
                <span>
                  자연어 처리 기반 지능형 챗봇으로<br />
                  <strong className="text-purple-600">24시간 고객 응대 서비스</strong>
                </span>
              }
              features={[
                "자연어 처리(NLP) 기반 대화",
                "멀티채널 지원 (웹/모바일/메신저)",
                "실시간 학습 및 개선",
                "상담원 연결 기능",
                "대화 이력 분석 및 인사이트"
              ]}
              detailInfo={{
                purpose: "AI 기술을 활용한 고객 서비스 자동화 및 효율성 극대화",
                form: "AI 챗봇 + 상담 시스템 + 관리 대시보드",
                target: "금융기관, 이커머스, 고객센터 운영 기업",
                keyFeatures: [
                  "자연어 처리 기술",
                  "멀티채널 지원",
                  "실시간 학습 능력",
                  "감정 분석 기능"
                ],
                techStack: [
                  "Python/TensorFlow",
                  "NLP/BERT",
                  "FastAPI",
                  "Redis/Elasticsearch"
                ],
                additionalInfo: "신한은행 THE NEXT 등 금융권 챗봇 구축 경험을 통해 검증된 AI 기술력을 보유하고 있습니다."
              }}
            />
          </BusinessSectionErrorBoundary>
        </FadeSlideIn>

        <FadeSlideIn direction="up" delay={1.6}>
          <BusinessSectionErrorBoundary>
            <BusinessSection 
              id="demand-prediction"
              title="Demand Prediction System"
              subtitle="수요예측 시스템"
              description1="빅데이터와 머신러닝을 활용한 정확한 수요 예측 및 최적화 솔루션"
              description2={
                <span>
                  과거 데이터와 외부 요인을 종합 분석하여<br />
                  <strong className="text-orange-600">정확한 미래 수요 예측</strong>
                </span>
              }
              features={[
                "머신러닝 기반 예측 모델",
                "실시간 데이터 수집/분석",
                "외부 변수 반영 (날씨, 이벤트 등)",
                "대시보드를 통한 시각화",
                "예측 결과 알림 서비스"
              ]}
              detailInfo={{
                purpose: "데이터 기반 정확한 수요 예측으로 비즈니스 효율성 극대화",
                form: "예측 엔진 + 분석 대시보드 + API 서비스",
                target: "제조업, 유통업, 서비스업, 공공기관",
                keyFeatures: [
                  "고정밀 예측 알고리즘",
                  "다양한 변수 통합 분석",
                  "실시간 모니터링",
                  "맞춤형 알림 서비스"
                ],
                techStack: [
                  "Python/Scikit-learn",
                  "TensorFlow/PyTorch",
                  "Apache Spark",
                  "Tableau/Power BI"
                ],
                additionalInfo: "현대자동차, LG헬로비전 등의 수요예측 시스템 구축을 통해 다양한 산업 도메인 전문성을 확보했습니다."
              }}
            />
          </BusinessSectionErrorBoundary>
        </FadeSlideIn>

        <FadeSlideIn direction="up" delay={1.8}>
          <BusinessSectionErrorBoundary>
            <BusinessSection 
              id="rnd-center"
              title="R&D Center"
              subtitle="연구개발센터"
              description1="AI, 빅데이터, 클라우드 등 첨단 기술 연구개발, 기술 혁신 선도, 미래 기술 투자"
              description2={
                <span>
                  지속적인 기술 혁신과 연구개발을 통해<br />
                  <strong className="text-red-600"> 미래 기술을 선도</strong>하는 혁신 허브
                </span>
              }
              features={[
                "AI/ML 연구",
                "빅데이터 플랫폼",
                "클라우드 기술",
                "오픈소스 기여",
                "특허 출원"
              ]}
              detailInfo={{
                purpose: "첨단 기술 연구개발을 통한 미래 기술 혁신 선도",
                form: "연구개발센터 + 기술 인큐베이터 + 오픈소스 프로젝트",
                target: "기술 기업, 연구기관, 스타트업, 정부기관",
                keyFeatures: [
                  "AI/ML 알고리즘 연구",
                  "클라우드 네이티브 기술",
                  "오픈소스 생태계 기여",
                  "기술 특허 보유",
                  "산학연 협력 네트워크"
                ],
                techStack: [
                  "Python/R",
                  "TensorFlow/PyTorch",
                  "Docker/Kubernetes",
                  "Various ML Frameworks"
                ],
                additionalInfo: "국방기술품질원 등 정부기관과의 협력을 통해 국가 차원의 기술 혁신에 기여하고 있습니다."
              }}
            />
          </BusinessSectionErrorBoundary>
        </FadeSlideIn>
      </div>
    </div>
  </section>
);

// 📞 연락처 섹션
const ContactSection: React.FC = () => (
  <section id="contact" className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-full h-full opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-6">
      <FadeSlideIn direction="up" delay={0.2}>
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 border border-white/30 rounded-full text-white text-sm font-bold mb-6 shadow-2xl backdrop-blur-xl">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Contact Us
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 font-display">
            함께 만들어가는<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">디지털 미래</span>
          </h2>
          <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            혁신적인 IT 솔루션으로 고객의 비즈니스 성공을 함께 만들어가겠습니다.<br />
            <strong className="text-white">언제든지 문의해 주세요.</strong>
          </p>
        </div>
      </FadeSlideIn>

      <FadeSlideIn direction="up" delay={0.4}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 연락처 정보 */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">이메일</h3>
                  <p className="text-blue-200">info@dbinfo.co.kr</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">전화번호</h3>
                  <p className="text-blue-200">02-1234-5678</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">주소</h3>
                  <p className="text-blue-200">서울시 강남구 테헤란로 123</p>
                </div>
              </div>
            </div>
          </div>

          {/* 연락처 폼 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">프로젝트 문의</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">회사명</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                  placeholder="회사명을 입력해주세요"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">담당자명</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                  placeholder="담당자명을 입력해주세요"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">이메일</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                  placeholder="이메일을 입력해주세요"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">프로젝트 내용</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm resize-none"
                  placeholder="프로젝트에 대해 자세히 설명해주세요"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                문의 보내기
              </button>
            </form>
          </div>
        </div>
      </FadeSlideIn>
    </div>
  </section>
);

// 🎯 메인 홈 컴포넌트
export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* 히어로 섹션 */}
      <section className={PREMIUM_STYLES.hero}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center">
            <FadeSlideIn direction="up" delay={0.2}>
              <h1 className={PREMIUM_STYLES.text.hero}>
                DB.INFO
              </h1>
            </FadeSlideIn>
            
            <FadeSlideIn direction="up" delay={0.4}>
              <p className={PREMIUM_STYLES.text.subtitle}>
                IT Innovation & Digital Transformation
              </p>
            </FadeSlideIn>
            
            <FadeSlideIn direction="up" delay={0.6}>
              <p className={`${PREMIUM_STYLES.text.description} mt-8 mb-12 max-w-4xl mx-auto`}>
                13년간의 SI 경험과 AI, 빅데이터, 클라우드 기술을 바탕으로<br />
                고객의 <strong className="text-blue-300">디지털 혁신</strong>을 선도하는 IT 전문 기업입니다.
              </p>
            </FadeSlideIn>
            
            <FadeSlideIn direction="up" delay={0.8}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a
                  href="#contact"
                  className={PREMIUM_STYLES.button.primary}
                >
                  <span className="flex items-center gap-2">
                    프로젝트 문의
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </a>
                <a
                  href="#about"
                  className={PREMIUM_STYLES.button.secondary}
                >
                  회사 소개 보기
                </a>
              </div>
            </FadeSlideIn>
          </div>
        </div>
      </section>

      {/* 회사 소개 섹션 */}
      <AboutSection />

      {/* 사업 영역 섹션 */}
      <BusinessAreasSection />

      {/* 연락처 섹션 */}
      <ContactSection />
    </div>
  );
}