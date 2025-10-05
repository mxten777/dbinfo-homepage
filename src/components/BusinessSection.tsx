import React, { useState, useEffect } from 'react';

// 동적 그래픽 컴포넌트
interface DynamicGraphicProps {
  serviceType: string;
  title: string;
}

const DynamicGraphic: React.FC<DynamicGraphicProps> = ({ serviceType, title }) => {
  const getGraphicConfig = () => {
    const configs = {
      'ai-dataset': {
        gradient: 'from-blue-600 via-purple-600 to-indigo-800',
        icon: (
          <svg className="w-20 h-20 text-white/90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        ),
        particles: 'ai',
        accent: 'blue'
      },
      'si-integration': {
        gradient: 'from-emerald-600 via-teal-600 to-cyan-800',
        icon: (
          <svg className="w-20 h-20 text-white/90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
        ),
        particles: 'network',
        accent: 'emerald'
      },
      'ecommerce-platform': {
        gradient: 'from-orange-600 via-red-600 to-pink-800',
        icon: (
          <svg className="w-20 h-20 text-white/90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        ),
        particles: 'commerce',
        accent: 'orange'
      },
      'ai-chatbot': {
        gradient: 'from-violet-600 via-purple-600 to-fuchsia-800',
        icon: (
          <svg className="w-20 h-20 text-white/90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        ),
        particles: 'chat',
        accent: 'violet'
      },
      'demand-prediction': {
        gradient: 'from-green-600 via-lime-600 to-yellow-800',
        icon: (
          <svg className="w-20 h-20 text-white/90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
          </svg>
        ),
        particles: 'analytics',
        accent: 'green'
      },
      'rnd-center': {
        gradient: 'from-slate-600 via-gray-600 to-zinc-800',
        icon: (
          <svg className="w-20 h-20 text-white/90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ),
        particles: 'research',
        accent: 'slate'
      }
    };
    
    return configs[serviceType as keyof typeof configs] || configs['ai-dataset'];
  };

  const config = getGraphicConfig();

  return (
    <div className={`relative w-full h-64 bg-gradient-to-br ${config.gradient} rounded-lg overflow-hidden shadow-lg group`}>
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* 애니메이션 파티클들 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-yellow-400/40 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/2 w-6 h-6 bg-white/10 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
      </div>

      {/* 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-all duration-500"></div>

      {/* 중앙 아이콘 */}
      <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <div className="relative">
          {config.icon}
          {/* 아이콘 글로우 */}
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
        </div>
      </div>

      {/* 하단 타이틀 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="text-white font-medium text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          {title}
        </div>
      </div>

      {/* 호버 시 회전하는 링 */}
      <div className="absolute inset-8 border border-white/20 rounded-full group-hover:rotate-180 transition-transform duration-1000 ease-in-out"></div>
    </div>
  );
};

export interface BusinessSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  description1?: string;
  description2?: React.ReactElement;
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
  features,
  detailInfo
}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

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
      <section id={id} className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {title}
                </h2>
                
                {subtitle && (
                  <h3 className="text-xl font-medium text-blue-600">
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

              {features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">주요 기능</h3>
                  <ul className="space-y-2">
                    {features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  상세보기
                </button>
                
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  문의하기
                </button>
              </div>
            </div>

            {/* 동적 그래픽 */}
            <div className="relative">
              <DynamicGraphic serviceType={id} title={title} />
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          
          <div className="relative w-full max-w-4xl max-h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden">
            
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
            
            <div className="p-6 overflow-y-auto max-h-96">
              
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="flex gap-6">
                    <div className="w-32 h-32">
                      <DynamicGraphic serviceType={id} title={title} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-2">{title}</h3>
                      {subtitle && <p className="text-gray-600 mb-2">{subtitle}</p>}
                      <p className="text-gray-700">{description || detailInfo?.purpose}</p>
                    </div>
                  </div>
                  {detailInfo?.target && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">대상 고객</h4>
                      <p className="text-gray-600">{detailInfo.target}</p>
                    </div>
                  )}
                </div>
              )}

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
                  {detailInfo?.keyFeatures && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">추가 특징</h4>
                      <div className="space-y-2">
                        {detailInfo.keyFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                  {detailInfo?.additionalInfo && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">추가 정보</h4>
                      <p className="text-gray-600">{detailInfo.additionalInfo}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">문의하기</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">연락처</h4>
                        <p className="text-gray-600">이메일: contact@dbinfo.co.kr</p>
                        <p className="text-gray-600">전화: 02-1234-5678</p>
                        <p className="text-gray-600">운영시간: 평일 9:00-18:00</p>
                      </div>
                    </div>
                    <div>
                      <form className="space-y-3">
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="이름" />
                        <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="이메일" />
                        <textarea rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="문의 내용"></textarea>
                        <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
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