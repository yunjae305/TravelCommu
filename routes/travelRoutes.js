const express = require('express');
const viewController = require('../controllers/viewController');
const apiController = require('../controllers/apiController');

const router = express.Router();

// ============================================================
// [View] 화면 렌더링 (GET 요청) - viewController가 담당
// ============================================================

router.get('/', viewController.showLoginPage);
router.get('/home', viewController.showMainPage);

router.get('/signup', viewController.showSignupPage);
router.get('/profile-fix', viewController.showProfileFixPage);

router.get('/mypage', viewController.showMyPage);
router.get('/mytrip', viewController.showMyTripsPage);

router.get('/trip-list', viewController.showTripListPage);

router.get('/write', viewController.showWritePage);

router.get('/trips/:id', viewController.showDetailPage);


// ============================================================
// [API] 데이터 처리 (POST 요청) - apiController가 담당
// ============================================================

router.post('/planner', apiController.createPlanner);

//local에 저장되어있는 User정보를 넘겨받은 후, 해당 User가 작성한 플랜을 가져오는 라우터
router.post('/api/trips/favorite', apiController.getFavoritePlans);
router.post('/api/trips/myplans', apiController.getMyPlans);

module.exports = router;