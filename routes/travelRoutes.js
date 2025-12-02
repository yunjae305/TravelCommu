import express from 'express';
import {
  listTrips,
  showCreateForm,
  createTrip,
  showTripDetail,
  showMyPage,
  showWriteForm,
  createPlanner,
  requestJoin
} from '../controllers/travelController.js';

const router = express.Router();

router.get('/', listTrips);
router.get('/trips/new', showCreateForm);
router.post('/trips', createTrip);
router.get('/trips/:id', showTripDetail);
router.get('/mypage', showMyPage);
router.get('/write', showWriteForm);
router.post('/planner', createPlanner);
router.post('/trips/:id/request', requestJoin);

export default router;
