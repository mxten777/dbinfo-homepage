import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

interface Employee {
  id: string;
  name: string;
  email: string;
  position?: string;
  department?: string;
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
}

interface DeputyRequest {
  id?: string;
  employeeId: string;
  employeeName: string;
  type: '연차' | '반차' | '병가' | '기타';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: '신청' | '승인' | '반려';
  requestDate: string;
}

const AdminDeputyRequest: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requests, setRequests] = useState<DeputyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // 폼 상태
  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState<'연차' | '반차' | '병가' | '기타'>('연차');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 직원 목록 가져오기
      const employeesSnap = await getDocs(collection(db, 'employees'));
      const employeesData = employeesSnap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        email: doc.data().email || '',
        position: doc.data().position || '',
        department: doc.data().department || '',
        totalLeaves: doc.data().totalLeaves || 0,
        usedLeaves: doc.data().usedLeaves || 0,
        remainingLeaves: doc.data().remainingLeaves || 0
      }));
      setEmployees(employeesData);

      // 대리신청 목록 가져오기
      const requestsSnap = await getDocs(collection(db, 'deputyRequests'));
      const requestsData = requestsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        requestDate: doc.data().requestDate || new Date().toISOString().split('T')[0]
      })) as DeputyRequest[];
      
      setRequests(requestsData);
      setLoading(false);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      setMessage('데이터를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };



  // 일수 자동 계산
  useEffect(() => {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setDays(diff > 0 ? diff : 1);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      if (!employee) {
        setMessage('선택한 직원을 찾을 수 없습니다.');
        return;
      }

      await addDoc(collection(db, 'deputyRequests'), {
        employeeId,
        employeeName: employee.name,
        type,
        startDate,
        endDate,
        days,
        reason,
        status: '신청',
        requestDate: new Date().toISOString().split('T')[0]
      });

      setMessage('대리 신청이 성공적으로 등록되었습니다.');
      
      // 폼 초기화
      setEmployeeId('');
      setType('연차');
      setStartDate('');
      setEndDate('');
      setDays(1);
      setReason('');

      // 목록 새로고침
      fetchData();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('대리 신청 등록 실패:', error);
      setMessage('대리 신청 등록에 실패했습니다.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'deputyRequests', id), { status: '승인' });
      setMessage('대리신청이 승인되었습니다.');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('승인 처리 실패:', error);
      setMessage('승인 처리에 실패했습니다.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, 'deputyRequests', id), { status: '반려' });
      setMessage('대리신청이 반려되었습니다.');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('반려 처리 실패:', error);
      setMessage('반려 처리에 실패했습니다.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/20 to-accent-50/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-strong rounded-3xl p-8 shadow-glass border border-white/30">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-neutral-200 rounded-2xl w-1/3"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-neutral-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/20 to-accent-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="glass-strong rounded-3xl p-8 mb-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-brand-100 to-accent-100 rounded-full border border-brand-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full animate-pulse"></div>
                <span className="text-brand-700 font-bold text-sm">DEPUTY MANAGEMENT</span>
              </div>
              <h1 className="text-4xl font-black gradient-text font-display tracking-tight">
                관리자대리 신청
              </h1>
              <p className="text-neutral-600 text-lg">
                직원을 대신하여 연차 신청을 처리하고 관리하세요
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="glass rounded-2xl p-4 bg-gradient-to-br from-brand-50/50 to-accent-50/50 border border-brand-200/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-700">{requests.length}</div>
                  <div className="text-sm text-brand-600 font-medium">대리 신청</div>
                </div>
              </div>
              
              <Link 
                to="/admin/home"
                className="btn-primary bg-gradient-to-r from-brand-500 to-accent-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-transform duration-300 font-bold shadow-glow flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                관리자홈
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 대리신청 폼 섹션 */}
          <div className="xl:col-span-1">
            <div className="glass-strong rounded-3xl shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 pb-6 border-b border-neutral-200/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-800">대리 연차신청</h3>
                    <p className="text-sm text-neutral-600">직원을 대신하여 연차를 신청합니다</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-neutral-700">직원 선택 *</label>
                    <select 
                      value={employeeId} 
                      onChange={e => setEmployeeId(e.target.value)} 
                      className="w-full glass rounded-xl px-4 py-3 border border-brand-200/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-brand-50/20"
                      required
                    >
                      <option value="">직원을 선택하세요</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.position || '직책 미지정'}) - 잔여: {emp.remainingLeaves}일
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">연차 유형</label>
                      <select 
                        value={type} 
                        onChange={e => setType(e.target.value as any)} 
                        className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 focus:ring-2 focus:ring-success-500 focus:border-success-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-success-50/20"
                      >
                        <option value="연차">연차</option>
                        <option value="반차">반차</option>
                        <option value="병가">병가</option>
                        <option value="기타">기타</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">일수</label>
                      <input 
                        type="number" 
                        value={days} 
                        readOnly 
                        className="w-full glass rounded-xl px-4 py-3 border border-warning-200/30 bg-gradient-to-r from-neutral-100 to-warning-50/20 text-neutral-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">시작일 *</label>
                      <input 
                        type="date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                        className="w-full glass rounded-xl px-4 py-3 border border-accent-200/30 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-accent-50/20"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">종료일 *</label>
                      <input 
                        type="date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                        className="w-full glass rounded-xl px-4 py-3 border border-accent-200/30 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-accent-50/20"
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-neutral-700">신청 사유 *</label>
                    <textarea 
                      value={reason} 
                      onChange={e => setReason(e.target.value)} 
                      rows={4}
                      placeholder="연차 신청 사유를 입력하세요..." 
                      className="w-full glass rounded-xl px-4 py-3 border border-brand-200/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-brand-50/20 resize-none"
                      required 
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full btn-primary bg-gradient-to-r from-brand-500 to-accent-500 text-white py-3 rounded-2xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      대리 신청하기
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* 신청 목록 섹션 */}
          <div className="xl:col-span-1">
            <div className="glass-strong rounded-3xl shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 pb-6 border-b border-neutral-200/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-brand-500 rounded-2xl flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-800">대리신청 목록</h3>
                    <p className="text-sm text-neutral-600">총 {requests.length}건의 대리신청</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {requests.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-neutral-700 mb-2">대리신청이 없습니다</h4>
                      <p className="text-neutral-600">첫 번째 대리신청을 등록해보세요.</p>
                    </div>
                  ) : (
                    requests.map((request, index) => (
                      <div 
                        key={request.id} 
                        className="group glass rounded-2xl p-6 border border-neutral-200/30 hover:border-brand-300/50 transition-all duration-300 hover:shadow-glow bg-gradient-to-br from-white/80 to-neutral-50/30"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                                  {index + 1}
                                </div>
                                <h4 className="text-xl font-bold text-neutral-800">{request.employeeName}</h4>
                                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  request.status === '승인' 
                                    ? 'bg-gradient-to-r from-success-100 to-brand-100 text-success-700' 
                                    : request.status === '반려'
                                    ? 'bg-gradient-to-r from-error-100 to-warning-100 text-error-700'
                                    : 'bg-gradient-to-r from-warning-100 to-accent-100 text-warning-700'
                                }`}>
                                  {request.status}
                                </div>
                                <div className="px-2 py-1 bg-gradient-to-r from-accent-100 to-brand-100 text-accent-700 rounded-lg text-sm font-medium">
                                  {request.type}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div><span className="font-bold text-neutral-700">기간:</span> {request.startDate} ~ {request.endDate}</div>
                                  <div><span className="font-bold text-neutral-700">일수:</span> {request.days}일</div>
                                </div>
                                <div className="space-y-2">
                                  <div><span className="font-bold text-neutral-700">신청 사유:</span></div>
                                  <div className="text-neutral-600 bg-gradient-to-r from-neutral-50 to-brand-50/30 p-3 rounded-xl border border-neutral-200/30">
                                    {request.reason}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {request.status === '신청' && (
                            <div className="flex items-center gap-3 pt-4 border-t border-neutral-200/30">
                              <button 
                                onClick={() => handleApprove(request.id!)}
                                className="flex-1 btn-primary bg-gradient-to-r from-success-500 to-brand-500 text-white py-2 px-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                승인
                              </button>
                              <button 
                                onClick={() => handleReject(request.id!)}
                                className="flex-1 btn-secondary bg-gradient-to-r from-error-500 to-warning-500 text-white py-2 px-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                반려
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 성공/오류 메시지 */}
        {message && (
          <div className="fixed top-6 right-6 z-50 animate-fade-in">
            <div className={`glass-strong rounded-2xl p-6 shadow-glow border max-w-sm ${
              message.includes('실패') || message.includes('오류') 
                ? 'border-error-200/50 bg-gradient-to-r from-error-50/90 to-warning-50/90' 
                : 'border-success-200/50 bg-gradient-to-r from-success-50/90 to-brand-50/90'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  message.includes('실패') || message.includes('오류')
                    ? 'bg-gradient-to-br from-error-500 to-warning-500'
                    : 'bg-gradient-to-br from-success-500 to-brand-500'
                }`}>
                  {message.includes('실패') || message.includes('오류') ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`font-bold text-sm ${
                    message.includes('실패') || message.includes('오류') ? 'text-error-700' : 'text-success-700'
                  }`}>
                    {message.includes('실패') || message.includes('오류') ? '오류 발생' : '작업 완료'}
                  </p>
                  <p className={`text-xs ${
                    message.includes('실패') || message.includes('오류') ? 'text-error-600' : 'text-success-600'
                  }`}>
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDeputyRequest;
