"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.changePassword = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const api_error_1 = __importDefault(require("../utils/api-error"));
const api_response_1 = __importDefault(require("../utils/api-response"));
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const sequelize_client_1 = __importDefault(require("../sequelize-client"));
const jwt_token_1 = require("../utils/jwt.token");
exports.registerUser = (0, async_handler_1.default)(async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
        return next(new api_error_1.default(400, 'Email and password required'));
    }
    try {
        const newUser = await sequelize_client_1.default.User.create({
            email,
            password,
            firstName,
            lastName,
        });
        const response = new api_response_1.default(201, newUser, 'User created successfully');
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Error creating user:', error);
        return next(new api_error_1.default(500, 'Internal server error', [error]));
    }
});
exports.loginUser = (0, async_handler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new api_error_1.default(400, 'Email and password required'));
    }
    try {
        const user = await sequelize_client_1.default.User.findOne({ where: { email } });
        if (!user) {
            return next(new api_error_1.default(404, 'User not found'));
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return next(new api_error_1.default(401, "Invalid credentials"));
        }
        ;
        const accessToken = (0, jwt_token_1.generateAccessToken)({ userId: user.id, email: user.email });
        const refreshToken = (0, jwt_token_1.generateRefreshToken)({ userId: user.id });
        await sequelize_client_1.default.AccessToken.bulkCreate([
            {
                tokenType: 'ACCESS',
                token: accessToken,
                userId: user.id,
                expiredAt: new Date(Date.now() + 15 * 60 * 1000),
            },
            {
                tokenType: 'REFRESH',
                token: refreshToken,
                userId: user.id,
                expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
        ]);
        const response = new api_response_1.default(201, { accessToken, refreshToken, user }, 'Login Successfully');
        res.status(200).send(response);
    }
    catch (error) {
        console.error('Error logging in user:', error);
        return next(new api_error_1.default(500, 'Internal server error', [error]));
    }
});
exports.changePassword = (0, async_handler_1.default)(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    if (!user) {
        return next(new api_error_1.default(401, 'User not authenticated'));
    }
    if (!oldPassword || !newPassword) {
        return next(new api_error_1.default(400, 'Old password and new password required'));
    }
    try {
        const isMatch = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            return next(new api_error_1.default(401, 'Old password is incorrect'));
        }
        // Update the user's password
        user.password = newPassword;
        await user.save();
        const response = new api_response_1.default(200, null, 'Password updated successfully');
        res.json(response);
    }
    catch (error) {
        console.error('Error changing password:', error);
        return next(new api_error_1.default(500, 'Internal server error'));
    }
});
exports.logoutUser = (0, async_handler_1.default)(async (req, res, next) => {
    const token = req.token;
    if (!token) {
        return next(new api_error_1.default(401, 'User not authenticated'));
    }
    try {
        const deletedToken = await sequelize_client_1.default.AccessToken.destroy({
            where: { token, tokenType: 'ACCESS' }
        });
        if (deletedToken === 0) {
            return next(new api_error_1.default(401, 'Unauthorized-Token not found'));
        }
        await sequelize_client_1.default.AccessToken.destroy({
            where: { userId: req.user?.id, tokenType: 'REFRESH' }
        });
        const response = new api_response_1.default(200, null, 'Logged out successfully');
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error logging out:', error);
        return next(new api_error_1.default(500, 'Internal server error', [error]));
    }
});
