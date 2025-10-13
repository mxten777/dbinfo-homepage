// Firebase Security Rules 테스트용 설정
// Firebase Console > Firestore Database > Rules에서 다음과 같이 설정하세요:

/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 임시: 모든 읽기 허용 (테스트용)
    match /{document=**} {
      allow read: if true;
      allow write: if false; // 쓰기는 보안상 차단
    }
  }
}
*/

// 또는 더 구체적인 규칙:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // employees 컬렉션만 읽기 허용
    match /employees/{employeeId} {
      allow read: if true;
      allow write: if false;
    }
    
    // 다른 컬렉션들도 필요하면 추가
    match /projects/{projectId} {
      allow read: if true;
    }
    
    match /leaves/{leaveId} {
      allow read: if true;
    }
    
    match /company_news/{newsId} {
      allow read: if true;
    }
    
    match /deputy_requests/{requestId} {
      allow read: if true;
    }
  }
}
*/