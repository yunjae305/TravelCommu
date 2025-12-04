const crypto = require('crypto');
const db = require('../config/firebase'); // firebase 설정 불러오기

const tripsRef = db.ref('trips');

//DB 데이터를 사용하기 좋게 다듬는 함수
function normalizeTrip(id, data) {
  if (!data) return null;
  return {
    id: id,
    topic: data.topic || data.title,
    destination: data.destination || data.country,
    places: Array.isArray(data.places)
      ? data.places
      : (data.places || '').toString().split(',').map(t => t.trim()).filter(Boolean),
    headcount: Number(data.headcount) || 0,
    participants: data.participants ? Object.keys(data.participants) : [],
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
    
    // snapshot.forEach는 Firebase SDK가 제공하는 반복문
    snapshot.forEach((childSnapshot) => {
        //Plan ID까지 저장을 해서 넘겨줘야 추후 상세정보 조회할때 쓸 수 있음
        const trip = normalizeTrip(childSnapshot.key, childSnapshot.val());
        usersArray.push(trip);
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

//플랜 삭제하기
const remove = async (id) => {
  await tripsRef.child(id).remove();
};

//ID로 플랜 하나 찾기
const findById = async (id) => {
  const snapshot = await tripsRef.child(id).once('value');
  return normalizeTrip(id, snapshot.val());
};

//플랜 참가하기 (DB에 사용자 ID 추가)
const joinPlan = async (tripId, userId) => {
  await tripsRef.child(tripId).child('participants').child(userId).set(userId);
};

//플랜 참가 취소하기
const leavePlan = async (tripId, userId) => {
  await tripsRef.child(tripId).child('participants').child(userId).remove();
};

module.exports = {
  getAll,
  create,
  remove,
  findById,
  joinPlan,
  leavePlan,
};