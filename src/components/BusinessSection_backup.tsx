import React, { useState, useEffect } from 'react';

export interface BusinessSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  description1?: string;
  description2?: React.ReactElement;
  image: string;
  features: string[];
  detailInfo?: {
    purpose?: string;
    form?: string;
    target?: string;
    keyFeatures?: string[];
    techStack?: string[];
    additionalInfo?: string;
  };
}

type TabType = 'overview' | 'features' | 'tech' | 'contact';

// 깔끔한 스타일 시스템
const STYLES = {
  input: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  primaryButton: "px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200",
  secondaryButton: "px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
} as const;
    gradient: 'from-purple-500 to-indigo-500',
    color: 'text-purple-600'
  },
  { 
    id: 'contact' as const, 
    label: '문의', 
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    gradient: 'from-orange-500 to-red-500',
    color: 'text-orange-600'
  }
] as const;

const BusinessSection: React.FC<BusinessSectionProps> = ({
  id,
  title,
  subtitle,
  description,
  description1,
  description2,
  image,
  features,
  detailInfo
}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 모달 열림/닫힘 시 body 스크롤 제어
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // 🎯 향상된 ESC 키로 모달 닫기 기능 (애니메이션 포함)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        // 부드러운 닫기 애니메이션을 위한 약간의 지연
        setTimeout(() => setShowModal(false), 100);
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showModal]);

  return (
    <>
      {/* 🚀 프리미엄 메인 섹션 */}
      <section id={id} className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        {/* 배경 애니메이션 요소들 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              {/* 프리미엄 타이틀 섹션 */}
              <div className="space-y-6">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-transparent bg-clip-text rounded-full border border-blue-200/50 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    PREMIUM PROJECT
                  </span>
                </div>
                
                <h2 className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 leading-tight tracking-tight">
                  {title}
                </h2>
                
                {subtitle && (
                  <h3 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
                    {subtitle}
                  </h3>
                )}
                
                {description && (
                  <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light max-w-2xl">
                    {description}
                  </p>
                )}
                
                {description1 && (
                  <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light max-w-2xl">
                    {description1}
                  </p>
                )}
                
                {description2 && (
                  <div className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light max-w-2xl">
                    {description2}
                  </div>
                )}
              </div>

              {/* 프리미엄 기능 하이라이트 */}
              {features.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    핵심 특징
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {features.slice(0, 3).map((feature, index) => (
                      <div 
                        key={index} 
                        className="group relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        {/* 배경 그라데이션 효과 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-700"></div>
                        
                        <div className="relative flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                            {index + 1}
                          </div>
                          <div className="flex-1 pt-2">
                            <span className="text-gray-800 font-medium text-lg leading-relaxed">{feature}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 프리미엄 액션 버튼 */}
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={() => setShowModal(true)}
                  className={STYLES.primaryButton}
                >
                  상세보기
                </button>
                
                <button className={STYLES.secondaryButton}>
                  문의하기
                </button>
              </div>
            </div>

            {/* 🎭 프리미엄 3D 이미지 섹션 */}
            <div className="relative group perspective-1000">
              {/* 3D 카드 컨테이너 */}
              <div className="relative transform-gpu transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-6 group-hover:scale-105">
                
                {/* 메인 이미지 카드 */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-4xl transition-all duration-700 transform-gpu">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* 프리미엄 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent"></div>
                  
                  {/* 광택 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* 하단 그라데이션 */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
                  
                  {/* 프로젝트 레이블 */}
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <span className="text-white text-sm font-bold">PREMIUM</span>
                  </div>
                  
                  {/* 하단 정보 */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white/80 text-sm">실시간 운영중</span>
                    </div>
                  </div>
                </div>
                
                {/* 부유하는 배경 요소들 */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-2xl blur-lg transform rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700"></div>
              </div>
              
              {/* 3D 그림자 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-3xl blur-2xl transform translate-y-8 translate-x-4 group-hover:translate-y-12 group-hover:translate-x-8 transition-all duration-700 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 깔끔한 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 백드롭 */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          
          {/* 모달 컨테이너 */}
          <div className="relative w-full max-w-4xl max-h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden">
            
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 탭 네비게이션 */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'overview', label: '개요' },
                { id: 'features', label: '기능' },
                { id: 'tech', label: '기술' },
                { id: 'contact', label: '문의' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* 콘텐츠 */}
            <div className="p-6 overflow-y-auto max-h-96">
              
              {/* 개요 탭 */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="flex gap-6">
                    <img src={image} alt={title} className="w-32 h-32 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-2">{title}</h3>
                      {subtitle && <p className="text-gray-600 mb-2">{subtitle}</p>}
                      <p className="text-gray-700">{description || detailInfo?.purpose}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 기능 탭 */}
              {activeTab === 'features' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">주요 기능</h3>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                        </div>
                        <p className="text-gray-700">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 기술 탭 */}
              {activeTab === 'tech' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">기술 스택</h3>
                  {detailInfo?.techStack && detailInfo.techStack.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {detailInfo.techStack.map((tech, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                          <p className="font-medium text-gray-800">{tech}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">기술 스택 정보가 없습니다.</p>
                  )}
                </div>
              )}

              {/* 문의 탭 */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">문의하기</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                      <input type="text" className={STYLES.input} placeholder="이름을 입력하세요" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                      <input type="email" className={STYLES.input} placeholder="이메일을 입력하세요" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
                      <textarea 
                        rows={4} 
                        className={STYLES.input} 
                        placeholder="문의하실 내용을 입력하세요"
                      ></textarea>
                    </div>
                    <button type="submit" className={STYLES.primaryButton}>
                      문의 보내기
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessSection;
              <div className="relative px-10 py-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
                {/* 복잡한 배경 레이어들 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/40 to-indigo-600/30"></div>
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-gray-100/10 via-purple-100/10 to-blue-100/10"></div>
                
                {/* 고급 애니메이션 파티클들 */}
                <div className="absolute top-6 left-10 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-ping"></div>
                <div className="absolute top-12 right-20 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 left-20 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
                <div className="absolute top-8 left-1/3 w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse delay-500"></div>
                <div className="absolute bottom-6 right-1/3 w-3 h-3 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full animate-ping delay-1000"></div>
                
                {/* 움직이는 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                
                <div className="relative z-20 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    {/* 💎 3D 로고 컨테이너 */}
                    <div className="relative group">
                      <div className="w-20 h-20 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center border-2 border-white/50 shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-white/20 group-hover:shadow-2xl">
                        <svg className="w-10 h-10 text-white transform transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {/* 내부 광원 효과 */}
                        <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      {/* 로고 후광 */}
                      <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent tracking-tight mb-3">
                        {title}
                      </h1>
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                          <p className="text-white/90 text-sm font-semibold">프로젝트 상세 정보</p>
                        </div>
                        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-green-300 text-xs font-medium">PREMIUM</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 🔥 프리미엄 닫기 버튼 */}
                  <div className="relative group">
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-14 h-14 bg-gradient-to-br from-red-500/30 to-pink-500/30 hover:from-red-500/50 hover:to-pink-500/50 backdrop-blur-xl rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-180 border border-white/30 shadow-lg hover:shadow-red-500/20 hover:shadow-2xl text-white text-xl font-bold"
                    >
                      ✕
                    </button>
                    {/* 버튼 후광 */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                  </div>
                </div>
              </div>

              {/* 🚀 울트라 프리미엄 탭 네비게이션 */}
              <div className="relative px-12 py-8 bg-gradient-to-br from-slate-50/95 via-white/98 to-blue-50/95 border-b border-blue-200/40 backdrop-blur-2xl">
                {/* 배경 패턴 */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-blue-100/10 via-purple-100/10 to-indigo-100/10"></div>
                
                <div className="relative flex items-center justify-center">
                  <div className="bg-gradient-to-br from-white/80 via-white/90 to-white/70 backdrop-blur-3xl rounded-3xl p-3 border-2 border-white/60 shadow-[0_20px_40px_-8px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500">
                    {/* 탭 컨테이너 내부 그라데이션 */}
                    <div className="absolute inset-1 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-indigo-50/50 rounded-2xl opacity-50"></div>
                    
                    <div className="relative flex gap-3">
                      {TAB_CONFIG.map((tab, index) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`group relative flex items-center gap-4 px-8 py-4 rounded-2xl font-bold transition-all duration-500 hover:scale-105 hover:-translate-y-1 ${
                            activeTab === tab.id
                              ? `bg-gradient-to-br ${tab.gradient} text-white shadow-[0_15px_35px_-5px_rgba(0,0,0,0.2)] transform scale-105 -translate-y-1 border-2 border-white/40`
                              : `${tab.color} hover:bg-gradient-to-br hover:from-white/80 hover:to-white/60 hover:shadow-lg border border-white/30`
                          }`}
                          style={{
                            animationDelay: `${index * 150}ms`
                          }}
                        >
                          {/* 🎯 3D 아이콘 */}
                          <div className={`relative w-7 h-7 transition-all duration-500 ${activeTab === tab.id ? 'rotate-12 scale-125' : 'group-hover:rotate-6 group-hover:scale-110'}`}>
                            <svg className="w-full h-full drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} />
                            </svg>
                            {/* 아이콘 후광 효과 */}
                            {activeTab === tab.id && (
                              <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm opacity-75"></div>
                            )}
                          </div>
                          
                          {/* 💫 프리미엄 텍스트 */}
                          <span className={`font-display text-lg font-black tracking-wide transition-all duration-300 ${
                            activeTab === tab.id 
                              ? 'text-white drop-shadow-sm' 
                              : 'group-hover:scale-105'
                          }`}>
                            {tab.label}
                          </span>
                          
                          {/* ✨ 활성 인디케이터 */}
                          {activeTab === tab.id && (
                            <>
                              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full animate-bounce shadow-lg"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-2xl animate-pulse"></div>
                            </>
                          )}
                          
                          {/* 호버 효과 후광 */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/0 via-purple-400/20 to-indigo-400/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 🌟 홀로그램 탭 콘텐츠 영역 */}
              <div 
                className="flex-1 overflow-y-auto overflow-x-hidden max-h-screen relative"
                style={{maxHeight: 'calc(95vh - 200px)'}}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  setMousePosition({x, y});
                }}
              >
                {/* 홀로그램 배경 시스템 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20"></div>
                
                {/* 동적 홀로그램 오버레이 */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 opacity-60"
                  style={{
                    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                ></div>
                
                {/* 스캐닝 라이트 효과 */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                
                {/* 입자 시스템 */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full animate-ping"></div>
                <div className="absolute top-1/4 left-8 w-1 h-1 bg-blue-400/80 rounded-full animate-bounce"></div>
                <div className="absolute bottom-1/3 right-12 w-1 h-1 bg-purple-400/80 rounded-full animate-pulse"></div>
                
                {/* 🎨 홀로그램 개요 탭 */}
                {activeTab === 'overview' && (
                  <div className="p-12 space-y-12 animate-in fade-in slide-in-from-right duration-700 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      {/* 🖼️ 홀로그램 3D 이미지 섹션 */}
                      <div className="lg:col-span-7 group">
                        <div className={`${PREMIUM_STYLES.hologramCard} p-4 border-2 border-white/30`}>
                          <div className="absolute -inset-6 bg-gradient-to-br from-blue-400/30 via-purple-500/30 to-pink-400/30 rounded-3xl blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
                          <img
                            src={image}
                            alt={title}
                            className="relative w-full h-96 object-cover rounded-3xl shadow-[0_35px_70px_-12px_rgba(0,0,0,0.4)] border-4 border-white/80 backdrop-blur-lg transform transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2 group-hover:shadow-[0_45px_80px_-12px_rgba(0,0,0,0.5)]"
                          />
                          
                          {/* 홀로그램 이미지 오버레이 시스템 */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-3xl"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 rounded-3xl"></div>
                          
                          {/* 스캐닝 효과 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-pulse duration-3000 rounded-3xl"></div>
                          
                          {/* 홀로그램 프레임 효과 */}
                          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/60 rounded-tl-lg"></div>
                          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/60 rounded-tr-lg"></div>
                          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/60 rounded-bl-lg"></div>
                          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/60 rounded-br-lg"></div>
                        </div>
                      </div>
                      
                      {/* 📝 프리미엄 설명 섹션 */}
                      <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-6">
                          <h2 className="text-4xl font-black bg-gradient-to-br from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                            {title}
                          </h2>
                          <p className="text-xl text-gray-700 leading-relaxed font-medium">
                            {description}
                          </p>
                        </div>
                        
                        {/* 🏆 프리미엄 통계 카드들 */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="relative group">
                            <div className="bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-100 rounded-3xl p-6 border-2 border-blue-200/40 text-center shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative">
                                <div className="text-3xl font-black text-blue-600 mb-2 bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                  {detailInfo?.additionalInfo?.split(',')[0] || '100%'}
                                </div>
                                <div className="text-sm font-semibold text-gray-600">완성도</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative group">
                            <div className="bg-gradient-to-br from-green-50 via-green-100/50 to-emerald-100 rounded-3xl p-6 border-2 border-green-200/40 text-center shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative">
                                <div className="text-3xl font-black text-green-600 mb-2 bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                  {detailInfo?.additionalInfo?.split(',')[1] || 'A+'}
                                </div>
                                <div className="text-sm font-semibold text-gray-600">보안등급</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🚀 프리미엄 기능 탭 */}
                {activeTab === 'features' && (
                  <div className="p-12 space-y-12 animate-in fade-in slide-in-from-right duration-700">
                    <div className="text-center mb-12 relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
                      <h2 className="relative text-5xl font-black bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        핵심 기능
                      </h2>
                      <div className="w-32 h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full mx-auto shadow-lg"></div>
                    </div>

                    {features.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                          <div key={index} className="group relative">
                            {/* 카드 후광 */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-green-400/30 via-blue-500/30 to-purple-500/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
                            
                            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 rounded-3xl p-8 border-2 border-white/60 backdrop-blur-sm hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-700 hover:scale-105 hover:-translate-y-2">
                              <div className="flex items-start gap-6">
                                {/* 3D 번호 아이콘 */}
                                <div className="relative group/icon">
                                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 text-white rounded-3xl flex items-center justify-center text-2xl font-black shadow-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                                    {index + 1}
                                    {/* 내부 하이라이트 */}
                                    <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  </div>
                                  {/* 아이콘 후광 */}
                                  <div className="absolute -inset-1 bg-gradient-to-br from-green-400/40 to-purple-500/40 rounded-3xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 blur-md"></div>
                                </div>
                                
                                <div className="flex-1 space-y-3">
                                  <h3 className="text-2xl font-black bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    핵심 기능 #{index + 1}
                                  </h3>
                                  <p className="text-lg text-gray-700 leading-relaxed font-medium">
                                    {feature}
                                  </p>
                                </div>
                              </div>
                              
                              {/* 카드 내부 그라데이션 효과 */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-blue-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 🛠️ 프리미엄 기술 스택 탭 */}
                {activeTab === 'tech' && (
                  <div className="p-12 space-y-12 animate-in fade-in slide-in-from-right duration-700">
                    <div className="text-center mb-16 relative">
                      {/* 배경 후광 효과 */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
                      
                      <h2 className="relative text-5xl font-black bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6">
                        기술 스택
                      </h2>
                      <p className="text-xl text-gray-600 font-medium mb-8">최신 기술로 구축된 강력한 솔루션</p>
                      <div className="w-32 h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full mx-auto shadow-lg"></div>
                    </div>

                    {detailInfo?.techStack && detailInfo.techStack.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {detailInfo.techStack.map((tech, index) => (
                          <div key={index} className="group relative" style={{animationDelay: `${index * 100}ms`}}>
                            {/* 카드 후광 효과 */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 via-indigo-500/30 to-blue-500/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg"></div>
                            
                            <div className="relative bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/40 rounded-3xl p-8 border-2 border-white/60 backdrop-blur-sm hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-700 hover:scale-105 hover:-translate-y-2">
                              <div className="text-center space-y-4">
                                {/* 3D 기술 아이콘 */}
                                <div className="relative group/icon mx-auto w-fit">
                                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                                    <svg className="w-10 h-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    {/* 내부 하이라이트 */}
                                    <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  </div>
                                  {/* 아이콘 후광 */}
                                  <div className="absolute -inset-2 bg-gradient-to-br from-purple-400/50 via-indigo-400/50 to-blue-400/50 rounded-3xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 blur-xl"></div>
                                </div>
                                
                                <div className="space-y-2">
                                  <h3 className="text-xl font-black bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    {tech}
                                  </h3>
                                  <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full mx-auto opacity-70"></div>
                                </div>
                              </div>
                              
                              {/* 카드 내부 효과 */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-purple-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 relative">
                        {/* 배경 효과 */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-indigo-100/20 to-blue-100/20 rounded-3xl"></div>
                        
                        <div className="relative space-y-8">
                          <div className="relative group mx-auto w-fit">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-200/60 via-indigo-200/60 to-blue-200/60 rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                            </div>
                            {/* 후광 효과 */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-purple-300/20 to-blue-300/20 rounded-full blur-2xl"></div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="text-3xl font-black bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                              기술 스택 정보
                            </h3>
                            <p className="text-xl text-gray-500 font-medium">곧 업데이트 예정입니다</p>
                            <div className="flex items-center justify-center gap-2 pt-4">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 📞 프리미엄 문의 탭 */}
                {activeTab === 'contact' && (
                  <div className="p-12 space-y-12 animate-in fade-in slide-in-from-right duration-700">
                    <div className="text-center mb-16 relative">
                      {/* 배경 후광 효과 */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
                      
                      <h2 className="relative text-5xl font-black bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-6">
                        프로젝트 문의
                      </h2>
                      <p className="text-xl text-gray-600 font-medium mb-8">언제든 편하게 연락주세요</p>
                      <div className="w-32 h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full mx-auto shadow-lg"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div className="relative group">
                          {/* 카드 후광 */}
                          <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/30 via-indigo-500/30 to-purple-500/30 rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
                          
                          <div className="relative bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40 rounded-3xl p-10 border-2 border-white/60 backdrop-blur-sm shadow-2xl">
                            <h3 className="text-3xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
                              연락처 정보
                            </h3>
                            <div className="space-y-8">
                              {/* 이메일 카드 */}
                              <div className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                                
                                <div className="relative flex items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                                  <div className="relative group/icon">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
                                      <svg className="w-8 h-8 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                      {/* 내부 하이라이트 */}
                                      <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    {/* 아이콘 후광 */}
                                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/40 to-indigo-500/40 rounded-2xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 blur-lg"></div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">이메일</p>
                                    <p className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                      contact@dbinfo.co.kr
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* 전화 카드 */}
                              <div className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                                
                                <div className="relative flex items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                                  <div className="relative group/icon">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
                                      <svg className="w-8 h-8 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                      {/* 내부 하이라이트 */}
                                      <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    {/* 아이콘 후광 */}
                                    <div className="absolute -inset-1 bg-gradient-to-br from-green-400/40 to-emerald-500/40 rounded-2xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 blur-lg"></div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">전화번호</p>
                                    <p className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                      02-1234-5678
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 🌟 프리미엄 문의 폼 */}
                      <div className="relative group">
                        {/* 폼 후광 */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 via-red-500/30 to-pink-500/30 rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
                        
                        <div className="relative bg-gradient-to-br from-white via-orange-50/40 to-red-50/40 rounded-3xl p-10 border-2 border-white/60 backdrop-blur-sm shadow-2xl">
                          <h3 className="text-3xl font-black bg-gradient-to-br from-orange-600 to-red-600 bg-clip-text text-transparent mb-8">
                            빠른 문의
                          </h3>
                          <form className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <label className="block text-sm font-black text-gray-700 uppercase tracking-wide">회사명</label>
                                <div className="relative group/input">
                                  <input 
                                    type="text" 
                                    className={PREMIUM_STYLES.input}
                                    placeholder="회사명을 입력해주세요"
                                  />
                                  {/* 입력 필드 후광 */}
                                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300 blur-sm"></div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <label className="block text-sm font-black text-gray-700 uppercase tracking-wide">담당자명</label>
                                <div className="relative group/input">
                                  <input 
                                    type="text" 
                                    className={PREMIUM_STYLES.input}
                                    placeholder="담당자명을 입력해주세요"
                                  />
                                  {/* 입력 필드 후광 */}
                                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300 blur-sm"></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <label className="block text-sm font-black text-gray-700 uppercase tracking-wide">연락처</label>
                              <div className="relative group/input">
                                <input 
                                  type="tel" 
                                  className={PREMIUM_STYLES.input}
                                  placeholder="연락처를 입력해주세요"
                                />
                                {/* 입력 필드 후광 */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300 blur-sm"></div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <label className="block text-sm font-black text-gray-700 uppercase tracking-wide">문의 내용</label>
                              <div className="relative group/input">
                                <textarea 
                                  rows={5}
                                  className={`${PREMIUM_STYLES.input} resize-none`}
                                  placeholder="문의하실 내용을 자세히 입력해주세요..."
                                />
                                {/* 텍스트 영역 후광 */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300 blur-sm"></div>
                              </div>
                            </div>
                            
                            {/* 🚀 프리미엄 제출 버튼 */}
                            <div className="pt-4">
                              <button
                                type="submit"
                                className={`w-full ${PREMIUM_STYLES.primaryButton} text-xl font-black py-4`}
                              >
                                <span className="relative z-10">문의 보내기</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20 rounded-2xl animate-pulse"></div>
                              </button>
                            </div>
                          </form>
                          
                          {/* 추가 정보 */}
                          <div className="mt-10 pt-8 border-t border-orange-200/40">
                            <div className="flex items-center justify-center gap-3 text-gray-500">
                              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium">24시간 내 회신 보장</span>
                              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-500"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessSection;