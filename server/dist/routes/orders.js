"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_token_1 = require("../utils/verify-token");
const orders_controller_1 = require("../controllers/orders.controller");
const router = (0, express_1.Router)();
router.post("/", verify_token_1.verifyToken, orders_controller_1.getOrders);
exports.default = router;
