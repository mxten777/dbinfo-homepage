'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'card';
}

interface QuickReply {
  text: string;
  payload: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: '안녕하세요! DB.INFO AI 어시스턴트입니다. 🤖\n무엇을 도와드릴까요?',
    sender: 'bot',
    timestamp: new Date(),
    type: 'text'
  }
];

const quickReplies: QuickReply[] = [
  { text: '💼 서비스 문의', payload: 'service_inquiry' },
  { text: '📞 연락처 정보', payload: 'contact_info' },
  { text: '💰 가격 문의', payload: 'pricing_info' },
  { text: '🏢 회사 소개', payload: 'company_info' }
];

export function ChatSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';

    if (lowerMessage.includes('서비스') || lowerMessage.includes('솔루션')) {
      response = `DB.INFO의 주요 서비스를 소개해드릴게요! 🚀

• AI DataSet Platform - 맞춤형 AI 솔루션
• SI (System Integration) - 시스템 통합
• E-Commerce Platform - 전자상거래 플랫폼
• AI ChatBot Service - 챗봇 서비스
• Demand Prediction - 수요 예측
• R&D Center - 연구개발

더 자세한 정보가 필요하시면 언제든 말씀해주세요!`;
    } else if (lowerMessage.includes('연락처') || lowerMessage.includes('전화')) {
      response = `📞 DB.INFO 연락처 정보입니다:

📧 이메일: hankjae@db-info.co.kr
📞 전화: 02-2025-8511
📠 팩스: 02-2025-8512
📍 주소: 서울특별시 금천구 서부샛길 606
       대성디폴리스 지식산업센터 B동 1410호

업무시간: 평일 09:00 - 18:00`;
    } else if (lowerMessage.includes('가격') || lowerMessage.includes('비용')) {
      response = `💰 가격 정보는 프로젝트 규모와 요구사항에 따라 달라집니다.

무료 상담을 통해 정확한 견적을 제공해드리고 있어요:

• 요구사항 분석
• 맞춤형 솔루션 설계
• 상세 견적서 제공
• 프로젝트 일정 협의

상담 신청을 원하시면 '상담 신청'이라고 말씀해주세요!`;
    } else if (lowerMessage.includes('회사') || lowerMessage.includes('소개')) {
      response = `🏢 DB.INFO는 2011년부터 시작된 IT 전문 기업입니다:

✨ 13년간의 풍부한 경험
🎯 100+ 프로젝트 성공 사례  
🤝 50+ 파트너 기업
🔧 24/7 전문 기술 지원

혁신적인 AI 기술과 데이터 분석으로 고객의 디지털 트랜스포메이션을 이끌어가고 있습니다!`;
    } else if (lowerMessage.includes('상담') || lowerMessage.includes('문의')) {
      response = `📋 무료 상담 신청을 도와드릴게요!

다음 정보를 알려주시면 더 정확한 상담이 가능합니다:
• 프로젝트 유형
• 예상 규모
• 원하는 일정
• 예산 범위

또는 직접 연락주세요:
📞 02-2025-8511
📧 hankjae@db-info.co.kr`;
    } else {
      response = `안녕하세요! 😊

다음 중 궁금한 것이 있으시면 언제든 물어보세요:
• 서비스 소개
• 연락처 정보  
• 가격 문의
• 회사 소개
• 프로젝트 상담

구체적인 질문도 환영합니다!`;
    }

    return {
      id: Date.now().toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: QuickReply) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply.text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(reply.payload);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        
        {/* 알림 배지 */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <div className="font-semibold">DB.INFO AI</div>
            <div className="text-xs text-blue-100">온라인</div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              <div className="text-sm whitespace-pre-line">{message.text}</div>
              <div className={`text-xs mt-1 opacity-70 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 빠른 답장 버튼 */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-1">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              {reply.text}
            </button>
          ))}
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatSystem;
