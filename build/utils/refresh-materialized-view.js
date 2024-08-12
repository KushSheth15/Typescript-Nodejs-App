"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshMaterializedView = refreshMaterializedView;
const sequelize_client_1 = __importDefault(require("../sequelize-client"));
async function refreshMaterializedView() {
    try {
        await sequelize_client_1.default.sequelize.query('REFRESH MATERIALIZED VIEW user_product_category_summary;');
        console.log('Materialized view refreshed successfully.');
    }
    catch (error) {
        console.error('Error refreshing materialized view:', error);
        throw error;
    }
}
