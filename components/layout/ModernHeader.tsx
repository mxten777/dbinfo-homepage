'use client';

import React, { useState } from 'react';
import { 
  Bars3Icon, 
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function ModernHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const services = [
    {
      title: 'AI DataSet Platform',
      description: '인공지능 데이터셋 플랫폼',
      icon: CpuChipIcon,
      href: '#ai-dataset'
    },
    {
      title: 'SI (System Integration)',
      description: '체계적인 정보시스템 통합구축',
      icon: BuildingOfficeIcon,
      href: '#si-integration'
    },
    {
      title: 'E-Commerce Platform',
      description: '통합 전자상거래 솔루션',
      icon: ChartBarIcon,
      href: '#ecommerce-platform'
    },
    {
      title: 'AI ChatBot Service',
      description: '지능형 고객서비스 챗봇',
      icon: DevicePhoneMobileIcon,
      href: '#ai-chatbot'
    },
    {
      title: 'Demand Prediction',
      description: '수요 예측 AI 솔루션',
      icon: ChartBarIcon,
      href: '#demand-prediction'
    },
    {
      title: 'R&D Center',
      description: '연구개발 및 기술혁신',
      icon: CloudIcon,
      href: '#rnd-center'
    }
  ];

  const navigationItems = [
    { 
      href: '#home', 
      label: 'HOME',
      type: 'link' as const
    },
    { 
      href: '#about',
      label: 'ABOUT',
      type: 'link' as const
    },
    { 
      label: 'SERVICES',
      type: 'dropdown' as const,
      items: services
    },
    { 
      href: '#portfolio', 
      label: 'PORTFOLIO',
      type: 'link' as const
    },
    { 
      href: '#contact', 
      label: 'CONTACT',
      type: 'link' as const
    }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-blue-100/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <CpuChipIcon className="w-6 h-6 text-white" />
                </div>
                <a href="#home" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-800 transition-all duration-300">
                  DB.INFO
                </a>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.type === 'link' ? (
                    <a
                      href={item.href}
                      className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-blue-50"
                    >
                      {item.label}
                    </a>
                  ) : item.type === 'dropdown' ? (
                    <div 
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-blue-50">
                        {item.label}
                        <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-200 ${
                        activeDropdown === item.label 
                          ? 'opacity-100 visible translate-y-0' 
                          : 'opacity-0 invisible translate-y-2 pointer-events-none'
                      }`}>
                        <div className="p-6">
                          {item.label === 'SERVICES' && (
                            <div className="grid grid-cols-2 gap-4">
                              {services.map((service, serviceIndex) => (
                                <a
                                  key={serviceIndex}
                                  href={service.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const targetId = service.href.replace('#', '');
                                    const targetElement = document.getElementById(targetId);
                                    if (targetElement) {
                                      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                    setActiveDropdown(null);
                                  }}
                                  className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                                >
                                  <service.icon className="w-8 h-8 text-blue-600 mt-1 group-hover:text-blue-700 transition-colors" />
                                  <div className="ml-3">
                                    <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                      {service.title}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      {service.description}
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Contact Info */}
              <div className="hidden xl:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📞</span>
                  </div>
                  <span className="font-medium">02-2025-8511</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📧</span>
                  </div>
                  <span className="font-medium">hankjae@db-info.co.kr</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button 
                  className="hidden lg:flex items-center px-4 py-2.5 text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50/80 rounded-xl transition-all duration-200 border border-blue-100 hover:border-blue-200"
                  onClick={() => window.location.href = '/employee'}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  직원 포털
                </button>
                <button 
                  className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-indigo-800"
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  프로젝트 시작하기
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden bg-white/98 backdrop-blur-md border-t border-blue-100/50 shadow-lg ${
          isMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}>
          <div className="container mx-auto px-4 py-6">
            <nav className="space-y-6">
              {navigationItems.map((item, index) => (
                <div key={index}>
                  {item.type === 'link' ? (
                    <a
                      href={item.href}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <div>
                      <div className="font-semibold text-gray-900 py-2 border-b border-gray-100">
                        {item.label}
                      </div>
                      <div className="mt-3 space-y-3 pl-4">
                        {services.map((service, serviceIndex) => (
                          <a
                            key={serviceIndex}
                            href={service.href}
                            className="flex items-center text-gray-600 hover:text-blue-600 py-2 transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="w-8 h-8 mr-3 bg-blue-50 rounded-lg flex items-center justify-center">
                              <service.icon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{service.title}</div>
                              <div className="text-sm text-gray-500">{service.description}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="space-y-4 mt-6 pt-6 border-t border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">📞</span>
                    </div>
                    <span>02-2025-8511</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">📧</span>
                    </div>
                    <span>문의하기</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    className="flex items-center justify-center px-4 py-3 text-blue-600 border border-blue-200 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.location.href = '/employee';
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    직원 포털
                  </button>
                  <button 
                    className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg"
                    onClick={() => {
                      setIsMenuOpen(false);
                      const contactSection = document.getElementById('contact');
                      contactSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    프로젝트 시작하기
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSearchOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="서비스, 솔루션, 문서 검색..."
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                인기 검색어: ERP, 데이터분석, AI솔루션, 모바일앱
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
