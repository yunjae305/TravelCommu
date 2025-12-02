import fs from 'fs';
import path from 'path';

// 단순 파일+메모리 저장소 (서버 재시작 후에도 유지)
const userStore = new Map();
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadUsersFromFile() {
  try {
    ensureDataDir();
    if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf8');
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    arr.forEach((u) => userStore.set(u.email, u));
  } catch (e) {
    console.error('[auth] load error', e);
  }
}

function saveUsersToFile() {
  try {
    ensureDataDir();
    const arr = Array.from(userStore.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {
    console.error('[auth] save error', e);
  }
}

loadUsersFromFile();

const countryOptions = ['대한민국', '일본', '베트남', '미국', '영국', '독일', '스페인', '이탈리아', '호주'];

export function showLoginForm(_req, res) {
  res.render('login', { title: '로그인', error: null, success: null, user: null, form: {} });
}

export function showSignupForm(_req, res) {
  res.render('signup', { title: '회원가입', error: null, form: {}, countries: countryOptions });
}

// Firebase 가입 후 프로필 저장
export function saveUserInfo(req, res) {
  const { uid, name, email, gender, country } = req.body || {};
  if (!uid || !name || !email || !gender || !country) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }
  userStore.set(email, { uid, name, email, gender, country });
  saveUsersToFile();
  return res.json({ success: true, user: { name, email, gender, country } });
}

// Firebase 로그인 후 서버에 사용자 기록/조회
export function loginWithFirebase(req, res) {
  const { uid, email, name } = req.body || {};
  if (!uid || !email) {
    return res.status(400).json({ error: 'uid와 이메일이 필요합니다.' });
  }
  let user = userStore.get(email);
  const resolvedName = name || (user && user.name) || (email ? email.split('@')[0] : '사용자');

  if (!user) {
    user = { uid, email, name: resolvedName, gender: '', country: '' };
  } else {
    user = { ...user, uid: user.uid || uid, name: resolvedName };
  }

  userStore.set(email, user);
  saveUsersToFile();

  return res.json({
    success: true,
    user: { name: user.name, email: user.email, gender: user.gender, country: user.country }
  });
}
