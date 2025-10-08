'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for better performance
const ModernHeader = dynamic(() => import('@/components/layout/ModernHeader'), { 
  ssr: false,
  loading: () => <div className="h-16 bg-white shadow-sm animate-pulse"></div>
});

const ModernBusinessSection = dynamic(() => import('@/components/sections/ModernBusinessSection'), {
  ssr: false,
  loading: () => <div className="py-20 bg-gray-50 animate-pulse"></div>
});

const ChatSystem = dynamic(() => import('@/components/chat/ChatSystem').then(mod => ({ default: mod.ChatSystem })), { 
  ssr: false 
});

const NotificationSystem = dynamic(() => import('@/components/notification/NotificationSystem').then(mod => ({ default: mod.NotificationSystem })), { 
  ssr: false 
});



export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Suspense fallback={<div className="h-16 bg-white shadow-sm animate-pulse"></div>}>
        <ModernHeader />
      </Suspense>
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* 반응형 배경 패턴 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 left-5 w-48 h-48 md:top-10 md:left-10 md:w-96 md:h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-5 right-5 w-40 h-40 md:bottom-10 md:right-10 md:w-80 md:h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 md:left-1/3 md:w-64 md:h-64 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="mb-8 sm:mb-12">
              <span className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-md rounded-full text-blue-100 text-sm sm:text-lg font-bold mb-6 sm:mb-8 border border-white/20">
                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="hidden sm:inline">2011년부터 13년간의 IT 전문성</span>
                <span className="sm:hidden">13년 IT 전문성</span>
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 sm:mb-8 leading-none bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent px-2">
              DB.INFO
            </h1>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-6 sm:mb-8 text-blue-200 leading-tight px-4">
              디지털 혁신을 선도하는<br />
              <span className="text-white">IT 솔루션 파트너</span>
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-12 sm:mb-16 text-blue-100 max-w-4xl mx-auto leading-relaxed font-light px-4">
              최첨단 기술과 창의적 사고로 고객의 비즈니스 성장을 가속화하는<br className="hidden sm:block" />
              <span className="font-semibold text-white">프리미엄 IT 전문 기업입니다</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-2xl mx-auto px-4">
              <button 
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 sm:px-12 sm:py-6 rounded-2xl font-black text-lg sm:text-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 border border-blue-500/30 w-full sm:w-auto"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                🚀 프로젝트 시작하기
              </button>
              <button 
                className="border-3 border-white/50 text-white px-6 py-4 sm:px-12 sm:py-6 rounded-2xl font-bold text-lg sm:text-2xl hover:bg-white/15 hover:border-white/70 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
                onClick={() => {
                  const aboutSection = document.getElementById('about');
                  aboutSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                📋 회사소개 보기
              </button>
            </div>
          </div>

          {/* Floating Elements - 반응형 */}
          <div className="absolute top-10 left-5 w-12 h-12 sm:top-20 sm:left-10 sm:w-20 sm:h-20 bg-blue-500/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-5 w-16 h-16 sm:bottom-20 sm:right-10 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-10 w-10 h-10 sm:left-20 sm:w-16 sm:h-16 bg-indigo-500/20 rounded-full animate-pulse delay-500"></div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 px-4">
                <span className="text-blue-600">숫자로</span> 보는 DB.INFO
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">신뢰할 수 있는 성과와 경험</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center group">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-blue-100">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">13</div>
                  <div className="text-base sm:text-lg font-bold text-gray-700">년</div>
                  <div className="text-sm sm:text-base text-gray-500 font-medium">사업 경력</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-indigo-100">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">100+</div>
                  <div className="text-base sm:text-lg font-bold text-gray-700">개</div>
                  <div className="text-sm sm:text-base text-gray-500 font-medium">완료 프로젝트</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-purple-100">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">50+</div>
                  <div className="text-base sm:text-lg font-bold text-gray-700">곳</div>
                  <div className="text-sm sm:text-base text-gray-500 font-medium">파트너 기업</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-green-100">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">24/7</div>
                  <div className="text-lg font-bold text-gray-700">시간</div>
                  <div className="text-gray-500 font-medium">기술 지원</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-gray-900 mb-6 sm:mb-8 leading-tight px-2">
                혁신을 통한 성장<br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">미래를 선도하는 기술</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
                2011년부터 축적된 기술력과 경험으로<br className="hidden sm:block" />
                <span className="font-bold text-gray-800">금융·공공·기업 분야에서 디지털 트랜스포메이션을 이끌어왔습니다</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 max-w-7xl mx-auto">
              <div className="text-center group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl mx-auto mb-6 sm:mb-8 flex items-center justify-center text-white text-4xl sm:text-5xl md:text-6xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                  🚀
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">혁신</h3>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-2">
                  최신 기술 트렌드를 선도하며 끊임없는 연구개발을 통해 차별화된 솔루션을 제공합니다.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl sm:rounded-3xl mx-auto mb-6 sm:mb-8 flex items-center justify-center text-white text-4xl sm:text-5xl md:text-6xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                  🛡️
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">신뢰</h3>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-2">
                  13년간의 축적된 경험과 성공적인 프로젝트 수행으로 고객의 신뢰를 얻어왔습니다.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600 rounded-2xl sm:rounded-3xl mx-auto mb-6 sm:mb-8 flex items-center justify-center text-white text-4xl sm:text-5xl md:text-6xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                  📈
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">성장</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  지속적인 혁신과 품질 향상을 통해 고객과 함께 성장하는 동반자 역할을 합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Business Section */}
        <Suspense fallback={
          <div className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">서비스 정보를 불러오는 중...</p>
            </div>
          </div>
        }>
          <ModernBusinessSection />
        </Suspense>

        {/* Contact Section */}
        <section id="contact" className="py-16 sm:py-24 md:py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-6 sm:mb-8 leading-tight px-2">
                함께 만들어가는<br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">디지털 미래</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed px-4">
                혁신적인 아이디어와 전문적인 기술력으로<br className="hidden sm:block" />
                <span className="font-bold text-white">여러분의 비즈니스 성장을 함께 만들어갑니다</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
              {/* 본사 위치 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white hover:bg-white/15 transition-all duration-300 group hover:scale-105 border border-white/20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center justify-center text-2xl sm:text-4xl group-hover:scale-110 transition-transform shadow-lg mx-auto sm:mx-0">
                  🏢
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent text-center sm:text-left">본사 주소</h3>
                <p className="text-blue-100 text-sm sm:text-base md:text-lg leading-relaxed text-center sm:text-left">
                  서울특별시 금천구 서부샛길 606<br />
                  대성디폴리스 지식산업센터 B동 1410호<br />
                  <span className="text-cyan-300 font-semibold text-xs sm:text-sm">지하철 1호선, 7호선 8번 출구 500m</span>
                </p>
              </div>

              {/* 이메일 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white hover:bg-white/15 transition-all duration-300 group hover:scale-105 border border-white/20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center justify-center text-2xl sm:text-4xl group-hover:scale-110 transition-transform shadow-lg mx-auto sm:mx-0">
                  📧
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent text-center sm:text-left">이메일</h3>
                <p className="text-blue-100 text-sm sm:text-base md:text-lg leading-relaxed text-center sm:text-left">
                  <span className="text-cyan-300 font-semibold">hankjae@db-info.co.kr</span><br />
                  <span className="text-xs sm:text-sm">6511kesuk@db-info.co.kr</span><br />
                  <span className="text-xs text-gray-300">(관리이사)</span>
                </p>
              </div>

              {/* 전화번호 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white hover:bg-white/15 transition-all duration-300 group hover:scale-105 border border-white/20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center justify-center text-2xl sm:text-4xl group-hover:scale-110 transition-transform shadow-lg mx-auto sm:mx-0">
                  📞
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center sm:text-left">전화번호</h3>
                <p className="text-blue-100 text-sm sm:text-base md:text-lg leading-relaxed text-center sm:text-left">
                  <span className="text-cyan-300 font-bold text-lg sm:text-xl">02-2025-8511</span><br />
                  <span className="text-gray-300 text-xs sm:text-sm">02-2025-8512 (팩스)</span>
                </p>
              </div>

              {/* 프로젝트 문의 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white hover:bg-white/15 transition-all duration-300 group hover:scale-105 border border-white/20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center justify-center text-2xl sm:text-4xl group-hover:scale-110 transition-transform shadow-lg mx-auto sm:mx-0">
                  💼
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent text-center sm:text-left">프로젝트 문의</h3>
                <div className="space-y-3 sm:space-y-4">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-xl sm:rounded-2xl text-sm sm:text-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg">
                    📋 무료 상담 신청
                  </button>
                  <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-xl sm:rounded-2xl text-sm sm:text-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg">
                    📅 미팅 예약하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">DB.INFO</h3>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              13년간의 전문성과 혁신적 기술력으로 디지털 미래를 선도하는<br className="hidden sm:block" />
              <span className="font-bold text-white">프리미엄 IT 솔루션 파트너</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12 md:mb-16">
            <div>
              <h4 className="text-2xl font-black mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">🚀 서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#ai-dataset" className="hover:text-cyan-400 transition-colors text-lg hover:scale-105 inline-block transform">🤖 AI DataSet Platform</a></li>
                <li><a href="#si-integration" className="hover:text-white transition-colors">🏢 SI (System Integration)</a></li>
                <li><a href="#ecommerce-platform" className="hover:text-white transition-colors">🛒 E-Commerce Platform</a></li>
                <li><a href="#ai-chatbot" className="hover:text-white transition-colors">💬 AI ChatBot Service</a></li>
                <li><a href="#demand-prediction" className="hover:text-white transition-colors">📊 Demand Prediction</a></li>
                <li><a href="#rnd-center" className="hover:text-white transition-colors">🔬 R&D Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">💡 기술력</h4>
              <ul className="space-y-2 text-gray-400">
                <li>🧠 인공지능 & 머신러닝</li>
                <li>📊 빅데이터 분석</li>
                <li>☁️ 클라우드 인프라</li>
                <li>🔗 시스템 통합</li>
                <li>🎨 UI/UX 디자인</li>
                <li>🔒 보안 & 컴플라이언스</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">🏢 회사 정보</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">🏢 회사 소개</a></li>
                <li><a href="#business" className="hover:text-white transition-colors">💼 사업 영역</a></li>
                <li><a href="#portfolio" className="hover:text-white transition-colors">📁 포트폴리오</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">📞 문의하기</a></li>
                <li><a href="https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EA%B8%88%EC%B2%9C%EA%B5%AC%20%EC%84%9C%EB%B6%80%EC%83%9B%EA%B8%B8%20606" target="_blank" className="hover:text-white transition-colors">🗺️ 오시는 길</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">연락처</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 hankjae@db-info.co.kr</li>
                <li>📧 6511kesuk@db-info.co.kr (관리이사)</li>
                <li>📞 02-2025-8511 (전화)</li>
                <li>� 02-2025-8512 (팩스)</li>
                <li>📍 서울특별시 금천구 서부샛길 606</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 sm:pt-12 text-gray-300 text-center">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">&copy; 2024 DB.INFO Co., Ltd. All rights reserved. | <span className="text-cyan-400">Premium IT Solutions Partner</span></p>
              <div className="flex space-x-4 sm:space-x-6 md:space-x-8 text-sm sm:text-base md:text-lg">
                <span className="font-semibold">Follow us:</span>
                <a href="#" className="hover:text-cyan-400 transition-all duration-300 hover:scale-110 transform">Twitter</a>
                <a href="#" className="hover:text-cyan-400 transition-all duration-300 hover:scale-110 transform">LinkedIn</a>
                <a href="#" className="hover:text-cyan-400 transition-all duration-300 hover:scale-110 transform">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Client-side Components */}
      <Suspense fallback={null}>
        <ChatSystem />
      </Suspense>
      <Suspense fallback={null}>
        <NotificationSystem />
      </Suspense>
    </div>
  );
}
