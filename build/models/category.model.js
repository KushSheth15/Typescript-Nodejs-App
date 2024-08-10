"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.category = void 0;
const sequelize_1 = require("sequelize");
class Category extends sequelize_1.Model {
    static associate;
}
exports.default = Category;
const category = (sequelize, DataTypes) => {
    Category.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
        },
    }, {
        sequelize,
        underscored: true,
        timestamps: true,
        paranoid: true,
        modelName: 'Category',
        tableName: 'categories',
    });
    Category.associate = (models) => {
        Category.hasMany(models.Product, {
            foreignKey: 'categoryId',
            sourceKey: 'id',
        });
    };
    return Category;
};
exports.category = category;
