import { Router } from 'express';
import {createCategory} from '../controllers/category.controller';
const router = Router();

router.post('/create-category',createCategory);

export default router;