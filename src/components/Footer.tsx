import React from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import FadeSlideIn from './FadeSlideIn';

// 🎨 프리미엄 푸터 스타일 시스템 - 극강 가독성
const FOOTER_STYLES = {
  container: "bg-slate-800 relative overflow-hidden",
  wrapper: "relative z-10 max-w-7xl mx-auto",
  background: "absolute inset-0 overflow-hidden",
  orb: {
    primary: "absolute top-20 right-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow",
    secondary: "absolute bottom-20 left-32 w-64 h-64 bg-purple-500/4 rounded-full blur-3xl animate-pulse-slow",
    tertiary: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl animate-float"
  },
  grid: "grid lg:grid-cols-4 md:grid-cols-2 gap-8 px-6 py-16",
  card: "bg-white/95 rounded-2xl border-2 border-slate-200 shadow-xl p-8 hover:shadow-2xl transition-all duration-500",
  heading: "text-2xl font-bold text-slate-900 mb-6 drop-shadow-lg",
  contact: {
    item: "flex items-start gap-4 p-5 bg-slate-100 rounded-xl border-2 border-slate-300 hover:border-slate-400 transition-all duration-300 group shadow-lg",
    icon: "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105",
    iconPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600",
    iconSecondary: "bg-gradient-to-r from-indigo-600 to-purple-600",
    iconTertiary: "bg-gradient-to-r from-green-600 to-emerald-600"
  },
  link: "text-slate-700 hover:text-slate-900 transition-all duration-300 text-base font-semibold hover:translate-x-1 block py-2 hover:bg-slate-200 px-3 rounded-lg",
  social: {
    container: "flex items-center gap-4",
    button: "w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all duration-300 hover:scale-110 border-2 border-slate-300 hover:border-slate-400 shadow-lg"
  },
  bottom: "border-t-2 border-slate-300 px-6 py-8 bg-slate-100",
  backToTop: "w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-glow hover:shadow-blue-500/25"
} as const;

// 🌟 배경 애니메이션 컴포넌트
const FooterBackground: React.FC = () => (
  <div className={FOOTER_STYLES.background}>
    <div className={FOOTER_STYLES.orb.primary}></div>
    <div className={FOOTER_STYLES.orb.secondary} style={{ animationDelay: '2s' }}></div>
    <div className={FOOTER_STYLES.orb.tertiary}></div>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>
  </div>
);

// 📞 연락처 카드 컴포넌트
const ContactCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  iconStyle: string;
  delay?: number;
}> = ({ icon, title, content, iconStyle, delay = 0 }) => (
  <FadeSlideIn delay={delay}>
    <div className={FOOTER_STYLES.contact.item}>
      <div className={`${FOOTER_STYLES.contact.icon} ${iconStyle}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-slate-900 font-bold text-lg mb-3 drop-shadow-sm">{title}</h4>
        <div className="text-slate-800 text-base leading-relaxed font-semibold">
          {content}
        </div>
      </div>
    </div>
  </FadeSlideIn>
);

// 🔗 링크 섹션 컴포넌트
const LinkSection: React.FC<{
  title: string;
  links: Array<{ href: string; label: string; external?: boolean }>;
  delay?: number;
}> = ({ title, links, delay = 0 }) => (
  <FadeSlideIn delay={delay}>
    <div className={FOOTER_STYLES.card}>
      <h4 className={FOOTER_STYLES.heading}>{title}</h4>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a 
              href={link.href} 
              className={FOOTER_STYLES.link}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {link.external && (
                <svg className="w-3 h-3 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </FadeSlideIn>
);

// 📱 소셜 버튼 컴포넌트
const SocialButton: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
}> = ({ href, icon, label }) => (
  <a 
    href={href} 
    className={FOOTER_STYLES.social.button}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

// 🗂️ 데이터 관리 함수들 (기존 기능 유지)
export async function clearLeaves(setUploadMessage: (msg: string) => void) {
  try {
    const snapshot = await getDocs(collection(db, 'leaves'));
    const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'leaves', docSnap.id)));
    await Promise.all(deletePromises);
    setUploadMessage('연차기록 전체 삭제 완료.');
  } catch {
    setUploadMessage('연차기록 삭제 중 오류가 발생했습니다.');
  }
}

export async function clearEmployees(setUploadMessage: (msg: string) => void) {
  try {
    const snapshot = await getDocs(collection(db, 'employees'));
    const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'employees', docSnap.id)));
    await Promise.all(deletePromises);
    setUploadMessage('직원정보 전체 삭제 완료.');
  } catch {
    setUploadMessage('삭제 중 오류가 발생했습니다.');
  }
}

const employeeSamples = [
  { name: '한규재', residentId: '621021-', gender: '남', position: '사장', department: '임원', final: '관리직', joinDate: '2012-10-10', contact: '010-4211-1849', totalLeaves: 15, usedLeaves: 0, remainingLeaves: 15 },
  { name: '김애숙', residentId: '660415-', gender: '여', position: '이사', department: '임원', final: '관리직', joinDate: '2019-05-01', contact: '010-6341-2515', totalLeaves: 15, usedLeaves: 0, remainingLeaves: 15 },
  { name: '박동영', residentId: '940927-', gender: '남', position: '사원', department: 'SI사업부', final: '개발', joinDate: '2021-11-08', contact: '010-2908-1740', totalLeaves: 15, usedLeaves: 0, remainingLeaves: 15 },
  { name: '윤충희', residentId: '890412-', gender: '남', position: '사원', department: '기술연구소', final: '전임', joinDate: '2022-06-01', contact: '010-2730-1329', totalLeaves: 15, usedLeaves: 0, remainingLeaves: 15 },
  { name: '김예은', residentId: '890318-', gender: '여', position: '사원', department: 'SI사업부', final: '개발', joinDate: '2022-08-01', contact: '010-5502-2135', totalLeaves: 15, usedLeaves: 0, remainingLeaves: 15 },
  { name: '최한결', residentId: '940530-', gender: '남', position: '사원', department: 'SI사업부', final: '개발', joinDate: '2022-08-08', contact: '010-2139-2477', totalLeaves: 15, usedLeaves: 0, remainingLeaves: 15 },
  { name: '김종악', residentId: '580212-', gender: '남', position: '기술이사', department: 'SI사업부', final: '개발', joinDate: '2022-09-19', contact: '010-6206-4041', totalLeaves: 15, usedLeaves: 0, remainingLeaves: 15 },
  { name: '김예종', residentId: '950417-', gender: '남', position: '사원', department: 'SI사업부', final: '개발', joinDate: '2022-12-26', contact: '010-9628-2146', totalLeaves: 15, usedLeaves: 0, remainingLeaves: 15 },
  { name: '성기찬', residentId: '820223-', gender: '남', position: '이사', department: 'SI사업부', final: '개발', joinDate: '2023-01-01', contact: '010-4015-5622', totalLeaves: 15, usedLeaves: 0, remainingLeaves: 15 },
  { name: '이우철', residentId: '920801-', gender: '남', position: '사원', department: 'SI사업부', final: '개발', joinDate: '2023-01-09', contact: '010-5131-4567', totalLeaves: 15, usedLeaves: 0, remainingLeaves: 15 },
  { name: '이준민', residentId: '960401-11', gender: '남', position: '사원', department: 'SI사업부', final: '개발', joinDate: '2024-03-01', contact: '010-7357-6325', totalLeaves: 15, usedLeaves: 0, remainingLeaves: 15 }
];

export async function uploadUniqueEmployees(setUploadMessage: (msg: string) => void) {
  try {
    const snapshot = await getDocs(collection(db, 'employees'));
    const existing = snapshot.docs.map(doc => doc.data().residentId);
    let added = 0;
    for (const emp of employeeSamples) {
      if (!existing.includes(emp.residentId)) {
        await addDoc(collection(db, 'employees'), emp);
        added++;
      }
    }
    if (added > 0) {
      setUploadMessage(`직원정보 ${added}명 업로드 완료.`);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setUploadMessage('이미 등록된 직원입니다.');
    }
  } catch {
    setUploadMessage('업로드 중 오류가 발생했습니다.');
  }
}

function Footer() {

  const serviceLinks = [
    { href: "#", label: "🌐 웹 개발" },
    { href: "#", label: "📱 모바일 앱" },
    { href: "#", label: "🗄️ 데이터베이스" },
    { href: "#", label: "☁️ 클라우드 & DevOps" },
    { href: "#", label: "🎨 UI/UX 디자인" },
    { href: "#", label: "💡 기술 컨설팅" }
  ];

  const companyLinks = [
    { href: "#about", label: "🏢 회사 소개" },
    { href: "#team", label: "👥 팀 소개" },
    { href: "#recruit", label: "💼 채용 정보" },
    { href: "#news", label: "📰 뉴스" },
    { href: "#blog", label: "📝 기술 블로그" },
    { 
      href: "https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EA%B8%88%EC%B2%9C%EA%B5%AC%20%EC%84%9C%EB%B6%80%EC%83%9B%EA%B8%B8%20606,%20%EB%8C%80%EC%84%B1%EB%94%94%ED%8F%B4%EB%A6%AC%EC%8A%A4%20%EC%A7%80%EC%8B%9D%EC%82%B0%EC%97%85%EC%84%BC%ED%84%B0%20B%EB%8F%99%201410%ED%98%B8", 
      label: "🗺️ 오시는 길", 
      external: true 
    }
  ];

  return (
    <footer id="footer" className={FOOTER_STYLES.container}>
      <FooterBackground />
      
      <div className={FOOTER_STYLES.wrapper}>
        {/* 메인 컨텐츠 */}
        <div className={FOOTER_STYLES.grid}>
          {/* 회사 정보 및 연락처 */}
          <div className="lg:col-span-2 space-y-6">
            <FadeSlideIn>
              <div className="mb-8">
                <h3 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  DB.INFO
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  13년간의 전문성과 혁신적 기술력으로 디지털 미래를 선도하는 IT 솔루션 파트너입니다.
                </p>
              </div>
            </FadeSlideIn>
            
            {/* 연락처 정보 */}
            <div className="space-y-4">
              <ContactCard
                icon={
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                title="본사 주소"
                content={
                  <>
                    서울특별시 금천구 서부샛길 606<br />
                    대성디폴리스 지식산업센터 B동 1410호<br />
                    <span className="text-blue-300 text-xs">지하철 1호선, 7호선 8번 출구 500m</span>
                  </>
                }
                iconStyle={FOOTER_STYLES.contact.iconPrimary}
                delay={200}
              />

              <ContactCard
                icon={
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                title="이메일"
                content={
                  <>
                    hankjae@db-info.co.kr<br />
                    6511kesuk@db-info.co.kr <span className="text-xs text-slate-600 font-semibold">(관리이사)</span>
                  </>
                }
                iconStyle={FOOTER_STYLES.contact.iconSecondary}
                delay={300}
              />

              <ContactCard
                icon={
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                title="전화번호"
                content={
                  <>
                    02-2025-8511 <span className="text-xs text-slate-600 font-semibold">(전화)</span><br />
                    02-2025-8512 <span className="text-xs text-slate-600 font-semibold">(팩스)</span>
                  </>
                }
                iconStyle={FOOTER_STYLES.contact.iconTertiary}
                delay={400}
              />
            </div>
          </div>

          {/* 서비스 링크 */}
          <LinkSection 
            title="🚀 서비스"
            links={serviceLinks}
            delay={500}
          />

          {/* 회사 링크 */}
          <LinkSection 
            title="🏢 회사 정보"
            links={companyLinks}
            delay={600}
          />
        </div>

        {/* 하단 섹션 */}
        <div className={FOOTER_STYLES.bottom}>
          <FadeSlideIn delay={700}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* 저작권 */}
              <div className="text-slate-800 text-base font-semibold">
                © 2024 DB.INFO Co., Ltd. All rights reserved. | 
                <span className="text-blue-700 ml-2 font-bold">Premium IT Solutions Partner</span>
              </div>

              {/* 소셜 링크 */}
              <div className="flex items-center gap-6">
                <span className="text-slate-800 text-base font-bold">Follow us:</span>
                <div className={FOOTER_STYLES.social.container}>
                  <SocialButton
                    href="#"
                    label="Twitter"
                    icon={
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    }
                  />
                  
                  <SocialButton
                    href="#"
                    label="LinkedIn"
                    icon={
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    }
                  />

                  <SocialButton
                    href="#"
                    label="GitHub"
                    icon={
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    }
                  />
                </div>
              </div>

              {/* 상단 이동 버튼 */}
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={FOOTER_STYLES.backToTop}
                aria-label="페이지 상단으로 이동"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </FadeSlideIn>
        </div>
      </div>
    </footer>
  );
}

export default Footer;