import express from 'express';

import {
  authenticateUser
  // authorizePermissions
} from '../middleware/authentication.js';
import { offsetPagination } from '../middleware/pagination.js';

import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get(
  '/',
  // [offsetPagination, authenticateUser, authorizePermissions('admin')],
  [offsetPagination, authenticateUser],
  userController.getAllUsers
);

router
  .route('/me')
  .get(authenticateUser, userController.getCurrentUser)
  .put(authenticateUser, userController.updateCurrentUser);

router.put('/password/update', authenticateUser, userController.updatePassword);

router.get(
  '/:id',
  // [authenticateUser, authorizePermissions('admin')],
  authenticateUser,
  userController.getSingleUser
);

export default router;
