import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface LeaveRequest {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: string;
  status: string;
  requestDate: string;
  approverComment?: string;
}

const AdminLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    let filtered = leaves;
    
    if (searchTerm) {
      filtered = filtered.filter(leave => 
        leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(leave => leave.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(leave => leave.type === typeFilter);
    }
    
    setFilteredLeaves(filtered);
  }, [leaves, searchTerm, statusFilter, typeFilter]);

  const fetchLeaves = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'leaveRequests'));
      const leavesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeaveRequest[];
      
      setLeaves(leavesData);
      setLoading(false);
    } catch (error) {
      console.error('연차 신청 목록 조회 실패:', error);
      setMessage('연차 신청 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string, comment?: string) => {
    try {
      const docRef = doc(db, 'leaveRequests', id);
      await updateDoc(docRef, {
        status: newStatus,
        approverComment: comment || ''
      });
      
      setMessage(`연차 신청이 ${newStatus === 'approved' ? '승인' : '반려'}되었습니다.`);
      fetchLeaves();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
      setMessage('상태 업데이트에 실패했습니다.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'leaveRequests', id));
        setMessage('연차 신청이 삭제되었습니다.');
        fetchLeaves();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('삭제 실패:', error);
        setMessage('삭제에 실패했습니다.');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const getStatusStats = () => {
    const pending = leaves.filter(leave => leave.status === 'pending').length;
    const approved = leaves.filter(leave => leave.status === 'approved').length;
    const rejected = leaves.filter(leave => leave.status === 'rejected').length;
    return { pending, approved, rejected, total: leaves.length };
  };

  const stats = getStatusStats();

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
        <div className="glass-strong rounded-3xl p-8 mb-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-brand-100 to-accent-100 rounded-full border border-brand-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full animate-pulse"></div>
                <span className="text-brand-700 font-bold text-sm">LEAVE MANAGEMENT</span>
              </div>
              <h1 className="text-4xl font-black gradient-text font-display tracking-tight">
                직원연차 관리
              </h1>
              <p className="text-neutral-600 text-lg">
                직원들의 연차 신청을 승인하고 관리하세요
              </p>
            </div>
            
            <div className="flex items-center gap-4">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass rounded-2xl p-4 bg-gradient-to-br from-brand-50/50 to-accent-50/50 border border-brand-200/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-700">{stats.total}</div>
                <div className="text-sm text-brand-600 font-medium">전체 신청</div>
              </div>
            </div>
            <div className="glass rounded-2xl p-4 bg-gradient-to-br from-warning-50/50 to-accent-50/50 border border-warning-200/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-warning-700">{stats.pending}</div>
                <div className="text-sm text-warning-600 font-medium">대기중</div>
              </div>
            </div>
            <div className="glass rounded-2xl p-4 bg-gradient-to-br from-success-50/50 to-brand-50/50 border border-success-200/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-success-700">{stats.approved}</div>
                <div className="text-sm text-success-600 font-medium">승인</div>
              </div>
            </div>
            <div className="glass rounded-2xl p-4 bg-gradient-to-br from-error-50/50 to-warning-50/50 border border-error-200/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-error-700">{stats.rejected}</div>
                <div className="text-sm text-error-600 font-medium">반려</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-6 mb-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700">직원명/사유 검색</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="직원명 또는 연차 사유"
                className="w-full glass rounded-xl px-4 py-3 border border-brand-200/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700">상태 필터</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 focus:ring-2 focus:ring-success-500 focus:border-success-500 outline-none transition-all duration-300"
              >
                <option value="all">전체</option>
                <option value="pending">대기중</option>
                <option value="approved">승인</option>
                <option value="rejected">반려</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700">연차 유형</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full glass rounded-xl px-4 py-3 border border-accent-200/30 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-300"
              >
                <option value="all">전체</option>
                <option value="연차">연차</option>
                <option value="반차">반차</option>
                <option value="병가">병가</option>
                <option value="경조사">경조사</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700">빠른 액션</label>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className="w-full btn-secondary bg-gradient-to-r from-neutral-500 to-brand-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-300"
              >
                필터 초기화
              </button>
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-3xl shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-3 pb-6 border-b border-neutral-200/50">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-glow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v8m0 0v8m0-8h8m-8 0H6a2 2 0 01-2-2V7a2 2 0 012-2h2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-800">연차 신청 목록</h3>
                <p className="text-sm text-neutral-600">총 {filteredLeaves.length}건의 연차 신청</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredLeaves.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v8m0 0v8m0-8h8m-8 0H6a2 2 0 01-2-2V7a2 2 0 012-2h2" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-neutral-700 mb-2">연차 신청이 없습니다</h4>
                  <p className="text-neutral-600">필터 조건에 맞는 연차 신청을 찾을 수 없습니다.</p>
                </div>
              ) : (
                filteredLeaves.map((leave, index) => (
                  <div 
                    key={leave.id} 
                    className="group glass rounded-2xl p-6 border border-neutral-200/30 hover:border-brand-300/50 transition-all duration-300 hover:shadow-glow bg-gradient-to-br from-white/80 to-neutral-50/30"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <h4 className="text-xl font-bold text-neutral-800">{leave.name}</h4>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                              leave.status === 'approved' 
                                ? 'bg-gradient-to-r from-success-100 to-brand-100 text-success-700' 
                                : leave.status === 'rejected'
                                ? 'bg-gradient-to-r from-error-100 to-warning-100 text-error-700'
                                : 'bg-gradient-to-r from-warning-100 to-accent-100 text-warning-700'
                            }`}>
                              {leave.status === 'approved' ? '승인' : leave.status === 'rejected' ? '반려' : '대기중'}
                            </div>
                            <div className="px-2 py-1 bg-gradient-to-r from-accent-100 to-brand-100 text-accent-700 rounded-lg text-sm font-medium">
                              {leave.type}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div><span className="font-bold text-neutral-700">연차 기간:</span> {leave.startDate} ~ {leave.endDate}</div>
                              <div><span className="font-bold text-neutral-700">신청일:</span> {leave.requestDate}</div>
                            </div>
                            <div className="space-y-2">
                              <div><span className="font-bold text-neutral-700">연차 사유:</span></div>
                              <div className="text-neutral-600 bg-gradient-to-r from-neutral-50 to-brand-50/30 p-3 rounded-xl border border-neutral-200/30">
                                {leave.reason}
                              </div>
                            </div>
                          </div>

                          {leave.approverComment && (
                            <div className="space-y-2">
                              <div className="font-bold text-neutral-700 text-sm">승인자 코멘트:</div>
                              <div className="text-neutral-600 bg-gradient-to-r from-brand-50/50 to-accent-50/30 p-3 rounded-xl border border-brand-200/30 text-sm">
                                {leave.approverComment}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {leave.status === 'pending' && (
                        <div className="flex items-center gap-3 pt-4 border-t border-neutral-200/30">
                          <button 
                            onClick={() => {
                              const comment = prompt('승인 코멘트를 입력하세요 (선택사항):');
                              if (comment !== null) {
                                handleStatusUpdate(leave.id!, 'approved', comment);
                              }
                            }}
                            className="flex-1 btn-primary bg-gradient-to-r from-success-500 to-brand-500 text-white py-2 px-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            승인
                          </button>
                          <button 
                            onClick={() => {
                              const comment = prompt('반려 사유를 입력하세요:');
                              if (comment) {
                                handleStatusUpdate(leave.id!, 'rejected', comment);
                              }
                            }}
                            className="flex-1 btn-secondary bg-gradient-to-r from-error-500 to-warning-500 text-white py-2 px-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            반려
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-200/30">
                        <div className="text-xs text-neutral-500">
                          ID: {leave.id}
                        </div>
                        <button 
                          onClick={() => handleDelete(leave.id!)} 
                          className="w-8 h-8 bg-gradient-to-br from-error-500 to-warning-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-glow"
                          title="삭제"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

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

export default AdminLeaves;