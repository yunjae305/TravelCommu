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

//module.exports로 내보내기
module.exports = { createPlanner };