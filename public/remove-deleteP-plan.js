//전역 함수 등록 (onclick에서 사용)
window.deleteTrip = async function(tripId) {
    if (!confirm("정말 여행 플래너를 삭제하시겠습니까?")) return;
    await sendRequestDeleteplan(`/trips/${tripId}/delete`);
};

window.leaveTrip = async function(tripId, participantId) {
    if (!confirm("해당 참가자를 제외하시겠습니까?")) return;
    await sendRequestParticipants(url)(`/trips/${tripId}/leave`);
};

//POST방식으로 정보를 보낸 후 라우팅 결과에 따라 출력하는 함수 (플래너 삭제)
async function sendRequestDeleteplan(url) {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr);

    try 
    {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

// POST방식으로 정보를 보낸 후 라우팅 결과에 따라 출력하는 함수 (참가자 삭제)
async function sendRequestParticipants(url) {
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