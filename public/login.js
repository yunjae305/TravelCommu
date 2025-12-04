const loginBtn = document.getElementById('login-btn');

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('id').value.trim();
    const password = document.getElementById('password').value;

    if (!id || !password) 
    {
        alert('아이디와 비밀번호를 입력해주세요.');
        return;
    }

    try 
    {
        //서버로 로그인 요청
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password })
        });

        const data = await res.json();

        if (data.success)
        {
            window.location.href = '/home';
        } 
        else 
        {
            alert(data.message);
        }
    } 
    catch (error) 
    {
        console.error(error);
        alert("오류가 발생했습니다.");
    }
});