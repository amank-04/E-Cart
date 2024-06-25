"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = void 0;
const db_1 = require("../db/db");
const error_1 = require("../utils/error");
const success_1 = require("../utils/success");
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.user.email;
    try {
        const orders = yield db_1.db.query(`SELECT * FROM orders 
    WHERE user_email = '${email}'
    ORDER BY placed DESC`);
        return next((0, success_1.CreateSuccess)(200, "Orders Fetched", orders.rows));
    }
    catch (error) {
        console.log("dont get orders");
        return next((0, error_1.CreateError)(501, "Something Went Wrong"));
    }
});
exports.getOrders = getOrders;
