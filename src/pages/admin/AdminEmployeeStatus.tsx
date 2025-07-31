import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AdminEmployeeStatus: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'employees'));
      setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setError('직원 데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/admin-employee-edit?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'employees', id));
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 flex justify-center items-start">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 flex flex-col gap-10">
          <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-tight">직원현황 조회</h1>
          {loading ? (
            <div className="text-center py-8 text-gray-400">직원 데이터 로딩 중...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8 text-gray-400">직원 데이터 없음</div>
          ) : (
            <table className="min-w-[700px] w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-blue-50 text-blue-900">
                  <th className="border px-4 py-2 rounded-tl-lg">이름</th>
                  <th className="border px-4 py-2">이메일</th>
                  <th className="border px-4 py-2">사번</th>
                  <th className="border px-4 py-2">직급</th>
                  <th className="border px-4 py-2">수정</th>
                  <th className="border px-4 py-2 rounded-tr-lg">삭제</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className="bg-gray-50 hover:bg-blue-50 shadow rounded-lg">
                    <td className="border px-4 py-2 whitespace-nowrap">{emp.name}</td>
                    <td className="border px-4 py-2 whitespace-nowrap">{emp.email}</td>
                    <td className="border px-4 py-2 whitespace-nowrap">{emp.empNo}</td>
                    <td className="border px-4 py-2 whitespace-nowrap">{emp.position}</td>
                    <td className="border px-4 py-2 whitespace-nowrap">
                      <button className="px-4 py-1 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition" onClick={() => handleEdit(emp.id)}>수정</button>
                    </td>
                    <td className="border px-4 py-2 whitespace-nowrap">
                      <button className="px-4 py-1 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition" onClick={() => handleDelete(emp.id)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmployeeStatus;
