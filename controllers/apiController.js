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

//module.exports로 내보내기
module.exports = { createPlanner, getFavoritePlans, getMyPlans };