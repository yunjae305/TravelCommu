import app from '/firebase-client.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js';

const auth = getAuth(app);
const form = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const errorMsg = document.getElementById('error-msg');

function isLoggedIn() {
  try {
    return !!localStorage.getItem('currentUser');
  } catch (e) {
    return false;
  }
}

if (loginBtn) {
  // 이미 로그인 상태면 버튼 텍스트를 로그아웃으로 표시
  if (isLoggedIn()) {
    loginBtn.textContent = '로그아웃';
  }

  loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // 로그인 상태에서 클릭 시 로그아웃 처리
    if (isLoggedIn()) {
      localStorage.removeItem('currentUser');
      loginBtn.textContent = '로그인';
      alert('로그아웃 되었습니다.');
      window.location.href = '/';
      return;
    }
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      loginBtn.disabled = true;
      loginBtn.textContent = '로그인 중...';
      
      // Firebase로 로그인
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 서버에 사용자 기록 동기화
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        window.location.href = '/mypage';
      } else {
        const data = await res.json();
        showError(data.error || '서버 처리 중 오류가 발생했습니다.');
        loginBtn.disabled = false;
        loginBtn.textContent = '로그인';
      }
    } catch (error) {
      let msg = '로그인에 실패했습니다.';
      if (error.code === 'auth/user-not-found') {
        msg = '가입된 이메일이 없습니다. 회원가입을 진행해주세요.';
      } else if (error.code === 'auth/wrong-password') {
        msg = '비밀번호가 일치하지 않습니다.';
      } else if (error.code === 'auth/invalid-email') {
        msg = '유효한 이메일을 입력해주세요.';
      } else if (error.message) {
        msg = error.message;
      }
      showError(msg);
      loginBtn.disabled = false;
      loginBtn.textContent = '로그인';
    }
  });
}

function showError(msg) {
  if (!errorMsg || errorMsg.textContent === '') {
    const newError = document.createElement('div');
    newError.className = 'alert';
    newError.id = 'error-msg';
    newError.textContent = msg;
    form.parentNode.insertBefore(newError, form);
  } else {
    errorMsg.textContent = msg;
  }
}
