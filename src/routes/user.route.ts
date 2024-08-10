import { Router } from 'express';
import {registerUser,loginUser,changePassword,logoutUser} from '../controllers/user.controller'; 
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerUser);

router.post('/login',loginUser);

router.post('/change-password',verifyToken,changePassword);

router.post('/logout',verifyToken,logoutUser);

export default router;
