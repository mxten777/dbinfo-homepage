import BusinessSection from '../components/BusinessSection';

export default function Home() {
  return (
    <main className="min-h-[80vh] bg-gradient-to-br from-blue-50 to-cyan-50 p-0 md:p-8">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-16 px-4 md:px-8 text-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-indigo-50/50"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Main Title */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-3 mb-6 shadow-lg">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-700 tracking-wide">IT INNOVATION LEADER</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-blue-800 via-cyan-600 to-indigo-800 bg-clip-text mb-6 tracking-tight leading-tight">
              DB.INFO
            </h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
                <span className="text-xl md:text-2xl font-bold text-gray-700">Digital Transformation</span>
              </div>
              <div className="hidden md:block w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-3">
                <span className="text-xl md:text-2xl font-bold text-gray-700">AI Innovation</span>
                <div className="w-1 h-8 bg-gradient-to-b from-indigo-400 to-cyan-600 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-blue-800">13년간의 전문성</span>과 
            <span className="font-semibold text-cyan-600"> 혁신적 기술력</span>으로<br className="hidden md:inline"/>
            디지털 미래를 선도하는 <span className="font-semibold text-indigo-800">IT 솔루션 파트너</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <span className="flex items-center gap-3">
                사업영역 보기
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </span>
            </button>
            <button className="px-8 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-white/90 transition-all duration-300">
              회사소개 자세히
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">13+</div>
              <div className="text-sm text-gray-600">Years</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-cyan-600 mb-1">100+</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-indigo-600 mb-1">50+</div>
              <div className="text-sm text-gray-600">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* 회사소개(About Us) */}
      <section id="about" className="max-w-5xl mx-auto py-16 px-4">
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                About DB.INFO
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      디지털 혁신의 선도자
                    </span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    2011년부터 <span className="text-cyan-400 font-semibold">13년간</span> 축적된 기술력으로 
                    금융·공공·기업 분야의 <span className="text-white font-semibold">디지털 트랜스포메이션</span>을 이끌어왔습니다.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    <span className="text-cyan-400 font-semibold">AI, IoT, 빅데이터</span> 등 차세대 기술과 
                    <span className="text-white font-semibold"> 고객 중심의 혁신적 사고</span>로 
                    새로운 비즈니스 가치를 창출합니다.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                  <div className="text-cyan-400 text-2xl font-bold mb-1">13+</div>
                  <div className="text-gray-300 text-sm">Years Experience</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                  <div className="text-cyan-400 text-2xl font-bold mb-1">100+</div>
                  <div className="text-gray-300 text-sm">Projects</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                  <div className="text-cyan-400 text-2xl font-bold mb-1">50+</div>
                  <div className="text-gray-300 text-sm">Enterprise Clients</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                  <div className="text-cyan-400 text-2xl font-bold mb-1">24/7</div>
                  <div className="text-gray-300 text-sm">Support</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-sm">신뢰 기반 파트너십</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-sm">전문 인재 육성</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-sm">최신 기술 도입</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-sm">고객 가치 창출</span>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="text-right">
                  <div className="text-gray-400 text-sm">CEO</div>
                  <div className="text-white font-semibold">한규재</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Vision & Mission</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-3">
                Vision
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              <span className="font-semibold text-blue-800">고객의 데이터 가치 극대화</span>와 
              <span className="font-semibold text-cyan-700">IT 혁신</span>을 통한 
              <span className="font-semibold text-gray-800">미래 성장 동력 창출</span>
            </p>
          </div>

          {/* Mission Card */}
          <div className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent mb-3">
                Mission
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              <span className="font-semibold text-indigo-800">최고의 기술력</span>과 
              <span className="font-semibold text-purple-700">신뢰</span>를 바탕으로 
              <span className="font-semibold text-gray-800">고객의 성공을 지원하는 IT 파트너</span>
            </p>
          </div>
        </div>
      </section>

      {/* 연혁 */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our History</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg">13년간의 혁신 여정과 성장 스토리</p>
        </div>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-cyan-500 to-indigo-500 h-full rounded-full hidden md:block"></div>
          
          <div className="space-y-12">
            {/* 2024 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 md:text-right">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    2024
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">대기업 파트너십 확대</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">LG헬로비전, CJ올리브네트웍스 등 대형 프로젝트 수행으로 기업 규모 확장</p>
                </div>
              </div>
              <div className="hidden md:block w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full border-4 border-white shadow-lg z-10"></div>
              <div className="md:w-1/2"></div>
            </div>

            {/* 2023 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2 md:text-left">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    2023
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">다각화 전략 성공</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">국방기술품질원, 현대자동차, 삼성닷컴, KB증권, 하나은행 등 다양한 분야 진출</p>
                </div>
              </div>
              <div className="hidden md:block w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-4 border-white shadow-lg z-10"></div>
              <div className="md:w-1/2"></div>
            </div>

            {/* 2021-2022 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 md:text-right">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    2021-2022
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">핀테크 혁신 선도</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">마이데이타, 신한은행 THE NEXT, 농협금융 바젤 등 차세대 금융시스템 구축</p>
                </div>
              </div>
              <div className="hidden md:block w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full border-4 border-white shadow-lg z-10"></div>
              <div className="md:w-1/2"></div>
            </div>

            {/* 2011-2020 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2 md:text-left">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    2011-2020
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">기업 설립 및 성장</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">신한카드, 하나은행, 우리은행 등 주요 금융기관과의 파트너십으로 기반 구축</p>
                </div>
              </div>
              <div className="hidden md:block w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-4 border-white shadow-lg z-10"></div>
              <div className="md:w-1/2"></div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            주요 연혁은 공식 홈페이지 및 최근 프로젝트 기준 요약
          </div>
        </div>
      </section>

      {/* 조직도 */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Organization</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg">전문성과 혁신을 바탕으로 한 체계적 조직 구성</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Organization Chart Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-200 shadow-xl">
              {/* CEO */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">대표이사</h3>
                <p className="text-sm text-gray-600">한규재</p>
              </div>
              
              {/* Connection Line */}
              <div className="flex justify-center mb-6">
                <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
              
              {/* Departments */}
              <div className="grid grid-cols-3 gap-4">
                {/* 금융사업부 */}
                <div className="text-center">
                  <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                      </svg>
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 mb-1">금융사업부</h4>
                    <p className="text-xs text-gray-600">Banking & Finance</p>
                  </div>
                </div>
                
                {/* 공공사업부 */}
                <div className="text-center">
                  <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 mb-1">공공사업부</h4>
                    <p className="text-xs text-gray-600">Public Sector</p>
                  </div>
                </div>
                
                {/* 기술연구소 */}
                <div className="text-center">
                  <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                      </svg>
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 mb-1">기술연구소</h4>
                    <p className="text-xs text-gray-600">R&D Center</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Organization Details */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">조직 특성</h3>
              
              <div className="space-y-6">
                {/* 전문성 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">전문 인력 구성</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">각 사업부별 핵심 기술력과 도메인 전문성을 보유한 인재들로 구성</p>
                  </div>
                </div>
                
                {/* 혁신 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">품질 혁신</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">지속적인 품질 개선과 고객 만족을 위한 체계적 프로세스 운영</p>
                  </div>
                </div>
                
                {/* 미래기술 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">미래 기술 연구</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">AI, IoT, 빅데이터 등 차세대 기술 연구개발을 통한 미래 경쟁력 확보</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-2xl font-bold text-blue-700 mb-1">3</div>
                <div className="text-sm text-gray-600">사업부</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                <div className="text-2xl font-bold text-indigo-700 mb-1">30+</div>
                <div className="text-sm text-gray-600">전문 인력</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사업영역 */}
      <section id="business" className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-lg font-bold text-blue-700 mb-8">주요 사업영역</h2>
        {/* ...BusinessSection 컴포넌트들... */}
        <BusinessSection
          image="/images/sphere-01.jpg"
          title="AI DataSet Platform"
          subtitle="(인공지능 데이터셋 플랫폼)"
          description1="인공지능을 학습시키기 위해서 필수적으로 갖춰져야 할 것은 많은 양질의 데이터입니다. 데이터가 많을수록 학습의 정확도가 높아지고 예측을 더 정확하게 할 수 있습니다."
          description2={'기계 학습에 필요한 데이터를 수집하기 위해서는 엄청난 시간과 노력이 필요하지만 디비인포의 "인공지능 데이터셋 플랫폼"을 이용하여 손쉽게 모바일이나 웹상에서 공유되고 기록되는 정보와 데이터를 수집, 정제, 가공하여 양질의 데이터를 확보할 수 있습니다.'}
          features={["데이터 수집/정제/가공 자동화", "대용량 데이터 라벨링 및 품질 관리", "AI 학습 데이터셋 제공"]}
        />
        <BusinessSection
          image="/images/sphere-02.jpg"
          title="SI (System Integration)"
          subtitle="시스템 통합 구축"
          description1="정보화 전략수립, 업무분석/설계/구축, 시스템 운영까지 전 과정 통합 서비스. 금융·공공기관 등 다양한 SI사업 수행 경험."
          description2="정보화 전략, 아키텍처 설계, DB설계, 솔루션 제공, H/W, S/W, 네트워크 등 기반기술 통합 및 통합 유지보수까지 제공합니다."
          features={["정보화 전략/아키텍처 설계", "DB설계, 솔루션 제공", "H/W, S/W, 네트워크 통합", "통합 유지보수"]}
        />
        <BusinessSection
          image="/images/sphere-03.jpg"
          title="E-Commerce"
          subtitle="전자상거래 시스템 구축"
          description1="클라우드·빅데이터·AI 기반 전자상거래 시스템 구축, 머신러닝 기반 고객 행동 예측, 맞춤형 마케팅 및 데이터 분석."
          description2="AI 기반 고객 행동 예측, 데이터 분석/마케팅 자동화, 지도/비지도 학습 모델, 스마트 커머스 시스템 등 다양한 서비스를 제공합니다."
          features={["AI 기반 고객 행동 예측", "데이터 분석/마케팅 자동화", "지도/비지도 학습 모델", "스마트 커머스 시스템"]}
        />
        <BusinessSection
          image="/images/sphere-04.jpg"
          title="AI ChatBot Service"
          subtitle="인공지능 챗봇 서비스"
          description1="금융, 공공, 유통 등 다양한 산업에 적용 가능한 AI 챗봇. 시나리오 기반 대화, 상품 안내/구매/결제 등 시스템 연계."
          description2="시나리오 기반 챗봇, 다양한 메시지 응답, 기간계 시스템 연계, AI 기반 고객지원 등 다양한 기능을 제공합니다."
          features={["시나리오 기반 챗봇", "다양한 메시지 응답", "기간계 시스템 연계", "AI 기반 고객지원"]}
        />
        <BusinessSection
          image="/images/sphere-05.jpg"
          title="AI Demand Prediction"
          subtitle="인공지능 수요예측"
          description1="머신러닝 기반 수요예측 솔루션. 이벤트, 계절, 트렌드 등 다양한 변수 반영, 재고/자원 최적화."
          description2="수요예측 모델 개발, 재고/자원 최적화, 매출 증대 지원, 다양한 변수 반영 등 실질적 비즈니스 효과를 제공합니다."
          features={["수요예측 모델 개발", "재고/자원 최적화", "매출 증대 지원", "다양한 변수 반영"]}
        />
        <BusinessSection
          image="/images/sphere-06.jpg"
          title="AI Model 연구개발"
          subtitle="기술연구소"
          description1="자율주행, 드론, 로봇 등 미래 AI 기술 연구. 머신러닝/딥러닝 모델 개발 및 적용."
          description2="미래 AI 기술 연구, 머신러닝/딥러닝 모델, 산업별 AI 적용, 기술 세미나/교육 등 다양한 연구개발을 수행합니다."
          features={["미래 AI 기술 연구", "머신러닝/딥러닝 모델", "산업별 AI 적용", "기술 세미나/교육"]}
        />
      </section>

      {/* 구성원 */}
      <section className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-lg font-bold text-blue-700 mb-4">주요 구성원</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* 대표이사 카드 */}
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition">
            <div className="w-20 h-20 mb-3 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
              <img src="/images/president.jpg" alt="홍길동" className="w-full h-full object-cover rounded-full" onError={e => {e.currentTarget.src = 'https://em-content.zobj.net/thumbs/240/apple/354/man-office-worker_1f468-200d-1f4bc.png'}} />
            </div>
            <span className="text-2xl font-bold text-blue-800 mb-1">홍길동</span>
            <span className="text-sm font-semibold text-cyan-700 mb-2">대표이사</span>
            <span className="text-4xl">👨‍💼</span>
          </div>
          {/* 기술이사 카드 */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition">
            <div className="w-20 h-20 mb-3 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
              <img src="/images/tech-director.jpg" alt="김철수" className="w-full h-full object-cover rounded-full" onError={e => {e.currentTarget.src = 'https://em-content.zobj.net/thumbs/240/apple/354/man-technologist_1f468-200d-1f4bb.png'}} />
            </div>
            <span className="text-2xl font-bold text-blue-800 mb-1">김철수</span>
            <span className="text-sm font-semibold text-cyan-700 mb-2">기술이사</span>
            <span className="text-4xl">🧑‍💻</span>
          </div>
          {/* DB컨설턴트 카드 */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition">
            <div className="w-20 h-20 mb-3 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
              <img src="/images/db-consultant.jpg" alt="이영희" className="w-full h-full object-cover rounded-full" onError={e => {e.currentTarget.src = 'https://em-content.zobj.net/thumbs/240/apple/354/woman-office-worker_1f469-200d-1f4bc.png'}} />
            </div>
            <span className="text-2xl font-bold text-blue-800 mb-1">이영희</span>
            <span className="text-sm font-semibold text-cyan-700 mb-2">DB컨설턴트</span>
            <span className="text-4xl">👩‍💼</span>
          </div>
        </div>
      </section>

      {/* 채용정보(Recruit) */}
      <section id="recruit" className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-lg font-bold text-blue-700 mb-4">채용정보</h2>
        <p className="text-gray-800 mb-3">
          <span className="font-semibold text-blue-800">꿈과 미래가 있는 회사는 좋은 인재로부터 출발합니다.</span><br />
          디비인포는 건강한 사회인, 최고의 전문가를 지향하며, Global IT Leader를 향해 도전하는 창의적인 인재를 찾습니다.<br />
          자신의 꿈을 펼치고 싶은 분들의 많은 지원을 기다립니다.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-2 space-y-1">
          <li><span className="font-bold">채용절차:</span> 1차 서류전형(이메일접수: <a href="mailto:6511kesuk@db-info.co.kr" className="underline text-blue-600">6511kesuk@db-info.co.kr</a>) → 2차 면접전형</li>
          <li><span className="font-bold">모집시기:</span> 연중 수시모집(신입/경력)</li>
          <li><span className="font-bold">응시자격:</span> 나이/성별 무관, 전문대학/대학졸업 이상, Java/JSP/Pro*C/SQL 등 경력자 우대</li>
          <li><span className="font-bold">복리후생:</span> 4대보험, 장기근속/우수사원 포상, 퇴직금, 주5일근무, 정기/특별휴가, 각종 경조금</li>
          <li><span className="font-bold">제출서류:</span> 이력서(휴대전화, 희망연봉 명기)</li>
          <li><span className="font-bold">문의처:</span> 김애숙 이사, 02-780-0386</li>
        </ul>
        <div className="text-xs text-gray-500">* 자세한 내용은 공식 홈페이지 채용정보 참고</div>
      </section>

      {/* 연락처 */}
      <section className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-lg font-bold text-blue-700 mb-2">연락처 및 위치</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="mb-1">주소: 서울특별시 금천구 서부샛길 606, 대성디플리스 지식산업센터 B동 1410호</p>
          <p className="mb-1">대표전화: 02-1234-5678</p>
          <p className="mb-1">이메일: info@dbinfo.co.kr</p>
          <p className="mb-1">대중교통: 1호선, 7호선 8번 출구 500미터</p>
        </div>
      </section>

    </main>
  );
}
