import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import { Link } from 'react-router-dom';

const initialForm = {
  empNo: '', name: '', regNo: '', gender: '', position: '', department: '', jobType: '', joinDate: '', email: '', phone: '', role: 'employee', password: '',
  carryOverLeaves: 0, // 이월연차
  annualLeaves: 0     // 발생연차
};

const AdminEmployeeRegister: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    // 일괄변환 버튼 핸들러
    const handleBulkConvert = async () => {
      setLoading(true);
      try {
        // employees 컬렉션 employeeId를 uid로 통일
        const empSnap = await getDocs(collection(db, 'employees'));
        for (const docSnap of empSnap.docs) {
          const data = docSnap.data();
          if (data.uid && data.employeeId !== data.uid) {
            await updateDoc(doc(db, 'employees', docSnap.id), { employeeId: data.uid });
          }
        }
        // leaves 컬렉션 employeeId를 uid로 통일
        const leaveSnap = await getDocs(collection(db, 'leaves'));
        for (const docSnap of leaveSnap.docs) {
          const data = docSnap.data();
          // 직원 uid 찾기
          const emp = empSnap.docs.find(e => {
            const ed = e.data();
            return ed.email === data.employeeName || ed.name === data.employeeName || ed.id === data.employeeId;
          });
          const uid = emp ? emp.data().uid : data.employeeId;
          if (uid && data.employeeId !== uid) {
            await updateDoc(doc(db, 'leaves', docSnap.id), { employeeId: uid });
          }
        }
        // deputyRequests 컬렉션 employeeId를 uid로 통일
        const deputySnap = await getDocs(collection(db, 'deputyRequests'));
        for (const docSnap of deputySnap.docs) {
          const data = docSnap.data();
          // 직원 uid 찾기
          const emp = empSnap.docs.find(e => {
            const ed = e.data();
            return ed.email === data.employeeName || ed.name === data.employeeName || ed.id === data.employeeId;
          });
          const uid = emp ? emp.data().uid : data.employeeId;
          if (uid && data.employeeId !== uid) {
            await updateDoc(doc(db, 'deputyRequests', docSnap.id), { employeeId: uid });
          }
        }
        setMessage('employeeId 일괄 변환 완료!');
      } catch (err) {
          {/* 관리자 네비게이션 바 */}
          <nav className="flex justify-center gap-4 mb-8">
            <Link to="/admin/register" className="bg-gray-100 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded font-semibold shadow">직원등록</Link>
            <Link to="/admin/manage" className="bg-gray-100 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded font-semibold shadow">직원관리</Link>
            <Link to="/admin/deputy" className="bg-gray-100 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded font-semibold shadow">대리신청관리</Link>
            <Link to="/admin/projects" className="bg-gray-100 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded font-semibold shadow">프로젝트관리</Link>
            <Link to="/admin/notice" className="bg-gray-100 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded font-semibold shadow">사내소식등록</Link>
            <Link to="/admin/leaves-reset" className="bg-gray-100 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded font-semibold shadow">연차정보초기화</Link>
          </nav>
        setMessage('일괄 변환 실패: ' + (err as Error).message);
      }
      setLoading(false);
    };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // 숫자 필드는 자동 변환
    if (name === 'carryOverLeaves' || name === 'annualLeaves') {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('등록 버튼 클릭됨');
    try {
      // Firebase Auth 계정 생성
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCredential.user.uid;
      const totalLeaves = Number(form.carryOverLeaves) + Number(form.annualLeaves);
      const employeeData = {
        ...form,
        uid,
        employeeId: uid,
        usedLeaves: 0,
        remainingLeaves: totalLeaves,
        totalLeaves,
        role: form.role,
        password: form.password // Firestore에도 저장(실제 운영시 해시 권장)
      };
      await addDoc(collection(db, 'employees'), employeeData);
      setMessage('직원정보가 등록되었습니다. (임시 패스워드: ' + form.password + ')');
      setForm(initialForm);
      setTimeout(() => {
        navigate('/admin/home');
      }, 1000);
    } catch (err: any) {
      console.error('직원 등록 에러:', err);
      let msg = '직원 등록 중 오류가 발생했습니다.';
      if (err.code === 'auth/email-already-in-use') {
        msg = '이미 사용 중인 이메일입니다.';
      } else if (err.code === 'auth/invalid-password') {
        msg = '비밀번호 규칙을 확인하세요.';
      }
      setMessage(msg);
    }
  };


  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-extrabold text-blue-700">직원 등록</h2>
        <Link to="/admin/home" className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded font-semibold shadow">관리자 홈</Link>
      </div>
        <button
          type="button"
          className="bg-green-500 text-white rounded px-4 py-2 font-bold mb-4"
          onClick={handleBulkConvert}
          disabled={loading}
        >
          employeeId 일괄 uid로 변환
        </button>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <div className="flex gap-2">
          <div className="flex flex-col w-1/2">
            <label htmlFor="carryOverLeaves" className="text-sm font-semibold text-gray-700 mb-1">이월연차</label>
            <input name="carryOverLeaves" id="carryOverLeaves" type="number" value={form.carryOverLeaves} onChange={handleChange} placeholder="이월연차" aria-label="이월연차" className="border rounded px-3 py-2 bg-gray-100 text-gray-600 placeholder-gray-400" min={0} />
          </div>
          <div className="flex flex-col w-1/2">
            <label htmlFor="annualLeaves" className="text-sm font-semibold text-gray-700 mb-1">발생연차</label>
            <input name="annualLeaves" id="annualLeaves" type="number" value={form.annualLeaves} onChange={handleChange} placeholder="발생연차" aria-label="발생연차" className="border rounded px-3 py-2 bg-gray-100 text-gray-600 placeholder-gray-400" min={0} />
          </div>
        </div>
        <div className="font-bold text-blue-700">총연차: {Number(form.carryOverLeaves) + Number(form.annualLeaves)}일</div>
  <input name="empNo" value={form.empNo} onChange={handleChange} placeholder="사번" aria-label="사번" className="border rounded px-3 py-2" required />
  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="패스워드" aria-label="패스워드" className="border rounded px-3 py-2" required />
  <input name="name" value={form.name} onChange={handleChange} placeholder="이름" aria-label="이름" className="border rounded px-3 py-2" required />
  <input name="regNo" value={form.regNo} onChange={handleChange} placeholder="주민번호" aria-label="주민번호" className="border rounded px-3 py-2" />
  <input name="gender" value={form.gender} onChange={handleChange} placeholder="성별" aria-label="성별" className="border rounded px-3 py-2" />
  <input name="position" value={form.position} onChange={handleChange} placeholder="직위" aria-label="직위" className="border rounded px-3 py-2" />
  <input name="department" value={form.department} onChange={handleChange} placeholder="부서" aria-label="부서" className="border rounded px-3 py-2" />
  <input name="jobType" value={form.jobType} onChange={handleChange} placeholder="직종" aria-label="직종" className="border rounded px-3 py-2" />
  <input name="joinDate" value={form.joinDate} onChange={handleChange} placeholder="입사일" aria-label="입사일" className="border rounded px-3 py-2" />
  <input name="email" value={form.email} onChange={handleChange} placeholder="이메일" aria-label="이메일" className="border rounded px-3 py-2" />
  <input name="phone" value={form.phone} onChange={handleChange} placeholder="연락처" aria-label="연락처" className="border rounded px-3 py-2" />
  <label className="font-semibold">권한(역할)</label>
  <select name="role" value={form.role} onChange={handleChange} className="border rounded px-3 py-2">
    <option value="employee">일반직원</option>
    <option value="admin">관리자</option>
  </select>
        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 font-bold">등록</button>
      </form>
      {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}
    </div>
  );
};

export default AdminEmployeeRegister;
