import { Router } from 'express';
import { createProduct,getProducts,deleteProduct,updateProduct} from '../controllers/product.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/create-product',verifyToken,createProduct);

router.get('/get-products',verifyToken,getProducts);

router.delete('/delete-product/:id',verifyToken,deleteProduct);

router.put('/update-product/:id',verifyToken,updateProduct);

export default router;