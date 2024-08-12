"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = void 0;
const sequelize_client_1 = __importDefault(require("../sequelize-client"));
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const api_error_1 = __importDefault(require("../utils/api-error"));
const api_response_1 = __importDefault(require("../utils/api-response"));
const messages_1 = require("../constants/messages");
exports.createCategory = (0, async_handler_1.default)(async (req, res, next) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return next(new api_error_1.default(401, messages_1.ERROR_MESSAGES.REQUIRED_FIELDS));
    }
    ;
    try {
        const category = await sequelize_client_1.default.Category.create({
            name,
            description,
        });
        const response = new api_response_1.default(201, category, messages_1.SUCCESS_MESSAGES.CATEGORY_CREATED);
        res.status(201).json(response);
    }
    catch (error) {
        console.error(messages_1.ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new api_error_1.default(500, messages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
    }
});
