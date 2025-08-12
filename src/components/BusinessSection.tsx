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
      <section className="bg-white rounded-3xl shadow-2xl flex flex-col gap-8 p-10 mb-16">
        <div className="text-left">
          <img
            src={image}
            alt={title + " 대표 이미지"}
            className="w-full h-48 md:h-56 object-cover rounded-xl shadow-lg border border-gray-100 mb-4"
            style={{ boxSizing: 'border-box' }}
          />
          <h3 className="text-3xl font-extrabold text-blue-800 mb-3">{title}</h3>
          {subtitle && <p className="text-blue-600 mb-4 font-semibold text-lg">{subtitle}</p>}
          <p className="text-gray-700 mb-3 text-base md:text-lg font-medium">{description1}</p>
          {description2 && <p className="text-gray-600 mb-3 text-base">{description2}</p>}
          {features.length > 0 && (
            <ul className="text-base text-gray-700 list-disc list-inside mb-2 space-y-1">
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
          <button
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-lg shadow hover:scale-105 transition"
            onClick={() => setShowModal(true)}
          >
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
