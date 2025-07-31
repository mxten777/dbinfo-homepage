import React, { useEffect, useState } from 'react';
import { getDocs, updateDoc, doc, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { Employee } from '../../types/employee';

const AdminEmployeeLeaveEdit: React.FC = () => {
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
  }, [message]);

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
        carryOverLeaves: Number(editForm.carryOverLeaves),
        annualLeaves: Number(editForm.annualLeaves),
        usedLeaves: Number(editForm.usedLeaves),
        remainingLeaves: Number(editForm.remainingLeaves),
      });
      setMessage('수정 완료');
      setEditId(null);
      setEditForm({});
    } catch {
      setMessage('수정 실패');
    }
    setTimeout(() => setMessage(''), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h2 className="text-2xl mb-6">연차정보 초기화</h2>
      {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">연차정보 초기화</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-blue-100 sticky top-0 z-10">
              <tr>
                <th className="border px-4 py-2">이름</th>
                <th className="border px-4 py-2">이월연차</th>
                <th className="border px-4 py-2">올해연차</th>
                <th className="border px-4 py-2">총연차</th>
                <th className="border px-4 py-2">연차사용일수</th>
                <th className="border px-4 py-2">잔여연차</th>
                <th className="border px-4 py-2">수정</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="odd:bg-gray-50 even:bg-white hover:bg-blue-50">
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.name}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.carryOverLeaves}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.annualLeaves}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{(Number(emp.carryOverLeaves) || 0) + (Number(emp.annualLeaves) || 0)}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.usedLeaves || 0}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{((Number(emp.carryOverLeaves) || 0) + (Number(emp.annualLeaves) || 0)) - (Number(emp.usedLeaves) || 0)}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    <button className="bg-gray-200 px-3 py-1 rounded hover:bg-blue-200" onClick={() => handleEditClick(emp)}>수정</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEmployeeLeaveEdit;
