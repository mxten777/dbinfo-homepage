import FadeSlideIn from '../components/FadeSlideIn';
import BusinessSection from '../components/BusinessSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - 완전 새로운 디자인 */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-brand-950 to-accent-950">
        {/* 배경 요소들 */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 via-transparent to-accent-600/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* 메인 콘텐츠 */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <FadeSlideIn direction="up" delay={0.2}>
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-6 py-3 glass-strong rounded-full text-brand-200 text-sm font-medium shadow-glow">
                <span className="w-2 h-2 bg-success-400 rounded-full animate-pulse-slow"></span>
                2011년부터 13년간의 IT 전문성
              </span>
            </div>
          </FadeSlideIn>

          <FadeSlideIn direction="up" delay={0.4}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black gradient-text mb-8 font-display leading-none">
              DB.INFO
            </h1>
          </FadeSlideIn>

          <FadeSlideIn direction="up" delay={0.6}>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-neutral-300 mb-6 font-medium">
              디지털 혁신을 선도하는 IT 솔루션 파트너
            </h2>
          </FadeSlideIn>

          <FadeSlideIn direction="up" delay={0.8}>
            <p className="text-lg text-neutral-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              최첨단 기술과 창의적 사고로 고객의 비즈니스 성장을 가속화하는<br className="hidden sm:block" />
              프리미엄 IT 전문 기업입니다
            </p>
          </FadeSlideIn>

          <FadeSlideIn direction="up" delay={1.0}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button className="btn-primary group px-8 py-4 text-lg font-semibold hover-lift">
                <span className="flex items-center gap-3">
                  프로젝트 시작하기
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              
              <button className="btn-secondary group px-8 py-4 text-lg font-semibold hover-lift">
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  포트폴리오 보기
                </span>
              </button>
            </div>
          </FadeSlideIn>

          {/* 핵심 지표 */}
          <FadeSlideIn direction="up" delay={1.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="text-4xl font-black text-brand-400 mb-2">500+</div>
                <div className="text-neutral-400 text-sm">완료 프로젝트</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-accent-400 mb-2">13년</div>
                <div className="text-neutral-400 text-sm">경험과 노하우</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-success-400 mb-2">98%</div>
                <div className="text-neutral-400 text-sm">고객 만족도</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-brand-300 mb-2">24/7</div>
                <div className="text-neutral-400 text-sm">기술 지원</div>
              </div>
            </div>
          </FadeSlideIn>
        </div>

        {/* Scroll Indicator - 새로운 디자인 */}
        <FadeSlideIn direction="up" delay={1.4}>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center text-neutral-500 animate-bounce-subtle">
              <span className="text-sm mb-2 font-medium">더 알아보기</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </FadeSlideIn>
      </section>

      {/* About Section - 완전 새로운 디자인 */}
      <section id="about" className="py-32 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <FadeSlideIn direction="up" delay={0.2}>
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full text-brand-700 text-sm font-semibold mb-6 shadow-soft">
                <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
                About DB.INFO
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-neutral-900 mb-6 font-display">
                13년간 쌓아온<br />
                <span className="gradient-text">전문성과 신뢰</span>
              </h2>
              <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
                2011년부터 시작된 여정, 끊임없는 혁신으로 IT 업계의 새로운 기준을 만들어갑니다
              </p>
            </div>
          </FadeSlideIn>

          <FadeSlideIn direction="up" delay={0.4}>
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {/* 경험과 전문성 */}
              <div className="card hover-lift p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <span className="text-2xl font-black text-white">13</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Years of Excellence</h3>
                <p className="text-neutral-600 leading-relaxed">
                  2011년부터 축적된 풍부한 경험과 노하우로 안정적이고 혁신적인 솔루션을 제공합니다.
                </p>
              </div>

              {/* 신뢰성 */}
              <div className="card hover-lift p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Trusted Partnership</h3>
                <p className="text-neutral-600 leading-relaxed">
                  고객과의 신뢰를 바탕으로 한 장기적 파트너십을 통해 지속가능한 성장을 이끌어냅니다.
                </p>
              </div>

              {/* 혁신 */}
              <div className="card hover-lift p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Innovation Driven</h3>
                <p className="text-neutral-600 leading-relaxed">
                  최신 기술 트렌드를 선도하며, 창의적이고 혁신적인 아이디어로 차별화된 가치를 창출합니다.
                </p>
              </div>
            </div>
          </FadeSlideIn>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-success-600 mb-2">24/7</div>
                      <div className="text-sm text-neutral-600">기술 지원</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-700 mb-2">100+</div>
                      <div className="text-sm text-neutral-600">기업 파트너</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200/50 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-200/50 rounded-full blur-xl"></div>
              </div>
            </FadeSlideIn>
          </div>

          {/* Core Values */}
          <FadeSlideIn direction="up" delay={1.2}>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center group hover-lift">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Excellence</h3>
                <p className="text-neutral-600 text-sm">최고 품질의 서비스 제공</p>
              </div>

              <div className="text-center group hover-lift">
                <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Collaboration</h3>
                <p className="text-neutral-600 text-sm">팀워크와 소통 중시</p>
              </div>

              <div className="text-center group hover-lift">
                <div className="w-16 h-16 bg-gradient-to-r from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Innovation</h3>
                <p className="text-neutral-600 text-sm">창의적 사고와 혁신</p>
              </div>

              <div className="text-center group hover-lift">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-600 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Passion</h3>
                <p className="text-neutral-600 text-sm">열정과 책임감</p>
              </div>
            </div>
          </FadeSlideIn>
        </div>
      </section>

      {/* Business Areas Section - 리뉴얼된 디자인 */}
      <section id="business" className="py-24 bg-gradient-to-b from-white via-brand-50/20 to-neutral-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/30 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeSlideIn direction="up" delay={0.2}>
              <span className="inline-block px-6 py-3 glass rounded-full text-brand-700 text-sm font-medium mb-4 shadow-soft">
                Business Areas
              </span>
            </FadeSlideIn>
            <FadeSlideIn direction="up" delay={0.4}>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 font-display">
                <span className="gradient-text">
                  13년간의 혁신 여정
                </span><br />
                주요 사업영역
              </h2>
            </FadeSlideIn>
            <FadeSlideIn direction="up" delay={0.6}>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                2011년부터 축적된 기술력과 경험으로 다양한 분야에서 혁신을 이끌어온 성장 스토리
              </p>
            </FadeSlideIn>
          </div>

          <div className="space-y-12">
            <FadeSlideIn direction="up" delay={0.8}>
              <BusinessSection 
                image="/images/sphere-01.jpg"
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
                    "클라우드 기반 확장성"
                  ],
                  additionalInfo: "13년간의 데이터 처리 경험과 AI 기술력을 바탕으로 최고 품질의 학습 데이터를 제공합니다."
                }}
              />
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={1.0}>
              <BusinessSection 
                image="/images/sphere-02.jpg"
                title="SI (System Integration)"
                subtitle="시스템 통합 구축"
                description1="정보화 전략수립, 업무분석/설계/구축, 시스템 운영까지 전 과정 통합 서비스"
                description2={
                  <span>
                    금융·공공기관 등 다양한 SI사업 수행 경험으로 
                    <strong className="text-indigo-600"> 정보화 전략부터 통합 유지보수</strong>까지 제공
                  </span>
                }
                features={[
                  "정보화 전략/아키텍처 설계",
                  "DB설계, 솔루션 제공",
                  "H/W, S/W, 네트워크 통합",
                  "통합 유지보수",
                  "금융·공공기관 전문"
                ]}
                detailInfo={{
                  purpose: "정보화 전략, 아키텍처 설계, DB설계, 솔루션 제공, H/W, S/W, 네트워크 등 기반기술 통합 및 통합 유지보수까지 제공",
                  form: "전 과정 통합 서비스 (컨설팅부터 운영까지)",
                  target: "금융기관, 공공기관, 대기업",
                  keyFeatures: [
                    "엔터프라이즈 아키텍처 설계",
                    "레거시 시스템 현대화",
                    "클라우드 마이그레이션",
                    "24/7 운영 지원"
                  ],
                  additionalInfo: "신한은행, 하나은행, 우리은행 등 주요 금융기관과 13년간의 파트너십을 통해 검증된 SI 전문성을 보유하고 있습니다."
                }}
              />
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={1.2}>
              <BusinessSection 
                image="/images/sphere-03.jpg"
                title="E-Commerce Platform"
                subtitle="전자상거래 플랫폼 구축"
                description1="온라인 쇼핑몰, 결제 시스템, 상품관리, 주문/배송 등 전자상거래 전 과정 통합 솔루션"
                description2={
                  <span>
                    맞춤형 쇼핑몰 구축부터 마케팅 자동화까지 
                    <strong className="text-emerald-600"> 전자상거래 통합 솔루션</strong> 제공
                  </span>
                }
                features={[
                  "쇼핑몰 구축",
                  "결제/배송 연동",
                  "재고/주문 관리",
                  "마케팅 자동화",
                  "실시간 데이터 분석"
                ]}
                detailInfo={{
                  purpose: "온라인 쇼핑몰, 결제 시스템, 상품관리, 주문/배송 등 전자상거래 전 과정 통합 솔루션 제공",
                  form: "맞춤형 쇼핑몰 구축 + 통합 관리 시스템",
                  target: "리테일 기업, 스타트업, 중소기업, 대기업",
                  keyFeatures: [
                    "반응형 웹/모바일 최적화",
                    "다중 결제 게이트웨이 연동",
                    "실시간 재고 동기화",
                    "고객 행동 분석 및 추천 엔진"
                  ],
                  additionalInfo: "삼성닷컴 등 대형 이커머스 플랫폼 구축 경험을 바탕으로 안정적이고 확장 가능한 솔루션을 제공합니다."
                }}
              />
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={1.4}>
              <BusinessSection 
                image="/images/sphere-05.jpg"
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
                  "데이터 분석"
                ]}
                detailInfo={{
                  purpose: "AI 기반 챗봇, 고객상담 자동화, FAQ, 실시간 응대, 자연어 처리 기술 적용",
                  form: "다양한 채널(웹/모바일/메신저) 연동 챗봇 시스템",
                  target: "금융기관, 이커머스, 고객센터 운영 기업",
                  keyFeatures: [
                    "고도화된 자연어 이해 엔진",
                    "다국어 지원",
                    "감정 분석 기반 응답",
                    "실시간 학습 및 개선"
                  ],
                  additionalInfo: "신한은행 THE NEXT 등 금융권 챗봇 구축 경험을 통해 검증된 AI 기술력을 보유하고 있습니다."
                }}
              />
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={1.6}>
              <BusinessSection 
                image="/images/watch-03.jpg"
                title="Demand Prediction"
                subtitle="수요예측/AI 분석"
                description1="AI/머신러닝 기반 수요예측, 판매/재고/트렌드 분석, 비즈니스 의사결정 지원"
                description2={
                  <span>
                    빅데이터 분석과 예측모델 구축으로 
                    <strong className="text-amber-600"> 산업별 맞춤형 솔루션</strong> 제공
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
                  purpose: "AI/머신러닝 기반 수요예측, 판매/재고/트렌드 분석, 비즈니스 의사결정 지원",
                  form: "빅데이터 분석, 예측모델 구축, 실시간 대시보드 제공",
                  target: "제조업, 유통업, 금융업, 공공기관",
                  keyFeatures: [
                    "고급 머신러닝 알고리즘",
                    "실시간 데이터 처리",
                    "직관적인 시각화 대시보드",
                    "산업별 특화 모델"
                  ],
                  additionalInfo: "현대자동차, LG헬로비전 등의 수요예측 시스템 구축을 통해 다양한 산업 도메인 전문성을 확보했습니다."
                }}
              />
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={1.8}>
              <BusinessSection 
                image="/images/whatsapp-05.jpg"
                title="R&D Center"
                subtitle="기술연구소/신기술 개발"
                description1="AI, IoT, 빅데이터 등 신기술 연구개발, 특허/논문, 산학협력 프로젝트 수행"
                description2={
                  <span>
                    미래기술 연구와 산학협력을 통해 
                    <strong className="text-rose-600"> 혁신적 IT 서비스</strong> 창출
                  </span>
                }
                features={[
                  "신기술 연구",
                  "산학협력",
                  "특허/논문",
                  "미래기술 연구",
                  "혁신 IT 서비스"
                ]}
                detailInfo={{
                  purpose: "AI, IoT, 빅데이터 등 신기술 연구개발, 특허/논문, 산학협력 프로젝트 수행",
                  form: "미래기술 연구, 산학협력, 기술 특허/논문, 혁신적 IT 서비스 창출",
                  target: "대학교, 연구기관, 정부기관, 혁신기업",
                  keyFeatures: [
                    "차세대 AI 기술 연구",
                    "블록체인 및 IoT 플랫폼",
                    "오픈소스 기술 기여",
                    "기술 특허 및 논문 발표"
                  ],
                  additionalInfo: "국방기술품질원 등 정부기관과의 협력을 통해 국가 차원의 기술 혁신에 기여하고 있습니다."
                }}
              />
            </FadeSlideIn>
          </div>

          {/* Business Achievements */}
          <FadeSlideIn direction="up" delay={1.4}>
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 md:p-12 text-white">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4 font-space">사업 성과</h3>
                <p className="text-blue-200 text-lg">13년간 쌓아온 신뢰와 전문성의 결과</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                  <div className="text-blue-200">완료 프로젝트</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-400 mb-2">100+</div>
                  <div className="text-blue-200">기업 고객</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-400 mb-2">98%</div>
                  <div className="text-blue-200">고객 만족도</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-amber-400 mb-2">13년</div>
                  <div className="text-blue-200">업계 경험</div>
                </div>
              </div>
            </div>
          </FadeSlideIn>
        </div>
      </section>

      {/* Recruit Section */}
      <section id="recruit" className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeSlideIn direction="up" delay={0.2}>
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                Join Our Team
              </span>
            </FadeSlideIn>
            <FadeSlideIn direction="up" delay={0.4}>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-space">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  함께 성장할
                </span><br />
                인재를 찾습니다
              </h2>
            </FadeSlideIn>
            <FadeSlideIn direction="up" delay={0.6}>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                혁신적인 기술과 창의적인 아이디어로 미래를 만들어갈 동료를 기다립니다
              </p>
            </FadeSlideIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeSlideIn direction="up" delay={0.8}>
              <div className="group bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">프론트엔드 개발자</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  React, Vue.js 등 최신 프론트엔드 기술로 사용자 경험을 만드는 개발자
                </p>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    React, Vue.js, TypeScript
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    경력 2년 이상
                  </li>
                </ul>
              </div>
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={1.0}>
              <div className="group bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">백엔드 개발자</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Node.js, Python 등으로 안정적인 서버 시스템을 구축하는 개발자
                </p>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    Node.js, Python, Java
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    경력 3년 이상
                  </li>
                </ul>
              </div>
            </FadeSlideIn>

            <FadeSlideIn direction="up" delay={1.2}>
              <div className="group bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">UI/UX 디자이너</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  사용자 중심의 직관적이고 아름다운 디자인을 만드는 디자이너
                </p>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    Figma, Adobe Creative Suite
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    경력 2년 이상
                  </li>
                </ul>
              </div>
            </FadeSlideIn>
          </div>

          <div className="mt-16 text-center">
            <FadeSlideIn direction="up" delay={1.4}>
              <a 
                href="mailto:hankjae@db-info.co.kr"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                지원서 보내기
              </a>
            </FadeSlideIn>
          </div>
        </div>
      </section>

      {/* Contact Section - 리뉴얼된 디자인 */}
      <section id="contact" className="py-24 bg-gradient-to-br from-neutral-900 via-brand-900 to-accent-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeSlideIn direction="up" delay={0.2}>
              <span className="inline-block px-6 py-3 glass-strong text-brand-200 rounded-full text-sm font-medium mb-4 shadow-soft">
                Contact Us
              </span>
            </FadeSlideIn>
            <FadeSlideIn direction="up" delay={0.4}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
                프로젝트를 시작할<br />
                <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
                  준비가 되셨나요?
                </span>
              </h2>
            </FadeSlideIn>
            <FadeSlideIn direction="up" delay={0.6}>
              <p className="text-xl text-brand-100 max-w-3xl mx-auto leading-relaxed">
                전문가와 상담하고 맞춤형 솔루션을 받아보세요
              </p>
            </FadeSlideIn>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <FadeSlideIn direction="left" delay={0.8}>
              <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6">연락처 정보</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white shadow-glow">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">주소</h4>
                        <p className="text-brand-200">서울특별시 금천구 서부샛길 606</p>
                        <p className="text-brand-200">대성디폴리스 지식산업센터 B동 1410호</p>
                        <p className="text-brand-200 text-sm mt-1">지하철 1호선, 7호선 8번 출구 500m</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white shadow-glow">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">전화번호</h4>
                        <p className="text-brand-200">02-2025-8511 (전화)</p>
                        <p className="text-brand-200">02-2025-8512 (팩스)</p>
                        <p className="text-brand-200 text-sm">평일 9:00 - 18:00</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-xl flex items-center justify-center text-white shadow-glow">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">이메일</h4>
                        <p className="text-brand-200">hankjae@db-info.co.kr</p>
                        <p className="text-brand-200">6511kesuk@db-info.co.kr (관리이사)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-strong rounded-2xl p-8 shadow-glass">
                  <h3 className="text-xl font-bold text-white mb-4">영업시간</h3>
                  <div className="space-y-2 text-brand-200">
                    <div className="flex justify-between">
                      <span>월요일 - 금요일</span>
                      <span>09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>토요일</span>
                      <span>09:00 - 13:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>일요일 및 공휴일</span>
                      <span>휴무</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeSlideIn>

            <FadeSlideIn direction="right" delay={1.0}>
              <div className="glass-strong rounded-2xl p-8 shadow-glass">
                <h3 className="text-2xl font-bold text-white mb-6">프로젝트 문의</h3>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-200 mb-2">이름</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                        placeholder="홍길동"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-200 mb-2">회사명</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                        placeholder="회사명"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brand-200 mb-2">이메일</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                      placeholder="hankjae@db-info.co.kr"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brand-200 mb-2">전화번호</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                      placeholder="02-2025-8511"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brand-200 mb-2">프로젝트 유형</label>
                    <select className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent">
                      <option value="" className="bg-neutral-800">선택해주세요</option>
                      <option value="web" className="bg-neutral-800">웹 개발</option>
                      <option value="mobile" className="bg-neutral-800">모바일 앱</option>
                      <option value="database" className="bg-neutral-800">데이터베이스</option>
                      <option value="cloud" className="bg-neutral-800">클라우드 & DevOps</option>
                      <option value="design" className="bg-neutral-800">UI/UX 디자인</option>
                      <option value="consulting" className="bg-neutral-800">기술 컨설팅</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brand-200 mb-2">프로젝트 상세 내용</label>
                    <textarea 
                      rows={5}
                      className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
                      placeholder="프로젝트에 대한 자세한 내용을 알려주세요..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="btn-primary w-full hover-lift"
                  >
                    문의 보내기
                  </button>
                </form>
              </div>
            </FadeSlideIn>
          </div>

          <FadeSlideIn direction="up" delay={1.4}>
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-4 glass-strong rounded-2xl px-8 py-4 shadow-soft">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success-400 rounded-full animate-pulse-slow"></div>
                  <span className="text-white font-medium">24/7 기술 지원 운영 중</span>
                </div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-brand-200">평균 응답시간 2시간 이내</span>
                </div>
              </div>
            </div>
          </FadeSlideIn>
        </div>
      </section>
    </div>
  );
}