import express from 'express';
import { 
  createAdminUserController, 
  getAllAdminUsersController, 
  getAdminUserByIdController, 
  updateAdminUserController, 
  deleteAdminUserController,
  loginAdminUserController
} from '../controllers/adminUsersModule/admin.user.controller.js';

const router = express.Router();

router.post('/admin-users/signup', createAdminUserController);
router.get('/admin-users', getAllAdminUsersController);
router.get('/admin-users/:id', getAdminUserByIdController);
router.put('/admin-users/:id', updateAdminUserController);
router.delete('/admin-users/:id', deleteAdminUserController);
router.post('/admin-user/login', loginAdminUserController);

export default router;
