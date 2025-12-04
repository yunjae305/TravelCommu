const asyncHandler = require('express-async-handler');
const TripDB = require('../models/tripModel');
const UserDB = require('../models/userModel');

//플래너 작성 처리
const createPlanner = asyncHandler(async (req, res) => {
    const { title, location, members, budget, desc, places, authorName, authorEmail } = req.body;

    if (!title || !location) {
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

    const newTrip = await TripDB.create(newTripData);
    res.redirect(`/trips/${newTrip.id}`);
});

//플래너 삭제 처리
const deletePlanner = asyncHandler(async (req, res) => {
    const tripId = req.params.id;
    await TripDB.remove(tripId);
    res.json({ success: true, message: "삭제되었습니다." });
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

//module.exports로 내보내기
module.exports = { 
    createPlanner,
    deletePlanner,
    getFavoritePlans, 
    getMyPlans,
    joinPlanner,
    leavePlanner
 };