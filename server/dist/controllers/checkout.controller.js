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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySessionId = exports.createCheckout = void 0;
const stripe_1 = __importDefault(require("stripe"));
const error_1 = require("../utils/error");
const success_1 = require("../utils/success");
const db_1 = require("../db/db");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET);
const createCheckout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_email, orderdItems } = req.body;
    try {
        if (!user_email || !orderdItems) {
            return next((0, error_1.CreateError)(400, "Please fill all the fields"));
        }
        const origin = req.headers.origin;
        const session = yield stripe.checkout.sessions.create({
            line_items: orderdItems.map((item) => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                        images: [item.imageurl],
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.count,
            })),
            mode: "payment",
            customer_email: user_email,
            success_url: origin + "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: origin,
        });
        const products = JSON.stringify(orderdItems);
        const { amount_total, id, customer_email } = session;
        yield db_1.db.query(`INSERT INTO orders
    (total, user_email, products) VALUES 
    (${amount_total / 100}, '${customer_email}', '${products}')`);
        return next((0, success_1.CreateSuccess)(201, "Checkout Completed", { id: session.id }));
    }
    catch (error) {
        console.log(error);
        next((0, error_1.CreateError)(501, "Stripe Payment Error!"));
    }
});
exports.createCheckout = createCheckout;
const verifySessionId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = req.body.sessionId;
    try {
        yield stripe.checkout.sessions.retrieve(sessionId);
        return next((0, success_1.CreateSuccess)(200, "Token Verified"));
    }
    catch (error) {
        next((0, error_1.CreateError)(404, "Token is Invalid!"));
    }
});
exports.verifySessionId = verifySessionId;
