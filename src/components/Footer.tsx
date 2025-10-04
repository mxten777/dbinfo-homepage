// ...existing code...
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
// ...existing code...
// 연차기록 전체 삭제 함수
export async function clearLeaves(setUploadMessage: (msg: string) => void) {
  try {
    const snapshot = await getDocs(collection(db, 'leaves'));
    const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'leaves', docSnap.id)));
    await Promise.all(deletePromises);
    setUploadMessage('연차기록 전체 삭제 완료.');
    // setTimeout(() => window.location.reload(), 1500);
  } catch {
    setUploadMessage('연차기록 삭제 중 오류가 발생했습니다.');
  }
}
// 직원정보 전체 삭제 함수
export async function clearEmployees(setUploadMessage: (msg: string) => void) {
  try {
    const snapshot = await getDocs(collection(db, 'employees'));
    const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'employees', docSnap.id)));
    await Promise.all(deletePromises);
    setUploadMessage('직원정보 전체 삭제 완료.');
    // setTimeout(() => window.location.reload(), 1500);
  } catch {
    setUploadMessage('삭제 중 오류가 발생했습니다.');
  }
}
import { db } from '../firebaseConfig';

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
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-10 right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 px-6 py-16">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-space mb-4">
                DB.INFO
              </h3>
              <p className="text-blue-100 leading-relaxed mb-6">
                13년간의 전문성과 혁신적 기술력으로 디지털 미래를 선도하는 IT 솔루션 파트너입니다.
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">본사 주소</h4>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    서울특별시 금천구 서부샛길 606<br />
                    대성디폴리스 지식산업센터 B동 1410호
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
                    지하철 1호선, 7호선 8번 출구 500m
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">이메일</h4>
                  <p className="text-blue-200 text-sm">hankjae@db-info.co.kr</p>
                  <p className="text-blue-200 text-sm">6511kesuk@db-info.co.kr (관리이사)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">전화번호</h4>
                  <p className="text-blue-200 text-sm">02-2025-8511 (전화)</p>
                  <p className="text-blue-200 text-sm">02-2025-8512 (팩스)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 font-space">서비스</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200 text-sm">웹 개발</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200 text-sm">모바일 앱</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200 text-sm">데이터베이스</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200 text-sm">클라우드 & DevOps</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200 text-sm">UI/UX 디자인</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200 text-sm">기술 컨설팅</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 font-space">회사</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200 text-sm">회사 소개</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200 text-sm">팀 소개</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200 text-sm">채용 정보</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200 text-sm">뉴스</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200 text-sm">블로그</a></li>
              <li>
                <a
                  href="https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EA%B8%88%EC%B2%9C%EA%B5%AC%20%EC%84%9C%EB%B6%80%EC%83%9B%EA%B8%B8%20606,%20%EB%8C%80%EC%84%B1%EB%94%94%ED%8F%B4%EB%A6%AC%EC%8A%A4%20%EC%A7%80%EC%8B%9D%EC%82%B0%EC%97%85%EC%84%BC%ED%84%B0%20B%EB%8F%99%201410%ED%98%B8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  오시는 길
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-blue-300 text-sm">
              © 2024 DB.INFO Co., Ltd. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-blue-200 text-sm mr-2">Follow us:</span>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.750-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>

            {/* Back to Top */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 hover:scale-110"
              aria-label="페이지 상단으로 이동"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}



export default Footer;

