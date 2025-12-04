document.addEventListener('DOMContentLoaded', async () => {
    const gridContainer = document.getElementById('preference-trips-grid');
    const storedUser = localStorage.getItem('user');

    //비로그인 예외 처리 추가
    if (!storedUser) {
        gridContainer.innerHTML = '<p style="padding:20px;">로그인이 필요합니다.</p>';
        return;
    }

    const currentUser = JSON.parse(storedUser);
    
    try 
    {
       const response = await fetch('/api/trips/favorite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                myCountry: currentUser.country, 
                myName: currentUser.name
            })
        });

        let displayCount = 0; 
        const plans = await response.json();

        if (plans.length > 0) {
            plans.forEach(trip => {
                if(displayCount < 4)
                {
                    const bgImg = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3';
                    
                    const cardHTML = `
                        <div class="card" onclick="location.href='/detail/${trip.id}'">
                            <div class="card-image" style="background-image: url('${bgImg}');"></div>
                            <div class="card-content">
                                <div class="author-participants">
                                    <span class="headcount"><i class="fas fa-users"></i> ${trip.participants.length ? trip.participants.length : 0} / ${trip.headcount}명</span>
                                    <span class="card-create-name">작성자: ${trip.authorName}</span>
                                </div>
                                <h3 class="card-name">${trip.topic}</h3>
                            </div>
                        </div>
                    `;
                    
                    gridContainer.insertAdjacentHTML('beforeend', cardHTML);
                    displayCount++;
                }
            });
        } 
        else 
        {
            gridContainer.innerHTML = `
                <div class="card">
                        <div class="card-image" style="background: linear-gradient(to left, #b5e7a0, #c9f1b9);"></div>
                        <div class="card-content">
                            <h3 class="card-name">일치하는 플랜이 없습니다 😥</h3>
                        </div>
                </div>
            `;
        }
    } 
    catch (error) 
    {
        console.error("플랜 로딩 실패:", error);
    }
});