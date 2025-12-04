document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('planner-form');
    const addBtn = document.getElementById('add-route-btn');
    const routeList = document.getElementById('route-list');
    
    // 숨겨진 input 요소들 (서버로 보낼 데이터)
    const placesInput = document.getElementById('places');
    const authorNameInput = document.getElementById('authorName');
    const authorEmailInput = document.getElementById('authorEmail');

    //로컬스토리지에서 사용자 정보 가져와서 hidden input에 채우기
    function syncAuthor() {
        try {
            const raw = localStorage.getItem('user');
            
            if (!raw) 
                return;
            
            const user = JSON.parse(raw);
            
            // 작성자 이름과 이메일 설정
            if (authorNameInput && user.name)
            {
                authorNameInput.value = user.name;
            }
                
            if (authorEmailInput && user.email)
            {
                authorEmailInput.value = user.email;
            }  
        } 
        catch (error) 
        {
            console.error(error);
        }
    }

    //방문지 번호 증가 함수
    function updateRouteIndexes() 
    {
        const indexes = routeList.querySelectorAll('.route-index');
        
        indexes.forEach((el, idx) => {
            el.textContent = idx + 1;
        });
    }

    //방문지 입력칸 추가 기능
    function addRouteInput() 
    {
        const wrapper = document.createElement('div');
        wrapper.className = 'route-item';
        
        // 화살표 아이콘과 입력창, 번호표 추가
        wrapper.innerHTML = `
            <span class="route-index"></span>
            <input class="route-input" placeholder="방문지">
        `;
        
        routeList.appendChild(wrapper);
        updateRouteIndexes();
    }

    //버튼 클릭 이벤트 연결 (방문지 추가 이벤트)
    if (addBtn) 
    {
        addBtn.addEventListener('click', addRouteInput);
    }

    // 5. 폼 제출 전 데이터 정리 (저장 이벤트)
    if (form) 
    {
        form.addEventListener('submit', () => {
            // 모든 방문지 입력칸(.route-input)을 찾아서 가져옴
            const inputs = document.querySelectorAll('.route-input');
            const resultList = []; 

            //쿼리를 하나씩 꺼내서 내용이 있으면 담기
            inputs.forEach(input => {
                const text = input.value.trim();
                
                if (text !== "") 
                {
                    resultList.push(text);
                }
            });

            // 여러 방문지는 쉼표로 이어 붙여서 hidden input에 넣기
            if (placesInput) 
            {
                placesInput.value = resultList.join(',');
            }
            
            //제출 전, User정보 한번 더 확인
            syncAuthor();
        });
    }

    // 페이지 로드 시 최초 실행
    syncAuthor();
});