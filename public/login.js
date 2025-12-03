import app from './firebase-client.js';
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
const loginBtn = document.getElementById('login-btn');

const db = getDatabase(app);

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('id').value.trim();
    const password = document.getElementById('password').value;

    if (!id || !password) {
      showError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    const dbRef = ref(db);

    try 
    {
      loginBtn.disabled = true;
      loginBtn.textContent = '로그인 중...';
      
      const check_userExists = await get(child(dbRef, `users/${id}`));
    
      if (check_userExists.exists()) 
      {
        const userData = check_userExists.val();

        if(password === userData.password)
        {
            // 로그인 성공 시 작성자/프로필 정보 저장
            localStorage.setItem('currentUser', JSON.stringify({
              userId: id,
              name: userData.name || '',
              email: userData.email || '',
              country: userData.country || '',
              gender: userData.gender || '',
            }));

            alert(`${userData.name}님 환영합니다!`);
            localStorage.setItem('user', JSON.stringify(userData));
            window.location.href = '/home';
        }
        else
        {
            alert("비밀번호가 일치하지 않습니다.");
        }
      }
      else
      {
          alert("존재하지 않는 아이디입니다.");
      }
    } 
    catch (error) 
    {
        console.error(error);
        alert("로그인 중 오류가 발생했습니다.");
    }
  });
