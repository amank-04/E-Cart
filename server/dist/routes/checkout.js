"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_controller_1 = require("../controllers/checkout.controller");
const router = (0, express_1.Router)();
router.post("/", checkout_controller_1.createCheckout);
router.post("/verify", checkout_controller_1.verifySessionId);
exports.default = router;
