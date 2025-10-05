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

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
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
      {/* 메인 섹션 */}
      <section id={id} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* 왼쪽: 콘텐츠 */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {title}
                </h2>
                {subtitle && (
                  <h3 className="text-xl lg:text-2xl font-semibold text-blue-600">
                    {subtitle}
                  </h3>
                )}
                {description && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {description}
                  </p>
                )}
                {description1 && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {description1}
                  </p>
                )}
                {description2 && (
                  <div className="text-lg text-gray-600 leading-relaxed">
                    {description2}
                  </div>
                )}
              </div>

              {/* 기능 목록 */}
              {features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">핵심 기능</h3>
                  <div className="space-y-3">
                    {features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          ✓
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  상세보기
                </button>
                
                <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  문의하기
                </button>
              </div>
            </div>

            {/* 오른쪽: 이미지 */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 백드롭 */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          
          {/* 모달 컨테이너 */}
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden">
            
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                {subtitle && <p className="text-blue-100 mt-1">{subtitle}</p>}
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className={`px-6 py-3 font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* 콘텐츠 영역 */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              
              {/* 개요 탭 */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src={image} 
                        alt={title}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <div className="space-y-4">
                      {detailInfo?.purpose && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">목적</h3>
                          <p className="text-gray-600 leading-relaxed">{detailInfo.purpose}</p>
                        </div>
                      )}
                      {detailInfo?.form && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">제공 형태</h3>
                          <p className="text-gray-600 leading-relaxed">{detailInfo.form}</p>
                        </div>
                      )}
                      {detailInfo?.target && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">대상 고객</h3>
                          <p className="text-gray-600 leading-relaxed">{detailInfo.target}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* 기능 탭 */}
              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">주요 기능</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {detailInfo?.keyFeatures && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">핵심 특징</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {detailInfo.keyFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* 기술 탭 */}
              {activeTab === 'tech' && detailInfo?.techStack && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">기술 스택</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {detailInfo.techStack.map((tech, index) => (
                        <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {detailInfo?.additionalInfo && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">추가 정보</h4>
                      <p className="text-gray-600 leading-relaxed">{detailInfo.additionalInfo}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* 문의 탭 */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">문의하기</h3>
                    <p className="text-gray-600 mb-6">
                      {title} 서비스에 대한 문의사항이나 제안이 있으시면 언제든 연락해 주세요.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 연락처 정보 */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">연락처 정보</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <div className="font-medium text-gray-800">이메일</div>
                            <div className="text-sm text-gray-600">contact@dbinfo.co.kr</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div>
                            <div className="font-medium text-gray-800">전화</div>
                            <div className="text-sm text-gray-600">02-1234-5678</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="font-medium text-gray-800">운영시간</div>
                            <div className="text-sm text-gray-600">평일 09:00 - 18:00</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 문의 폼 */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">빠른 문의</h4>
                      <form className="space-y-4">
                        <input
                          type="text"
                          placeholder="회사명"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        />
                        <input
                          type="email"
                          placeholder="이메일 주소"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        />
                        <textarea
                          placeholder="문의하실 내용을 입력해 주세요..."
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors duration-200"
                        />
                        <button
                          type="submit"
                          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          문의 보내기
                        </button>
                      </form>
                    </div>
                  </div>
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