import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Notice } from '../types/notice';
import type { Leave, Employee } from '../types/employee';
import { useAuth } from '../AuthContext';
import CompanyNewsList from '../components/CompanyNewsList';

const EmployeeHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [message, setMessage] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const noticeSnap = await getDocs(collection(db, 'notices'));
      setNotices(noticeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notice)));
      const leaveSnap = await getDocs(collection(db, 'leaves'));
      setLeaves(leaveSnap.docs.filter(doc => doc.data().employeeId === user?.uid).map(doc => ({ id: doc.id, ...doc.data() } as Leave)));
      // 직원 정보 불러오기
      const empSnap = await getDocs(collection(db, 'employees'));
      const emp = empSnap.docs.find(doc => doc.id === user?.uid);
      setEmployee(emp ? {
        id: emp.id,
        empNo: emp.data().empNo ?? '',
        name: emp.data().name ?? '',
        email: emp.data().email ?? '',
        totalLeaves: emp.data().totalLeaves ?? 0,
        usedLeaves: emp.data().usedLeaves ?? 0,
        remainingLeaves: emp.data().remainingLeaves ?? 0
      } : null);
    };
    fetchData();
  }, [user]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason || !user?.uid) {
      setMessage('모든 항목을 입력하세요.');
      return;
    }
    try {
      const now = new Date();
      const newLeave: Omit<Leave, 'id'> = {
        employeeId: user.uid,
        employeeName: employee?.name || user.email || '',
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
        status: '신청',
        createdAt: now.toISOString()
      };
      // Firestore에 저장
      const firestore = await import('firebase/firestore');
      const docRef = await firestore.addDoc(firestore.collection(db, 'leaves'), newLeave);
      await firestore.updateDoc(firestore.doc(db, 'leaves', docRef.id), { id: docRef.id });
      setLeaves(prev => [...prev, { ...newLeave, id: docRef.id }]);
      setMessage('연차신청이 접수되었습니다.');
      setForm({ startDate: '', endDate: '', reason: '' });
      setTimeout(() => setMessage(''), 1500);
    } catch (err) {
      setMessage('신청 실패');
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await logout();
      navigate('/employee-login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center text-blue-700">직원정보</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
            onClick={() => navigate('/employee-login')}
          >
            직원로그인 화면으로
          </button>
        </div>
        {/* 직원정보 카드 */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center gap-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <h2 className="text-xl font-bold text-blue-600">직원정보</h2>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-700">{employee ? employee.name : user?.email}</div>
              <div className="text-gray-500 text-sm">환영합니다! 오늘도 힘내세요.</div>
              {employee && (
                <div className="mt-2 text-sm text-gray-700">
                  <span className="mr-4">총 연차: <b>{employee.totalLeaves}</b></span>
                  <span className="mr-4">사용: <b>{employee.usedLeaves}</b></span>
                  <span>잔여: <b className="text-blue-600">{employee.remainingLeaves}</b></span>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="ml-auto px-4 py-2 bg-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-300 shadow">로그아웃</button>
          </div>
        </div>
        {/* 사내소식 카드 */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
              <h2 className="text-xl font-bold text-indigo-600">사내소식</h2>
            </div>
            <CompanyNewsList />
          </div>
        </div>
        {/* 연차신청 카드 */}
        <div className="mb-10">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <h2 className="text-xl font-bold text-blue-600">연차신청</h2>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">시작일</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">종료일</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">사유</label>
                <input
                  type="text"
                  name="reason"
                  value={form.reason}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-blue-400"
                  placeholder="사유 입력"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
              >
                연차 신청
              </button>
            </div>
            {message && <div className="text-green-600 mt-4 text-center font-semibold">{message}</div>}
          </form>
        </div>
        {/* 내 연차신청 내역 테이블 */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-600">내 연차 신청 내역</h2>
            <div className="overflow-x-auto">
              {leaves.length === 0 ? (
                <div className="text-center py-8 text-gray-400">신청 내역 없음</div>
              ) : (
                <table className="min-w-[700px] w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-blue-50 text-blue-900">
                      <th className="border px-4 py-2 rounded-tl-lg">시작일</th>
                      <th className="border px-4 py-2">종료일</th>
                      <th className="border px-4 py-2">사유</th>
                      <th className="border px-4 py-2">신청일자</th>
                      <th className="border px-4 py-2">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map(l => (
                      <tr key={l.id} className="bg-gray-50 hover:bg-blue-50 shadow rounded-lg">
                        <td className="border px-4 py-2 font-semibold">{l.startDate}</td>
                        <td className="border px-4 py-2 font-semibold">{l.endDate}</td>
                        <td className="border px-4 py-2">{l.reason}</td>
                        <td className="border px-4 py-2">{l.createdAt ? new Date(l.createdAt).toLocaleDateString('ko-KR') : '-'}</td>
                        <td className="border px-4 py-2 font-bold">
                          {l.status === '신청' && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">신청</span>}
                          {l.status === '승인' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">승인</span>}
                          {l.status === '거절' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">거절</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
