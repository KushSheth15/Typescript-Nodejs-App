import { Request, Response, NextFunction } from "express";
import db from "../sequelize-client";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";
import User from "../models/user.model";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/messages'

interface NewRequest extends Request {
    token?: string;
    user?: User;
}

export const createProduct = asyncHandler(async (req: NewRequest, res: Response, next: NextFunction) => {
    const { name, price, description, categoryId } = req.body;
    const user = req.user;

    if (!user) {
        return next(new ApiError(401, ERROR_MESSAGES.USER_NOT_FOUND));
    }

    if (!name || !price || !description || !categoryId) {
        return next(new ApiError(401, ERROR_MESSAGES.REQUIRED_FIELDS));
    };

    try {

        const product = await db.Product.create({
            name,
            price,
            description,
            categoryId,
            userId: user.id
        });

        const response = new ApiResponse(201, product, SUCCESS_MESSAGES.PRODUCT_CREATED);
        res.status(201).json(response);
    } catch (error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new ApiError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
    }
})

export const getProducts = asyncHandler(async (req: NewRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        return next(new ApiError(401, ERROR_MESSAGES.USER_NOT_FOUND));
    }

    try {
        const product = await db.Product.findAll({ where: { userId: user.id } });
        const response = new ApiResponse(200, product, SUCCESS_MESSAGES.PRODUCTS_RETRIEVED);
        res.status(200).json(response);
    } catch (error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new ApiError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
    }
});

export const deleteProduct = asyncHandler(async (req: NewRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
        return next(new ApiError(401, ERROR_MESSAGES.USER_NOT_FOUND));
    }

    try {
        // const deleteProduct = await db.Product.destroy({where:{userId: user.id, id: id}});
        const result = await db.sequelize.query(`
            DELETE FROM products WHERE user_id=:userId AND id=:productId        
        `, {
            replacements: { userId: user.id, productId: id },
            type: 'RAW'
        });

        const affectedRows = Number(result);

        if (affectedRows === 0) {
            return next(new ApiError(404, ERROR_MESSAGES.PRODUCT_NOT_FOUND));
        }

        const response = new ApiResponse(200, SUCCESS_MESSAGES.PRODUCT_DELETED);
        res.status(200).json(response);

    } catch (error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new ApiError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
    }
});

export const updateProduct = asyncHandler(async (req: NewRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
        return next(new ApiError(401, ERROR_MESSAGES.USER_NOT_FOUND));
    }
    const { name, description, price, categoryId } = req.body;

    try {
        const product = await db.Product.findByPk(id);
        if (!product) {
            return next(new ApiError(404, ERROR_MESSAGES.PRODUCT_NOT_FOUND));
        };

        if (product.userId !== user.id) {
            return next(new ApiError(403, ERROR_MESSAGES.PERMISSION_DENIED));
        };

        const updateProduct = await product.update({
            name,
            description,
            price,
            categoryId
        },
            {
                where: { userId: user.id }
            });

        const response = new ApiResponse(200, updateProduct, SUCCESS_MESSAGES.PRODUCT_UPDATED);
        res.status(200).json(response);
    } catch (error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new ApiError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
    }
});