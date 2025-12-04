document.addEventListener('DOMContentLoaded', () => {
    // 참가자 목록은 문자열로 되어있으므로 파싱 필요
    const container = document.getElementById('trip-container');
    const participantsStr = container.dataset.participants || '[]';
    const participants = JSON.parse(participantsStr);

    const userStr = localStorage.getItem('user');
    const currentUser = JSON.parse(userStr);

    const btnJoin = document.getElementById('join-btn');
    const btnLeave = document.getElementById('leave-btn');

    const myId = currentUser.userId;

    //이미 참가중인 플래너이면: 참여 취소 버튼
    if (participants.includes(myId))
    {
        if(btnLeave)
        {
            btnLeave.style.display = 'flex';
        }
    }
    //참여중이지 않은 플래너이면: 참여 버튼
    else 
    {
        if(btnJoin)
        {
            btnJoin.style.display = 'flex'; 
        }
    }
});

//전역 함수 등록 (onclick에서 사용)
window.joinTrip = async function(tripId) {
    if (!confirm("이 여행에 참가하시겠습니까?")) return;
    await sendRequest(`/trips/${tripId}/join`);
};

window.leaveTrip = async function(tripId) {
    if (!confirm("여행 참가를 취소하시겠습니까?")) return;
    await sendRequest(`/trips/${tripId}/leave`);
};

// POST방식으로 정보를 보낸 후 라우팅 결과에 따라 출력하는 함수
async function sendRequest(url) {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr);

    try 
    {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.userId })
        });
        
        const data = await res.json();
        
        if (data.success) 
        {
            alert(data.message);
            location.reload();
        } 
        else 
        {
            alert(data.message);
        }
    } 
    catch (error) 
    {
        console.error(error);
        alert("오류 발생");
    }
}