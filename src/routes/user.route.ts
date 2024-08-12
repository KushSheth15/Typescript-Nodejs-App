import { Router } from 'express';
import {registerUser,loginUser,changePassword,logoutUser} from '../controllers/user.controller'; 
import { verifyToken } from '../middlewares/auth.middleware';
import {USER_ROUTES} from '../constants/routes.constants';

const router = Router();

router.post(USER_ROUTES.REGISTER, registerUser);

router.post(USER_ROUTES.LOGIN,loginUser);

router.post(USER_ROUTES.CHANGE_PASSWORD,verifyToken,changePassword);

router.post(USER_ROUTES.LOGOUT,verifyToken,logoutUser);

export default router;
