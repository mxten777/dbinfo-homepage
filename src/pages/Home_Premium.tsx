import React, { useState, useEffect } from 'react';
import BusinessSection from '../components/BusinessSection';
import FadeSlideIn from '../components/FadeSlideIn';

// 🎨 프리미엄 스타일 시스템
const PREMIUM_STYLES = {
  hero: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden",
  card: "glass-card rounded-3xl shadow-glass border border-white/10 backdrop-blur-xl",
  button: {
    primary: "group px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-500",
    secondary: "px-8 py-4 glass rounded-2xl border border-white/20 text-white font-semibold hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
  },
  text: {
    hero: "text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent",
    subtitle: "text-xl sm:text-2xl md:text-3xl text-blue-100 font-medium",
    description: "text-lg text-blue-200/80 leading-relaxed"
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
    <div className={`${PREMIUM_STYLES.card} p-6 text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
      <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
        {count}{suffix}
      </div>
      <div className="text-blue-200 font-medium text-sm md:text-base">{label}</div>
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
  <div className={`${PREMIUM_STYLES.card} p-8 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-4`}>
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-blue-200/70 leading-relaxed group-hover:text-blue-200/90 transition-colors duration-300">
      {description}
    </p>
  </div>
);

// 🏢 회사 소개 섹션
const AboutSection: React.FC = () => (
  <section className="py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-6">
      <FadeSlideIn direction="up" delay={0.2}>
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full text-blue-700 text-sm font-semibold mb-6 shadow-soft">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            About DB.INFO
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 font-display">
            혁신을 통한 성장<br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">미래를 선도하는 기술</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            2011년부터 축적된 기술력과 경험으로 다양한 분야에서 혁신을 이끌어온 성장 스토리
          </p>
        </div>
      </FadeSlideIn>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <FadeSlideIn direction="up" delay={0.4}>
          <FeatureCard
            icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            title="혁신"
            description="최신 기술 트렌드를 선도하며 끊임없는 연구개발을 통해 차별화된 솔루션을 제공합니다."
            color="from-blue-500 to-blue-600"
          />
        </FadeSlideIn>
        
        <FadeSlideIn direction="up" delay={0.6}>
          <FeatureCard
            icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
            title="신뢰"
            description="13년간의 축적된 경험과 성공적인 프로젝트 수행으로 고객의 신뢰를 얻어왔습니다."
            color="from-indigo-500 to-purple-600"
          />
        </FadeSlideIn>
        
        <FadeSlideIn direction="up" delay={0.8}>
          <FeatureCard
            icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            title="성장"
            description="지속적인 혁신과 품질 향상을 통해 고객과 함께 성장하는 동반자 역할을 합니다."
            color="from-purple-500 to-pink-600"
          />
        </FadeSlideIn>
      </div>

      <FadeSlideIn direction="up" delay={1.0}>
        <div className={`${PREMIUM_STYLES.card} p-12 text-center bg-gradient-to-r from-slate-900/90 to-blue-900/90`}>
          <h3 className="text-4xl font-black text-white mb-6 font-display">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">13년간의 혁신 여정</span>
          </h3>
          <p className="text-blue-200 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            금융·공공·기업 분야에서 디지털 트랜스포메이션을 이끌어왔습니다
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <CounterCard end={13} label="년 경험" suffix="+" delay={200} />
            <CounterCard end={150} label="프로젝트" suffix="+" delay={400} />
            <CounterCard end={98} label="고객 만족도" suffix="%" delay={600} />
            <CounterCard end={24} label="기술 지원" suffix="/7" delay={800} />
          </div>
        </div>
      </FadeSlideIn>
    </div>
  </section>
);

// 🎯 사업영역 섹션
const BusinessAreasSection: React.FC = () => (
  <section id="business" className="py-32 bg-gradient-to-b from-white via-blue-50/20 to-slate-50 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent"></div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <FadeSlideIn direction="up" delay={0.2}>
          <span className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full text-blue-700 text-sm font-semibold mb-6 shadow-soft">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Business Areas
          </span>
        </FadeSlideIn>
        <FadeSlideIn direction="up" delay={0.4}>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 font-display">
            13년간의 혁신 여정<br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">주요 사업영역</span>
          </h2>
        </FadeSlideIn>
        <FadeSlideIn direction="up" delay={0.6}>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            2011년부터 축적된 기술력과 경험으로 다양한 분야에서 혁신을 이끌어온 성장 스토리
          </p>
        </FadeSlideIn>
      </div>

      <div className="space-y-12">
        <FadeSlideIn direction="up" delay={0.8}>
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
              form: "웹 기반 + API 기반 데이터 마켓플레이스",
              target: "AI 개발사, 데이터 과학자, 연구기관, 공공기관, 스타트업",
              keyFeatures: [
                "고품질 데이터셋 제공",
                "실시간 데이터 처리",
                "머신러닝 최적화",
                "API 통합 서비스"
              ],
              techStack: [
                "Python/Django",
                "React.js",
                "PostgreSQL",
                "Docker/Kubernetes"
              ]
            }}
          />
        </FadeSlideIn>

        <FadeSlideIn direction="up" delay={1.0}>
          <BusinessSection 
            id="si-integration"
            title="SI (System Integration)"
            subtitle="시스템 통합 구축"
            description1="정보화 전략수립, 업무분석/설계/구축, 시스템 운영까지 전 과정 통합 서비스"
            description2={
              <span>
                금융·공공기관과의 13년간 파트너십을 통해 검증된 SI 전문성으로<br />
                <strong className="text-blue-600"> 정보화 전략부터 통합 운영보수</strong>까지 제공
              </span>
            }
            features={[
              "정보화 전략 수립",
              "업무 분석 및 설계",
              "시스템 구축 및 개발",
              "레거시 시스템 전환",
              "클라우드 마이그레이션",
              "24/7 운영 지원"
            ]}
            detailInfo={{
              purpose: "기업의 디지털 트랜스포메이션을 위한 종합 IT 서비스",
              form: "컨설팅 + 개발 + 운영 통합 서비스",
              target: "금융기관, 공공기관, 대기업, 중견기업",
              keyFeatures: [
                "엔터프라이즈 아키텍처 설계",
                "레거시 시스템 현대화",
                "클라우드 네이티브 전환",
                "DevOps 자동화"
              ],
              techStack: [
                "Java/Spring",
                "Oracle/PostgreSQL",
                "Kubernetes",
                "AWS/Azure"
              ],
              additionalInfo: "신한은행, 하나은행, 우리은행 등 주요 금융기관과 13년간의 파트너십을 통해 검증된 SI 전문성을 보유하고 있습니다."
            }}
          />
        </FadeSlideIn>

        <FadeSlideIn direction="up" delay={1.2}>
          <BusinessSection 
            id="ecommerce-platform"
            title="E-Commerce Platform"
            subtitle="전자상거래 플랫폼 구축"
            description1="온라인 쇼핑몰, 결제 시스템, 상품관리, 주문/배송 등 전자상거래 전 과정 통합 솔루션"
            description2={
              <span>
                다양한 채널 연동과 사용자 맞춤형 쇼핑 경험으로<br />
                <strong className="text-green-600"> 전자상거래 통합 솔루션</strong> 제공
              </span>
            }
            features={[
              "쇼핑몰 구축 및 운영",
              "상품/주문 관리",
              "마케팅 자동화",
              "실시간 데이터 분석"
            ]}
            detailInfo={{
              purpose: "완성도 높은 전자상거래 플랫폼 구축 및 운영",
              form: "맞춤형 쇼핑몰 구축 + 통합 관리 시스템",
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
        </FadeSlideIn>

        <FadeSlideIn direction="up" delay={1.4}>
          <BusinessSection 
            id="ai-chatbot"
            title="AI ChatBot Service"
            subtitle="챗봇/상담 자동화"
            description1="AI 기반 챗봇, 고객상담 자동화, FAQ, 실시간 응대, 자연어 처리 기술 적용"
            description2={
              <span>
                다양한 채널 연동과 사용자 맞춤형 답변으로 
                <strong className="text-purple-600"> 고객 서비스 혁신</strong> 실현
              </span>
            }
            features={[
              "AI 챗봇",
              "상담 자동화",
              "다채널 연동",
              "자연어 처리",
              "실시간 학습"
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
        </FadeSlideIn>

        <FadeSlideIn direction="up" delay={1.6}>
          <BusinessSection 
            id="demand-prediction"
            title="Demand Prediction"
            subtitle="수요예측/AI 분석"
            description1="AI/머신러닝 기반 수요예측, 판매/재고/트렌드 분석, 비즈니스 의사결정 지원"
            description2={
              <span>
                빅데이터 분석과 예측모델 구축으로 
                <strong className="text-orange-600"> 산업별 맞춤형 솔루션</strong> 제공
              </span>
            }
            features={[
              "수요예측",
              "빅데이터 분석",
              "실시간 대시보드",
              "예측모델 구축",
              "산업별 맞춤 솔루션"
            ]}
            detailInfo={{
              purpose: "AI/머신러닝을 활용한 정확한 수요 예측 및 비즈니스 인사이트 제공",
              form: "예측 모델 + 분석 대시보드 + API 서비스",
              target: "제조업, 유통업, 금융업, 공공기관",
              keyFeatures: [
                "고급 머신러닝 알고리즘",
                "실시간 데이터 처리",
                "직관적인 시각화 대시보드",
                "산업별 특화 모델"
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
        </FadeSlideIn>

        <FadeSlideIn direction="up" delay={1.8}>
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
              purpose: "차세대 IT 기술 연구개발 및 혁신적 솔루션 창출",
              form: "연구개발 + 기술 이전 + 컨설팅",
              target: "기업 R&D 부서, 연구기관, 스타트업",
              keyFeatures: [
                "AI/ML 전문 연구진",
                "오픈소스 기여 활동",
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
          <span className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full text-blue-200 text-sm font-semibold mb-6 shadow-soft">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Contact Us
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 font-display">
            함께 만들어가는<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">디지털 미래</span>
          </h2>
          <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            혁신적인 아이디어와 전문적인 기술력으로 여러분의 비즈니스 성장을 함께 만들어갑니다
          </p>
        </div>
      </FadeSlideIn>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <FadeSlideIn direction="left" delay={0.4}>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-glow">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">본사 위치</h3>
                <p className="text-blue-200">서울특별시 강남구 테헤란로</p>
                <p className="text-blue-200/70">DB.INFO 본사</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-glow">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">연락처</h3>
                <p className="text-blue-200">전화: 02-1234-5678</p>
                <p className="text-blue-200">팩스: 02-1234-5679</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-glow">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">이메일</h3>
                <p className="text-blue-200">contact@dbinfo.co.kr</p>
                <p className="text-blue-200/70">24시간 이내 답변 드립니다</p>
              </div>
            </div>
          </div>
        </FadeSlideIn>

        <FadeSlideIn direction="right" delay={0.6}>
          <div className={`${PREMIUM_STYLES.card} p-8`}>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">프로젝트 문의</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">이름</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 glass rounded-xl border border-slate-200/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    placeholder="성함을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">회사명</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 glass rounded-xl border border-slate-200/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    placeholder="회사명을 입력해주세요"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">이메일</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 glass rounded-xl border border-slate-200/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                  placeholder="연락받을 이메일을 입력해주세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">프로젝트 유형</label>
                <select className="w-full px-4 py-3 glass rounded-xl border border-slate-200/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300">
                  <option value="">프로젝트 유형을 선택해주세요</option>
                  <option value="ai">AI/데이터 분석</option>
                  <option value="si">시스템 통합</option>
                  <option value="ecommerce">이커머스 플랫폼</option>
                  <option value="chatbot">챗봇/상담 자동화</option>
                  <option value="consulting">기술 컨설팅</option>
                  <option value="other">기타</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">프로젝트 내용</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 glass rounded-xl border border-slate-200/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 resize-none"
                  placeholder="프로젝트에 대한 상세한 내용을 입력해주세요..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className={`${PREMIUM_STYLES.button.primary} w-full`}
              >
                <span className="flex items-center justify-center gap-3">
                  문의 보내기
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </span>
              </button>
            </form>
          </div>
        </FadeSlideIn>
      </div>
    </div>
  </section>
);

// 🏠 메인 홈 컴포넌트
export default function Home() {

  // 스크롤 이동 함수
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* 🌟 프리미엄 Hero 섹션 */}
      <section className={PREMIUM_STYLES.hero}>
        {/* 배경 요소들 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse-slow"></div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <FadeSlideIn direction="up" delay={0.2}>
              <div className="mb-8">
                <span className="inline-flex items-center gap-3 px-6 py-3 glass-strong rounded-full text-blue-200 text-sm font-medium shadow-glow">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-slow"></span>
                  2011년부터 13년간의 IT 전문성
                </span>
              </div>
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={0.4}>
              <h1 className={`${PREMIUM_STYLES.text.hero} mb-8 font-display leading-none`}>
                DB.INFO
              </h1>
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={0.6}>
              <h2 className={`${PREMIUM_STYLES.text.subtitle} mb-6`}>
                디지털 혁신을 선도하는 IT 솔루션 파트너
              </h2>
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={0.8}>
              <p className={`${PREMIUM_STYLES.text.description} mb-12 max-w-4xl mx-auto`}>
                최첨단 기술과 창의적 사고로 고객의 비즈니스 성장을 가속화하는<br className="hidden sm:block" />
                프리미엄 IT 전문 기업입니다
              </p>
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={1.0}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <button 
                  className={PREMIUM_STYLES.button.primary}
                  onClick={() => scrollToSection('business')}
                >
                  <span className="flex items-center gap-3">
                    프로젝트 시작하기
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
                
                <button 
                  className={PREMIUM_STYLES.button.secondary}
                  onClick={() => scrollToSection('about')}
                >
                  회사소개 보기
                </button>
              </div>
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={1.2}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <CounterCard end={13} label="년 경험" suffix="+" />
                <CounterCard end={150} label="프로젝트" suffix="+" delay={200} />
                <CounterCard end={98} label="고객 만족도" suffix="%" delay={400} />
                <CounterCard end={24} label="기술 지원" suffix="/7" delay={600} />
              </div>
            </FadeSlideIn>

            {/* 스크롤 인디케이터 */}
            <FadeSlideIn direction="up" delay={1.4}>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="flex flex-col items-center gap-2 text-blue-200">
                  <span className="text-xs font-medium">Scroll Down</span>
                  <div className="w-6 h-10 border-2 border-blue-200/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-blue-200 rounded-full mt-2 animate-bounce"></div>
                  </div>
                </div>
              </div>
            </FadeSlideIn>
          </div>
        </div>
      </section>

      {/* 섹션들 */}
      <AboutSection />
      <BusinessAreasSection />
      <ContactSection />
    </div>
  );
}