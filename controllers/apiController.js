const asyncHandler = require('express-async-handler');
const TripDB = require('../models/tripModel');
const UserDB = require('../models/userModel');
const db = require('../config/firebase');
const bcrypt = require('bcrypt');

//로그인 처리
const login = asyncHandler(async (req, res) => {
    const { id, password } = req.body;

    //DB에서 유저 찾기
    const userSnapshot = await db.ref(`users/${id}`).once('value');
    
    if (!userSnapshot.exists()) 
    {
        return res.status(401).json({ success: false, message: "존재하지 않는 아이디입니다." });
    }

    const userData = userSnapshot.val();

    //비밀번호 확인
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
        return res.status(401).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
    }

    //쿠키에 유저 정보 저장
    res.cookie('user', JSON.stringify(userData), {
        maxAge: 24 * 60 * 60 * 1000 // 1일 유효
    });

    res.json({ success: true, message: "로그인 성공!" });
});

//로그아웃 처리 (쿠키 삭제)
const logout = (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
};

//회원가입 처리 (비밀번호 암호화)
const registerUser = asyncHandler(async (req, res) => {
    const {id, password, name, email, gender, country} = req.body;

    //아이디 중복 확인
    const userRef = db.ref(`users/${id}`);
    const snapshot = await userRef.once('value');
    
    if (snapshot.exists()) {
        return res.status(400).json({ success: false, message: "이미 존재하는 아이디입니다." });
    }
    //비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 서버에서 DB에 저장
    await userRef.set({
        userId: id,
        password: hashedPassword,
        name,
        email,
        gender,
        country
    }); 
    res.json({ success: true, message: "회원가입이 완료되었습니다!" })
});

//플래너 작성 처리
const createPlanner = asyncHandler(async (req, res) => {
    const { title, location, members, budget, desc, places, authorName, authorEmail } = req.body;

    if (!title || !location)
    {
         return res.status(400).send("<script>alert('필수 정보(주제, 여행지)를 입력해주세요.'); history.back();</script>");
    }

    const newTripData = {
        topic: title,
        destination: location,
        places: places,
        headcount: members,
        budget: budget,
        description: desc,
        authorName: authorName,
        authorEmail: authorEmail
    };

    try
    {
        await TripDB.create(newTripData);

        res.send(`
            <script>
                alert('플래너가 성공적으로 저장되었습니다!');
                location.href = '/home';
            </script>
        `);
    }
    catch(error)
    {
        console.error(error);
        
        res.send(`
            <script>
                alert('플래너 저장에 실패하였습니다! 작성을 다시 해주세요');
                location.href = '/write';
            </script>
        `);
    }
});

//플래너 삭제 처리
const deletePlanner = asyncHandler(async (req, res) => {
    const tripId = req.params.id;
    await TripDB.remove(tripId);
    res.json({ success: true, message: "삭제되었습니다." });
});

//플래너 수정 및 업데이트 처리
const updatePlanner = asyncHandler(async (req, res) => {
    const tripId = req.params.id;
    const { topic, destination, headcount, budget, description, places } = req.body;

    if (!topic || !destination) 
    {
        return res.send("<script>alert('제목과 여행지는 필수입니다.'); history.back();</script>");
    }

    //DB 업데이트 데이터 구성
    const updateData = {
        topic,
        destination,
        headcount,
        budget,
        description,
        places: places
    };

    // Firebase 업데이트
    try
    {
        await TripDB.update(tripId, updateData);

        res.send(`
            <script>
                alert('수정이 완료되었습니다!');
                location.href = '/detail-myplan/${tripId}';
            </script>
        `);
    }
    catch(error)
    {
        console.error(error);
        res.send(`
            <script>
                alert('수정에 실패하였습니다! 다시 저장해주세요');
                location.href = '/detail-myplan/${tripId}';
            </script>
        `);
    }
});

//선호 국가 여행 플래너 보기
const getFavoritePlans = asyncHandler(async (req, res) => {
    const { myCountry, myName } = req.body;

    if(!myCountry) 
    {
        return res.json([]);
    }

    const allTrips = await TripDB.getAll();
    const favorites = []

    allTrips.forEach((planner) => {
        if (planner.destination === myCountry && planner.authorName !== myName) 
        {
            favorites.push(planner);
        }
    });

    res.json(favorites);
});

//내가 작성한 플랜 가져오기
const getMyPlans = asyncHandler(async (req, res) => {
    const { myEmail, myName } = req.body;

    if(!myEmail && !myName)
    {
        return res.json([]);
    }

    const allTrips = await TripDB.getAll();
    const myplans = [];

    allTrips.forEach((planner) => {
        if(planner.authorName === myName && planner.authorEmail === myEmail)
        {
            myplans.push(planner);
        }
    });

    res.json(myplans);
});

//내가 참여중인 플랜 가져오기
const getJoinedPlans = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if(!userId)
    {
        return res.json([]);
    }

    const allTrips = await TripDB.getAll();
    const joined = [];

    allTrips.forEach((planner) => {
        // 참가자 목록에 내 ID가 있고, 내가 작성자가 아닌 경우
        if (planner.participants.includes(userId)) 
        {
            joined.push(planner);
        }
    });

    res.json(joined);
});

//플래너 참가 처리
const joinPlanner = asyncHandler(async (req, res) => {
    const tripId = req.params.id;
    const { userId } = req.body;

    //해당 플래너를 DB에서 가져오기
    const trip = await TripDB.findById(tripId);

    //이미 참가했는지 확인
    if (trip.participants.includes(userId))
    {
        return res.status(400).json({ success: false, message: "이미 참가 중인 플랜입니다." });
    }

    //인원 초과 확인
    //(현재 참가자 수 + 1)이 (최대 인원)보다 크면 불가, 작성자 포함
    if (trip.participants.length >= trip.headcount) 
    {
        return res.status(400).json({ success: false, message: "모집 인원이 마감되었습니다." });
    }

    //참가 처리
    await TripDB.joinPlan(tripId, userId);

    res.json({ success: true, message: "참가가 완료되었습니다!" });
});

//플래너 참가 취소 처리
const leavePlanner = asyncHandler(async (req, res) => {
    const tripId = req.params.id;
    const { userId } = req.body;

    //해당 플래너를 DB에서 가져오기
    const trip = await TripDB.findById(tripId);

    //이미 참가했는지 확인: 정상적으로 삭제
    if (trip.participants.includes(userId))
    {
        await TripDB.leavePlan(tripId, userId);
    }

    res.json({ success: true, message: "참가 취소가 완료되었습니다!" });
});

//유저 프로파일 수정
const updateProfile = asyncHandler(async (req, res) => {
    //폼에서 데이터 가져오기
    const { name, gender, country, email, id, password } = req.body;

    //업데이트할 데이터 객체 생성
    const updates = {
        name,
        gender,
        country,
        email,
        password,
        userId: id
    };
    if (password && password.trim() !== "") {
        // 사용자가 새 비밀번호를 입력했다면 -> 암호화해서 updates에 추가
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.password = hashedPassword;
    }
    try 
    {
        //Firebase DB 업데이트
        await db.ref(`users/${id}`).update(updates);

        //쿠키 정보도 갱신 (그래야 로그인 세션 유지 가능)
        res.cookie('user', JSON.stringify(updates), {
            maxAge: 24 * 60 * 60 * 1000, // 1일
            httpOnly: true
        });

        res.send(`
            <script>
                alert('회원정보가 수정되었습니다.');
                location.href = '/mypage';
            </script>
        `);
    } 
    catch(error) 
    {
        console.error(error);
        res.send(`
            <script>
                alert('정보 수정 중 오류가 발생했습니다.');
                history.back();
            </script>
        `);
    }
});


//module.exports로 내보내기
module.exports = { 
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
 };