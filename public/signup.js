// Firebase 클라이언트 초기화 모듈 import
import app from '/firebase-client.js';
// 인증 관련 Firebase 함수 import
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js';

// 인증 인스턴스 준비
const auth = getAuth(app);
// 폼과 버튼, 에러 표시 요소 참조
const form = document.getElementById('signup-form');
const signupBtn = document.getElementById('signup-btn');
const errorMsg = document.getElementById('error-msg');

// 가입 버튼 클릭 시 회원가입 로직 실행
signupBtn.addEventListener('click', async (e) => {
  // 기본 폼 제출 동작 차단
  e.preventDefault();
  
  // 입력값 수집 및 공백 제거
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const gender = document.getElementById('gender').value;
  const country = document.getElementById('country').value;

  // 하나라도 비어 있으면 안내 후 종료
  if (!name || !email || !password || !gender || !country) {
    showError('모든 필드를 입력해주세요.');
    return;
  }

  try {
    // 중복 클릭 방지 및 진행 상태 표시
    signupBtn.disabled = true;
    signupBtn.textContent = '가입 중...';
    
    // Firebase에 사용자 계정 생성 요청
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // displayName 필드에 이름 저장
    await updateProfile(user, { displayName: name });
    
    // 서버에 추가 사용자 정보 저장
    const res = await fetch('/api/auth/save-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user.uid,
        name,
        email,
        gender,
        country
      })
    });

    // 서버 저장 성공 시 로컬 스토리지 저장 후 이동
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      window.location.href = '/mypage';
    } else {
      // 서버 측 오류 메시지 표시 후 버튼 상태 복구
      const data = await res.json();
      showError(data.error || '서버 저장 중 오류가 발생했습니다.');
      signupBtn.disabled = false;
      signupBtn.textContent = '회원가입';
    }
  } catch (error) {
    // Firebase 오류 유형별 안내 메시지 설정
    let msg = '회원가입에 실패했습니다.';
    if (error.code === 'auth/email-already-in-use') {
      msg = '이미 사용 중인 이메일입니다.';
    } else if (error.code === 'auth/weak-password') {
      msg = '비밀번호는 최소 6자 이상이어야 합니다.';
    } else if (error.code === 'auth/invalid-email') {
      msg = '유효한 이메일을 입력해주세요.';
    } else if (error.message) {
      msg = error.message;
    }
    showError(msg);
    signupBtn.disabled = false;
    signupBtn.textContent = '회원가입';
  }
});

// 에러 메시지를 화면에 표시하거나 업데이트
function showError(msg) {
  if (!errorMsg) {
    const newError = document.createElement('div');
    newError.className = 'alert';
    newError.id = 'error-msg';
    newError.textContent = msg;
    form.parentNode.insertBefore(newError, form);
  } else {
    errorMsg.textContent = msg;
  }
}
