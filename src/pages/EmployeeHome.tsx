import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db } from '../firebaseConfig';
// 불필요한 타입 import 제거
import type { Leave, Employee } from '../types/employee';
import { useAuth } from '../AuthContext';
import CompanyNewsList from '../components/CompanyNewsList';

const EmployeeHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // 불필요한 상태 제거
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [message, setMessage] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // 불필요한 코드 제거
      const leaveSnap = await getDocs(collection(db, 'leaves'));
      setLeaves(leaveSnap.docs.filter(doc => doc.data().employeeId === user?.uid).map(doc => ({ id: doc.id, ...doc.data() } as Leave)));
      // 직원 정보 불러오기
      const empSnap = await getDocs(collection(db, 'employees'));
      const empDoc = empSnap.docs.find(doc => doc.data().uid === user?.uid);
      
      if (empDoc) {
        const empData = empDoc.data();
        setEmployee({
          id: empDoc.id,
          empNo: empData.empNo ?? '',
          name: empData.name ?? '',
          email: empData.email ?? '',
          carryOverLeaves: empData.carryOverLeaves ?? 0,
          annualLeaves: empData.annualLeaves ?? 0,
          totalLeaves: empData.totalLeaves ?? ((empData.carryOverLeaves ?? 0) + (empData.annualLeaves ?? 0)),
          usedLeaves: empData.usedLeaves ?? 0,
          remainingLeaves: empData.remainingLeaves ?? ((empData.totalLeaves ?? ((empData.carryOverLeaves ?? 0) + (empData.annualLeaves ?? 0))) - (empData.usedLeaves ?? 0))
        });
        
        // 임시 비밀번호로 로그인한 경우 비밀번호 변경 유도
        if (empData.passwordChanged === false) {
          setShowPasswordChange(true);
          setPasswordMessage('보안을 위해 비밀번호를 변경해주세요.');
        }
      }
    };
    fetchData();
  }, [user]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage('모든 비밀번호 필드를 입력해주세요.');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage('새 비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    
    try {
      if (!user || !employee) {
        setPasswordMessage('사용자 정보를 찾을 수 없습니다.');
        return;
      }
      
      // 현재 비밀번호로 재인증
      const credential = EmailAuthProvider.credential(user.email!, passwordForm.currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // 비밀번호 변경
      await updatePassword(user, passwordForm.newPassword);
      
      // Firestore에서 passwordChanged를 true로 업데이트
      await updateDoc(doc(db, 'employees', employee.id), {
        passwordChanged: true,
        tempPassword: null // 임시 비밀번호 정보 삭제
      });
      
      setPasswordMessage('비밀번호가 성공적으로 변경되었습니다.');
      setShowPasswordChange(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
    } catch (error: any) {
      console.error('비밀번호 변경 실패:', error);
      if (error.code === 'auth/wrong-password') {
        setPasswordMessage('현재 비밀번호가 올바르지 않습니다.');
      } else {
        setPasswordMessage('비밀번호 변경에 실패했습니다: ' + (error.message || '오류 발생'));
      }
    }
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
        employeeName: employee?.name || user.email?.split('@')[0] || '',
        name: employee?.name || user.email?.split('@')[0] || '',
        startDate: form.startDate,
        endDate: form.endDate,
        date: `${form.startDate}~${form.endDate}`,
        reason: form.reason,
        status: '신청' as const,
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
              <div className="text-lg font-bold text-blue-700">
                {employee ? employee.name : (user?.email?.split('@')[0] || '사용자')}
              </div>
              <div className="text-gray-600 text-sm">
                {employee?.email || user?.email || ''}
              </div>
              <div className="text-gray-500 text-xs mt-1">환영합니다! 오늘도 힘내세요.</div>
              {employee && (
                <div className="mt-3 text-sm text-gray-700">
                  <div className="flex flex-wrap gap-4">
                    <span>총 연차: <b>{employee.totalLeaves}</b></span>
                    <span>사용: <b>{employee.usedLeaves}</b></span>
                    <span>잔여: <b className="text-blue-600">{employee.remainingLeaves}</b></span>
                  </div>
                  {(employee.carryOverLeaves || employee.annualLeaves) && (
                    <div className="mt-1 text-xs text-gray-500">
                      (이월: {employee.carryOverLeaves || 0} + 올해: {employee.annualLeaves || 0})
                    </div>
                  )}
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="ml-auto px-4 py-2 bg-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-300 shadow">로그아웃</button>
          </div>
        </div>
        
        {/* 비밀번호 변경 모달 */}
        {showPasswordChange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-blue-700">비밀번호 변경</h3>
                <button 
                  onClick={() => setShowPasswordChange(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {passwordMessage && (
                <div className={`p-3 mb-4 rounded ${
                  passwordMessage.includes('성공') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {passwordMessage}
                </div>
              )}
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    minLength={6}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    minLength={6}
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    변경하기
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
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
        {/* 내 연차신청 내역 테이블 (Leave 타입에 맞게 date 필드만 사용) */}
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
                      <th className="border px-4 py-2 rounded-tl-lg">기간</th>
                      <th className="border px-4 py-2">사유</th>
                      <th className="border px-4 py-2">신청일자</th>
                      <th className="border px-4 py-2">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map(l => (
                      <tr key={l.id} className="bg-gray-50 hover:bg-blue-50 shadow rounded-lg">
                        <td className="border px-4 py-2 font-semibold">{l.date}</td>
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
