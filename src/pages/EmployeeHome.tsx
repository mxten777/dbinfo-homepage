import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db } from '../firebaseConfig';
import type { Leave, Employee } from '../types/employee';
import { useAuth } from '../AuthContext';
import CompanyNewsList from '../components/CompanyNewsList';

const EmployeeHome: React.FC = () => {
  // 연차 일수 자동 계산 함수
  const calculateLeaveDays = (start: string, end: string, type: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
    if (type === '반차') return 0.5;
    return diff;
  };
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [form, setForm] = useState({ 
    startDate: '', 
    endDate: '', 
    reason: '',
    type: '연차' as '연차' | '반차' | '병가' | '기타'
  });
  const [message, setMessage] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const leaveSnap = await getDocs(collection(db, 'leaves'));
      setLeaves(
        leaveSnap.docs
          .filter(doc => doc.data().employeeId === user?.uid)
          .map(doc => {
            const data = doc.data();
            let days = data.days;
            if (typeof days === 'undefined' || days === null) {
              days = data.type === '반차' ? 0.5 : ((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1);
            } else if (typeof days === 'string') {
              days = Number(days);
              if (isNaN(days)) days = 0;
            }
            return { id: doc.id, ...data, days } as Leave;
          })
      );
      // 직원 정보 불러오기
      const empSnap = await getDocs(collection(db, 'employees'));
      const empDoc = empSnap.docs.find(doc => doc.data().uid === user?.uid);
      if (empDoc) {
        const empData = empDoc.data();
        setEmployee({
          id: empDoc.id,
          uid: empData.uid ?? user?.uid ?? '',
          empNo: empData.empNo ?? '',
          name: empData.name ?? '',
          email: empData.email ?? '',
          carryOverLeaves: empData.carryOverLeaves ?? 0,
          annualLeaves: empData.annualLeaves ?? 0,
          totalLeaves: empData.totalLeaves ?? ((empData.carryOverLeaves ?? 0) + (empData.annualLeaves ?? 0)),
          usedLeaves: empData.usedLeaves ?? 0,
          remainingLeaves: empData.remainingLeaves ?? ((empData.totalLeaves ?? ((empData.carryOverLeaves ?? 0) + (empData.annualLeaves ?? 0))) - (empData.usedLeaves ?? 0))
        });
        if (empData.passwordChanged === false) {
          setShowPasswordChange(true);
          setPasswordMessage('보안을 위해 비밀번호를 변경해주세요.');
        }
      }
    };
    fetchData();
  }, [user]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, type: e.target.value as '연차' | '반차' | '병가' | '기타' });
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
      const credential = EmailAuthProvider.credential(user.email!, passwordForm.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordForm.newPassword);
      await updateDoc(doc(db, 'employees', employee.id), {
        passwordChanged: true,
        tempPassword: null
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
      const now = Date.now();
      let days: number = form.type === '반차'
        ? 0.5
        : ((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1);
      if (typeof days !== 'number') {
        days = Number(days);
        if (isNaN(days)) days = 0;
      }
      const newLeave: Omit<Leave, 'id'> = {
        employeeId: user.uid,
        employeeName: employee?.name || user.email?.split('@')[0] || '',
        name: employee?.name || user.email?.split('@')[0] || '',
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
        type: form.type,
        status: '신청',
        createdAt: now,
        isAdminRequest: false,
        days
      };
      const firestore = await import('firebase/firestore');
      const docRef = await firestore.addDoc(firestore.collection(db, 'leaves'), newLeave);
      await firestore.updateDoc(firestore.doc(db, 'leaves', docRef.id), { id: docRef.id });
      setLeaves(prev => [...prev, { ...newLeave, id: docRef.id }]);
      setMessage('연차신청이 접수되었습니다.');
      setForm({ startDate: '', endDate: '', reason: '', type: '연차' });
      setTimeout(() => setMessage(''), 1500);
    } catch (err) {
      setMessage('신청 실패');
    }
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await logout();
      navigate('/employee-login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-2 flex flex-col items-center" role="main" aria-label="직원 홈 페이지">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-10">
        {/* 직원정보 카드 */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col md:flex-row items-center gap-8" role="region" aria-label="직원정보 카드">
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">직원정보</h2>
            </div>
            <div className="text-2xl font-extrabold text-blue-800">{employee?.name || '이름없음'}</div>
            <div className="text-gray-700 text-base font-medium">{employee?.email || user?.email || ''}</div>
            <div className="text-gray-500 text-sm mt-2">환영합니다! 오늘도 힘내세요.</div>
            {employee && (
              <div className="mt-3 text-base text-gray-700">
                <div className="flex flex-wrap gap-6">
                  <span>총 연차: <b className="text-lg text-blue-700">{employee.totalLeaves}</b></span>
                  <span>사용: <b className="text-lg text-blue-700">{employee.usedLeaves}</b></span>
                  <span>잔여: <b className="text-lg text-blue-800">{employee.remainingLeaves}</b></span>
                </div>
                {(employee.carryOverLeaves || employee.annualLeaves) && (
                  <div className="mt-2 text-sm text-gray-500">(이월: {employee.carryOverLeaves || 0} + 올해: {employee.annualLeaves || 0})</div>
                )}
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="px-6 py-3 bg-blue-100 text-blue-700 rounded-xl text-base font-bold hover:bg-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-accent" aria-label="로그아웃">로그아웃</button>
        </div>
        {/* 비밀번호 변경 모달 */}
        {showPasswordChange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="비밀번호 변경 모달">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-blue-700">비밀번호 변경</h3>
                <button onClick={() => setShowPasswordChange(false)} className="text-gray-400 hover:text-gray-600" aria-label="비밀번호 변경 취소">✕</button>
              </div>
              {passwordMessage && (
                <div className={`p-3 mb-4 rounded ${passwordMessage.includes('성공') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{passwordMessage}</div>
              )}
              <form onSubmit={handlePasswordChange} className="space-y-4" aria-label="비밀번호 변경하기">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                  <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                  <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" minLength={6} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                  <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" minLength={6} required />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" aria-label="비밀번호 변경하기">변경하기</button>
                  <button type="button" onClick={() => setShowPasswordChange(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition" aria-label="비밀번호 변경 취소">취소</button>
                </div>
              </form>
            </div>
          </div>
        )}
    {/* 사내소식 카드 */}
    <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8" role="region" aria-label="사내소식 카드">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
            <h2 className="text-2xl font-extrabold text-indigo-700 tracking-tight">사내소식</h2>
          </div>
          <CompanyNewsList />
        </div>
        {/* 연차신청 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-blue-100">
          <form onSubmit={handleSubmit} aria-label="연차신청 폼">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2H5a2 2 0 00-2 2v12a2 2 0 012 2z" /></svg>
              <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">연차신청</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
              <div>
                <label className="block font-bold mb-2 text-gray-700 text-base">연차 유형</label>
                <select name="type" value={form.type} onChange={handleTypeChange} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-blue-400 text-base" required>
                  <option value="연차">연차</option>
                  <option value="반차">반차</option>
                  <option value="병가">병가</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-2 text-gray-700 text-base">시작일</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleFormChange} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-blue-400 text-base" required />
              </div>
              <div>
                <label className="block font-bold mb-2 text-gray-700 text-base">종료일</label>
                <input type="date" name="endDate" value={form.endDate} onChange={handleFormChange} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-blue-400 text-base" required />
              </div>
              <div className="flex items-center h-full pb-2">
                <span className="text-blue-700 font-extrabold text-lg whitespace-nowrap">
                  신청 일수: {calculateLeaveDays(form.startDate, form.endDate, form.type)}일
                  {form.type === '반차' && <span className="text-sm text-gray-500 ml-2">(반차는 0.5일로 계산)</span>}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2 text-gray-700 text-base">사유</label>
              <input type="text" name="reason" value={form.reason} onChange={handleFormChange} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-blue-400 text-base" placeholder="사유 입력" required />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-10 py-3 bg-blue-500 text-white rounded-xl font-extrabold text-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-accent" aria-label="연차 신청">연차 신청</button>
            </div>
            {message && <div className="text-green-600 mt-4 text-center font-bold text-lg">{message}</div>}
          </form>
        </div>
        {/* 내 연차 신청 내역 카드 */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
          <h2 className="text-2xl font-extrabold mb-6 text-blue-700 tracking-tight" id="leave-history-title">내 연차 신청 내역</h2>
          <div className="overflow-x-auto">
            {leaves.length === 0 ? (
              <div className="text-center py-8 text-gray-400">신청 내역 없음</div>
            ) : (
              <table className="min-w-[700px] w-full border-separate border-spacing-y-2" role="table" aria-labelledby="leave-history-title">
                <thead>
                  <tr className="bg-blue-50 text-blue-900 text-lg" role="row">
                    <th className="border px-5 py-3 rounded-tl-xl font-extrabold" scope="col">유형</th>
                    <th className="border px-5 py-3 font-extrabold" scope="col">기간</th>
                    <th className="border px-5 py-3 font-extrabold" scope="col">신청 일수</th>
                    <th className="border px-5 py-3 font-extrabold" scope="col">사유</th>
                    <th className="border px-5 py-3 font-extrabold" scope="col">신청일자</th>
                    <th className="border px-5 py-3 font-extrabold" scope="col">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map(l => (
                    <tr key={l.id} className="bg-gray-50 hover:bg-blue-50 shadow rounded-xl focus-within:bg-blue-100 transition" tabIndex={0} role="row" aria-label={`연차신청: ${l.type}, ${l.startDate}~${l.endDate}, 상태: ${l.status}`}> 
                      <td className="border px-5 py-3 font-extrabold text-center text-base">
                        <span className={`px-3 py-2 rounded-xl text-base font-extrabold ${
                          l.type === '연차' ? 'bg-blue-100 text-blue-700' :
                          l.type === '반차' ? 'bg-green-100 text-green-700' :
                          l.type === '병가' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {l.type || '연차'}
                        </span>
                      </td>
                      <td className="border px-5 py-3 font-bold text-base">{l.startDate} ~ {l.endDate}</td>
                      <td className="border px-5 py-3 font-extrabold text-blue-700 text-base">
                        {typeof l.days === 'number' ? l.days :
                          (typeof l.days === 'string' && !isNaN(Number(l.days)) ? Number(l.days) :
                            (l.type === '반차' ? 0.5 : ((new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)))}일
                      </td>
                      <td className="border px-5 py-3 text-base">{l.reason}</td>
                      <td className="border px-5 py-3 text-base">{l.createdAt ? new Date(l.createdAt).toLocaleDateString('ko-KR') : '-'}</td>
                      <td className="border px-5 py-3 font-extrabold text-base">
                        {l.status === '신청' && <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-base font-extrabold">신청</span>}
                        {l.status === '승인' && <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-base font-extrabold">승인</span>}
                        {l.status === '반려' && <span className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-base font-extrabold">반려</span>}
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
  );
};

export default EmployeeHome;