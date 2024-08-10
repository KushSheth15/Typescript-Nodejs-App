"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    JWT: {
        SECRET: process.env.JWT_SECRET
    },
    ENCRYPTION: {
        IV: process.env.ENCRYPTION_IV,
        SECRET: process.env.ENCRYPTION_SECRET,
        PASSWORD_SALT: process.env.ENCRYPTION_PASSWORD_SALT,
        PASSWORD_ITERATIONS: Number(process.env.ENCRYPTION_PASSWORD_ITERATIONS) || 1000,
    },
};
