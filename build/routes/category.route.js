"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const routes_constants_1 = require("../constants/routes.constants");
const router = (0, express_1.Router)();
router.post(routes_constants_1.CATEGORY_ROUTES.CREATE, category_controller_1.createCategory);
exports.default = router;
