import dotenv from 'dotenv';
dotenv.config();
export default {
    JWT:{
        SECRET: process.env.JWT_SECRET as string
    }
}