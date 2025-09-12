import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// 연차/대리신청 데이터 타입 정의
/**
 * Leave: 연차 및 대리신청 데이터 구조
 * @property id - 문서 ID
 * @property employeeId - 직원 고유 ID
 * @property employeeName - 직원 이름
 * @property type - 연차/대리신청 유형
 * @property startDate - 시작일
 * @property endDate - 종료일
 * @property days - 사용 일수
 * @property reason - 사유
 * @property status - 상태(신청/승인/반려)
 * @property isAdminRequest - 대리신청 여부
 * @property createdAt - 생성일(타임스탬프)
 */
interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: '신청' | '승인' | '반려';
  isAdminRequest?: boolean;
  createdAt?: string;
}

/**
 * 관리자 연차/대리신청 승인/반려 페이지
 * - 미처리(대기) 신청: 모바일 카드/PC 테이블 UI
 * - 처리현황: 테이블 UI(최신순)
 * - 승인/반려 처리 및 직원 연차정보 업데이트
 */
const AdminDeputyApproval: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);

  // 최초 마운트 시 전체 데이터(연차, 대리신청, 직원) 조회
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      // 연차 신청 데이터
      const leavesSnap = await getDocs(collection(db, 'leaves'));
      // 대리신청 데이터
      const deputySnap = await getDocs(collection(db, 'deputyRequests'));
      // 직원 데이터
      const empSnap = await getDocs(collection(db, 'employees'));
      // 데이터 병합(대리신청은 isAdminRequest 플래그 추가)
      const leavesData = leavesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leave));
      const deputyData = deputySnap.docs.map(doc => ({ id: doc.id, ...doc.data(), isAdminRequest: true } as Leave));
      setLeaves([...leavesData, ...deputyData]);
      setEmployees(empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchAll();
  }, []);

  /**
   * 연차/대리신청 승인 처리
   * - 상태 '승인'으로 변경
   * - 직원 usedLeaves/remainingLeaves 업데이트
   */
  const handleApprove = async (id: string, isAdminRequest?: boolean) => {
    let targetLeave = leaves.find(l => l.id === id);
    if (!targetLeave) return;
    // 승인 처리 (컬렉션 분기)
    if (isAdminRequest) {
      await updateDoc(doc(db, 'deputyRequests', id), { status: '승인' });
    } else {
      await updateDoc(doc(db, 'leaves', id), { status: '승인' });
    }
    // 직원 연차정보 업데이트
    const emp = employees.find(e => e.id === targetLeave.employeeId || e.name === targetLeave.employeeName);
    if (emp) {
      const used = Number(emp.usedLeaves ?? 0) + Number(targetLeave.days ?? 0);
      const remain = Number(emp.remainingLeaves ?? 0) - Number(targetLeave.days ?? 0);
      await updateDoc(doc(db, 'employees', String(emp.id)), { usedLeaves: used, remainingLeaves: remain });
    }
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: '승인' } : l));
  };

  /**
   * 연차/대리신청 반려 처리
   * - 상태 '반려'로 변경
   */
  const handleReject = async (id: string, isAdminRequest?: boolean) => {
    let targetLeave = leaves.find(l => l.id === id);
    if (!targetLeave) return;
    if (isAdminRequest) {
      await updateDoc(doc(db, 'deputyRequests', id), { status: '반려' });
    } else {
      await updateDoc(doc(db, 'leaves', id), { status: '반려' });
    }
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: '반려' } : l));
  };

  // 분리: 미처리(대기)와 처리된 신청
  // pending: 상태 '신청'인 연차/대리신청
  // processed: 처리(승인/반려)된 신청, 최신순 정렬
  const pending = leaves.filter(l => l.status === '신청');
  const processed = leaves.filter(l => l.status !== '신청').sort((a, b) => {
    const aDate = new Date(a.createdAt || a.endDate || a.startDate).getTime();
    const bDate = new Date(b.createdAt || b.endDate || b.startDate).getTime();
    return bDate - aDate;
  });

  return (
    <div className="p-2 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <div className="mb-8 bg-white rounded-xl shadow-lg p-4 md:p-6 border border-blue-200 flex flex-col gap-4">
        <div className="mb-4 text-xl md:text-2xl font-extrabold text-blue-700 text-center drop-shadow">직원연차 관리</div>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <>
            {/* [모바일] 대기 신청 카드 UI - 모바일 환경에서만 노출 */}
            <div className="block md:hidden">
              {pending.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-lg font-bold">신청된 연차가 없습니다.</div>
              ) : (
                <>
                  {pending.map((l: Leave) => (
                    <div key={l.id} className="mb-4 p-4 rounded-xl shadow border">
                      <div className="font-bold text-blue-700">{l.employeeName}</div>
                      <div className="text-xs text-gray-600">{l.type} | {l.startDate} ~ {l.endDate} | {l.days}일</div>
                      <div className="text-xs text-gray-600 mb-1">사유: {l.reason}</div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleApprove(l.id, l.isAdminRequest)} className="flex-1 px-2 py-2 bg-green-500 text-white rounded font-bold shadow hover:bg-green-600 transition">
                          ✔️ 승인
                        </button>
                        <button onClick={() => handleReject(l.id, l.isAdminRequest)} className="flex-1 px-2 py-2 bg-red-500 text-white rounded font-bold shadow hover:bg-red-600 transition">
                          ❌ 반려
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            {/* [PC] 대기 신청 테이블 UI - 데스크탑 환경에서만 노출 */}
            <div className="hidden md:block">
              <table className="min-w-full text-sm text-left rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border px-3 py-2 font-bold text-blue-700">직원명</th>
                    <th className="border px-3 py-2 font-bold text-blue-700">유형</th>
                    <th className="border px-3 py-2 font-bold text-blue-700">기간</th>
                    <th className="border px-3 py-2 font-bold text-blue-700">일수</th>
                    <th className="border px-3 py-2 font-bold text-blue-700">사유</th>
                    <th className="border px-3 py-2 font-bold text-blue-700">상태</th>
                    <th className="border px-3 py-2 font-bold text-blue-700">구분</th>
                    <th className="border px-3 py-2 font-bold text-blue-700">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-8 text-gray-400 text-lg font-bold">신청된 연차가 없습니다.</td></tr>
                  ) : (
                    <>
                      {pending.map((l: Leave) => (
                        <tr key={l.id} className="bg-white hover:bg-blue-50 transition">
                          <td className="border px-3 py-2 whitespace-nowrap">{l.employeeName}</td>
                          <td className="border px-3 py-2 whitespace-nowrap">{l.type}</td>
                          <td className="border px-3 py-2 whitespace-nowrap">{l.startDate} ~ {l.endDate}</td>
                          <td className="border px-3 py-2 whitespace-nowrap text-blue-700 font-bold">{l.days}</td>
                          <td className="border px-3 py-2 whitespace-nowrap">{l.reason}</td>
                          <td className="border px-3 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              l.status === '신청' ? 'bg-yellow-100 text-yellow-700' :
                              l.status === '승인' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>{l.status}</span>
                          </td>
                          <td className="border px-3 py-2 whitespace-nowrap">
                            {l.isAdminRequest ? (
                              <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">대리신청</span>
                            ) : (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">직원신청</span>
                            )}
                          </td>
                          <td className="border px-3 py-2 whitespace-nowrap text-center">
                            <button onClick={() => handleApprove(l.id, l.isAdminRequest)} className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold shadow hover:bg-green-600 transition mx-1">
                              <span>✔️</span> 승인
                            </button>
                            <button onClick={() => handleReject(l.id, l.isAdminRequest)} className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition mx-1">
                              <span>❌</span> 반려
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {/* 처리현황(승인/반려) 영역: 최신순 테이블 UI */}
      <div className="flex flex-col items-center mt-10">
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col gap-4 w-full">
          <div className="mb-4 text-2xl font-extrabold text-gray-700 text-center drop-shadow">처리현황(최신순)</div>
          {/* 승인/반려 처리된 신청만 노출, 최신순 정렬 */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-3 py-2 font-bold text-gray-700">직원명</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">유형</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">기간</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">일수</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">사유</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">상태</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">구분</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">처리일자</th>
                </tr>
              </thead>
              <tbody>
                {processed.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-400 text-lg font-bold">처리된 연차가 없습니다.</td></tr>
                ) : (
                  processed.map((l: Leave) => (
                    <tr key={l.id} className="bg-white hover:bg-blue-50 transition">
                      <td className="border px-3 py-2 whitespace-nowrap">{l.employeeName}</td>
                      <td className="border px-3 py-2 whitespace-nowrap">{l.type}</td>
                      <td className="border px-3 py-2 whitespace-nowrap">{l.startDate} ~ {l.endDate}</td>
                      <td className="border px-3 py-2 whitespace-nowrap text-blue-700 font-bold">{l.days}</td>
                      <td className="border px-3 py-2 whitespace-nowrap">{l.reason}</td>
                      <td className="border px-3 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          l.status === '승인' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>{l.status}</span>
                      </td>
                      <td className="border px-3 py-2 whitespace-nowrap">
                        {l.isAdminRequest ? (
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">대리신청</span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">직원신청</span>
                        )}
                      </td>
                      <td className="border px-3 py-2 whitespace-nowrap text-gray-500 text-xs">
                        {typeof l.createdAt === 'string' ? l.createdAt.split('T')[0] : l.endDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* 관리자 홈으로 이동 버튼 */}
        <button className="px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 font-bold text-lg transition-all duration-150 flex items-center gap-2 mt-8" onClick={() => window.location.href = '/admin/home'}>
          <span>🏠</span> 관리자 홈으로
        </button>
      </div>
    </div>
  );
};

export default AdminDeputyApproval;