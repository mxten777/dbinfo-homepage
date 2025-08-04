import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { Employee } from '../../types/employee';

const AdminEmployeeLeaveEdit: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ carryOverLeaves: '', annualLeaves: '', usedLeaves: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const snap = await getDocs(collection(db, 'employees'));
      setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
    };
    fetchEmployees();
  }, []);



  // 연차정보 저장 핸들러
  const handleEditClick = (emp: Employee) => {
    setEditId(emp.id);
    setEditForm({
      carryOverLeaves: String(emp.carryOverLeaves ?? ''),
      annualLeaves: String(emp.annualLeaves ?? ''),
      usedLeaves: String(emp.usedLeaves ?? '')
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!editId) return;
    try {
      const firestore = await import('firebase/firestore');
      const empRef = firestore.doc(db, 'employees', editId);
      const carryOverLeaves = Number(editForm.carryOverLeaves) || 0;
      const annualLeaves = Number(editForm.annualLeaves) || 0;
      const usedLeaves = Number(editForm.usedLeaves) || 0;
      await firestore.updateDoc(empRef, {
        carryOverLeaves,
        annualLeaves,
        usedLeaves
      });
      setEmployees(prev => prev.map(emp => emp.id === editId ? { ...emp, carryOverLeaves, annualLeaves, usedLeaves } : emp));
      setMessage('저장되었습니다.');
      setEditId(null);
    } catch (err) {
      setMessage('저장 실패');
    }
    setTimeout(() => setMessage(''), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h2 className="text-2xl mb-6">연차정보 초기화</h2>
      {message && <div className="mb-4 text-green-600 font-bold text-center">{message}</div>}
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
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {editId === emp.id ? (
                      <input type="number" name="carryOverLeaves" value={editForm.carryOverLeaves} onChange={handleFormChange} className="w-16 border rounded px-2" />
                    ) : emp.carryOverLeaves}
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {editId === emp.id ? (
                      <input type="number" name="annualLeaves" value={editForm.annualLeaves} onChange={handleFormChange} className="w-16 border rounded px-2" />
                    ) : emp.annualLeaves}
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">{(Number(emp.carryOverLeaves) || 0) + (Number(emp.annualLeaves) || 0)}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {editId === emp.id ? (
                      <input type="number" name="usedLeaves" value={editForm.usedLeaves} onChange={handleFormChange} className="w-16 border rounded px-2" />
                    ) : (emp.usedLeaves || 0)}
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">{((Number(emp.carryOverLeaves) || 0) + (Number(emp.annualLeaves) || 0)) - (Number(emp.usedLeaves) || 0)}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {editId === emp.id ? (
                      <>
                        <button className="px-3 py-1 bg-blue-500 text-white rounded mr-2" onClick={handleSave}>저장</button>
                        <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setEditId(null)}>취소</button>
                      </>
                    ) : (
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded" onClick={() => handleEditClick(emp)}>수정</button>
                    )}
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
