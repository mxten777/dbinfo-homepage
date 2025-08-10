import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

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

const AdminDeputyApproval: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const leavesSnap = await getDocs(collection(db, 'leaves'));
      const deputySnap = await getDocs(collection(db, 'deputyRequests'));
      const empSnap = await getDocs(collection(db, 'employees'));
      const leavesData = leavesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leave));
      const deputyData = deputySnap.docs.map(doc => ({ id: doc.id, ...doc.data(), isAdminRequest: true } as Leave));
      setLeaves([...leavesData, ...deputyData]);
      setEmployees(empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleApprove = async (id: string, isAdminRequest?: boolean) => {
    let targetLeave = leaves.find(l => l.id === id);
    if (!targetLeave) return;
    // 승인 처리
    if (isAdminRequest) {
      await updateDoc(doc(db, 'deputyRequests', id), { status: '승인' });
    } else {
      await updateDoc(doc(db, 'leaves', id), { status: '승인' });
    }
    // 직원 usedLeaves/remainingLeaves 업데이트
  const emp = employees.find(e => e.id === targetLeave.employeeId || e.name === targetLeave.employeeName);
    if (emp) {
      const used = Number(emp.usedLeaves ?? 0) + Number(targetLeave.days ?? 0);
      const remain = Number(emp.remainingLeaves ?? 0) - Number(targetLeave.days ?? 0);
      await updateDoc(doc(db, 'employees', String(emp.id)), { usedLeaves: used, remainingLeaves: remain });
      console.log(`[승인] 직원 ${emp.name} (${emp.id}) usedLeaves: ${used}, remainingLeaves: ${remain}`);
    } else {
      console.warn(`[승인] 직원 정보 없음: ${targetLeave.employeeId}, ${targetLeave.employeeName}`);
    }
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: '승인' } : l));
  };
  const handleReject = async (id: string, isAdminRequest?: boolean) => {
    let targetLeave = leaves.find(l => l.id === id);
    if (!targetLeave) return;
    if (isAdminRequest) {
      await updateDoc(doc(db, 'deputyRequests', id), { status: '반려' });
    } else {
      await updateDoc(doc(db, 'leaves', id), { status: '반려' });
    }
    console.log(`[반려] 신청 ${id} (${targetLeave.employeeName}) 반려 처리됨.`);
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: '반려' } : l));
  };

  // 분리: 미처리(대기)와 처리된 신청
  const pending = leaves.filter(l => l.status === '신청');
  const processed = leaves.filter(l => l.status !== '신청').sort((a, b) => {
    const aDate = new Date(a.createdAt || a.endDate || a.startDate).getTime();
    const bDate = new Date(b.createdAt || b.endDate || b.startDate).getTime();
    return bDate - aDate;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-blue-200 flex flex-col gap-4">
        <div className="mb-4 text-2xl font-extrabold text-blue-700 text-center drop-shadow">연차신청 현황</div>
        {loading ? <div>로딩 중...</div> : (
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
              ) : pending.map(l => (
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
            </tbody>
          </table>
        )}
      </div>
      <div className="flex flex-col items-center mt-10">
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col gap-4 w-full">
          <div className="mb-4 text-2xl font-extrabold text-gray-700 text-center drop-shadow">처리현황(최신순)</div>
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
                ) : processed.map(l => (
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
                      {l.createdAt ? l.createdAt.split('T')[0] : l.endDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDeputyApproval;
// ...existing code...
