import app from '/firebase-client.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js';

const auth = getAuth(app);

// 헬퍼: DOM id로 텍스트 교체
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// 헬퍼: 셀렉터 대상 display 토글
function setDisplay(selector, displayValue) {
  document.querySelectorAll(selector).forEach((node) => {
    node.style.display = displayValue;
  });
}

// 로그아웃 버튼에 한 번만 핸들러 부착
function attachLogout(logoutBtn) {
  if (!logoutBtn || logoutBtn.dataset.attached === '1') return;
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('signOut error', e);
    } finally {
      localStorage.removeItem('currentUser');
      window.location.href = '/';
    }
  });
  logoutBtn.dataset.attached = '1';
}

onAuthStateChanged(auth, async (user) => {
  const loginAnchors = Array.from(document.querySelectorAll("a[href='/login']"));
  const signupAnchors = Array.from(document.querySelectorAll("a[href='/signup']"));
  const logoutBtn = document.getElementById('logout-btn');
  const headerProfile = document.getElementById('header-profile');
  const headerUserName = document.getElementById('user-name');
  const headerUserBox = document.getElementById('header-user');

  if (user) {
    const displayName =
      user.displayName || (user.email ? user.email.split('@')[0] : '사용자');
    const userInfo = { name: displayName, email: user.email || '' };
    localStorage.setItem('currentUser', JSON.stringify(userInfo));

    setText('user-name', `${displayName}님`);
    setText('profile-name', `${displayName}님`);
    if (headerProfile) headerProfile.style.display = '';
    if (headerUserName) headerUserName.style.display = '';
    if (headerUserBox) headerUserBox.style.display = 'flex';

    // 로그인 링크를 로그아웃 버튼으로 재활용 (없다면 logoutBtn 사용)
    let logoutTarget = logoutBtn;
    if (!logoutTarget && loginAnchors.length) {
      logoutTarget = loginAnchors[0];
      logoutTarget.id = 'logout-btn';
      logoutTarget.textContent = '로그아웃';
      logoutTarget.href = '#';
      logoutTarget.style.display = '';
      // 나머지 로그인 링크는 숨김
      loginAnchors.slice(1).forEach((a) => (a.style.display = 'none'));
    } else {
      loginAnchors.forEach((a) => (a.style.display = 'none'));
    }

    signupAnchors.forEach((a) => (a.style.display = 'none'));

    attachLogout(logoutTarget);
    if (logoutTarget) logoutTarget.style.display = '';
  } else {
    localStorage.removeItem('currentUser');
    setText('user-name', 'OOO님');
    setText('profile-name', 'OOO님');
    if (headerProfile) headerProfile.style.display = 'none';
    if (headerUserName) headerUserName.style.display = 'none';
    if (headerUserBox) headerUserBox.style.display = 'none';

    // 로그아웃 버튼 숨기고, 로그인 링크를 원래대로 노출
    const currentLogout = document.getElementById('logout-btn');
    if (currentLogout) {
      currentLogout.style.display = 'none';
      // logout-btn이 로그인 링크를 재사용한 경우를 대비해 원상복귀
      if (currentLogout.tagName === 'A') {
        currentLogout.textContent = '로그인';
        currentLogout.href = '/login';
        currentLogout.removeAttribute('id');
        currentLogout.removeAttribute('data-attached');
        currentLogout.style.display = '';
      }
    }
    setDisplay("a[href='/login']", '');
    setDisplay("a[href='/signup']", '');
  }
});
