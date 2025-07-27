import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import type { Employee, Leave } from '../types/employee';

import { useAuth } from '../AuthContext';

const Leaves: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ employeeId: '', date: '', reason: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  // 관리자 여부를 useAuth의 user.email로 직접 판별
  const isAdmin = user?.email === 'west@naver.com';
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const empSnap = await getDocs(collection(db, 'employees'));
      const leaveSnap = await getDocs(collection(db, 'leaves'));
      setEmployees(empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
      setLeaves(leaveSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leave)));
      setLoading(false);
    };
    fetchData();
  }, []);

  // 직원 로그인 시 form.employeeId를 항상 user.uid로 동기화
  useEffect(() => {
    if (user && !isAdmin) {
      setForm(f => ({ ...f, employeeId: user.uid }));
    }
  }, [user, isAdmin]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    if (!form.date || !form.reason) {
      setSubmitError('모든 항목을 입력하세요.');
      setSubmitLoading(false);
      return;
    }
    // 직원 로그인 시 employeeId는 항상 user.uid로 강제 세팅
    const employeeId = isAdmin ? form.employeeId : user?.uid;
    if (!employeeId) {
      setSubmitError('직원 정보가 올바르지 않습니다.');
      setSubmitLoading(false);
      return;
    }
    try {
      // 직원 이름 찾기
      const emp = employees.find(e => e.id === employeeId);
      const now = new Date();
      const newLeave: Omit<Leave, 'id'> = {
        employeeId,
        employeeName: emp ? emp.name : '',
        date: form.date, // 사용일자(직원이 입력)
        reason: form.reason,
        status: '신청',
        createdAt: now.toISOString() // 신청일자(시스템 일시)
      };
      // 1. addDoc으로 문서 생성 (id 필드 없이)
      const docRef = await import('firebase/firestore').then(firestore =>
        firestore.addDoc(firestore.collection(db, 'leaves'), newLeave)
      );
      // 2. 생성된 문서에 id 필드 업데이트
      await import('firebase/firestore').then(firestore =>
        firestore.updateDoc(firestore.doc(db, 'leaves', docRef.id), { id: docRef.id })
      );
      // 3. 상태 반영
      setLeaves(prev => [...prev, { ...newLeave, id: docRef.id }]);
      setForm({ employeeId: '', date: '', reason: '' });
    } catch (err) {
      setSubmitError('신청 실패');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleStatusChange = async (leaveId: string, status: '승인' | '거절') => {
    setActionLoading(leaveId + status);
    try {
      const now = new Date();
      const leaveRef = doc(db, 'leaves', leaveId);
      await updateDoc(leaveRef, { status, processedAt: now.toISOString() });
      // Firestore에 성공적으로 반영된 경우에만 상태 변경
      setLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status, processedAt: now.toISOString() } : l));
      // 승인 시 직원 잔여일수 반영
      if (status === '승인') {
        const leave = leaves.find(l => l.id === leaveId);
        if (leave) {
          const empRef = doc(db, 'employees', leave.employeeId);
          const emp = employees.find(e => e.id === leave.employeeId);
          if (emp) {
            await updateDoc(empRef, {
              usedLeaves: (emp.usedLeaves ?? 0) + 1,
              remainingLeaves: (emp.remainingLeaves ?? 0) - 1
            });
            setEmployees(prev => prev.map(e =>
              e.id === emp.id
                ? { ...e, usedLeaves: (e.usedLeaves ?? 0) + 1, remainingLeaves: (e.remainingLeaves ?? 0) - 1 }
                : e
            ));
          }
        }
      }
      setStatusMessage(status === '승인' ? '승인되었습니다.' : '거절되었습니다.');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      setStatusMessage('상태 변경 실패');
      setTimeout(() => setStatusMessage(''), 2000);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-4 md:p-10 bg-gradient-to-br from-blue-100 to-white min-h-screen font-sans">
      {/* 전체 상단 타이틀 */}
      <div className="max-w-5xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-2 drop-shadow-lg tracking-tight">DB.INFO 연차 관리 시스템</h1>
        <p className="text-center text-lg md:text-xl text-blue-700 mb-6 font-medium">연차 신청, 내역 확인, 회사 공지까지 한눈에!</p>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-blue-200 rounded mx-auto mb-4"></div>
      </div>
      {/* 상단 유저/관리자 카드 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="col-span-1 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-100">
          <div className="bg-blue-100 rounded-full p-4 mb-2">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div className="text-xl font-bold text-blue-700 mb-1">{user?.email}</div>
          <div className="text-gray-500 text-base mb-2">환영합니다! 오늘도 힘내세요.</div>
          <button onClick={logout} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 font-semibold text-base">로그아웃</button>
        </div>
        <div className="col-span-1 bg-white rounded-2xl shadow-xl p-6 border border-blue-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
            <span className="text-lg font-bold text-blue-700">회사 공지사항</span>
          </div>
          <div className="text-gray-400 text-base">공지사항 없음</div>
        </div>
        <div className="col-span-1 bg-white rounded-2xl shadow-xl p-6 border border-blue-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            <span className="text-lg font-bold text-blue-700">내 연차 신청 내역</span>
          </div>
          <div className="text-gray-400 text-base">신청 내역 없음</div>
        </div>
      </div>
      {/* 관리자 홈 버튼 */}
      {isAdmin && (
        <div className="max-w-5xl mx-auto mb-8 flex justify-end">
          <button
            onClick={() => navigate('/admin-home')}
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 font-bold shadow text-lg"
          >
            관리자홈
          </button>
        </div>
      )}
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <>
          {/* 상단 인사/잔여연차 카드 */}
          {/* 잔여 연차 카드 (직원만) */}
          {user && !isAdmin && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-xl p-8 border border-blue-200">
                <div className="bg-blue-200 rounded-full p-4">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-800 mb-1">{employees.find(e => e.id === user.uid)?.name || user.email}</div>
                  <div className="text-gray-600 text-lg">잔여 연차 <span className="text-blue-700 font-extrabold text-2xl">{employees.find(e => e.id === user.uid)?.remainingLeaves ?? '-'}</span>일</div>
                </div>
              </div>
            </div>
          )}

          {/* 연차 신청 폼 카드 */}
          {user && (
            isAdmin ? (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8 bg-white rounded-2xl shadow-lg p-6 border border-blue-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold mb-1 text-blue-700">직원</label>
                  <select
                    name="employeeId"
                    value={form.employeeId}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">직원 선택</option>
                    {employees.map((emp, idx) => (
                      <option key={emp.id + '-' + idx} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold mb-1 text-blue-700">날짜</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold mb-1 text-blue-700">사유</label>
                  <input
                    type="text"
                    name="reason"
                    value={form.reason}
                    onChange={handleFormChange}
                    placeholder="사유"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow font-bold hover:scale-105 transition-transform"
                  disabled={submitLoading}
                >
                  {submitLoading ? '신청 중...' : '신청'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8 bg-white rounded-2xl shadow-lg p-6 border border-blue-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold mb-1 text-blue-700">직원</label>
                  <input
                    type="text"
                    value={employees.find(e => e.id === user.uid)?.name ?? user.email ?? undefined}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold mb-1 text-blue-700">날짜</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold mb-1 text-blue-700">사유</label>
                  <input
                    type="text"
                    name="reason"
                    value={form.reason}
                    onChange={handleFormChange}
                    placeholder="사유"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow font-bold hover:scale-105 transition-transform"
                  disabled={submitLoading}
                >
                  {submitLoading ? '신청 중...' : '신청'}
                </button>
              </form>
            )
          )}
          {submitError && <div className="text-red-500 mb-4 text-center font-semibold">{submitError}</div>}
          {statusMessage && (
            <div className={`mb-4 font-bold text-lg text-center ${statusMessage.includes('실패') ? 'text-red-600' : 'text-green-600'}`}>{statusMessage}</div>
          )}

          {/* 연차신청 내역 카드: 관리자가 아닐 때만 노출 */}
          {!isAdmin && (
            <div className="max-w-2xl mx-auto mt-8">
              <h3 className="text-lg font-bold mb-4 text-blue-700 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                내 연차 신청 내역
              </h3>
              <div className="space-y-4">
                {leaves.filter(l => l.employeeId === user?.uid).length === 0 ? (
                  <div className="text-gray-400 text-center py-8">신청 내역 없음</div>
                ) : (
                  leaves.filter(l => l.employeeId === user?.uid).map((leave, idx) => (
                    <div key={leave.id + '-' + idx} className="bg-white rounded-xl shadow border border-blue-50 p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-blue-800">{leave.date}</div>
                        <div className="text-gray-500 text-sm">사유: {leave.reason}</div>
                        <div className="text-xs text-gray-400 mt-1">신청일자: {leave.createdAt ? (() => {
                          const d = new Date(leave.createdAt);
                          const kst = d.toLocaleString('ko-KR', {
                            timeZone: 'Asia/Seoul',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                          return kst.replace(/\. /g, '-').replace(/\.$/, '');
                        })() : '-'}</div>
                        {leave.status !== '신청' && (
                          <div className="text-xs text-gray-400 mt-1">처리일자: {leave.processedAt ? (() => {
                            const d = new Date(leave.processedAt);
                            const kst = d.toLocaleString('ko-KR', {
                              timeZone: 'Asia/Seoul',
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            });
                            return kst.replace(/\. /g, '-').replace(/\.$/, '');
                          })() : '-'}</div>
                        )}
                      </div>
                      <div>
                        {leave.status === '신청' && <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">신청</span>}
                        {leave.status === '승인' && <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">승인</span>}
                        {leave.status === '거절' && <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">거절</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 관리자: 전체 신청 내역/직원 현황 */}
          {isAdmin && (
            <div className="max-w-5xl mx-auto mt-12 overflow-x-auto">
              <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
                <span>연차 현황 및 기록</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">관리자</span>
              </h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-blue-700">직원별 연차 현황</h3>
                <table className="min-w-[400px] md:min-w-full border mb-6 bg-white rounded-xl overflow-hidden shadow text-xs md:text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border px-2 py-1 min-w-[60px] whitespace-nowrap">사번</th>
                      <th className="border px-2 py-1 min-w-[80px] whitespace-nowrap">이름</th>
                      <th className="border px-2 py-1 min-w-[60px] whitespace-nowrap">총연차</th>
                      <th className="border px-2 py-1 min-w-[60px] whitespace-nowrap">사용일수</th>
                      <th className="border px-2 py-1 min-w-[60px] whitespace-nowrap">잔여일수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, idx) => (
                      <tr key={emp.id + '-' + idx}>
                        <td className="border px-2 py-1 whitespace-nowrap">{emp.empNo || '-'}</td>
                        <td className="border px-2 py-1 whitespace-nowrap">{emp.name}</td>
                        <td className="border px-2 py-1 whitespace-nowrap">{emp.totalLeaves ?? '-'}</td>
                        <td className="border px-2 py-1 whitespace-nowrap">{emp.usedLeaves ?? 0}</td>
                        <td className="border px-2 py-1 whitespace-nowrap">{emp.remainingLeaves ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-700">연차 기록</h3>
                <table className="min-w-[700px] md:min-w-full border bg-white rounded-xl overflow-hidden shadow text-xs md:text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border px-2 py-1 min-w-[60px] whitespace-nowrap">사번</th>
                      <th className="border px-2 py-1 min-w-[100px] whitespace-nowrap">직원</th>
                      <th className="border px-2 py-1 min-w-[90px] whitespace-nowrap">사용일자</th>
                      <th className="border px-2 py-1 min-w-[120px] whitespace-nowrap">신청일자</th>
                      <th className="border px-2 py-1 min-w-[100px] whitespace-nowrap">사유</th>
                      <th className="border px-2 py-1 min-w-[60px] whitespace-nowrap">상태</th>
                      <th className="border px-2 py-1 min-w-[120px] whitespace-nowrap">승인/반려일자</th>
                      <th className="border px-2 py-1 min-w-[80px] whitespace-nowrap">관리자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave, idx) => {
                      const emp = employees.find(e => e.id === leave.employeeId);
                      return (
                        <tr key={leave.id + '-' + idx}>
                          <td className="border px-2 py-1 whitespace-nowrap">{emp?.empNo || '-'}</td>
                          <td className="border px-2 py-1 whitespace-nowrap">{leave.employeeName}</td>
                          <td className="border px-2 py-1 whitespace-nowrap">{leave.date}</td>
                          <td className="border px-2 py-1 whitespace-nowrap">{leave.createdAt ? (() => {
                            const d = new Date(leave.createdAt);
                            const kst = d.toLocaleString('ko-KR', {
                              timeZone: 'Asia/Seoul',
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            });
                            return kst.replace(/\. /g, '-').replace(/\.$/, '');
                          })() : '-'}</td>
                          <td className="border px-2 py-1 whitespace-nowrap">{leave.reason}</td>
                          <td className="border px-2 py-1 whitespace-nowrap">
                            {leave.status === '신청' && <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">신청</span>}
                            {leave.status === '승인' && <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">승인</span>}
                            {leave.status === '거절' && <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">거절</span>}
                          </td>
                          <td className="border px-2 py-1 whitespace-nowrap">{leave.processedAt ? (() => {
                            const d = new Date(leave.processedAt);
                            const kst = d.toLocaleString('ko-KR', {
                              timeZone: 'Asia/Seoul',
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            });
                            return kst.replace(/\. /g, '-').replace(/\.$/, '');
                          })() : '-'}</td>
                          <td className="border px-2 py-1 whitespace-nowrap">
                            <button
                              className="px-2 py-1 bg-green-500 text-white rounded mr-2 disabled:opacity-50 shadow"
                              disabled={actionLoading === leave.id + '승인' || leave.status !== '신청'}
                              onClick={() => handleStatusChange(leave.id, '승인')}
                            >
                              승인
                            </button>
                            <button
                              className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50 shadow"
                              disabled={actionLoading === leave.id + '거절' || leave.status !== '신청'}
                              onClick={() => handleStatusChange(leave.id, '거절')}
                            >
                              거절
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 하단 홈/로그아웃 버튼 (직원만) */}
          {!isAdmin && (
            <div className="mt-12 flex justify-end max-w-2xl mx-auto">
              <button
                onClick={async () => {
                  if (user) {
                    await logout();
                  }
                  navigate('/');
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold shadow"
              >
                홈으로
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaves;
