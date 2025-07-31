import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Employee } from '../types/employee';

const AdminEmployeeEdit: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Employee>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const snap = await getDocs(collection(db, 'employees'));
      setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
    };
    fetchEmployees();
  }, []);

  const handleEditClick = (emp: Employee) => {
    setEditId(emp.id);
    setEditForm(emp);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newForm = { ...editForm, [name]: value };
    // 잔여연차 자동 계산
    if (name === 'carryOverLeaves' || name === 'annualLeaves' || name === 'usedLeaves') {
      const carry = Number(name === 'carryOverLeaves' ? value : newForm.carryOverLeaves || 0);
      const annual = Number(name === 'annualLeaves' ? value : newForm.annualLeaves || 0);
      const used = Number(name === 'usedLeaves' ? value : newForm.usedLeaves || 0);
      newForm.remainingLeaves = carry + annual - used;
    }
    setEditForm(newForm);
  };

  const handleSave = async () => {
    if (!editId) return;
    try {
      await updateDoc(doc(db, 'employees', editId), {
        name: editForm.name,
        empNo: editForm.empNo,
        email: editForm.email,
        carryOverLeaves: Number(editForm.carryOverLeaves),
        annualLeaves: Number(editForm.annualLeaves),
        usedLeaves: Number(editForm.usedLeaves),
        remainingLeaves: Number(editForm.remainingLeaves),
      });
      setMessage('수정 완료');
      setEditId(null);
      setEditForm({});
      // 데이터 갱신
      const snap = await getDocs(collection(db, 'employees'));
      setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
    } catch {
      setMessage('수정 실패');
    }
    setTimeout(() => setMessage(''), 1500);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">직원연차정보 수정</h2>
      {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}
      <table className="min-w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">사번</th>
            <th className="border px-2 py-1">이름</th>
            <th className="border px-2 py-1">이메일</th>
            <th className="border px-2 py-1">이월연차</th>
            <th className="border px-2 py-1">올해연차</th>
            <th className="border px-2 py-1">사용일수</th>
            <th className="border px-2 py-1">잔여연차</th>
            <th className="border px-2 py-1">수정</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td className="border px-2 py-1">{editId === emp.id ? <input name="empNo" value={editForm.empNo || ''} onChange={handleFormChange} className="w-24 border rounded px-1" /> : emp.empNo}</td>
              <td className="border px-2 py-1">{editId === emp.id ? <input name="name" value={editForm.name || ''} onChange={handleFormChange} className="w-24 border rounded px-1" /> : emp.name}</td>
              <td className="border px-2 py-1">{editId === emp.id ? <input name="email" value={editForm.email || ''} onChange={handleFormChange} className="w-32 border rounded px-1" /> : emp.email || '-'}</td>
              <td className="border px-2 py-1">{editId === emp.id ? <input name="carryOverLeaves" type="number" value={editForm.carryOverLeaves || ''} onChange={handleFormChange} className="w-16 border rounded px-1" /> : emp.carryOverLeaves}</td>
              <td className="border px-2 py-1">{editId === emp.id ? <input name="annualLeaves" type="number" value={editForm.annualLeaves || ''} onChange={handleFormChange} className="w-16 border rounded px-1" /> : emp.annualLeaves}</td>
              <td className="border px-2 py-1">{editId === emp.id ? <input name="usedLeaves" type="number" value={editForm.usedLeaves || ''} onChange={handleFormChange} className="w-16 border rounded px-1" /> : emp.usedLeaves}</td>
              <td className="border px-2 py-1">{editId === emp.id ? <input name="remainingLeaves" type="number" value={editForm.remainingLeaves || ''} readOnly className="w-16 border rounded px-1 bg-gray-100" /> : emp.remainingLeaves}</td>
              <td className="border px-2 py-1">
                {editId === emp.id ? (
                  <button onClick={handleSave} className="px-2 py-1 bg-blue-500 text-white rounded">저장</button>
                ) : (
                  <button onClick={() => handleEditClick(emp)} className="px-2 py-1 bg-gray-200 rounded">수정</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-8">
        <button className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full shadow hover:bg-gray-400 font-semibold transition" onClick={() => navigate('/admin-home')}>
          관리자 홈으로
        </button>
      </div>
    </div>
  );
};

export default AdminEmployeeEdit;
