// ...existing code...
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
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
    <footer className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-10 px-4 mt-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        {/* 회사 정보 */}
        <div className="text-sm md:text-left text-center space-y-1">
          <div className="text-lg font-bold tracking-wide mb-1">DB.INFO Co.,Ltd.</div>
          <div><span className="font-semibold">대표</span>: 한규재 &nbsp; <span className="font-semibold">사업자등록번호</span>: 119-86-12345</div>
          <div className="flex items-center justify-center md:justify-start gap-2"><FaMapMarkerAlt className="inline-block mr-1"/>서울특별시 금천구 서부샛길 606, 대성디폴리스 B동 1410호</div>
          <div className="flex items-center justify-center md:justify-start gap-2"><FaPhoneAlt className="inline-block mr-1"/>대표전화: <a href="tel:02-780-0386" className="underline">02-780-0386</a></div>
          <div className="flex items-center justify-center md:justify-start gap-2"><FaEnvelope className="inline-block mr-1"/>이메일: <a href="mailto:hankjae@db-info.co.kr" className="underline">hankjae@db-info.co.kr</a></div>
          <div>대중교통: 1호선, 7호선 8번 출구 500미터</div>
        </div>
        {/* 소셜 링크 */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="mb-1">
            <a
              href="https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EA%B8%88%EC%B2%9C%EA%B5%AC%20%EC%84%9C%EB%B6%80%EC%83%9B%EA%B8%B8%20606,%20%EB%8C%80%EC%84%B1%EB%94%94%ED%8F%B4%EB%A6%AC%EC%8A%A4%20%EC%A7%80%EC%8B%9D%EC%82%B0%EC%97%85%EC%84%BC%ED%84%B0%20B%EB%8F%99%201410%ED%98%B8"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-xs text-white/80 hover:text-green-400 transition"
            >
              찾아오는 길
            </a>
          </div>
          <div className="text-xs text-white/80 mt-2">© 2025 DB.INFO Co.,Ltd. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}



export default Footer;

