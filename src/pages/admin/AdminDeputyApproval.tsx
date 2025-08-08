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
  status: string;
  isAdminRequest?: boolean;
  createdAt?: string;
}

const AdminDeputyApproval: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const leavesSnap = await getDocs(collection(db, 'leaves'));
      const deputySnap = await getDocs(collection(db, 'deputyRequests'));
      const leavesData = leavesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leave));
      const deputyData = deputySnap.docs.map(doc => ({ id: doc.id, ...doc.data(), isAdminRequest: true } as Leave));
      setLeaves([...leavesData, ...deputyData]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleApprove = async (id: string, isAdminRequest?: boolean) => {
    if (isAdminRequest) {
      await updateDoc(doc(db, 'deputyRequests', id), { status: '승인' });
    } else {
      await updateDoc(doc(db, 'leaves', id), { status: '승인' });
    }
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: '승인' } : l));
  };
  const handleReject = async (id: string, isAdminRequest?: boolean) => {
    if (isAdminRequest) {
      await updateDoc(doc(db, 'deputyRequests', id), { status: '반려' });
    } else {
      await updateDoc(doc(db, 'leaves', id), { status: '반려' });
    }
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: '반려' } : l));
  };

  // 분리: 미처리(대기)와 처리된 신청
  const pending = leaves.filter(l => l.status === '대기');
  const processed = leaves.filter(l => l.status !== '대기').sort((a, b) => {
    const aDate = new Date(a.createdAt || a.endDate || a.startDate).getTime();
    const bDate = new Date(b.createdAt || b.endDate || b.startDate).getTime();
    return bDate - aDate;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">연차/대리신청 승인·반려 처리</h2>
      {loading ? <div>로딩 중...</div> : (
        <>
          <h3 className="text-lg font-bold mb-2">미처리 신청</h3>
          <table className="w-full bg-white rounded shadow mb-8">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">직원명</th>
                <th className="p-2">유형</th>
                <th className="p-2">기간</th>
                <th className="p-2">일수</th>
                <th className="p-2">사유</th>
                <th className="p-2">상태</th>
                <th className="p-2">구분</th>
                <th className="p-2">작업</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-gray-400 py-4">미처리 신청이 없습니다.</td></tr>
              ) : pending.map(l => (
                <tr key={l.id} className="border-b">
                  <td className="p-2">{l.employeeName}</td>
                  <td className="p-2">{l.type}</td>
                  <td className="p-2">{l.startDate} ~ {l.endDate}</td>
                  <td className="p-2">{l.days}</td>
                  <td className="p-2">{l.reason}</td>
                  <td className="p-2">
                    <span className={l.status === '승인' ? 'text-green-600' : l.status === '반려' ? 'text-red-600' : 'text-gray-600'}>{l.status}</span>
                  </td>
                  <td className="p-2">{l.isAdminRequest ? '대리신청' : '직원신청'}</td>
                  <td className="p-2">
                    <button onClick={() => handleApprove(l.id, l.isAdminRequest)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">승인</button>
                    <button onClick={() => handleReject(l.id, l.isAdminRequest)} className="bg-red-500 text-white px-3 py-1 rounded">반려</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-lg font-bold mb-2">처리 완료 신청 (최신순)</h3>
          <table className="w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">직원명</th>
                <th className="p-2">유형</th>
                <th className="p-2">기간</th>
                <th className="p-2">일수</th>
                <th className="p-2">사유</th>
                <th className="p-2">상태</th>
                <th className="p-2">구분</th>
                <th className="p-2">처리일자</th>
              </tr>
            </thead>
            <tbody>
              {processed.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-gray-400 py-4">처리 완료된 신청이 없습니다.</td></tr>
              ) : processed.map(l => (
                <tr key={l.id} className="border-b">
                  <td className="p-2">{l.employeeName}</td>
                  <td className="p-2">{l.type}</td>
                  <td className="p-2">{l.startDate} ~ {l.endDate}</td>
                  <td className="p-2">{l.days}</td>
                  <td className="p-2">{l.reason}</td>
                  <td className="p-2">
                    <span className={l.status === '승인' ? 'text-green-600' : l.status === '반려' ? 'text-red-600' : 'text-gray-600'}>{l.status}</span>
                  </td>
                  <td className="p-2">{l.isAdminRequest ? '대리신청' : '직원신청'}</td>
                  <td className="p-2">{l.createdAt ? l.createdAt.split('T')[0] : l.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminDeputyApproval;
