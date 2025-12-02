import express from 'express';
import {
  showLoginForm,
  showSignupForm,
  saveUserInfo,
  loginWithFirebase
} from '../controllers/authController.js';

const router = express.Router();

router.get('/login', showLoginForm);
router.get('/signup', showSignupForm);
router.post('/api/auth/save-user', saveUserInfo);
router.post('/api/auth/login', loginWithFirebase);

export default router;
