import fs from 'fs';
import path from 'path';
import * as TripDB from '../models/TripDB_Model.js';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function findUserByEmail(email) {
  if (!email) return null;
  try {
    if (!fs.existsSync(USERS_FILE)) return null;
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    return arr.find((u) => u.email === email) || null;
  } catch (e) {
    console.warn('findUserByEmail error', e);
    return null;
  }
}

export async function listTrips(_req, res, next) {
  try {
    const trips = await TripDB.getAll();
    res.render('index', { title: '여행 커뮤니티', trips });
  } catch (err) {
    next(err);
  }
}

export function showCreateForm(_req, res) {
  res.render('create', { title: '새 여행 공유하기' });
}

export async function createTrip(req, res, next) {
  try {
    const {
      topic,
      destination,
      places,
      headcount,
      budget,
      description,
      authorName,
      authorEmail
    } = req.body;

    let finalAuthorName = authorName;
    let finalAuthorEmail = authorEmail;
    if (authorEmail && !authorName) {
      const u = findUserByEmail(authorEmail);
      if (u && u.name) finalAuthorName = u.name;
    }

    if (!topic || !destination) {
      return res.status(400).render('create', {
        title: '새 여행 공유하기',
        error: '주제와 여행지를 입력해주세요.',
        form: req.body
      });
    }

    const newTrip = await TripDB.create({
      topic,
      destination,
      places,
      headcount,
      budget,
      description,
      authorName: finalAuthorName,
      authorEmail: finalAuthorEmail
    });
    res.redirect(`/trips/${newTrip.id}`);
  } catch (err) {
    next(err);
  }
}

export async function showTripDetail(req, res, next) {
  try {
    const trip = await TripDB.findById(req.params.id);
    if (!trip) {
      return res.status(404).render('detail', {
        title: '여행을 찾을 수 없습니다',
        trip: null,
        message: '요청한 여행 글이 존재하지 않습니다.'
      });
    }
    res.render('detail', { title: trip.title, trip, message: null });
  } catch (err) {
    next(err);
  }
}

export async function FixProfile(req, res, next) {
  try {
      res.render('profile-fix');
    }
   catch (err) {
      next(err);
  }
}

export async function showMyPage(_req, res, next) {
  try {
    const trips = (await TripDB.getAll()).slice(0, 3);
    res.render('mypage', { title: '마이페이지', trips });
  } catch (err) {
    next(err);
  }
}

export function showWriteForm(_req, res) {
  res.render('write', { title: '여행 플랜 작성' });
}

export async function createPlanner(req, res, next) {
  try {
    const { title, location, places, members, budget, desc, authorName, authorEmail } = req.body;
    let finalAuthorName = authorName;
    let finalAuthorEmail = authorEmail;
    if (authorEmail && !authorName) {
      const u = findUserByEmail(authorEmail);
      if (u && u.name) finalAuthorName = u.name;
    }
    if (!title || !location) {
      return res.status(400).render('write', {
        title: '여행 플랜 작성',
        error: '제목과 여행지를 입력해주세요.',
        form: req.body
      });
    }
    const newTrip = await TripDB.create({
      topic: title,
      destination: location,
      places,
      headcount: members,
      budget,
      description: desc,
      authorName: finalAuthorName,
      authorEmail: finalAuthorEmail
    });
    return res.redirect(`/trips/${newTrip.id}`);
  } catch (err) {
    next(err);
  }
}

export async function requestJoin(req, res, next) {
  try {
    const tripId = req.params.id;
    const { requesterName, requesterEmail, message } = req.body || {};
    if (!requesterName || !requesterEmail) {
      return res.status(400).json({ error: '이름과 이메일이 필요합니다.' });
    }
    const trip = await TripDB.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: '여행 글을 찾을 수 없습니다.' });
    }
    const saved = await TripDB.addJoinRequest(tripId, { requesterName, requesterEmail, message });
    return res.json({ success: true, request: saved });
  } catch (err) {
    next(err);
  }
}

export async function showTripList(req, res, next) {
  try {
    const trips = await TripDB.getAll(); // 모든 여행 데이터 가져오기
    res.render('trip-list', { title: '여행 플랜', trips }); // trip-list.ejs 렌더링
  } catch (err) {
    next(err);
  }
}

export async function showMyTrips(_req, res, next) {
  try {
    const trips = await TripDB.getAll();
    res.render('mytrip', { title: '내 플랜', trips });
  } catch (err) {
    next(err);
  }
}
