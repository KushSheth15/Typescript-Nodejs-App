import { Request, Response, NextFunction } from "express";
import db from "../sequelize-client";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";
import User from "../models/user.model";

interface NewRequest extends Request{
    token?: string;
    user?: User;
}

export const createProduct = asyncHandler(async (req: NewRequest, res: Response, next: NextFunction) => {
    const { name, price, description,categoryId } = req.body;
    const user = req.user;

    if (!user) {
        return next(new ApiError(401, 'User not authenticated'));
    }

    if(!name || !price || !description || !categoryId) {
        return next(new ApiError(401,'All fields are required'));
    };

    try {

        const product = await db.Product.create({
            name,
            price,
            description,
            categoryId,
            userId: user.id
        });

        const response = new ApiResponse(201,product, 'Product created successfully');
        res.status(201).json(response);
    } catch (error) {
        console.log("Error in creating product",error);
        return next(new ApiError(500, 'Internal server error', [error]));
    }
})

export const getProducts = asyncHandler(async (req: NewRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        return next(new ApiError(401, 'User not authenticated'));
    }

    try {
        const product = await db.Product.findAll({where: {userId: user.id}});
        const response = new ApiResponse(200, product,"Products get successfull");
        res.status(200).json(response);
    } catch (error) {
        console.log("Error in fetching product", error);
        return next(new ApiError(500, 'Internal server error', [error]));
    }
});

export const deleteProduct = asyncHandler(async(req: NewRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const {id} = req.params;
    if(!user){
        return next(new ApiError(401, 'User not authenticated- So cannot delete products'));
    }

    try {
        // const deleteProduct = await db.Product.destroy({where:{userId: user.id, id: id}});
        const result = await db.sequelize.query(`
            DELETE FROM products WHERE user_id=:userId AND id=:productId        
        `, {
            replacements:{userId:user.id, productId:id},
            type:'RAW'
        });

        const affectedRows = Number(result);

        if (affectedRows === 0) {
            return next(new ApiError(404, 'Product not found or not authorized to delete'));
        }

        const response = new ApiResponse(200,"Product deleted successfully");
        res.status(200).json(response);

    } catch (error) {
        console.log("Error deleting product",error);
        return next(new ApiError(500, 'Internal server error', [error]));
    }
});

export const updateProduct = asyncHandler(async(req: NewRequest, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const user = req.user;
    if(!user){
        return next(new ApiError(401, 'User not authenticated- So cannot update products'));
    }
    const {name,description,price,categoryId} = req.body;

    try {
        const product = await db.Product.findByPk(id);
        if(!product){
            return next(new ApiError(404, 'Product not found'));
        };

        if (product.userId !== user.id) {
            return next(new ApiError(403, 'You do not have permission to update this product'));
        };

        const updateProduct = await product.update({
            name,
            description,
            price,
            categoryId
        },
        {
            where:{userId:user.id}
        });

        const response = new ApiResponse(200,updateProduct,"Product updated successfully");
        res.status(200).json(response);
    } catch (error) {
        console.log("Error updating product",error);
        return next(new ApiError(500, 'Internal server error', [error]));
    }
});