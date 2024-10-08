import Sequelize, { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import bcrypt from "bcrypt";
import db from "../sequelize-client";

export interface UserModelCreationAttributes {
    email: string;
    password: string;
}

export interface UserModelAttributes extends UserModelCreationAttributes {
    id: string;
    firstName: string;
    lastName: string;
}

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare email: string;
    declare password: string;
    declare firstName: CreationOptional<string>;
    declare lastName: CreationOptional<string>;

    static associate: (models: typeof db) => void;

    static async hashPassword(user:User){
        if(user.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
}

export const user = (sequelize: Sequelize.Sequelize,DataTypes:typeof Sequelize.DataTypes)=>{
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            firstName: {
                type:DataTypes.STRING
            },
            lastName: {
                type:DataTypes.STRING
            },
        },
        {
            sequelize,
            underscored: true,
            timestamps: true,
            paranoid: true,
            modelName: 'User',
            tableName: 'users',
            hooks:{
                beforeCreate:User.hashPassword,
                beforeUpdate:User.hashPassword,
                
            }
        }
    )

    User.associate = (models) =>{
        User.hasMany(models.AccessToken,{
            foreignKey:'userId',
            sourceKey:'id'
        })

        User.hasMany(models.Product,{
            foreignKey:'userId',
            sourceKey:'id'
        })
    };

    return User;
};