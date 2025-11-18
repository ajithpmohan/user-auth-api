import express from 'express';

import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/user/verify', authController.verifyUserAccount);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/password/forgot', authController.forgotPassword);
router.post('/password/reset/verify', authController.verifyPasswordResetLink);
router.post('/password/reset', authController.passwordReset);

export default router;
