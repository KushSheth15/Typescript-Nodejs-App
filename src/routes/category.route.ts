import { Router } from 'express';
import {createCategory} from '../controllers/category.controller';
import {CATEGORY_ROUTES} from '../constants/routes.constants'
const router = Router();

router.post(CATEGORY_ROUTES.CREATE,createCategory);

export default router;