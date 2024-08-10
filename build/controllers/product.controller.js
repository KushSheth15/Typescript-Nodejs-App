"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.deleteProduct = exports.getProducts = exports.createProduct = void 0;
const sequelize_client_1 = __importDefault(require("../sequelize-client"));
const api_error_1 = __importDefault(require("../utils/api-error"));
const api_response_1 = __importDefault(require("../utils/api-response"));
const async_handler_1 = __importDefault(require("../utils/async-handler"));
exports.createProduct = (0, async_handler_1.default)(async (req, res, next) => {
    const { name, price, description } = req.body;
    const user = req.user;
    if (!user) {
        return next(new api_error_1.default(401, 'User not authenticated'));
    }
    if (!name || !price || !description) {
        return next(new api_error_1.default(401, 'All fields are required'));
    }
    ;
    try {
        const product = await sequelize_client_1.default.Product.create({
            name,
            price,
            description,
            userId: user.id
        });
        const response = new api_response_1.default(201, product, 'Product created successfully');
        res.status(201).json(response);
    }
    catch (error) {
        console.log("Error in creating product", error);
        return next(new api_error_1.default(500, 'Internal server error', [error]));
    }
});
exports.getProducts = (0, async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return next(new api_error_1.default(401, 'User not authenticated'));
    }
    try {
        const product = await sequelize_client_1.default.Product.findAll({ where: { userId: user.id } });
        const response = new api_response_1.default(200, product, "Products get successfull");
        res.status(200).json(response);
    }
    catch (error) {
        console.log("Error in fetching product", error);
        return next(new api_error_1.default(500, 'Internal server error', [error]));
    }
});
exports.deleteProduct = (0, async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
        return next(new api_error_1.default(401, 'User not authenticated- So cannot delete products'));
    }
    try {
        const deleteProduct = await sequelize_client_1.default.Product.destroy({ where: { userId: user.id, id: id } });
        const response = new api_response_1.default(200, "Product deleted successfully");
        res.status(200).json(response);
    }
    catch (error) {
        console.log("Error deleting product", error);
        return next(new api_error_1.default(500, 'Internal server error', [error]));
    }
});
exports.updateProduct = (0, async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
        return next(new api_error_1.default(401, 'User not authenticated- So cannot update products'));
    }
    const { name, description, price } = req.body;
    try {
        const product = await sequelize_client_1.default.Product.findByPk(id);
        if (!product) {
            return next(new api_error_1.default(404, 'Product not found'));
        }
        ;
        const updateProduct = await product.update({
            name,
            description,
            price
        }, {
            where: { userId: user.id }
        });
        const response = new api_response_1.default(200, updateProduct, "Product updated successfully");
        res.status(200).json(response);
    }
    catch (error) {
        console.log("Error updating product", error);
        return next(new api_error_1.default(500, 'Internal server error', [error]));
    }
});
