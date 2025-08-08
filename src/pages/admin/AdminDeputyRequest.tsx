import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

interface Employee {
  id: string;
  name: string;
  email: string;
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
  status: string;
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
      setEmployees(snap.docs.map(doc => ({ id: doc.id, name: doc.data().name, email: doc.data().email })));
    };
    fetchEmployees();
  }, []);

  // 신청 목록 불러오기
  useEffect(() => {
    const fetchRequests = async () => {
      const snap = await getDocs(collection(db, 'deputyRequests'));
      setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DeputyRequest)));
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
      status: '대기',
    };
    const docRef = await addDoc(collection(db, 'deputyRequests'), newRequest);
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
    await updateDoc(doc(db, 'deputyRequests', id), { status: '승인' });
  setRequests((prev: DeputyRequest[]) => prev.map((r: DeputyRequest) => r.id === id ? { ...r, status: '승인' } : r));
    // 연차 자동 반영
    await addDoc(collection(db, 'leaves'), {
      employeeId: req.employeeId,
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
  };
  const handleReject = async (id: string) => {
    await updateDoc(doc(db, 'deputyRequests', id), { status: '반려' });
  setRequests((prev: DeputyRequest[]) => prev.map((r: DeputyRequest) => r.id === id ? { ...r, status: '반려' } : r));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">관리자 대리 신청</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">직원 선택</label>
          <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="w-full border rounded px-3 py-2" required>
            <option value="">직원 선택</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">유형</label>
          <select value={type} onChange={e => setType(e.target.value as any)} className="w-full border rounded px-3 py-2">
            <option value="연차">연차</option>
            <option value="반차">반차</option>
            <option value="병가">병가</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">시작일</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">종료일</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">일수</label>
            <input type="number" value={days} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">사유</label>
          <textarea value={reason} onChange={e => setReason(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded font-bold">신청하기</button>
      </form>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">신청 목록</h3>
        {requests.length === 0 ? (
          <p className="text-gray-500">신청 내역이 없습니다.</p>
        ) : (
          <ul>
            {requests.map(r => (
              <li key={r.id} className="mb-4 border-b pb-2">
                <div className="font-semibold">{r.employeeName}</div>
                <div className="text-sm text-gray-700 mb-1">유형: {r.type} | 기간: {r.startDate} ~ {r.endDate} | 일수: {r.days}</div>
                <div className="text-sm text-gray-700 mb-1">사유: {r.reason}</div>
                <div className="text-sm mb-2">상태: <span className={r.status === '승인' ? 'text-green-600' : r.status === '반려' ? 'text-red-600' : 'text-gray-600'}>{r.status}</span></div>
                {r.status === '대기' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(r.id)} className="bg-green-500 text-white px-3 py-1 rounded">승인</button>
                    <button onClick={() => handleReject(r.id)} className="bg-red-500 text-white px-3 py-1 rounded">반려</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDeputyRequest;
