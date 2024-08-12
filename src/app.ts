import * as dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import userRoutes from './routes/user.route';
import productRoutes from './routes/product.route';
import categoryRoutes from './routes/category.route';
const app = express();

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api',productRoutes);
app.use('/api',categoryRoutes);

app.use((err: any, req: any, res: any, next: any) => {
    if (err.statusCode) {
        res.status(err.statusCode).json({ message: err.message, code: err.code });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default app;