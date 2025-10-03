import React, { useState } from "react";

interface BusinessSectionProps {
  image: string;
  title: string;
  subtitle?: string;
  description1: string;
  description2?: React.ReactNode;
  features?: string[];
}


const BusinessSection: React.FC<BusinessSectionProps> = ({
  image,
  title,
  subtitle,
  description1,
  description2,
  features = [],
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
  <section className="bg-gradient-to-br from-gradientFrom via-gradientVia to-gradientTo rounded-3xl shadow-3xl flex flex-col gap-8 p-6 md:p-10 mb-16 border border-navy/20">
  <div className="text-left">
          <div className="relative mb-4">
            <img
              src={image}
              alt={title + " 대표 이미지"}
              className="w-full h-44 md:h-56 object-cover rounded-2xl shadow-xl border-2 border-gradientVia/40"
              style={{ boxSizing: 'border-box' }}
            />
            <div className="absolute top-2 right-2 bg-gradient-to-r from-point to-accent rounded-full p-2 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-black text-primary-dark mb-2 md:mb-3 tracking-tight drop-shadow-sm">
            {title}
          </h3>
          {subtitle && (
            <p className="text-accent font-semibold text-base md:text-lg mb-3 md:mb-4">
              {subtitle}
            </p>
          )}
          <p className="font-sans text-base md:text-lg text-sub mb-2 md:mb-3 font-medium leading-relaxed">
            {description1}
          </p>
          {description2 && (
            <p className="font-sans text-base text-muted mb-2 md:mb-3">
              {description2}
            </p>
          )}
          {features.length > 0 && (
            <ul className="text-base text-muted list-disc list-inside mb-2 space-y-1">
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
          <button
            className="mt-4 px-6 py-2 bg-gradient-to-r from-point via-accent to-primary text-contrast font-extrabold rounded-xl shadow-xl hover:scale-105 hover:from-primary-dark hover:to-accent-dark transition-all duration-200 text-base md:text-lg flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            대표 이미지 크게 보기
          </button>
        </div>
      </section>
      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            <img
              src={image}
              alt={title + " 대표 이미지"}
              className="w-full h-full max-w-3xl max-h-[80vh] object-cover rounded-2xl shadow-2xl border-4 border-white"
              style={{ boxSizing: 'border-box' }}
            />
            <button
              className="absolute bottom-10 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 text-lg"
              onClick={() => setShowModal(false)}
              aria-label="뒤로가기"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              뒤로가기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessSection;
