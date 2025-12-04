//방문지 추가 함수
window.addPlace = function() {
    const list = document.getElementById('place-list');
    const div = document.createElement('div');
    
    div.className = 'place-item';
    div.innerHTML = `
        <input type="text" class="edit-input place-input" placeholder="방문지 입력">
        <button type="button" class="btn-remove-place" onclick="removePlace(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    list.appendChild(div);
};

//방문지 삭제 함수
window.removePlace = function(btn) {
    const item = btn.closest('.place-item');
    item.remove();
};

//폼 제출 시 데이터 정리
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-form');
    
    if(form) 
    {
        form.addEventListener('submit', (e) => {
            const inputs = document.querySelectorAll('.place-input');
            const placesArr = [];
            
            inputs.forEach(input => {
                const val = input.value.trim();
                if(val) 
                {
                    placesArr.push(val);
                }
            });

            //hidden input에 쉼표로 구분하여 저장
            document.getElementById('places-hidden').value = placesArr.join(',');
        });
    }
});