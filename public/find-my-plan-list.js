document.addEventListener('DOMContentLoaded', async () => {
    const gridContainer = document.getElementById('my-plans-body');
    const storedUser = localStorage.getItem('user');

    //비로그인 예외 처리 추가
    if (!storedUser) {
        gridContainer.innerHTML = '<p style="padding:20px;">로그인이 필요합니다.</p>';
        return;
    }

    const currentUser = JSON.parse(storedUser);
    
    try 
    {
       const response = await fetch('/api/trips/myplans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                myEmail: currentUser.email,
                myName: currentUser.name
            })
        });

        const plans = await response.json();

        if (plans.length > 0) {
            plans.forEach(planner => {
                const date = planner.createdAt ? new Date(planner.createdAt).toLocaleDateString() : '-';
                const rowHTML = `
                    <tr onclick="location.href='/detail-myplan/${planner.id}'" style="cursor: pointer;">
                        <td><span class="trip-title" style="font-weight:600; color:#0f172a;">${planner.topic}</span></td>
                        <td class="trip-meta">${planner.participants.length} / ${planner.headcount}</td>
                        <td class="trip-meta">${planner.authorName}</td>
                        <td class="trip-meta">${date}</td>
                    </tr>
                `;
                    
                gridContainer.insertAdjacentHTML('beforeend', rowHTML);
            });
        } 
        else 
        {
            gridContainer.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-row">'${currentUser.name}'님이 작성하신 여행 플랜이 없습니다.</td>
                </tr>
            `;
        }
    } 
    catch (error) 
    {
        console.error("플랜 로딩 실패:", error);
    }
});