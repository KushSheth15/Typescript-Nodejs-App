"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_client_1 = __importDefault(require("../sequelize-client"));
async function setupViews(sequelize) {
    try {
        console.log('Starting view setup...');
        // Create a view
        await sequelize.query(`
            CREATE VIEW user_product_category AS 
            SELECT
                users.id AS user_id,
                users.first_name AS user_name,
                products.id AS product_id,
                products.name AS product_name,
                products.price AS product_price,
                categories.id AS category_id,
                categories.name AS category_name
            FROM
                users
            JOIN
                products ON users.id = products.user_id
            JOIN
                categories ON products.category_id = categories.id;
        `);
        console.log('User-Product-Category view created successfully.');
        // Create a materialized view
        await sequelize.query(`
            CREATE MATERIALIZED VIEW user_product_category_summary AS
            SELECT
                users.id AS user_id,
                users.first_name AS user_name,
                categories.id AS category_id,
                categories.name AS category_name,
                COUNT(products.id) AS product_count,
                SUM(products.price) AS total_price
            FROM
                users
            LEFT JOIN products ON users.id = products.user_id
            LEFT JOIN categories ON products.category_id = categories.id
            GROUP BY users.id, categories.id;
        `);
        console.log('User-Product-Category-Summary materialized view created successfully.');
        return true;
    }
    catch (error) {
        if (error.parent?.code === '42P07') { // PostgreSQL error code for "relation already exists"
            console.log('Views or materialized views already exist. Skipping setup.');
            return false;
        }
        else {
            console.error('Error setting up views:', error);
            throw error;
        }
    }
}
// Run this function when you initialize your app
setupViews(sequelize_client_1.default.sequelize);
exports.default = setupViews;
