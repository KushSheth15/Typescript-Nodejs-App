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
const messages_1 = require("../constants/messages");
exports.createProduct = (0, async_handler_1.default)(async (req, res, next) => {
    const { name, price, description, categoryId } = req.body;
    const user = req.user;
    if (!user) {
        return next(new api_error_1.default(401, messages_1.ERROR_MESSAGES.USER_NOT_FOUND));
    }
    if (!name || !price || !description || !categoryId) {
        return next(new api_error_1.default(401, messages_1.ERROR_MESSAGES.REQUIRED_FIELDS));
    }
    ;
    try {
        const product = await sequelize_client_1.default.Product.create({
            name,
            price,
            description,
            categoryId,
            userId: user.id
        });
        const response = new api_response_1.default(201, product, messages_1.SUCCESS_MESSAGES.PRODUCT_CREATED);
        res.status(201).json(response);
    }
    catch (error) {
        console.error(messages_1.ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new api_error_1.default(500, messages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
    }
});
exports.getProducts = (0, async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return next(new api_error_1.default(401, messages_1.ERROR_MESSAGES.USER_NOT_FOUND));
    }
    try {
        const product = await sequelize_client_1.default.Product.findAll({ where: { userId: user.id } });
        const response = new api_response_1.default(200, product, messages_1.SUCCESS_MESSAGES.PRODUCTS_RETRIEVED);
        res.status(200).json(response);
    }
    catch (error) {
        console.error(messages_1.ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new api_error_1.default(500, messages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
    }
});
exports.deleteProduct = (0, async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
        return next(new api_error_1.default(401, messages_1.ERROR_MESSAGES.USER_NOT_FOUND));
    }
    try {
        // const deleteProduct = await db.Product.destroy({where:{userId: user.id, id: id}});
        const result = await sequelize_client_1.default.sequelize.query(`
            DELETE FROM products WHERE user_id=:userId AND id=:productId        
        `, {
            replacements: { userId: user.id, productId: id },
            type: 'RAW'
        });
        const affectedRows = Number(result);
        if (affectedRows === 0) {
            return next(new api_error_1.default(404, messages_1.ERROR_MESSAGES.PRODUCT_NOT_FOUND));
        }
        const response = new api_response_1.default(200, messages_1.SUCCESS_MESSAGES.PRODUCT_DELETED);
        res.status(200).json(response);
    }
    catch (error) {
        console.error(messages_1.ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new api_error_1.default(500, messages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
    }
});
exports.updateProduct = (0, async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
        return next(new api_error_1.default(401, messages_1.ERROR_MESSAGES.USER_NOT_FOUND));
    }
    const { name, description, price, categoryId } = req.body;
    try {
        const product = await sequelize_client_1.default.Product.findByPk(id);
        if (!product) {
            return next(new api_error_1.default(404, messages_1.ERROR_MESSAGES.PRODUCT_NOT_FOUND));
        }
        ;
        if (product.userId !== user.id) {
            return next(new api_error_1.default(403, messages_1.ERROR_MESSAGES.PERMISSION_DENIED));
        }
        ;
        const updateProduct = await product.update({
            name,
            description,
            price,
            categoryId
        }, {
            where: { userId: user.id }
        });
        const response = new api_response_1.default(200, updateProduct, messages_1.SUCCESS_MESSAGES.PRODUCT_UPDATED);
        res.status(200).json(response);
    }
    catch (error) {
        console.error(messages_1.ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new api_error_1.default(500, messages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
    }
});
