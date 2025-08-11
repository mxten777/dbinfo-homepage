import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // 미사용 import 제거
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';

interface Employee {
  id: string;
  uid?: string;
  empNo?: string;
  name: string;
  email: string;
  carryOverLeaves?: number;
  annualLeaves?: number;
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
  regNo?: string;
  gender?: string;
  position?: string;
  department?: string;
  jobType?: string;
  joinDate?: string;
  phone?: string;
  role?: string;
}

interface DeputyRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: '연차' | '반차' | '병가' | '기타';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: '신청' | '승인' | '반려';
}

const AdminDeputyRequest: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requests, setRequests] = useState<DeputyRequest[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState<'연차' | '반차' | '병가' | '기타'>('연차');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');

  // 직원목록 불러오기
  useEffect(() => {
    const fetchEmployees = async () => {
      const snap = await getDocs(collection(db, 'employees'));
      setEmployees(snap.docs.map(doc => ({
        id: doc.id,
        uid: doc.data().uid,
        empNo: doc.data().empNo,
        name: doc.data().name,
        email: doc.data().email,
        carryOverLeaves: doc.data().carryOverLeaves,
        annualLeaves: doc.data().annualLeaves,
        totalLeaves: doc.data().totalLeaves,
        usedLeaves: doc.data().usedLeaves,
        remainingLeaves: doc.data().remainingLeaves,
        regNo: doc.data().regNo,
        gender: doc.data().gender,
        position: doc.data().position,
        department: doc.data().department,
        jobType: doc.data().jobType,
        joinDate: doc.data().joinDate,
        phone: doc.data().phone,
        role: doc.data().role
      })));
    };
    fetchEmployees();
  }, []);

  // 신청 목록 불러오기
  useEffect(() => {
    const fetchRequests = async () => {
      const snap = await getDocs(collection(db, 'deputyRequests'));
      setRequests(
        snap.docs.map(doc => {
          const data = doc.data();
          // status 변환
          let status: '신청' | '승인' | '반려';
          if (data.status === '신청' || data.status === '승인' || data.status === '반려') status = data.status;
          else status = '신청';
          // type 변환
          let type: '연차' | '반차' | '병가' | '기타';
          if (data.type === '연차' || data.type === '반차' || data.type === '병가' || data.type === '기타') type = data.type;
          else type = '연차';
          const req: DeputyRequest = {
            id: doc.id,
            employeeId: data.employeeId || '',
            employeeName: data.employeeName || '',
            type,
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            days: typeof data.days === 'number' ? data.days : 1,
            reason: data.reason || '',
            status,
          };
          return req;
        })
      );
    };
    fetchRequests();
  }, []);

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
    if (!employeeId || !startDate || !endDate || !reason) return;
    const emp = employees.find(e => e.id === employeeId);
    const newRequest = {
      employeeId,
      employeeName: emp?.name || '',
      type,
      startDate,
      endDate,
      days,
      reason,
      status: '신청' as '신청' | '승인' | '반려',
      isAdminRequest: true,
      createdAt: Date.now(),
    };
    const docRef = await addDoc(collection(db, 'deputyRequests'), newRequest);
    await setDoc(doc(db, 'deputyRequests', docRef.id), {
      ...newRequest,
      id: docRef.id,
    });
    setRequests((prev: DeputyRequest[]) => [...prev, { id: docRef.id, ...newRequest }]);
    setEmployeeId('');
    setType('연차');
    setStartDate('');
    setEndDate('');
    setDays(1);
    setReason('');
  };

  // 승인 시 연차 자동 반영(예시: leaves 컬렉션에 추가)
  const handleApprove = async (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    try {
      await updateDoc(doc(db, 'deputyRequests', id), { status: '승인' });
      console.log(`[updateDoc] deputyRequest status 변경 성공: ${id} → 승인`);
      setRequests((prev: DeputyRequest[]) => prev.map((r: DeputyRequest) => r.id === id ? { ...r, status: '승인' } : r));
  // 직원 찾기: uid > id > email
  const emp = employees.find(e => e.uid === req.employeeId || e.id === req.employeeId || e.email === req.employeeId);
  const employeeIdForLeave = emp ? emp.uid ?? emp.id : req.employeeId;
      await addDoc(collection(db, 'leaves'), {
        employeeId: employeeIdForLeave,
        employeeName: req.employeeName,
        type: req.type,
        startDate: req.startDate,
        endDate: req.endDate,
        days: req.days,
        reason: req.reason,
        status: '승인',
        createdAt: new Date().toISOString(),
        isAdminRequest: true,
      });
      // 직원 usedLeaves/remainingLeaves 반영
      if (emp) {
        const days = req.type === '반차' ? 0.5 : req.days;
        const newUsed = (emp.usedLeaves ?? 0) + days;
        const newRemain = (emp.totalLeaves ?? 0) - newUsed;
        await updateDoc(doc(db, 'employees', emp.id), {
          usedLeaves: newUsed,
          remainingLeaves: newRemain
        });
        console.log(`[updateDoc] 직원 연차 반영 성공: ${emp.id} used=${newUsed} remain=${newRemain}`);
      } else {
        console.warn(`[updateDoc] 직원 정보 매칭 실패: req.employeeId=${req.employeeId}`);
      }
    } catch (error) {
      console.error('[updateDoc] 대리신청 승인 처리 실패:', error);
    }
  };
  const handleReject = async (id: string) => {
  await updateDoc(doc(db, 'deputyRequests', id), { status: '반려' });
  setRequests((prev: DeputyRequest[]) => prev.map((r: DeputyRequest) => r.id === id ? { ...r, status: '반려' } : r));
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-blue-200 flex flex-col gap-6 w-full max-w-2xl">
        <div className="mb-2 text-3xl font-extrabold text-blue-700 text-center drop-shadow">관리자 대리 신청</div>
        <div className="mb-4 text-gray-600 text-center text-base">관리자 부재 시 업무를 위임할 대리자를 지정할 수 있습니다.</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center w-full">
          <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="border rounded px-4 py-2 w-full max-w-xs" required>
            <option value="">직원 선택</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 w-full max-w-xs justify-between">
            <select value={type} onChange={e => setType(e.target.value as any)} className="border rounded px-2 py-2 w-24">
              <option value="연차">연차</option>
              <option value="반차">반차</option>
              <option value="병가">병가</option>
              <option value="기타">기타</option>
            </select>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded px-2 py-2 w-32" required />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded px-2 py-2 w-32" required />
            <input type="number" value={days} readOnly className="border rounded px-2 py-2 w-16 bg-gray-100" />
          </div>
          <textarea value={reason} onChange={e => setReason(e.target.value)} className="border rounded px-4 py-2 w-full max-w-xs" rows={3} placeholder="위임 사유" required />
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-700 transition w-full max-w-xs">대리 신청</button>
        </form>
      </div>
      <div className="w-full max-w-2xl border rounded-2xl p-8 bg-white mt-8 shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-blue-700">신청 목록</h3>
        {requests.length === 0 ? (
          <p className="text-gray-400">신청 내역이 없습니다.</p>
        ) : (
          <ul>
            {requests.map(r => (
              <li key={r.id} className="mb-4 border-b pb-3">
                <div className="font-semibold text-lg text-blue-700">{r.employeeName}</div>
                <div className="text-xs text-gray-600 mb-1">유형: {r.type} | 기간: {r.startDate} ~ {r.endDate} | 일수: {r.days}</div>
                <div className="text-xs text-gray-600 mb-1">사유: {r.reason}</div>
                <div className="text-xs mb-2">상태: <span className={r.status === '승인' ? 'text-green-600' : r.status === '반려' ? 'text-red-600' : 'text-gray-600'}>{r.status}</span></div>
                {r.status === '신청' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(r.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold shadow hover:bg-green-700 transition">승인</button>
                    <button onClick={() => handleReject(r.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold shadow hover:bg-red-700 transition">반려</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 font-bold text-lg transition-all duration-150 flex items-center gap-2 mt-8" onClick={() => window.location.href = '/admin/home'}>
        <span>🏠</span> 관리자 홈으로
      </button>
    </div>
  );
};

export default AdminDeputyRequest;
