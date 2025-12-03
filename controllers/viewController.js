const TripDB = require('../models/tripModel');

//여행 플랜 상세 페이지
const showDetailPage = async (req, res) => {
    try {
        const id = req.params.id;
        const trip = await TripDB.findById(id);

        if (!trip) {
            return res.status(404).render('detail', {
                title: '여행을 찾을 수 없습니다',
                trip: null,
                message: '존재하지 않는 여행입니다.'
            });
        }
        res.render('detail', { title: trip.topic, trip: trip, message: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("상세 페이지 로딩 실패");
    }
};

//마이페이지
const showMyPage = async (req, res) => {
    try {
        const allTrips = await TripDB.getAll();
        const trips = allTrips.slice(0, 3); // 상위 3개만
        res.render('mypage', { title: '마이페이지', trips });
    } catch (error) {
        console.error(error);
        res.status(500).send("마이페이지 로딩 실패");
    }
};

//내 플랜 전체 보기
const showMyTripsPage = async (req, res) => {
    try {
        const trips = await TripDB.getAll();
        res.render('mytrip', { title: '내 플랜', trips });
    } catch (error) {
        console.error(error);
        res.status(500).send("내 플랜 로딩 실패");
    }
};

//전체 여행 목록 보기
const showTripListPage = async (req, res) => {
    try {
        const trips = await TripDB.getAll();
        res.render('trip-list', { title: '여행 플랜 목록', trips });
    } catch (error) {
        console.error(error);
        res.status(500).send("목록 로딩 실패");
    }
};

// --- 단순 렌더링 (데이터 조회 불필요) ---
const showLoginPage = (req, res) => {
    res.render('login', { title: '로그인' });
};

const showMainPage = async (req, res) => {
    res.render('index', { title: '여행 커뮤니티'});
};

const showSignupPage = (req, res) => {
    res.render('signup', { title: '회원가입', error: null, form: {} });
};

const showWritePage = (req, res) => {
    res.render('write', { title: '플랜 작성' });
};

const showProfileFixPage = (req, res) => {
    res.render('profile-fix', { title: '회원정보 수정'});
};

//module.exports로 내보내기
module.exports = {
    showMainPage,
    showDetailPage,
    showMyPage,
    showMyTripsPage,
    showTripListPage,
    showLoginPage,
    showSignupPage,
    showWritePage,
    showProfileFixPage
};