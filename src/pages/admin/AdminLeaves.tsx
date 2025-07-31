import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';

const AdminLeaves: React.FC = () => {
  const navigate = useNavigate();
  // 연차신청 폼 상태
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', reason: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate || !form.reason) {
      alert('모든 항목을 입력하세요.');
      return;
    }
    setSubmitLoading(true);
    try {
      await addDoc(collection(db, 'leaves'), {
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
        createdAt: new Date().toISOString(),
        status: '신청',
      });
      alert('연차 신청이 완료되었습니다!');
      setForm({ name: '', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      alert('신청 실패: ' + (err as Error).message);
    } finally {
      setSubmitLoading(false);
    }
  };
  const [leaves, setLeaves] = useState<any[]>([]);
  const [leavesLoading, setLeavesLoading] = useState(true);
  const [leavesError, setLeavesError] = useState('');

  const fetchLeaves = async () => {
    setLeavesLoading(true);
    try {
      const snap = await getDocs(collection(db, 'leaves'));
      setLeaves(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setLeavesError('연차신청 내역을 불러올 수 없습니다.');
    } finally {
      setLeavesLoading(false);
    }
  };
  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApprove = async (leaveId: string) => {
    try {
      // leaveId로 신청 정보 조회
      const leaveSnap = await getDocs(collection(db, 'leaves'));
      const leave = leaveSnap.docs.find(doc => doc.id === leaveId)?.data();
      if (!leave) throw new Error('신청 정보를 찾을 수 없습니다.');
      // 기간 계산 (startDate, endDate)
      if (!leave.startDate || !leave.endDate) throw new Error('신청 기간 정보가 올바르지 않습니다.');
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      // YYYY-MM-DD 형식으로 변환
      const formatDate = (d: Date) => d.toISOString().slice(0, 10);
      const startStr = formatDate(start);
      const endStr = formatDate(end);
      const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      // 직원 정보 조회
      const empSnap = await getDocs(collection(db, 'employees'));
      const empDoc = empSnap.docs.find(doc => doc.data().name === leave.name);
      if (!empDoc) throw new Error('직원 정보를 찾을 수 없습니다.');
      const emp = empDoc.data();
      const usedLeaves = (emp.usedLeaves ?? 0) + days;
      const totalLeaves = emp.totalLeaves ?? 0;
      const carryOverLeaves = emp.carryOverLeaves ?? 0;
      const remainingLeaves = totalLeaves + carryOverLeaves - usedLeaves;
      // 직원 정보 업데이트
      await updateDoc(doc(db, 'employees', empDoc.id), {
        usedLeaves,
        remainingLeaves
      });
      // 신청 상태 승인 처리
      await updateDoc(doc(db, 'leaves', leaveId), { status: '승인' });
      fetchLeaves();
    } catch (err) {
      alert('승인 처리 실패: ' + (err as Error).message);
    }
  };

  const handleReject = async (leaveId: string) => {
    try {
      await updateDoc(doc(db, 'leaves', leaveId), { status: '반려' });
      fetchLeaves();
    } catch (err) {
      alert('반려 처리 실패: ' + (err as Error).message);
    }
  };

  const [employeeStatus, setEmployeeStatus] = useState<any[]>([]);
  useEffect(() => {
    const fetchEmployeeStatus = async () => {
      try {
        const snap = await getDocs(collection(db, 'employees'));
        setEmployeeStatus(snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          email: doc.data().email ?? '',
          totalLeaves: doc.data().totalLeaves ?? 0,
          usedLeaves: doc.data().usedLeaves ?? 0,
          remainingLeaves: doc.data().remainingLeaves ?? 0
        })));
      } catch {
        setEmployeeStatus([]);
      }
    };
    fetchEmployeeStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white py-8 px-2 flex justify-center items-start">
      <div className="w-full max-w-lg mx-auto sm:max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-12 border border-blue-100 flex flex-col gap-10 sm:gap-12">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-600 text-center mb-2 tracking-tight drop-shadow-sm">관리자 연차신청 관리</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:flex-row sm:gap-8 items-stretch justify-center mb-8">
            <div className="flex flex-col items-start w-full sm:w-auto">
              <label className="font-semibold mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">이름</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full sm:w-32 border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base placeholder:text-blue-300" placeholder="이름" required />
            </div>
            <div className="flex flex-col items-start w-full sm:w-auto">
              <label className="font-semibold mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">시작일</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full sm:w-36 border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base placeholder:text-blue-300" required />
            </div>
            <div className="flex flex-col items-start w-full sm:w-auto">
              <label className="font-semibold mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">종료일</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full sm:w-36 border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base placeholder:text-blue-300" required />
            </div>
            <div className="flex flex-col items-start w-full sm:w-auto">
              <label className="font-semibold mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">사유</label>
              <input type="text" name="reason" value={form.reason} onChange={handleChange} className="w-full sm:w-40 border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base placeholder:text-blue-300" placeholder="사유" required />
            </div>
            <button type="submit" className="w-full sm:w-32 py-3 bg-blue-500/90 text-white rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-blue-600/90 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95" disabled={submitLoading}>
              {submitLoading ? '신청 중...' : '신청'}
            </button>
          </form>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-blue-500 text-center">연차신청 내역</h2>
            <div className="bg-white rounded-2xl shadow-md p-3 sm:p-7 w-full mx-auto mt-4 sm:mt-6 border border-blue-50">
              <div className="overflow-x-auto">
                {leavesLoading ? (
                  <div className="text-center py-8 text-gray-400">연차신청 내역 로딩 중...</div>
                ) : leavesError ? (
                  <div className="text-center py-8 text-red-500">{leavesError}</div>
                ) : leaves.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">신청 내역 없음</div>
                ) : (
                  <table className="min-w-full text-xs sm:text-base bg-white rounded-lg overflow-hidden">
                    <thead className="bg-blue-100 sticky top-0 z-10">
                      <tr>
                        <th className="border px-2 py-2 sm:px-4 sm:py-2 font-bold text-blue-700 bg-blue-50">번호</th>
                        <th className="border px-2 py-2 sm:px-4 sm:py-2 font-bold text-blue-700 bg-blue-50">이름</th>
                        <th className="border px-2 py-2 sm:px-4 sm:py-2 font-bold text-blue-700 bg-blue-50">시작일</th>
                        <th className="border px-2 py-2 sm:px-4 sm:py-2 font-bold text-blue-700 bg-blue-50">종료일</th>
                        <th className="border px-2 py-2 sm:px-4 sm:py-2 font-bold text-blue-700 bg-blue-50">사유</th>
                        <th className="border px-2 py-2 sm:px-4 sm:py-2 font-bold text-blue-700 bg-blue-50">신청일자</th>
                        <th className="border px-2 py-2 sm:px-4 sm:py-2 font-bold text-blue-700 bg-blue-50">상태</th>
                        <th className="border px-2 py-2 sm:px-4 sm:py-2 font-bold text-blue-700 bg-blue-50">처리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map((leave, idx) => (
                        <tr key={leave.id} className="group bg-white even:bg-blue-50/40 hover:bg-blue-100 transition border-b border-blue-50">
                          <td className="border px-2 py-2 sm:px-4 sm:py-2 font-bold text-blue-600 text-center">{idx + 1}</td>
                          <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">{leave.name}</td>
                          <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">{leave.startDate ? leave.startDate.replace(/\n/g, '').slice(0, 10) : '-'}</td>
                          <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">{leave.endDate ? leave.endDate.replace(/\n/g, '').slice(0, 10) : '-'}</td>
                          <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap truncate" title={leave.reason}>{leave.reason}</td>
                          <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">{leave.createdAt ? new Date(leave.createdAt).toLocaleDateString('ko-KR') : '-'}</td>
                          <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap text-center">
                            {leave.status === '신청' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs sm:text-sm">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                                검증
                              </span>
                            ) : leave.status === '승인' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs sm:text-sm">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                승인
                              </span>
                            ) : leave.status === '반려' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs sm:text-sm">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                반려
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-semibold text-xs sm:text-sm">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h4v4" /></svg>
                                {leave.status}
                              </span>
                            )}
                          </td>
                          <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap text-center">
                            {leave.status === '신청' ? (
                              <div className="flex gap-2 justify-center">
                                <button className="px-2 py-1 sm:px-4 sm:py-1 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition text-xs sm:text-base" onClick={() => handleApprove(leave.id)}>승인</button>
                                <button className="px-2 py-1 sm:px-4 sm:py-1 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition text-xs sm:text-base" onClick={() => handleReject(leave.id)}>반려</button>
                              </div>
                            ) : (
                              <span className="text-gray-400">처리완료</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-blue-500 text-center">직원 연차현황</h2>
          <div className="overflow-x-auto mb-8">
            {employeeStatus.length === 0 ? (
              <div className="text-center py-6 text-gray-400">직원 연차현황 데이터 없음</div>
            ) : (
              <table className="min-w-full sm:min-w-[1050px] border mb-8 whitespace-nowrap text-xs sm:text-lg shadow-md rounded-2xl bg-white">
                <thead className="sticky top-0 z-10 bg-blue-100">
                  <tr className="bg-blue-50 text-blue-900 text-xs sm:text-lg">
                    <th className="border px-2 py-2 sm:px-4 sm:py-2 rounded-tl-lg whitespace-nowrap">이메일</th>
                    <th className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">이름</th>
                    <th className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">총 연차</th>
                    <th className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">사용</th>
                    <th className="border px-2 py-2 sm:px-4 sm:py-2 rounded-tr-lg whitespace-nowrap">잔여</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeStatus.map((emp, idx) => (
                    <tr key={emp.id} className={idx % 2 === 0 ? 'bg-white even:bg-blue-50/40 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-100 transition'}>
                      <td className="border px-2 py-2 sm:px-6 sm:py-4">{emp.email}</td>
                      <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">{emp.name}</td>
                      <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">{(Number(emp.carryOverLeaves ?? 0) + Number(emp.annualLeaves ?? 0))}</td>
                      <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">{emp.usedLeaves}</td>
                      <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">{emp.remainingLeaves}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          </div>
          {/* 카드 내부 하단 네비게이션 버튼 */}
          <div className="flex justify-center mt-4 sm:mt-10">
            <button
              className="flex items-center gap-2 bg-blue-500/90 text-white rounded-full px-7 py-3 shadow-md font-semibold text-base sm:text-lg hover:bg-blue-600/90 transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => navigate('/admin/home')}
            >
              <AiOutlineHome className="text-xl sm:text-2xl" />
              <span>관리자 홈으로</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaves;
