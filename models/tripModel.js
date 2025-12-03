const crypto = require('crypto');
const db = require('../config/firebase'); // firebase 설정 불러오기

const tripsRef = db.ref('trips');

//DB 데이터를 사용하기 좋게 다듬는 함수
function normalizeTrip(id, data) {
  if (!data) return null;
  return {
    id,
    topic: data.topic || data.title,
    destination: data.destination || data.country,
    places: Array.isArray(data.places)
      ? data.places
      : (data.places || '').toString().split(',').map(t => t.trim()).filter(Boolean),
    headcount: Number(data.headcount) || 0,
    budget: data.budget || '예산 미정',
    authorName: data.authorName || data.author || '익명',
    authorEmail: data.authorEmail || '',
    description: data.description || '',
    createdAt: new Date(data.createdAt || Date.now())
  };
}

//모든 플랜 가져오기
const getAll = async () => {
  const snapshot = await tripsRef.once('value');
    const usersArray = [];
    
    // snapshot.forEach는 Firebase SDK가 제공하는 반복문입니다.
    snapshot.forEach((childSnapshot) => {
        usersArray.push(childSnapshot.val());
    });
    
    return usersArray;
};

//플랜 생성하기
const create = async (data) => {
  // 8글자 랜덤 ID 생성 (nanoid 대체)
  const id = crypto.randomBytes(4).toString('hex'); 
  
  const rawTrip = {
    topic: data.topic,
    destination: data.destination,
    places: data.places,
    headcount: data.headcount,
    budget: data.budget,
    authorName: data.authorName,
    authorEmail: data.authorEmail,
    description: data.description,
    createdAt: Date.now()
  };
  
  await tripsRef.child(id).set(rawTrip);
  return normalizeTrip(id, rawTrip);
};

//ID로 플랜 하나 찾기
const findById = async (id) => {
  const snapshot = await tripsRef.child(id).once('value');
  return normalizeTrip(id, snapshot.val());
};

//한꺼번에 내보내기
module.exports = {
  getAll,
  create,
  findById,
};