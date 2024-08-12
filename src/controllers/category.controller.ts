import {Request,Response,NextFunction} from 'express';
import db from '../sequelize-client'
import asyncHandler from '../utils/async-handler';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';

export const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    if(!name || !description) {
        return next(new ApiError(401,'All fields are required'));
    };

    try {
        const category = await db.Category.create({
            name,
            description,
        });

        const response = new ApiResponse(201,category, 'Category created successfully');
        res.status(201).json(response);
    } catch (error) {
        console.log("Error in creating category",error);
        return next(new ApiError(500, 'Internal server error', [error]));
    }
})
