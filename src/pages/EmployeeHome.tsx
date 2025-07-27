import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Notice } from '../types/notice';
import type { Leave, Employee } from '../types/employee';
import { useAuth } from '../AuthContext';

const EmployeeHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [form, setForm] = useState({ date: '', reason: '' });
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
    if (!form.date || !form.reason || !user?.uid) {
      setMessage('모든 항목을 입력하세요.');
      return;
    }
    try {
      const now = new Date();
      const newLeave: Omit<Leave, 'id'> = {
        employeeId: user.uid,
        employeeName: employee?.name || user.email || '',
        date: form.date,
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
      setForm({ date: '', reason: '' });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-2 md:px-0">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* 상단 인사/잔여연차 카드 */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-blue-100 flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-4">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
          {/* 공지사항 카드 */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20.5c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5-7.5 3.358-7.5 7.5 3.358 7.5 7.5 7.5z" /></svg>
              <h2 className="text-lg font-bold text-blue-700">회사 공지사항</h2>
            </div>
            <ul className="space-y-2">
              {notices.length === 0 ? <li className="text-gray-400">공지사항 없음</li> :
                notices.map(n => (
                  <li key={n.id} className="p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                    <span className="font-semibold text-gray-800">{n.title}</span>
                    <span className="text-xs text-gray-500">{n.date}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* 연차신청 카드 */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <h2 className="text-lg font-bold text-blue-700">연차 신청</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="date" type="date" value={form.date} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200" required />
              <textarea name="reason" value={form.reason} onChange={handleFormChange} placeholder="사유" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200" required />
              <button type="submit" className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow font-bold hover:scale-105 transition-transform">연차 신청</button>
            </form>
            {message && <div className="text-green-600 mt-4 text-center font-semibold">{message}</div>}
          </div>
          {/* 내 연차신청 내역 카드 */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2M9 21h6a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>
              <h2 className="text-lg font-bold text-blue-700">내 연차 신청 내역</h2>
            </div>
            <div className="space-y-2">
              {leaves.length === 0 ? <div className="text-gray-400">신청 내역 없음</div> :
                leaves.map(l => (
                  <div key={l.id} className="p-3 bg-blue-50 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="font-semibold text-gray-800">{l.date} <span className="text-xs text-gray-500">{l.reason}</span></div>
                    <div>
                      {l.status === '신청' && <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">신청</span>}
                      {l.status === '승인' && <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">승인</span>}
                      {l.status === '거절' && <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">거절</span>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
