const db = require('../config/firebase');
const usersRef = db.ref('users');

//유저 정보 저장 (회원가입/로그인 시)
const saveUser = async (userData) => {
    // uid가 없으면 저장 불가
    if (!userData.uid) return null;
    
    // users/{uid} 경로에 데이터 저장 (덮어쓰기)
    await usersRef.child(userData.uid).set(userData);
    return userData;
};

module.exports = { saveUser };