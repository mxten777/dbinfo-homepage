import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Leaves: React.FC = () => {
  // 직원 데이터 상태
  const [employees, setEmployees] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // 연차신청 내역 상태
  const [leaves, setLeaves] = useState<any[]>([]);
  const [leavesLoading, setLeavesLoading] = useState(true);
  const [leavesError, setLeavesError] = useState('');

  // 연차신청 내역 Firestore에서 불러오기
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
  // 연차신청 승인/반려 핸들러
  const handleApprove = async (leaveId: string) => {
    try {
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
  const [error, setError] = useState('');

  // 연차신청 폼 상태
  const [form, setForm] = useState({ name: '', date: '', reason: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  // 직원 데이터 Firestore에서 불러오기
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snap = await getDocs(collection(db, 'employees'));
        setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError('직원 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // 폼 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 연차신청 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date || !form.reason) {
      alert('모든 항목을 입력하세요.');
      return;
    }
    setSubmitLoading(true);
    try {
      await addDoc(collection(db, 'leaves'), {
        name: form.name,
        date: form.date,
        reason: form.reason,
        createdAt: new Date().toISOString(),
        status: '신청',
      });
      alert('연차 신청이 완료되었습니다!');
      setForm({ name: '', date: '', reason: '' });
    } catch (err) {
      alert('신청 실패: ' + (err as Error).message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center text-blue-700">DB.INFO 연차 관리 시스템</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
            onClick={() => navigate('/admin')}
          >
            관리자 홈으로
          </button>
        </div>
        {/* 연차신청 폼 */}
        <div className="mb-10">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">이름</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-blue-400"
                  placeholder="이름 입력"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">날짜</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                disabled={submitLoading}
              >
                {submitLoading ? '신청 중...' : '신청'}
              </button>
            </div>
          </form>
        </div>
        {/* 직원 연차 테이블 */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-600">직원 연차 현황</h2>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-400">직원 데이터 로딩 중...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : (
                <table className="min-w-[700px] w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-blue-100 text-blue-900">
                      <th className="border px-4 py-2 rounded-tl-lg">사번</th>
                      <th className="border px-4 py-2">이름</th>
                      <th className="border px-4 py-2">이메일</th>
                      <th className="border px-4 py-2">총연차</th>
                      <th className="border px-4 py-2">사용일수</th>
                      <th className="border px-4 py-2 rounded-tr-lg">잔여일수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id} className="bg-gray-50 hover:bg-blue-50 shadow rounded-lg">
                        <td className="border px-4 py-2 font-semibold">{emp.empNo}</td>
                        <td className="border px-4 py-2 font-semibold">{emp.name}</td>
                        <td className="border px-4 py-2">{emp.email}</td>
                        <td className="border px-4 py-2">{emp.totalLeaves}</td>
                        <td className="border px-4 py-2">{emp.usedLeaves}</td>
                        <td className="border px-4 py-2">{emp.remainingLeaves}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        {/* 연차신청 내역 테이블 */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-600">연차신청 내역</h2>
            <div className="overflow-x-auto">
              {leavesLoading ? (
                <div className="text-center py-8 text-gray-400">연차신청 내역 로딩 중...</div>
              ) : leavesError ? (
                <div className="text-center py-8 text-red-500">{leavesError}</div>
              ) : leaves.length === 0 ? (
                <div className="text-center py-8 text-gray-400">신청 내역 없음</div>
              ) : (
                <table className="min-w-[700px] w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-blue-50 text-blue-900">
                      <th className="border px-4 py-2 rounded-tl-lg whitespace-nowrap">이름</th>
                      <th className="border px-4 py-2 whitespace-nowrap">날짜</th>
                      <th className="border px-4 py-2 whitespace-nowrap">사유</th>
                      <th className="border px-4 py-2 whitespace-nowrap">신청일자</th>
                      <th className="border px-4 py-2 whitespace-nowrap">상태</th>
                      <th className="border px-4 py-2 rounded-tr-lg whitespace-nowrap">처리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map(leave => (
                      <tr key={leave.id} className="bg-gray-50 hover:bg-blue-50 shadow rounded-lg">
                        <td className="border px-4 py-2 whitespace-nowrap">{leave.name}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{leave.date}</td>
                        <td className="border px-4 py-2 whitespace-nowrap truncate" title={leave.reason}>{leave.reason}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{leave.createdAt ? new Date(leave.createdAt).toLocaleDateString('ko-KR') : '-'}</td>
                        <td className="border px-4 py-2 font-bold text-blue-600 whitespace-nowrap">{leave.status}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">
                          {leave.status === '신청' ? (
                            <div className="flex gap-2 justify-center">
                              <button
                                className="px-4 py-1 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                                onClick={() => handleApprove(leave.id)}
                              >승인</button>
                              <button
                                className="px-4 py-1 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                                onClick={() => handleReject(leave.id)}
                              >반려</button>
                            </div>
                          ) : (
                            <span className="text-gray-400">처리 완료</span>
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
      </div>
    </div>
  );
}

export default Leaves;
