const express = require('express');
const {
    requireLogin,
    showMainPage,
    showDetailPage,
    showMyDetailPage,
    showMyPage,
    showMyTripsPage,
    showFavoriteTripListPage,
    showLoginPage,
    showSignupPage,
    showWritePage,
    showProfileFixPage,
    showApiDocs
} = require('../controllers/viewController');

const {
    createPlanner,
    deletePlanner,
    updatePlanner,
    getFavoritePlans, 
    getMyPlans,
    getJoinedPlans,
    joinPlanner,
    leavePlanner,
    login,
    logout,
    updateProfile,
    registerUser
} = require('../controllers/apiController');

const router = express.Router();


// --- API 문서 ---
// API 명세서 페이지
router.get('/api-docs', showApiDocs);

// --- 인증 (Auth) ---
// 초기 진입 페이지 (로그인 화면)
router.get('/', showLoginPage);

// 회원가입 페이지
router.get('/signup', showSignupPage);

// --- 메인 및 개인화 (Main & Personal) ---
// 메인 페이지 (로그인 필요)
router.get('/home', requireLogin, showMainPage);

// 회원정보 수정 페이지 (로그인 필요)
router.get('/profile-fix', requireLogin, showProfileFixPage);

// 마이 페이지 (로그인 필요)
router.get('/mypage', requireLogin, showMyPage);

// --- 플랜 목록 조회 (Lists) ---
// 내가 작성한 플랜 목록 페이지 (로그인 필요)
router.get('/mytrip', requireLogin, showMyTripsPage);

// 선호 여행 국가 플랜 목록 페이지 (로그인 필요)
router.get('/myfavorite', requireLogin, showFavoriteTripListPage);

// --- 플랜 작성 및 상세 (Actions & Details) ---
// 플랜 작성 페이지 (로그인 필요)
router.get('/write', requireLogin, showWritePage);

//detail: 자기꺼가 아닌 플랜, detail-myplan:자기 플랜일때
router.get('/detail/:id', requireLogin, showDetailPage);
router.get('/detail-myplan/:id', requireLogin, showMyDetailPage);


//로그인, 로그아웃 요청
router.post('/login', login);
router.get('/logout', logout);

//플래너 생성/삭제/수정 라우터
router.post('/planner', createPlanner);
router.delete('/trips/:id/delete', deletePlanner);
router.post('/trips/:id/update', updatePlanner);

//플래너 참가/참가 취소(관리자가 직접 삭제) 라우터
router.post('/trips/:id/join', joinPlanner);
router.post('/trips/:id/leave', leavePlanner);

//local에 저장되어있는 User정보를 넘겨받은 후, 해당 User가 작성한 플랜을 가져오는 라우터
router.post('/api/trips/favorite', getFavoritePlans);
router.post('/api/trips/myplans', getMyPlans);

//로그인한 유저가 참여하고 있는 플랜을 가져오는 라우터
router.post('/api/trips/joined', getJoinedPlans);

//수정된 유저 프로필 정보를 업데이트 처리하는 라우터
router.post('/profile-fix', requireLogin, updateProfile);

//회원가입 요청이 오면 registerUser 함수 호출
router.post('/signup', registerUser);

module.exports = router;