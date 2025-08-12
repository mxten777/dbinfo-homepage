import BusinessSection from '../components/BusinessSection';
import { useState } from 'react';

export default function Home() {
  const [showAIDetail, setShowAIDetail] = useState(false);
  const [showSIDetail, setShowSIDetail] = useState(false);
  const [showECommerceDetail, setShowECommerceDetail] = useState(false);
  const [showChatBotDetail, setShowChatBotDetail] = useState(false);
  const [showDemandDetail, setShowDemandDetail] = useState(false);
  const [showRDDetail, setShowRDDetail] = useState(false);
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
          description1="AIDataHub – AI 개발을 위한 고품질 데이터셋을 쉽고 빠르게 확보하는 통합 데이터 플랫폼"
          description2={
            <>
              목적: 인공지능 학습에 필요한 데이터를 수집 → 정제 → 검증 → 제공까지 한 번에<br/>
              형태: 웹 기반 + API 기반 데이터 마켓플레이스<br/>
              대상 고객: AI 개발사, 데이터 과학자, 연구기관, 공공기관, 스타트업<br/>
              <button
                className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold shadow hover:scale-105 transition"
                onClick={() => setShowAIDetail(true)}
              >
                상세소개 보기
              </button>
            </>
          }
          features={["데이터 수집/정제/가공 자동화", "대용량 데이터 라벨링 및 품질 관리", "AI 학습 데이터셋 제공"]}
        />

      {/* AIDataHub 상세 모달 */}
      {showAIDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-indigo-100 bg-opacity-80 animate-fadein">
          <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh] border-2 border-blue-100">
            <h2 className="text-2xl font-extrabold text-blue-700 mb-4 text-center drop-shadow">AIDataHub 서비스 소개</h2>
            <div className="space-y-5 text-gray-900 text-[16px] leading-normal font-['Inter','Pretendard','Segoe UI',sans-serif]">
              <div className="space-y-2">
                <strong className="text-blue-700 text-lg md:text-xl">1. 서비스 개요</strong><br/>
                AIDataHub – AI 개발을 위한 고품질 데이터셋을 쉽고 빠르게 확보하는 통합 데이터 플랫폼<br/>
                목적: 인공지능 학습에 필요한 데이터를 수집 → 정제 → 검증 → 제공까지 한 번에<br/>
                형태: 웹 기반 + API 기반 데이터 마켓플레이스<br/>
                대상 고객: AI 개발사, 데이터 과학자, 연구기관, 공공기관, 스타트업
              </div>
              <div className="space-y-2">
                <strong className="text-blue-700 text-lg md:text-xl">2. 시장 배경</strong><br/>
                AI 학습 데이터는 양과 질이 모두 중요<br/>
                생성형 AI·자율주행·헬스케어 분야 데이터 수요 폭발<br/>
                데이터셋 제작·수집 비용이 높아 공유·거래 플랫폼 수요 증가<br/>
                글로벌 AI 데이터 시장<br/>
                → 2024년 25억 달러 규모, 연평균 성장률 25%+
              </div>
              <div className="space-y-2">
                <strong className="text-blue-700 text-lg md:text-xl">3. 주요 서비스</strong><br/>
                데이터셋 검색·다운로드<br/>
                이미지·텍스트·음성·영상·센서 데이터 지원<br/>
                데이터 품질검증<br/>
                자동 라벨 정확도 평가, 이상치 탐지, 중복 제거<br/>
                마켓플레이스<br/>
                데이터셋 거래, 판매자 수익 분배<br/>
                AI 라벨링·전처리<br/>
                AI 보조 라벨링, 데이터 증강, 포맷 변환<br/>
                API 실시간 제공<br/>
                데이터 스트리밍, 샘플링 API, SDK 연동<br/>
                커뮤니티 협업<br/>
                리뷰, 오픈데이터 공유, 공동 구축 프로젝트
              </div>
              <div className="space-y-2">
                <strong className="text-blue-700 text-lg md:text-xl">4. 서비스 흐름</strong><br/>
                데이터 제공자<br/>
                → 데이터 업로드 & 메타데이터 등록<br/>
                → 자동 품질검증 & 라벨 보정<br/>
                → 마켓플레이스 등록<br/>
                데이터 구매자<br/>
                → 검색 & 미리보기<br/>
                → 결제 후 다운로드 / API 호출<br/>
                → 데이터셋 프로젝트에 즉시 활용
              </div>
              <div className="space-y-2">
                <strong className="text-blue-700 text-lg md:text-xl">5. 경쟁력 포인트</strong><br/>
                원스톱 플랫폼: 수집부터 API 제공까지 한 번에<br/>
                품질 보장: AI 기반 품질검증 시스템<br/>
                다양한 과금 모델: 구독·건별·API 호출<br/>
                개방형 생태계: 누구나 데이터 공급자·소비자 가능<br/>
                빠른 확장성: 클라우드 기반 대용량 데이터 처리
              </div>
              <div className="space-y-2">
                <strong className="text-blue-700 text-lg md:text-xl">6. 수익 모델</strong><br/>
                구독형 요금제 (월/연 단위)<br/>
                건별 데이터 구매<br/>
                API 호출 과금<br/>
                전처리·라벨링 맞춤 서비스<br/>
                판매 수수료 (10~20%)
              </div>
              <div className="space-y-2">
                <strong className="text-blue-700 text-lg md:text-xl">7. 향후 확장 계획</strong><br/>
                B2G: 공공데이터와 연동해 공공기관 서비스 확장<br/>
                B2B: 기업 맞춤 데이터셋 제작·제공<br/>
                Global: 다국어 지원, 해외 결제, 각국 데이터 규제 준수<br/>
                AI 통합: 자체 모델 학습용 파이프라인 서비스 제공
              </div>
              <div className="space-y-2">
                <strong className="text-blue-700 text-lg md:text-xl">8. 비전</strong><br/>
                “데이터가 필요한 모든 사람과 데이터를 가진 모든 사람을 연결한다.”<br/>
                AIDataHub는 AI 혁신의 기초가 되는 데이터를 빠르고, 안전하고, 공정하게 제공합니다.
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 text-lg"
                onClick={() => setShowAIDetail(false)}
                aria-label="뒤로가기"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                뒤로가기
              </button>
            </div>
          </div>
        </div>
      )}
        <BusinessSection
          image="/images/sphere-02.jpg"
          title="SI (System Integration)"
          subtitle="시스템 통합 구축"
          description1="정보화 전략수립, 업무분석/설계/구축, 시스템 운영까지 전 과정 통합 서비스. 금융·공공기관 등 다양한 SI사업 수행 경험."
          description2={
            <>
              정보화 전략, 아키텍처 설계, DB설계, 솔루션 제공, H/W, S/W, 네트워크 등 기반기술 통합 및 통합 유지보수까지 제공합니다.<br/>
              <button
                className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow hover:scale-105 transition"
                onClick={() => setShowSIDetail(true)}
              >
                상세소개 보기
              </button>
            </>
          }
          features={["정보화 전략/아키텍처 설계", "DB설계, 솔루션 제공", "H/W, S/W, 네트워크 통합", "통합 유지보수"]}
        />
          {/* 하위 사업영역 복원 */}
          <BusinessSection
            image="/images/sphere-03.jpg"
            title="E-Commerce Platform"
            subtitle="전자상거래 플랫폼 구축"
            description1="온라인 쇼핑몰, 결제 시스템, 상품관리, 주문/배송 등 전자상거래 전 과정 통합 솔루션 제공."
              description2={
                <>
                  맞춤형 쇼핑몰 구축, 결제/배송 연동, 실시간 재고관리, 마케팅 자동화 등 다양한 기능 지원.<br/>
                  <button
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold shadow hover:scale-105 transition"
                    onClick={() => setShowECommerceDetail(true)}
                  >
                    상세소개 보기
                  </button>
                </>
              }
            features={["쇼핑몰 구축", "결제/배송 연동", "재고/주문 관리", "마케팅 자동화"]}
          />
          <BusinessSection
            image="/images/sphere-04.jpg"
            title="AI ChatBot Service"
            subtitle="챗봇/상담 자동화"
            description1="AI 기반 챗봇, 고객상담 자동화, FAQ, 실시간 응대, 자연어 처리 기술 적용."
              description2={
                <>
                  다양한 채널(웹/모바일/메신저) 연동, 사용자 맞춤형 답변, 데이터 분석 기반 서비스 개선.<br/>
                  <button
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow hover:scale-105 transition"
                    onClick={() => setShowChatBotDetail(true)}
                  >
                    상세소개 보기
                  </button>
                </>
              }
            features={["AI 챗봇", "상담 자동화", "다채널 연동", "데이터 분석"]}
          />
          <BusinessSection
            image="/images/pattern-01.jpg"
            title="Demand Prediction"
            subtitle="수요예측/AI 분석"
            description1="AI/머신러닝 기반 수요예측, 판매/재고/트렌드 분석, 비즈니스 의사결정 지원."
              description2={
                <>
                  빅데이터 분석, 예측모델 구축, 실시간 대시보드 제공, 산업별 맞춤형 솔루션.<br/>
                  <button
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold shadow hover:scale-105 transition"
                    onClick={() => setShowDemandDetail(true)}
                  >
                    상세소개 보기
                  </button>
                </>
              }
            features={["수요예측", "빅데이터 분석", "실시간 대시보드", "산업별 맞춤 솔루션"]}
          />
          <BusinessSection
            image="/images/pattern-02.jpg"
            title="R&D Center"
            subtitle="기술연구소/신기술 개발"
            description1="AI, IoT, 빅데이터 등 신기술 연구개발, 특허/논문, 산학협력 프로젝트 수행."
              description2={
                <>
                  미래기술 연구, 산학협력, 기술 특허/논문, 혁신적 IT 서비스 창출.<br/>
                  <button
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-bold shadow hover:scale-105 transition"
                    onClick={() => setShowRDDetail(true)}
                  >
                    상세소개 보기
                  </button>
                </>
              }
            features={["신기술 연구", "산학협력", "특허/논문", "혁신 IT 서비스"]}
          />
        {/* SI 상세소개 모달 */}
        {showSIDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 bg-opacity-80 animate-fadein">
            <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh] border-2 border-indigo-100">
              <h2 className="text-2xl font-extrabold text-indigo-700 mb-4 text-center drop-shadow">SI(System Integration) – 시스템 통합 구축 소개자료</h2>
              <div className="space-y-5 text-gray-900 text-[16px] leading-normal font-['Inter','Pretendard','Segoe UI',sans-serif]">
                <div className="space-y-2">
                  <strong className="text-indigo-700 text-lg md:text-xl">1. 서비스 개요</strong><br/>
                  SI(System Integration) 서비스는 정보화 전략 수립부터 시스템 운영까지 전 과정을 하나의 흐름으로 연결해 맞춤형 IT 통합 솔루션을 제공합니다.<br/>
                  금융, 공공기관, 제조, 유통 등 다양한 산업에서 축적된 경험을 바탕으로 안정적이고 확장 가능한 시스템을 구축합니다.
                </div>
                <div className="space-y-2">
                  <strong className="text-indigo-700 text-lg md:text-xl">2. 제공 범위</strong><br/>
                  <span className="font-semibold">정보화 전략 수립</span><br/>
                  경영목표·업무환경 분석<br/>
                  중·장기 IT 로드맵 제안<br/>
                  디지털 전환(DX) 전략 컨설팅<br/>
                  <span className="font-semibold">업무 분석 및 설계</span><br/>
                  현행 시스템 분석(AS-IS)<br/>
                  개선 목표 및 신규 시스템 요구사항 정의(TO-BE)<br/>
                  프로세스 최적화 및 표준화 설계<br/>
                  <span className="font-semibold">시스템 구축</span><br/>
                  아키텍처 설계 (애플리케이션·데이터·기술 구조)<br/>
                  DB 설계 (논리/물리 구조, 최적화)<br/>
                  솔루션 제공 (ERP, MES, CRM, 전자정부 표준프레임워크 등)<br/>
                  H/W, S/W, 네트워크 등 인프라 통합 구축<br/>
                  <span className="font-semibold">시스템 운영 및 유지보수</span><br/>
                  운영 모니터링, 장애 대응, 성능 개선<br/>
                  버전 업그레이드 및 기능 확장<br/>
                  SLA 기반 기술지원
                </div>
                <div className="space-y-2">
                  <strong className="text-indigo-700 text-lg md:text-xl">3. 핵심 특징</strong><br/>
                  <span className="font-semibold">전 과정 통합 서비스</span>: 전략 → 설계 → 구축 → 운영까지 원스톱 제공<br/>
                  <span className="font-semibold">다양한 산업 경험</span>: 금융, 공공기관, 제조, 유통 등 프로젝트 수행<br/>
                  <span className="font-semibold">최신 기술 적용</span>: 클라우드, AI, 빅데이터, IoT 등 차세대 IT 기술 반영<br/>
                  <span className="font-semibold">안정성과 확장성 보장</span>: 대규모 트랜잭션 처리 경험 및 보안/성능 최적화
                </div>
                <div className="space-y-2">
                  <strong className="text-indigo-700 text-lg md:text-xl">4. 주요 기능 & 특징 (Features)</strong><br/>
                  <span className="font-semibold">정보화 전략 / 아키텍처 설계</span><br/>
                  → 조직의 비전과 목표에 부합하는 IT 전략과 구조 설계<br/>
                  <span className="font-semibold">DB 설계, 솔루션 제공</span><br/>
                  → 데이터 모델링, 최적화 설계, 맞춤형 솔루션 제안<br/>
                  <span className="font-semibold">H/W, S/W, 네트워크 통합</span><br/>
                  → 전산 장비, 소프트웨어, 네트워크 인프라 통합 구축<br/>
                  <span className="font-semibold">통합 유지보수</span><br/>
                  → 예방 점검, 장애 대응, 성능 모니터링, 지속적 개선
                </div>
                <div className="space-y-2">
                  <strong className="text-indigo-700 text-lg md:text-xl">5. 서비스 적용 사례</strong><br/>
                  <span className="font-semibold">금융권 차세대 시스템</span><br/>
                  온라인 거래 처리 속도 40% 개선, 보안 수준 향상<br/>
                  <span className="font-semibold">공공기관 정보화 사업</span><br/>
                  전자정부 표준프레임워크 기반 시스템 고도화<br/>
                  <span className="font-semibold">제조업 MES 구축</span><br/>
                  생산 효율 20% 향상, 불량률 15% 감소<br/>
                  <span className="font-semibold">유통 ERP 통합</span><br/>
                  물류·재고 실시간 관리, 매출 데이터 분석 자동화
                </div>
                <div className="space-y-2">
                  <strong className="text-indigo-700 text-lg md:text-xl">6. 기대 효과</strong><br/>
                  <span className="font-semibold">운영 효율성 극대화</span>: 업무 프로세스 자동화 및 표준화<br/>
                  <span className="font-semibold">비용 절감</span>: 유지보수·업그레이드 비용 절감<br/>
                  <span className="font-semibold">확장성 강화</span>: 향후 신규 서비스 및 기능 추가 용이<br/>
                  <span className="font-semibold">보안·안정성 확보</span>: 최신 보안 규격 및 인프라 설계
                </div>
                <div className="space-y-2">
                  <strong className="text-indigo-700 text-lg md:text-xl">7. 비전</strong><br/>
                  “기술과 비즈니스를 연결하는 시스템 통합 파트너”<br/>
                  고객의 비즈니스 목표를 달성하는 맞춤형 통합 솔루션을 제공합니다.
                </div>
                <div className="flex justify-center mt-8">
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-lg"
                    onClick={() => setShowSIDetail(false)}
                    aria-label="뒤로가기"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    뒤로가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* E-Commerce 상세소개 모달 */}
        {showECommerceDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-100 to-blue-100 bg-opacity-80 animate-fadein">
            <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh] border-2 border-emerald-100">
              <h2 className="text-2xl font-extrabold text-emerald-700 mb-4 text-center drop-shadow">E-Commerce Platform – 전자상거래 플랫폼 구축 소개자료</h2>
              <div className="space-y-5 text-gray-900 text-[16px] leading-normal font-['Inter','Pretendard','Segoe UI',sans-serif]">
                <div className="space-y-2">
                  <strong className="text-emerald-700 text-lg md:text-xl">1. 서비스 개요</strong><br/>
                  E-Commerce Platform 서비스는<br/>
                  온라인 쇼핑몰 기획부터 상품 등록·결제·배송·마케팅까지 전자상거래 전 과정을 통합 제공하는 원스톱 솔루션입니다.<br/>
                  고객의 비즈니스 특성에 맞춘 맞춤형 쇼핑몰 구축과 안정적인 결제/배송 연동, 실시간 재고·주문 관리, 마케팅 자동화 기능을 지원합니다.
                </div>
                <div className="space-y-2">
                  <strong className="text-emerald-700 text-lg md:text-xl">2. 제공 범위</strong><br/>
                  <span className="font-semibold">맞춤형 쇼핑몰 구축</span><br/>
                  브랜드 맞춤 UI/UX 디자인<br/>
                  반응형 웹/모바일 최적화<br/>
                  멀티 카테고리, 다국어/다통화 지원<br/>
                  <span className="font-semibold">결제·배송 연동</span><br/>
                  다양한 결제수단 지원(신용카드, 간편결제, 해외결제)<br/>
                  국내외 배송사 API 연동(실시간 배송 추적)<br/>
                  주문·배송 상태 자동 업데이트<br/>
                  <span className="font-semibold">재고·주문 관리</span><br/>
                  실시간 재고 동기화<br/>
                  주문 처리 자동화<br/>
                  반품·교환 프로세스 관리<br/>
                  <span className="font-semibold">마케팅 자동화</span><br/>
                  쿠폰·할인·적립금 시스템<br/>
                  이메일/SMS/푸시 마케팅<br/>
                  광고 성과 분석 대시보드
                </div>
                <div className="space-y-2">
                  <strong className="text-emerald-700 text-lg md:text-xl">3. 핵심 특징</strong><br/>
                  <span className="font-semibold">통합 전자상거래 솔루션</span><br/>
                  기획 → 구축 → 운영 → 마케팅까지 원스톱 제공<br/>
                  <span className="font-semibold">확장성 높은 구조</span><br/>
                  소규모 쇼핑몰부터 대규모 마켓플레이스까지 대응<br/>
                  <span className="font-semibold">사용자 친화적 UI</span><br/>
                  쉽고 직관적인 관리자 페이지 제공<br/>
                  <span className="font-semibold">글로벌 지원</span><br/>
                  다국어, 다통화, 해외 결제·배송 연동 가능
                </div>
                <div className="space-y-2">
                  <strong className="text-emerald-700 text-lg md:text-xl">4. 주요 기능 (Features)</strong><br/>
                  <span className="font-semibold">쇼핑몰 구축</span><br/>
                  → 디자인, 기능, 사용자 경험까지 브랜드 맞춤형 구현<br/>
                  <span className="font-semibold">결제/배송 연동</span><br/>
                  → 안정적이고 다양한 결제수단, 배송사 연동<br/>
                  <span className="font-semibold">재고/주문 관리</span><br/>
                  → 실시간 재고, 주문, 반품·교환 관리<br/>
                  <span className="font-semibold">마케팅 자동화</span><br/>
                  → 프로모션, CRM, 성과 분석, 리타겟팅 지원
                </div>
                <div className="space-y-2">
                  <strong className="text-emerald-700 text-lg md:text-xl">5. 서비스 적용 사례</strong><br/>
                  <span className="font-semibold">패션 쇼핑몰 구축</span><br/>
                  시즌별 컬렉션 자동 업데이트, 인플루언서 마케팅 연동<br/>
                  <span className="font-semibold">전자제품 전문몰</span><br/>
                  실시간 재고·배송 상태 추적, 보증기간 알림<br/>
                  <span className="font-semibold">해외 직구몰</span><br/>
                  다국어·다통화·국제배송 API 완비<br/>
                  <span className="font-semibold">지역 특산품 마켓</span><br/>
                  로컬 판매자 입점형 마켓플레이스 구현
                </div>
                <div className="space-y-2">
                  <strong className="text-emerald-700 text-lg md:text-xl">6. 기대 효과</strong><br/>
                  <span className="font-semibold">매출 증대</span>: 효율적인 주문·재고 관리와 마케팅 자동화로 판매 극대화<br/>
                  <span className="font-semibold">운영 효율화</span>: 결제·배송·CS까지 통합 관리로 업무 시간 단축<br/>
                  <span className="font-semibold">고객 경험 향상</span>: 빠른 결제, 정확한 배송, 개인화 추천 제공<br/>
                  <span className="font-semibold">글로벌 확장 용이</span>: 해외 결제·배송·언어 지원으로 시장 확대
                </div>
                <div className="space-y-2">
                  <strong className="text-emerald-700 text-lg md:text-xl">7. 비전</strong><br/>
                  “판매와 고객을 잇는 최적의 전자상거래 인프라”<br/>
                  기술과 디자인, 마케팅이 결합된 통합형 이커머스 플랫폼을 제공합니다.
                </div>
                <div className="flex justify-center mt-8">
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 text-lg"
                    onClick={() => setShowECommerceDetail(false)}
                    aria-label="뒤로가기"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    뒤로가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ChatBot 상세소개 모달 */}
        {showChatBotDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-cyan-100 bg-opacity-80 animate-fadein">
            <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh] border-2 border-indigo-100">
              <h2 className="text-2xl font-extrabold text-indigo-700 mb-4 text-center drop-shadow">AI ChatBot Service – 챗봇/상담 자동화 상세소개</h2>
              <div className="space-y-5 text-gray-900 text-[16px] leading-normal font-['Inter','Pretendard','Segoe UI',sans-serif]">
                <div>
                  <strong className="text-indigo-700 text-lg md:text-xl">1. 서비스 개요</strong><br />
                  AI ChatBot Service는<br />
                  AI 기반 자연어 처리(NLP) 기술을 활용하여 고객 상담을 자동화하고, 실시간 응대와 맞춤형 답변을 제공하는 지능형 상담 솔루션입니다.<br />
                  웹·모바일·메신저 등 다양한 채널과 연동되며, 데이터 분석을 통해 지속적으로 응답 품질과 서비스 효율을 개선합니다.
                </div>
                <div>
                  <strong className="text-indigo-700 text-lg md:text-xl">2. 제공 범위</strong><br />
                  <ul className="list-disc ml-5">
                    <li>AI 챗봇 구축</li>
                    <li>자연어 처리(NLP) 기반 대화 엔진</li>
                    <li>고객 맞춤형 답변 시나리오 설계</li>
                    <li>다국어 지원 가능(한국어·영어·일본어 등)</li>
                    <li>상담 자동화</li>
                    <li>FAQ 자동응답</li>
                    <li>예약·주문·결제 등 프로세스 자동화</li>
                    <li>24/7 무중단 상담 서비스</li>
                    <li>다채널 연동</li>
                    <li>웹사이트, 모바일 앱, 카카오톡·네이버톡·WhatsApp·Slack 등 메신저 연동</li>
                    <li>API 기반 외부 시스템 연계(CRM, ERP, 결제, 배송 등)</li>
                    <li>데이터 분석</li>
                    <li>대화 로그 분석으로 고객 니즈 파악</li>
                    <li>응답 정확도·만족도 분석</li>
                    <li>개선 포인트 자동 추천</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-indigo-700 text-lg md:text-xl">3. 핵심 특징</strong><br />
                  <ul className="list-disc ml-5">
                    <li>지능형 자연어 처리: 대화 맥락 이해 및 의도 분석, 오타/방언 인식 가능</li>
                    <li>24시간 무중단 서비스: 언제든 고객 문의에 즉시 대응</li>
                    <li>다양한 채널·시스템 연계: 기존 업무 시스템과 매끄럽게 통합</li>
                    <li>데이터 기반 서비스 개선: 대화 데이터 분석으로 지속적인 품질 향상</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-indigo-700 text-lg md:text-xl">4. 주요 기능 (Features)</strong><br />
                  <ul className="list-disc ml-5">
                    <li>AI 챗봇<br />→ NLP 기반 대화 모델, 맞춤형 답변 시나리오</li>
                    <li>상담 자동화<br />→ 주문·예약·CS처리 자동화</li>
                    <li>다채널 연동<br />→ 웹·모바일·메신저 API 연동</li>
                    <li>데이터 분석<br />→ 대화 로그 분석, 고객 니즈 반영</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-indigo-700 text-lg md:text-xl">5. 서비스 적용 사례</strong><br />
                  <ul className="list-disc ml-5">
                    <li>전자상거래 고객센터<br />상품 문의·배송 조회·반품 요청 자동 처리</li>
                    <li>금융기관 챗봇<br />계좌 조회·상품 안내·대출 상담 자동화</li>
                    <li>공공기관 민원 상담<br />민원 안내·서류 제출 방법 안내·예약 접수</li>
                    <li>교육 플랫폼<br />강좌 안내·수강 신청·학습 피드백 자동화</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-indigo-700 text-lg md:text-xl">6. 기대 효과</strong><br />
                  <ul className="list-disc ml-5">
                    <li>운영 효율 향상: 상담 인력 부담 경감, 응대 속도 향상</li>
                    <li>고객 만족도 상승: 신속·정확한 맞춤형 응대 제공</li>
                    <li>비용 절감: 반복 업무 자동화로 운영 비용 절감</li>
                    <li>서비스 개선 가속화: 데이터 분석 기반 지속적 고도화</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-indigo-700 text-lg md:text-xl">7. 비전</strong><br />
                  “대화 그 이상의 가치를 제공하는 AI 상담 파트너”<br />
                  고객 경험 혁신과 기업 운영 효율화를 동시에 실현합니다.
                </div>
                <div className="flex justify-center mt-8">
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 text-lg"
                    onClick={() => setShowChatBotDetail(false)}
                    aria-label="뒤로가기"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    뒤로가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Demand Prediction 상세소개 모달 */}
        {showDemandDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-indigo-100 bg-opacity-80 animate-fadein">
            <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh] border-2 border-blue-100">
              <h2 className="text-2xl font-extrabold text-blue-700 mb-4 text-center drop-shadow">Demand Prediction – 수요예측/AI 분석 상세소개</h2>
              <div className="space-y-5 text-gray-900 text-[16px] leading-normal font-['Inter','Pretendard','Segoe UI',sans-serif]">
                <div>
                  <strong className="text-blue-700 text-lg md:text-xl">1. 서비스 개요</strong><br />
                  Demand Prediction 서비스는<br />
                  AI/머신러닝 기반 예측 모델과 빅데이터 분석 기술을 활용하여 판매·재고·트렌드 변화를 사전에 파악하고,<br />
                  비즈니스 의사결정을 지원하는 산업 맞춤형 예측 솔루션입니다.<br />
                  실시간 대시보드와 시뮬레이션 기능으로 빠르고 정확한 경영 판단이 가능합니다.
                </div>
                <div>
                  <strong className="text-blue-700 text-lg md:text-xl">2. 제공 범위</strong><br />
                  <ul className="list-disc ml-5">
                    <li>수요예측<br />AI·머신러닝 기반 시계열 예측<br />계절성·이벤트·트렌드 반영<br />예측 정확도 지속 개선</li>
                    <li>빅데이터 분석<br />판매·재고·마케팅 데이터 통합 분석<br />외부 요인(날씨·경제지표·SNS 트렌드) 반영<br />데이터 전처리·클렌징 자동화</li>
                    <li>실시간 대시보드<br />예측 결과 시각화<br />KPI 모니터링 및 알림<br />사용자별 맞춤형 데이터 뷰</li>
                    <li>산업별 맞춤 솔루션<br />제조·유통·패션·식품·에너지·교통 등 산업별 모델 최적화<br />비즈니스 특성에 따른 커스터마이징</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-blue-700 text-lg md:text-xl">3. 핵심 특징</strong><br />
                  <ul className="list-disc ml-5">
                    <li>AI/ML 고도화 모델: 다양한 알고리즘(XGBoost, Prophet, LSTM 등) 적용</li>
                    <li>데이터 통합 분석: 내부·외부 데이터 동시 반영</li>
                    <li>실시간 대응: 수요 변화에 즉각적인 경영 전략 수립 가능</li>
                    <li>산업 맞춤형 최적화: 업종별 특성에 따른 전용 모델 개발</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-blue-700 text-lg md:text-xl">4. 주요 기능 (Features)</strong><br />
                  <ul className="list-disc ml-5">
                    <li>수요예측<br />→ 판매·재고·이벤트 기반 AI 예측 모델</li>
                    <li>빅데이터 분석<br />→ 다원적 데이터 통합·패턴 분석</li>
                    <li>실시간 대시보드<br />→ 시각화, KPI 알림, 실시간 모니터링</li>
                    <li>산업별 맞춤 솔루션<br />→ 업종별 전용 알고리즘 설계</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-blue-700 text-lg md:text-xl">5. 서비스 적용 사례</strong><br />
                  <ul className="list-disc ml-5">
                    <li>유통업: 재고 부족·과잉 방지, 신상품 출시 타이밍 예측</li>
                    <li>제조업: 원자재 발주 최적화, 생산 스케줄 자동화</li>
                    <li>패션·리테일: 시즌별 수요 예측, 세일 전략 수립</li>
                    <li>에너지 산업: 전력 수요 예측, 공급 계획 최적화</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-blue-700 text-lg md:text-xl">6. 기대 효과</strong><br />
                  <ul className="list-disc ml-5">
                    <li>재고·운영 비용 절감: 불필요한 재고 감소</li>
                    <li>매출 증대: 판매 타이밍 최적화로 매출 극대화</li>
                    <li>위험 최소화: 수요 변동에 대한 사전 대응</li>
                    <li>데이터 기반 경영: 직관이 아닌 데이터 중심 의사결정</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-blue-700 text-lg md:text-xl">7. 비전</strong><br />
                  “미래를 예측하고 기회를 창출하는 AI 분석 파트너”<br />
                  데이터와 AI로 비즈니스 경쟁력을 강화합니다.
                </div>
                <div className="flex justify-center mt-8">
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 text-lg"
                    onClick={() => setShowDemandDetail(false)}
                    aria-label="뒤로가기"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    뒤로가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* R&D 상세소개 모달 */}
        {showRDDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-100 to-yellow-100 bg-opacity-80 animate-fadein">
            <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh] border-2 border-orange-100">
              <h2 className="text-2xl font-extrabold text-orange-700 mb-4 text-center drop-shadow">연구개발 센터 – 기술연구소/신기술 개발 상세소개</h2>
              <div className="space-y-5 text-gray-900 text-[16px] leading-normal font-['Inter','Pretendard','Segoe UI',sans-serif]">
                <div>
                  <strong className="text-orange-700 text-lg md:text-xl">1. 센터 개요</strong><br />
                  연구개발 센터는<br />
                  AI, IoT, 빅데이터 등 첨단 기술 분야에서 신기술 연구개발, 특허·논문 창출, 산학협력 프로젝트를 수행하며,<br />
                  미래지향적인 혁신 IT 서비스를 창출하는 기술혁신 거점입니다.
                </div>
                <div>
                  <strong className="text-orange-700 text-lg md:text-xl">2. 주요 연구 분야</strong><br />
                  <ul className="list-disc ml-5">
                    <li>신기술 연구<br />인공지능(AI) 알고리즘 개발<br />사물인터넷(IoT) 융합 솔루션<br />빅데이터 분석 및 예측 모델<br />클라우드·엣지 컴퓨팅 기술</li>
                    <li>산학협력<br />국내외 대학·연구기관 공동 연구<br />기업 맞춤형 기술 이전<br />정부·지자체 R&D 과제 수행</li>
                    <li>특허/논문<br />핵심 기술 특허 출원 및 등록<br />국제 학술지 논문 발표<br />기술 표준화 및 인증 취득</li>
                    <li>혁신적 IT 서비스 창출<br />AI·IoT 기반 신사업 모델 발굴<br />스마트 제조·헬스케어·에너지 분야 솔루션<br />디지털 전환(DX) 플랫폼 개발</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-orange-700 text-lg md:text-xl">3. 핵심 특징</strong><br />
                  <ul className="list-disc ml-5">
                    <li>미래지향 기술개발: 산업 트렌드를 선도하는 차세대 기술 연구</li>
                    <li>산학연 네트워크: 대학·연구기관·기업과의 협력 생태계 구축</li>
                    <li>지식재산 창출: 특허·논문·기술 인증을 통한 기술 자산 확보</li>
                    <li>사업화 연계: 연구성과를 실제 서비스·제품으로 상용화</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-orange-700 text-lg md:text-xl">4. 주요 활동 (Features)</strong><br />
                  <ul className="list-disc ml-5">
                    <li>신기술 연구<br />→ AI, IoT, 빅데이터, 클라우드, 로보틱스</li>
                    <li>산학협력<br />→ 공동연구, 기술 이전, 인재 양성</li>
                    <li>특허/논문<br />→ 지식재산권 창출, 국제 학술 발표</li>
                    <li>혁신적인 IT 서비스<br />→ 연구성과의 산업화 및 신사업 발굴</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-orange-700 text-lg md:text-xl">5. 연구성과 사례</strong><br />
                  <ul className="list-disc ml-5">
                    <li>AI 영상분석 기술 특허 등록<br />스마트 시티 교통 모니터링에 적용</li>
                    <li>IoT 기반 스마트 팜 솔루션 개발<br />작물 생산량 30% 향상</li>
                    <li>빅데이터 기반 예측 분석 플랫폼<br />제조 불량률 15% 감소</li>
                    <li>산학협력 과제<br />○○대학교와 공동 개발한 의료 영상 분석 AI</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-orange-700 text-lg md:text-xl">6. 기대 효과</strong><br />
                  <ul className="list-disc ml-5">
                    <li>기술 경쟁력 강화: 차별화된 기술 확보</li>
                    <li>지속가능한 혁신: 신기술 기반 신사업 창출</li>
                    <li>산업 발전 기여: 다양한 산업에 기술 확산</li>
                    <li>글로벌 진출 가능성 확대: 해외 인증·표준화 기반 진출</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-orange-700 text-lg md:text-xl">7. 비전</strong><br />
                  “연구와 혁신으로 미래를 설계하는 기술의 중심”<br />
                  새로운 가치를 창출하는 차세대 IT 연구개발 허브가 됩니다.
                </div>
                <div className="flex justify-center mt-8">
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-orange-700 hover:to-red-700 transition-all duration-300 text-lg"
                    onClick={() => setShowRDDetail(false)}
                    aria-label="뒤로가기"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    뒤로가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 구성원 */}
      <section className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-lg font-bold text-blue-700 mb-4">주요 구성원</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* 대표이사 카드 */}
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition">
            <div className="w-20 h-20 mb-3 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
              <img src="/images/president.jpg" alt="한규재" className="w-full h-full object-cover rounded-full" onError={e => {e.currentTarget.src = 'https://em-content.zobj.net/thumbs/240/apple/354/man-office-worker_1f468-200d-1f4bc.png'}} />
            </div>
            <span className="text-2xl font-bold text-blue-800 mb-1">한규재</span>
            <span className="text-sm font-semibold text-cyan-700 mb-2">대표이사</span>
            <span className="text-4xl">👨‍💼</span>
          </div>
          {/* 기술이사 카드 */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition">
            <div className="w-20 h-20 mb-3 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
              <img src="/images/tech-director.jpg" alt="김종악" className="w-full h-full object-cover rounded-full" onError={e => {e.currentTarget.src = 'https://em-content.zobj.net/thumbs/240/apple/354/man-technologist_1f468-200d-1f4bb.png'}} />
            </div>
            <span className="text-2xl font-bold text-blue-800 mb-1">김종악</span>
            <span className="text-sm font-semibold text-cyan-700 mb-2">기술이사</span>
            <span className="text-4xl">🧑‍💻</span>
          </div>
          {/* 관리이사 카드 */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition">
            <div className="w-20 h-20 mb-3 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
              <img src="/images/db-consultant.jpg" alt="김애숙" className="w-full h-full object-cover rounded-full" onError={e => {e.currentTarget.src = 'https://em-content.zobj.net/thumbs/240/apple/354/woman-office-worker_1f469-200d-1f4bc.png'}} />
            </div>
            <span className="text-2xl font-bold text-blue-800 mb-1">김애숙</span>
            <span className="text-sm font-semibold text-cyan-700 mb-2">관리이사</span>
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
