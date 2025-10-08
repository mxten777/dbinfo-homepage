import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { EnhancedAnimate } from '../animations';
import { Button } from '../ui';

interface BusinessSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  description1?: string;
  description2?: string | React.ReactNode;
  image?: string;
  features: string[];
  isReversed?: boolean;
  detailInfo?: {
    overview?: string;
    purpose?: string;
    form?: string;
    target?: string;
    keyFeatures?: string[];
    techStack?: string[];
    additionalInfo?: string;
  };
}

const BusinessSection: React.FC<BusinessSectionProps> = props => {
  const {
    id,
    title,
    subtitle,
    description,
    image,
    features,
    isReversed = false,
    detailInfo,
  } = props;

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'details'>('overview');
  const modalRef = useRef<HTMLDivElement>(null);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  return (
    <>
      <section id={id} className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className={isReversed ? 'lg:order-last' : ''}>
              <EnhancedAnimate variant="slideUp" delay={0}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mt-4">
                    {subtitle}
                  </p>
                )}
              </EnhancedAnimate>

              {description && (
                <EnhancedAnimate variant="slideUp" delay={200}>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed mt-6">
                    {description}
                  </p>
                </EnhancedAnimate>
              )}

              <EnhancedAnimate variant="scaleIn" delay={400}>
                <div className="flex gap-4 mt-8">
                  <Button onClick={() => setShowModal(true)} variant="primary" size="lg">
                    자세히 보기
                  </Button>
                  <Button onClick={scrollToContact} variant="secondary" size="lg">
                    문의하기
                  </Button>
                </div>
              </EnhancedAnimate>
            </div>

            {image && (
              <div className={isReversed ? 'lg:order-first' : ''}>
                <EnhancedAnimate variant="slideUp" delay={300}>
                  <Image 
                    src={image} 
                    alt={title} 
                    width={600} 
                    height={400} 
                    className="w-full h-auto rounded-2xl shadow-2xl" 
                  />
                </EnhancedAnimate>
              </div>
            )}
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />

          <div
            ref={modalRef}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-gray-50 border-b">
              <div className="flex px-6">
                {[
                  { id: 'overview', label: '개요' },
                  { id: 'features', label: '기능' },
                  { id: 'details', label: '상세정보' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'overview' | 'features' | 'details')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {image && (
                    <Image 
                      src={image} 
                      alt={title} 
                      width={400} 
                      height={256} 
                      className="w-full h-64 object-cover rounded-lg" 
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">프로젝트 개요</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {detailInfo?.overview ||
                        description ||
                        '이 프로젝트에 대한 자세한 정보입니다.'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">핵심 기능</h3>
                  <div className="space-y-4">
                    {(detailInfo?.keyFeatures || features).map((feature, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">기본 정보</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid gap-4">
                        <div>
                          <span className="font-medium">프로젝트명: </span>
                          <span className="text-gray-600">{title}</span>
                        </div>
                        {subtitle && (
                          <div>
                            <span className="font-medium">부제목: </span>
                            <span className="text-gray-600">{subtitle}</span>
                          </div>
                        )}
                      </div>
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
