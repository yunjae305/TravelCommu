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
    showProfileFixPage
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
    updateProfile
} = require('../controllers/apiController');

const router = express.Router();

// ============================================================
// [View] 화면 렌더링 (GET 요청) - viewController가 담당
// ============================================================

router.get('/', showLoginPage);
router.get('/home', requireLogin, showMainPage);

router.get('/signup', requireLogin, showSignupPage);
router.get('/profile-fix', requireLogin, showProfileFixPage);

router.get('/mypage', requireLogin, showMyPage);

router.get('/mytrip', requireLogin, showMyTripsPage);
router.get('/myfavorite', requireLogin, showFavoriteTripListPage);

router.get('/write', requireLogin, showWritePage);

//detail: 자기꺼가 아닌 플랜, detail-myplan:자기 플랜일때
router.get('/detail/:id', requireLogin, showDetailPage);
router.get('/detail-myplan/:id', requireLogin, showMyDetailPage);


// ============================================================
// [API] 데이터 처리 (POST 요청) - apiController가 담당
// ============================================================

//로그인, 로그아웃 요청
router.post('/login', login);
router.get('/logout', logout);

//플래너 생성/삭제/수정 라우터
router.post('/planner', createPlanner);
router.post('/trips/:id/delete', deletePlanner);
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

module.exports = router;