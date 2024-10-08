import * as dotenv from 'dotenv';
import express from 'express';
dotenv.config();

import router from './routes/index.route';
import {REST_API_PREFIX} from'./constants/routes.constants'
const app = express();

app.use(express.json());
app.use(REST_API_PREFIX.API_V1 , router);

app.use((err: any, req: any, res: any, next: any) => {
    if (err.statusCode) {
        res.status(err.statusCode).json({ message: err.message, code: err.code });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default app;