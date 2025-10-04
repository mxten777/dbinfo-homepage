import React, { useState } from "react";

interface BusinessSectionProps {
  image: string;
  title: string;
  subtitle?: string;
  description1: string;
  description2?: React.ReactNode;
  features?: string[];
  detailInfo?: {
    purpose?: string;
    form?: string;
    target?: string;
    keyFeatures?: string[];
    additionalInfo?: string;
  };
}

const BusinessSection: React.FC<BusinessSectionProps> = ({
  image,
  title,
  subtitle,
  description1,
  description2,
  features = [],
  detailInfo,
}) => {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      {/* 모바일 반응형 고도화된 BusinessSection */}
      <section className="bg-gradient-to-br from-gradientFrom via-gradientVia to-gradientTo rounded-2xl sm:rounded-3xl shadow-3xl flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 md:p-10 mb-8 sm:mb-12 md:mb-16 border border-navy/20">
        <div className="text-left">
          <div className="relative mb-3 sm:mb-4">
            <img
              src={image}
              alt={title + " 대표 이미지"}
              className="w-full h-36 sm:h-44 md:h-56 object-cover rounded-xl sm:rounded-2xl shadow-xl border-2 border-gradientVia/40"
              style={{ boxSizing: 'border-box' }}
            />
            <div className="absolute top-2 right-2 bg-gradient-to-r from-point to-accent rounded-full p-1.5 sm:p-2 shadow-lg">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-primary-dark mb-2 md:mb-3 tracking-tight drop-shadow-sm">
            {title}
          </h3>
          
          {subtitle && (
            <p className="text-accent font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4">
              {subtitle}
            </p>
          )}
          
          <p className="font-sans text-sm sm:text-base md:text-lg text-sub mb-2 md:mb-3 font-medium leading-relaxed">
            {description1}
          </p>
          
          {description2 && (
            <p className="font-sans text-sm sm:text-base text-muted mb-2 md:mb-3">
              {description2}
            </p>
          )}
          
          {features.length > 0 && (
            <ul className="text-sm sm:text-base text-muted list-disc list-inside mb-2 space-y-1">
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
          
          <button
            className="mt-3 sm:mt-4 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={() => setShowModal(true)}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            상세보기
          </button>
        </div>
      </section>
      
      {/* 모바일 최적화된 상세보기 모달 */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl max-h-[90vh] w-full overflow-hidden border border-white/20 backdrop-blur-xl" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모바일 최적화된 모달 헤더 */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-6 md:p-8 text-white overflow-hidden">
              {/* 배경 패턴 */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-white/10"></div>
                <div className="absolute inset-0 bg-white/5"></div>
              </div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 font-display tracking-tight">{title}</h2>
                      {subtitle && (
                        <p className="text-blue-100 text-lg sm:text-xl font-medium">{subtitle}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/30">
                      Enterprise Solution
                    </span>
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/30">
                      AI Powered
                    </span>
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/30">
                      13+ Years Experience
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 sm:p-3 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90 backdrop-blur-sm border border-white/30 shrink-0"
                  aria-label="모달 닫기"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* 모바일 최적화된 모달 내용 */}
            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[60vh]">
              {/* 메인 컨텐츠 - 모바일에서는 1컬럼, 태블릿 이상에서는 3컬럼 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
                {/* 이미지 섹션 */}
                <div className="lg:col-span-1">
                  <div className="relative group">
                    <img
                      src={image}
                      alt={title + " 상세 이미지"}
                      className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-xl sm:rounded-2xl"></div>
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
                      <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium border border-white/30">
                        Premium Service
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 서비스 개요 섹션 */}
                <div className="lg:col-span-2">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30 shadow-lg">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-2xl font-bold text-slate-900">서비스 개요</h3>
                    </div>
                    
                    <p className="text-slate-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base lg:text-lg">
                      {description1}
                    </p>
                    
                    {description2 && (
                      <div className="text-slate-600 mb-4 sm:mb-6 leading-relaxed bg-blue-50/50 p-3 sm:p-4 rounded-xl border-l-4 border-blue-500 text-sm sm:text-base">
                        {description2}
                      </div>
                    )}
                    
                    {detailInfo && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {detailInfo.purpose && (
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              목적
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{detailInfo.purpose}</p>
                          </div>
                        )}
                        {detailInfo.form && (
                          <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-3 sm:p-4 rounded-xl border border-emerald-100">
                            <h4 className="font-bold text-emerald-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              형태
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{detailInfo.form}</p>
                          </div>
                        )}
                        {detailInfo.target && (
                          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 sm:p-4 rounded-xl border border-purple-100 sm:col-span-2 lg:col-span-1">
                            <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              대상 고객
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{detailInfo.target}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 기능 섹션들 - 모바일에서는 1컬럼 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* 주요 기능 */}
                {features.length > 0 && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30 shadow-lg">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">주요 기능 및 특징</h3>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-slate-700 font-medium text-xs sm:text-sm lg:text-base">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 핵심 기능 */}
                {detailInfo?.keyFeatures && detailInfo.keyFeatures.length > 0 && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30 shadow-lg">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">핵심 기술</h3>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {detailInfo.keyFeatures.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <p className="text-slate-700 font-medium text-xs sm:text-sm lg:text-base">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 추가 정보 */}
              {detailInfo?.additionalInfo && (
                <div className="mt-6 sm:mt-8 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-slate-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">전문성 & 경험</h3>
                  </div>
                  <div className="bg-white/80 p-3 sm:p-4 rounded-xl border border-white/50">
                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base lg:text-lg font-medium">{detailInfo.additionalInfo}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* 모바일 최적화된 모달 푸터 */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t border-white/30 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
                  <span className="font-medium">DB.INFO</span> • 13년간의 전문성 • Enterprise Grade Solution
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-white/80 text-slate-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 font-medium border border-slate-200 hover:scale-105 text-sm sm:text-base"
                  >
                    닫기
                  </button>
                  <button className="flex-1 sm:flex-none px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    문의하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessSection;