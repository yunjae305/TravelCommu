import express from 'express';
import {
  listTrips,
  showCreateForm,
  createTrip,
  showTripDetail,
  showMyPage,
  showWriteForm,
  createPlanner,
  FixProfile,
  requestJoin,
  showTripList
} from '../controllers/travelController.js';

const router = express.Router();

router.get(['/home', '/trips'], listTrips);
router.get('/trips/new', showCreateForm);
router.post('/trips', createTrip);
router.get('/trips/:id', showTripDetail);
router.get('/mypage', showMyPage);
router.get('/write', showWriteForm);
router.get('/profile-fix', FixProfile);
router.post('/planner', createPlanner);
router.post('/trips/:id/request', requestJoin);
router.get(['/trip-list', '/trips/list'], showTripList);

export default router;
