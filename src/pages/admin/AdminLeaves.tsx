import React, { useState, useEffect } from 'react';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { Leave } from '../../types/employee';

const AdminLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    // leaves와 deputyRequests 통합
    const unsubLeaves = onSnapshot(collection(db, 'leaves'), snap => {
      const leaveData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id, isAdminRequest: false }) as Leave);
      setLeaves(prev => {
        // deputyRequests는 아래에서 합침
        const onlyDeputy = prev.filter(l => l.isAdminRequest);
        return [...leaveData, ...onlyDeputy];
      });
    });
    const unsubDeputy = onSnapshot(collection(db, 'deputyRequests'), snap => {
      const deputyData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id, isAdminRequest: true }) as Leave);
      setLeaves(prev => {
        // leaves는 위에서 합침
        const onlyLeaves = prev.filter(l => !l.isAdminRequest);
        return [...onlyLeaves, ...deputyData];
      });
    });
    return () => {
      unsubLeaves();
      unsubDeputy();
    };
  }, []);

  // 승인/반려 처리
  const updateLeaveStatus = async (id: string, status: '승인' | '반려') => {
    try {
      // leaves와 deputyRequests 모두에서 id를 찾음
      const leaveRef = doc(db, 'leaves', id);
      const deputyRef = doc(db, 'deputyRequests', id);
      // 우선 deputyRequests에서 시도, 없으면 leaves에서 시도
      try {
        await updateDoc(deputyRef, { status });
      } catch {
        await updateDoc(leaveRef, { status });
      }
    } catch (err) {
      alert('상태 변경 실패: ' + err);
    }
  };


  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-1">전체 연차 현황</h2>
          <p className="text-gray-500">모든 직원의 연차 신청 현황을 확인할 수 있습니다.</p>
        </div>
        <button
          className="px-5 py-2 rounded-lg bg-sky-600 text-white font-bold shadow hover:bg-sky-700 transition"
          onClick={() => window.location.href = '/admin'}
        >관리자 홈</button>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-4 text-left">직원 정보</th>
              <th className="px-6 py-4 text-center">유형</th>
              <th className="px-6 py-4 text-center">연차 기간</th>
              <th className="px-6 py-4 text-center">일수</th>
              <th className="px-6 py-4 text-center">사유</th>
              <th className="px-6 py-4 text-center">상태</th>
              <th className="px-6 py-4 text-center">구분</th>
              <th className="px-6 py-4 text-center">작업</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-semibold text-base">{leave.employeeName ? leave.employeeName : (leave.name ? leave.name : '이름없음')}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 font-bold">{leave.type}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {(leave.startDate || '') + ' ~ ' + (leave.endDate || '')}
                </td>
                <td className="px-6 py-4 text-center">{leave.days}일</td>
                <td className="px-6 py-4 text-center">{leave.reason || '-'}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-4 py-1 rounded-full font-semibold ${leave.status === '신청' ? 'bg-yellow-100 text-yellow-700' : leave.status === '승인' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{leave.status}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded ${leave.isAdminRequest ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>{leave.isAdminRequest ? '대리신청' : '직원신청'}</span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  {leave.status === '신청' && (
                    <>
                      <button className="px-4 py-1 rounded bg-green-100 text-green-700 font-bold hover:bg-green-200 transition" onClick={() => updateLeaveStatus(leave.id, '승인')}>승인</button>
                      <button className="px-4 py-1 rounded bg-red-100 text-red-700 font-bold hover:bg-red-200 transition" onClick={() => updateLeaveStatus(leave.id, '반려')}>반려</button>
                    </>
                  )}
                  {leave.status !== '신청' && (
                    <span className="text-gray-400">처리 완료</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeaves;