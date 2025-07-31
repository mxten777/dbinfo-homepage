import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const initialForm = {
  empNo: '', name: '', regNo: '', gender: '', position: '', department: '', jobType: '', joinDate: '', email: '', phone: ''
};

const AdminEmployeeRegister: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'employees'), form);
      setMessage('직원정보가 등록되었습니다.');
      setForm(initialForm);
    } catch (err) {
      setMessage('등록 실패: ' + (err as Error).message);
    }
  };


  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-6">직원 등록</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <input name="empNo" value={form.empNo} onChange={handleChange} placeholder="사번" className="border rounded px-3 py-2" required />
        <input name="name" value={form.name} onChange={handleChange} placeholder="이름" className="border rounded px-3 py-2" required />
        <input name="regNo" value={form.regNo} onChange={handleChange} placeholder="주민번호" className="border rounded px-3 py-2" />
        <input name="gender" value={form.gender} onChange={handleChange} placeholder="성별" className="border rounded px-3 py-2" />
        <input name="position" value={form.position} onChange={handleChange} placeholder="직위" className="border rounded px-3 py-2" />
        <input name="department" value={form.department} onChange={handleChange} placeholder="부서" className="border rounded px-3 py-2" />
        <input name="jobType" value={form.jobType} onChange={handleChange} placeholder="직종" className="border rounded px-3 py-2" />
        <input name="joinDate" value={form.joinDate} onChange={handleChange} placeholder="입사일" className="border rounded px-3 py-2" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="이메일" className="border rounded px-3 py-2" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="연락처" className="border rounded px-3 py-2" />
        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 font-bold">등록</button>
      </form>
      {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}
    </div>
  );
};

export default AdminEmployeeRegister;
