import app from '/firebase-client.js';
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const db = getDatabase(app);

// 폼과 버튼, 에러 표시 요소 참조
const signupBtn = document.getElementById('signup-btn');

// 가입 버튼 클릭 시 회원가입 로직 실행
signupBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const userId = document.getElementById('id').value.trim();
  const password = document.getElementById('password').value.trim();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const gender = document.getElementById('gender').value;
  const country = document.getElementById('country').value;

  if (!userId || !password || !name || !email) 
  {
    alert("모든 필수 정보를 입력해주세요.");
    return;
  }

  try 
  {
    //서버로 데이터를 보내서 처리 (서버에서 중복체크 & 암호화 & 저장 수행)
    const res = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: userId,        // 서버 컨트롤러에서 받는 변수명에 맞춤
            password: password,
            name: name,
            email: email,
            gender: gender,
            country: country
        })
    });

    const data = await res.json();

    //서버 응답(data.success)에 따라 처리
    if (data.success) {
        alert(data.message);
        window.location.href = '/'; // 로그인 화면으로 이동
    } else {
        alert(data.message); 
    }

  } 
  catch (error) 
  {
    console.error("가입 요청 실패:", error);
    alert("회원가입 중 오류가 발생했습니다: " + error.message);
  }
});
