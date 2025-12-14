const TripDB = require('../models/tripModel');

// 국가별 국기 이모지를 미리 매핑해 두는 테이블
const COUNTRY_FLAGS = new Map([
    ['대한민국', '🇰🇷'],
    ['일본', '🇯🇵'],
    ['베트남', '🇻🇳'],
]);

// 국가명을 받아서 대응하는 국기 이모지를 반환
const getCountryFlag = (countryName) => {
    if (!countryName) return '🌍';
    return COUNTRY_FLAGS.get(countryName.trim()) || '🌍';
};

//메인페이지
const showMainPage = async (req, res) => {
    try 
    {
        // 로그인한 사용자 정보와 모든 여행 계획 목록 조회
        const user = req.user;
        const allTrips = await TripDB.getAll();

        const favorites = [];
        const myPlans = [];

        // 국가/작성자 조건으로 추천 목록과 내 계획 목록을 나눔
        allTrips.forEach(trip => {
            //선호 국가 로직
            if (trip.destination === user.country && trip.authorName !== user.name) 
            {
                if (favorites.length < 4) 
                {
                    favorites.push(trip);
                }
            }
            
            // 내 플랜 로직
            if (trip.authorName === user.name && trip.authorEmail === user.email) 
            {
                if (myPlans.length < 4)
                {
                    myPlans.push(trip);
                }
            }
        });

        //화면 렌더링
        res.render('index', {
            title: '여행 커뮤니티',
            favorites: favorites, // 선호 국가 데이터
            myPlans: myPlans      // 내 플랜 데이터
        });

    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).send("메인 페이지 로딩 실패");
    }
};

//마이페이지
const showMyPage = async (req, res) => {
    try 
    {
        //쿠키에서 유저 정보 꺼내기
        const user = req.user;

        //DB에서 모든 플랜 가져오기
        const allTrips = await TripDB.getAll();

        //서버에서 필터링
        const myPlans = [];
        const joinedPlans = [];

        allTrips.forEach(u => {
            //내가 작성한 플랜인지 확인
            if (u.authorName === user.name && u.authorEmail === user.email) 
            {
                myPlans.push(u);
            }
            
            // 내가 참여한 플랜인지 확인
            if (u.participants.includes(user.userId))
            {
                joinedPlans.push(u);
            }
        });

        //데이터 담아서 렌더링
        res.render('mypage', { 
            title: '마이페이지', 
            user: user, 
            myPlans: myPlans,
            joinedPlans: joinedPlans,
            countryFlag: getCountryFlag(user.country) 
        });

    } 
    catch (error) 
    {
        console.error(error);
    }
};

//여행 플랜 상세 페이지 (자기꺼가 아닐때)
const showDetailPage = async (req, res) => {
    try
    {
        // URL?ì„œ ë°˜ì˜ëœ í™”ë©´?°? IDë¡œ ê°€?¸ì˜¤ê¸?
        const id = req.params.id;
        const trip = await TripDB.findById(id);

        if (!trip) 
        {
            return res.status(404).render('detail', {
                title: '여행을 찾을 수 없습니다',
                trip: null,
                message: '존재하지 않는 여행입니다.'
            });
        }
        res.render('detail', { title: trip.topic, trip: trip});
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).send("상세 페이지 로딩 실패");
    }
};

//여행 플랜 상세 페이지 (자기꺼일때)
const showMyDetailPage = async (req, res) => {
    try 
    {
        // í¨ë¼ë¯¸í„° IDë¡œ ë§ˆì´ íŒŒë… ?Œëžœ ê°€?¸ì˜¤ê¸?
        const id = req.params.id;
        const trip = await TripDB.findById(id);

        if (!trip) 
        {
            return res.status(404).render('detail', {
                title: '여행을 찾을 수 없습니다',
                trip: null,
                message: '존재하지 않는 여행입니다.'
            });
        }
        res.render('detailmyplan', { title: trip.topic, trip: trip});
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).send("상세 페이지 로딩 실패");
    }
};

//내 플랜 목록 보기
const showMyTripsPage = async (req, res) => {
    try 
    {
        const user = req.user;
        const allTrips = await TripDB.getAll();
        const myPlans = [];

        //내가 작성한 플랜 필터링
        allTrips.forEach(u => {
            if (u.authorName === user.name && u.authorEmail === user.email) 
            {
                myPlans.push(u);
            }
        });

        //데이터와 함께 렌더링
        res.render('mytrip', { 
            title: '내 플랜',
            trips: myPlans,
            user: user 
        });

    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).send("내 플랜 로딩 실패");
    }
};

//선호 여행 국가 플랜 목록 보기
const showFavoriteTripListPage = async (req, res) => {
    try 
    {
        const user = req.user;
        const allTrips = await TripDB.getAll();
        const favorites = [];

        //선호 국가 플랜 필터링 (내가 쓴건 제외)
        allTrips.forEach(u => {
            if (u.destination === user.country && u.authorName !== user.name) 
            {
                favorites.push(u);
            }
        });

        //데이터와 함께 렌더링
        res.render('favoritetrip', {
            title: '여행 플랜 목록', 
            trips: favorites,
            user: user 
        });

    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).send("목록 로딩 실패");
    }
};

//로그인 항상 요구
const requireLogin = (req, res, next) => {
    if (!req.user) 
    {
        return res.redirect('/'); 
    }
    next();
};

// --- 단순 렌더링 (데이터 조회 불필요) ---
const showLoginPage = (req, res) => {
    res.render('login', { title: '로그인' });
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

// 함수 추가
const showApiDocs = (req, res) => {
    res.render('api-docs', { 
        title: 'API 명세서',
        user: req.user || null 
    });
};

//module.exports로 내보내기
module.exports = {
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
};
