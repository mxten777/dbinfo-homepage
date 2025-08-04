# 🏢 시스템 역할 구조

## 📋 개선된 관리자/직원 분리 시스템

### 🔑 관리자 (Admin)
**역할**: 통제/감독자
- **데이터 저장**: `admins` 컬렉션에만 저장
- **권한**: 전체 시스템 관리, 직원 등록/수정, 휴가 승인/거절
- **특징**: 
  - 직원 목록에 표시되지 않음
  - 휴가 신청 대상이 아님
  - 관리 도구에만 접근 가능

**관리자 계정**:
- 한규재: `hankjae@db-info.co.kr` / `admin1234!`
- 김애숙: `6511kesuk@db-info.co.kr` / `admin1234!`

### 👥 직원 (Employee)
**역할**: 관리 대상
- **데이터 저장**: `employees` 컬렉션에만 저장
- **권한**: 휴가 신청, 개인정보 수정, 비밀번호 변경
- **특징**:
  - 관리자가 등록/관리
  - 휴가 신청 및 사용 내역 관리
  - 임시 비밀번호로 시작 후 변경 필요

## 🗂️ 데이터 구조

### admins 컬렉션
```
{
  email: string,
  name: string,
  role: 'admin',
  isAdmin: true,
  permissions: ['all'],
  createdAt: string
}
```

### employees 컬렉션
```
{
  empNo: string,
  name: string,
  email: string,
  role: 'employee', // 관리자는 저장되지 않음
  totalLeaves: number,
  usedLeaves: number,
  remainingLeaves: number,
  // ... 기타 직원 정보
}
```

## 🔄 주요 개선사항

1. **완전 분리**: 관리자는 직원 목록에서 완전히 제외
2. **권한 명확화**: 관리자는 `admins` 컬렉션에서만 확인
3. **역할 구분**: 관리자 = 통제자, 직원 = 관리 대상
4. **UI 개선**: 관리자는 관리 화면만, 직원은 사용자 화면만 접근

## ⚠️ 마이그레이션 필요

기존에 `employees` 컬렉션에 저장된 관리자 데이터는 수동으로 삭제해야 함:
```javascript
// Firebase 콘솔에서 실행
// employees 컬렉션에서 role: 'admin' 인 문서들 삭제
```
