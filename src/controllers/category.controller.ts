import {Request,Response,NextFunction} from 'express';
import db from '../sequelize-client'
import asyncHandler from '../utils/async-handler';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import {ERROR_MESSAGES,SUCCESS_MESSAGES} from '../constants/messages'

export const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    if(!name || !description) {
        return next(new ApiError(401,ERROR_MESSAGES.REQUIRED_FIELDS));
    };

    try {
        const category = await db.Category.create({
            name,
            description,
        });

        const response = new ApiResponse(201,category, SUCCESS_MESSAGES.CATEGORY_CREATED);
        res.status(201).json(response);
    } catch (error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new ApiError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
    }
})
