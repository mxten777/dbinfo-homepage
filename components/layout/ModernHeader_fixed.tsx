'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon, CpuChipIcon } from '@heroicons/react/24/outline';

// Service icons (using simple icons)
const ServiceIcon = ({ type }: { type: string }) => (
  <div className="w-8 h-8 text-blue-600">
    {type === 'ai' && '🤖'}
    {type === 'si' && '⚙️'}
    {type === 'ecommerce' && '🛒'}
    {type === 'chatbot' && '💬'}
    {type === 'prediction' && '📊'}
    {type === 'rd' && '🔬'}
  </div>
);

const ModernHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);



  const services = [
    {
      title: 'AI DataSet Platform',
      description: '머신러닝을 위한 데이터 수집/가공/활용 플랫폼',
      href: '#services',
      icon: ServiceIcon({ type: 'ai' })
    },
    {
      title: 'SI (System Integration)',
      description: '기업 맞춤형 시스템 통합 및 구축 서비스',
      href: '#services', 
      icon: ServiceIcon({ type: 'si' })
    },
    {
      title: 'E-Commerce Solutions',
      description: '온라인 쇼핑몰 및 전자상거래 플랫폼 개발',
      href: '#services',
      icon: ServiceIcon({ type: 'ecommerce' })
    },
    {
      title: 'AI ChatBot Services',
      description: '지능형 챗봇 개발 및 고객 상담 자동화',
      href: '#services',
      icon: ServiceIcon({ type: 'chatbot' })
    },
    {
      title: 'Demand Prediction',
      description: 'AI 기반 수요 예측 및 재고 최적화 솔루션',
      href: '#services',
      icon: ServiceIcon({ type: 'prediction' })
    },
    {
      title: 'R&D Center',
      description: '최신 기술 연구개발 및 혁신 솔루션 창출',
      href: '#services',
      icon: ServiceIcon({ type: 'rd' })
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
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
                  ) : (
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
                      {activeDropdown === item.label && (
                        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100">
                          <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                              {services.map((service, serviceIndex) => (
                                <a
                                    key={serviceIndex}
                                    href={service.href}
                                    onClick={() => setActiveDropdown(null)}
                                    className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                                  >
                                  <div className="w-8 h-8 text-blue-600 mt-1 group-hover:text-blue-700 transition-colors">
                                    {service.icon}
                                  </div>
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
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                  <span className="font-medium">02-1234-5678</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">✉️</span>
                  </div>
                  <span className="font-medium">hankjae@db-info.co.kr</span>
                </div>
              </div>

              {/* Employee Portal Button */}
              <a
                href="/employee"
                className="hidden lg:flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 py-4">
              <nav className="space-y-2">
                {navigationItems.map((item, index) => (
                  <div key={index}>
                    {item.type === 'link' ? (
                      <a
                        href={item.href}
                        className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <div>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                          className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                        >
                          {item.label}
                          <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === item.label ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        {activeDropdown === item.label && (
                          <div className="mt-2 ml-4 space-y-1">
                            {services.map((service, serviceIndex) => (
                              <a
                                key={serviceIndex}
                                href={service.href}
                                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <span className="mr-2">{service.icon}</span>
                                {service.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile Contact & Employee Portal */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <a
                    href="/employee"
                    className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-2">👥</span>
                    직원 포털
                  </a>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    📞 02-1234-5678 | ✉️ hankjae@db-info.co.kr
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="flex items-start justify-center pt-20">
            <div className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center space-x-4">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="서비스, 솔루션 검색..."
                  className="flex-1 text-lg placeholder-gray-400 border-0 outline-0 bg-transparent"
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
};

export default ModernHeader;