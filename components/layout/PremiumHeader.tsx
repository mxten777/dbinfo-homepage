'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bars3Icon, 
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function PremiumHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      id: 'ai-dataset',
      title: 'AI DataSet Platform',
      description: '머신러닝을 위한 고품질 데이터 수집/가공/활용',
      icon: '🤖',
      gradient: 'from-blue-600 to-cyan-600',
      features: ['데이터 수집 자동화', '품질 관리 시스템', 'API 연동'],
      image: '🎯'
    },
    {
      id: 'si-integration',
      title: 'SI (System Integration)',
      description: '기업 맞춤형 시스템 통합 및 구축 서비스',
      icon: '⚙️',
      gradient: 'from-purple-600 to-pink-600',
      features: ['레거시 현대화', '클라우드 전환', '통합 솔루션'],
      image: '🏗️'
    },
    {
      id: 'ecommerce-platform',
      title: 'E-Commerce Solutions',
      description: '온라인 쇼핑몰 및 전자상거래 플랫폼',
      icon: '🛒',
      gradient: 'from-orange-600 to-red-600',
      features: ['옴니채널 통합', '결제 시스템', '재고 관리'],
      image: '🛍️'
    },
    {
      id: 'ai-chatbot',
      title: 'AI ChatBot Services',
      description: '지능형 챗봇으로 고객 상담 자동화',
      icon: '💬',
      gradient: 'from-green-600 to-teal-600',
      features: ['자연어 처리', '24/7 자동 응답', '다국어 지원'],
      image: '🤝'
    },
    {
      id: 'demand-prediction',
      title: 'Demand Prediction',
      description: 'AI 기반 수요 예측 및 재고 최적화',
      icon: '📊',
      gradient: 'from-indigo-600 to-blue-600',
      features: ['예측 분석', '재고 최적화', '트렌드 분석'],
      image: '📈'
    },
    {
      id: 'rnd-center',
      title: 'R&D Center',
      description: '최신 기술 연구개발 및 혁신 솔루션',
      icon: '🔬',
      gradient: 'from-violet-600 to-purple-600',
      features: ['기술 연구', '프로토타입 개발', '특허 출원'],
      image: '💡'
    }
  ];

  const navigationItems = [
    { href: '#home', label: 'HOME', type: 'link' as const },
    { href: '#about', label: 'ABOUT', type: 'link' as const },
    { label: 'SERVICES', type: 'dropdown' as const },
    { href: '#portfolio', label: 'PORTFOLIO', type: 'link' as const },
    { href: '#news', label: 'NEWS', type: 'link' as const },
    { href: '#contact', label: 'CONTACT', type: 'link' as const }
  ];

  const scrollToSection = (href: string) => {
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerHeight = 80;
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-lg shadow-lg'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Premium Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <SparklesIcon className="w-7 h-7 text-white" />
                </div>
                <a href="#home" className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
                    DB.INFO
                  </span>
                </a>
              </div>
            </div>

            {/* Desktop Premium Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.type === 'link' ? (
                    <a
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); scrollToSection(item.href!); }}
                      className="relative px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 rounded-lg hover:bg-blue-50 group"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></span>
                    </a>
                  ) : (
                    <div 
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 rounded-lg hover:bg-blue-50 group">
                        {item.label}
                        <ChevronDownIcon className={`w-4 h-4 ml-1 transition-all duration-300 ${
                          activeDropdown === item.label ? 'rotate-180 text-blue-600' : ''
                        }`} />
                      </button>
                      
                      {/* Premium Mega Menu */}
                      {activeDropdown === item.label && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[900px]">
                          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                            {/* Mega Menu Header */}
                            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6">
                              <h3 className="text-2xl font-black text-white mb-2">Our Services</h3>
                              <p className="text-blue-50 text-sm">13년 경력의 전문 기술로 최고의 솔루션을 제공합니다</p>
                            </div>
                            
                            {/* Services Grid */}
                            <div className="grid grid-cols-3 gap-6 p-8">
                              {services.map((service, idx) => (
                                <a
                                  key={idx}
                                  href={`#${service.id}`}
                                  onClick={(e) => { e.preventDefault(); scrollToSection(`#${service.id}`); }}
                                  className="group relative p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border-2 border-transparent hover:border-gray-100 hover:shadow-xl"
                                >
                                  {/* Service Icon */}
                                  <div className="relative mb-4">
                                    <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                                    <div className={`relative w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                                      <span className="text-3xl">{service.icon}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Service Content */}
                                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                    {service.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                    {service.description}
                                  </p>
                                  
                                  {/* Features */}
                                  <ul className="space-y-2 mb-4">
                                    {service.features.map((feature, fidx) => (
                                      <li key={fidx} className="flex items-center text-xs text-gray-500">
                                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-2"></span>
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                  
                                  {/* Learn More Button */}
                                  <div className="flex items-center text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    자세히 보기
                                    <ArrowRightIcon className="w-4 h-4 ml-2 text-purple-600" />
                                  </div>
                                  
                                  {/* Hover Effect */}
                                  <div className="absolute top-3 right-3 text-4xl opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                                    {service.image}
                                  </div>
                                </a>
                              ))}
                            </div>
                            
                            {/* Mega Menu Footer */}
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">더 많은 정보가 필요하신가요?</p>
                                  <p className="text-xs text-gray-600 mt-1">전문 상담사가 친절하게 안내해드립니다</p>
                                </div>
                                <a
                                  href="#contact"
                                  onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
                                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                  문의하기
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Premium Actions */}
            <div className="flex items-center space-x-4">
              {/* Premium Contact Info */}
              <div className="hidden xl:flex items-center space-x-6">
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-lg">📞</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Contact</p>
                    <p className="text-sm font-bold text-gray-900">02-2025-8511</p>
                  </div>
                </div>
              </div>

              {/* Employee Portal Button */}
              <a
                href="/employee"
                className="hidden lg:flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span className="mr-2">👥</span>
                직원 포털
              </a>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Premium Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 py-6 animate-in slide-in-from-top duration-300">
              <nav className="space-y-3">
                {navigationItems.map((item, index) => (
                  <div key={index}>
                    {item.type === 'link' ? (
                      <a
                        href={item.href}
                        onClick={(e) => { e.preventDefault(); scrollToSection(item.href!); }}
                        className="block px-6 py-4 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl font-bold transition-all duration-300"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <div>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                          className="flex items-center justify-between w-full px-6 py-4 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl font-bold transition-all duration-300"
                        >
                          {item.label}
                          <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${
                            activeDropdown === item.label ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        {activeDropdown === item.label && (
                          <div className="mt-3 ml-6 space-y-2 animate-in slide-in-from-top duration-200">
                            {services.map((service, idx) => (
                              <a
                                key={idx}
                                href={`#${service.id}`}
                                onClick={(e) => { e.preventDefault(); scrollToSection(`#${service.id}`); }}
                                className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
                              >
                                <span className="text-2xl mr-3">{service.icon}</span>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900 text-sm">{service.title}</p>
                                  <p className="text-xs text-gray-600">{service.description}</p>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile Actions */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <a
                    href="/employee"
                    className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg"
                  >
                    <span className="mr-2">👥</span>
                    직원 포털
                  </a>
                  <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">문의 전화</p>
                    <p className="text-sm font-bold text-gray-900">📞 02-2025-8511</p>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Premium Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex items-start justify-center pt-32">
            <div className="w-full max-w-3xl mx-6 bg-white rounded-3xl shadow-2xl p-8 animate-in slide-in-from-top duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-transparent focus-within:border-purple-300 transition-all duration-300">
                  <MagnifyingGlassIcon className="w-7 h-7 text-gray-400" />
                  <input
                    type="text"
                    placeholder="서비스, 솔루션 검색..."
                    className="flex-1 text-xl placeholder-gray-400 border-0 outline-0 bg-transparent font-medium"
                    autoFocus
                  />
                </div>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-4 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-2xl transition-all duration-300"
                >
                  <XMarkIcon className="w-7 h-7" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">인기 검색어</p>
                  <div className="flex flex-wrap gap-2">
                    {['AI DataSet', 'SI 구축', '이커머스', '챗봇', '수요예측', 'R&D'].map((keyword, idx) => (
                      <button
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
