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

  const dbRef = ref(db);
  
  try 
  {
    const check_userAlreadyExists = await get(child(dbRef, `users/${userId}`));
    
    if (check_userAlreadyExists.exists()) 
    {
      alert("이미 존재하는 아이디입니다.");
      return;
    }

    // Realtime Database에 저장
    await set(ref(db, 'users/' + userId), {
      userId: userId,
      password: password,
      name: name,
      email: email,
      gender: gender,
      country: country,
    });

    alert("회원가입 성공!");
    window.location.href = '/';

  } catch (error) {
    console.error("저장 실패:", error);
    alert("회원가입 중 오류가 발생했습니다: " + error.message);
  }
});