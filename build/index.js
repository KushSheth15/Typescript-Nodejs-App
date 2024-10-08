"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app_1 = __importDefault(require("./app"));
const sequelize_client_1 = __importDefault(require("./sequelize-client"));
const setup_views_1 = __importDefault(require("./utils/setup-views"));
const refresh_materialized_view_1 = require("./utils/refresh-materialized-view");
const PORT = process.env.PORT;
const startServer = async () => {
    try {
        const setup = await (0, setup_views_1.default)(sequelize_client_1.default.sequelize);
        if (setup) {
            console.log('Views were created.');
        }
        else {
            console.log('Views already existed, no need to create them.');
        }
    }
    catch (error) {
        console.log('Error during view setup:', error);
    }
    try {
        await sequelize_client_1.default.sequelize.sync({ force: false });
        console.log('Database connected successfully.');
        (0, refresh_materialized_view_1.refreshMaterializedView)();
        app_1.default.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Unable to start the server:', error);
    }
};
startServer();
