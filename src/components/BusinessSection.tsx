import React, { useState } from "react";

interface BusinessSectionProps {
  image: string;
  title: string;
  subtitle?: string;
  description1: string;
  description2?: string;
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
          <button
            className="absolute top-4 right-6 text-4xl text-white bg-black/50 rounded-full px-4 py-2 hover:bg-blue-600 font-bold z-10"
            onClick={() => setShowModal(false)}
            aria-label="닫기"
          >
            ×
          </button>
          <img
            src={image}
            alt={title + " 대표 이미지"}
            className="w-[96vw] h-[90vh] max-w-none max-h-[90vh] object-contain rounded-2xl shadow-2xl border-4 border-white"
            style={{ boxSizing: 'border-box' }}
          />
        </div>
      )}
    </>
  );
};

export default BusinessSection;
