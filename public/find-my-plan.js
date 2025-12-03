import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import app from '/firebase-client.js';

const db = getDatabase(app);

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async () => {
    
    const gridContainer = document.getElementById('my-plans-grid');
    
    const storedUser = localStorage.getItem('user');

    const currentUser = JSON.parse(storedUser);
    const myUserName = currentUser.name;

    const dbRef = ref(db);
    
    try 
    {
        const snapshot = await get(child(dbRef, 'trips'));

        let displayCount = 0; 

            snapshot.forEach((childSnapshot) => {
                const tripData = childSnapshot.val();
                const tripId = childSnapshot.key;

                if (tripData.authorName === myUserName && displayCount < 4) {
                    
                    const cardHTML = `
                       <div class="card" onclick="location.href='/trips/${tripId}'">
                            <div class="card-image" style="background-image: url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3');"></div>
                            <div class="card-content">
                                <span class="card-create-name">작성자: ${tripData.authorName || '나'}</span>
                                <h3 class="card-name">${tripData.topic || '제목 없음'}</h3>
                            </div>
                        </div>
                    `;
                    
                    gridContainer.insertAdjacentHTML('beforeend', cardHTML);
                    
                    displayCount++; 
                }
            });
            
            if (displayCount === 0) {
                 const cardHTML = `
                    <div class="card">
                        <div class="card-image" style="background-image: url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');"></div>
                        <div class="card-content">
                            <span class="card-create-name">작성된 플랜이 없습니다</span>
                            <h3 class="card-name">새로운 플랜을 작성해보세요</h3>
                        </div>
                    </div>
                `;
                gridContainer.insertAdjacentHTML('beforeend', cardHTML);
            }
    } catch (error) {
        console.error("DB 조회 실패:", error);
    }
});