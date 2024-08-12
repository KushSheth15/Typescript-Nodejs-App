import { Router } from 'express';
import { createProduct,getProducts,deleteProduct,updateProduct} from '../controllers/product.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import {PRODUCT_ROUTES} from '../constants/routes.constants'

const router = Router();

router.post(PRODUCT_ROUTES.CREATE,verifyToken,createProduct);

router.get(PRODUCT_ROUTES.GET,verifyToken,getProducts);

router.delete(PRODUCT_ROUTES.DELETE,verifyToken,deleteProduct);

router.put(PRODUCT_ROUTES.UPDATE,verifyToken,updateProduct);

export default router;