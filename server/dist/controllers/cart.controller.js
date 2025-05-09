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
exports.clearAllCart = exports.selectAllCartItems = exports.deleteCartItem = exports.updateCartItem = exports.createCartItem = exports.getAllCartItems = void 0;
const db_1 = require("../db/db");
const success_1 = require("../utils/success");
const error_1 = require("../utils/error");
const getAllCartItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.user.email;
    try {
        const cartItems = yield db_1.prisma.carts
            .findMany({
            where: { user_email: email },
            select: {
                product_id: true,
                selected: true,
                count: true,
                products: {
                    select: {
                        description: true,
                        name: true,
                        price: true,
                        product_details: {
                            select: {
                                imageurls: true,
                            },
                        },
                    },
                },
            },
        })
            .then((items) => items.map(({ products, product_id, selected, count }) => {
            var _a, _b;
            return ({
                id: product_id,
                imageurl: (_b = (_a = products.product_details[0]) === null || _a === void 0 ? void 0 : _a.imageurls[0]) !== null && _b !== void 0 ? _b : "",
                selected,
                description: products.description,
                count,
                name: products.name,
                price: products.price,
            });
        }));
        return next((0, success_1.CreateSuccess)(200, "Cart Items", cartItems));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(501, "Internal Server Issue"));
    }
});
exports.getAllCartItems = getAllCartItems;
const createCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const item = req.body.item;
    const email = req.body.user.email;
    if (!email || !item.p_id) {
        return next((0, error_1.CreateError)(401, "You are not authenticated!"));
    }
    try {
        yield db_1.prisma.carts.create({
            data: {
                count: item.count,
                product_id: item.p_id,
                user_email: email,
                selected: item.selected,
            },
        });
        return next((0, success_1.CreateSuccess)(200, "Cart Item Added"));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(501, "Internal Server Issue"));
    }
});
exports.createCartItem = createCartItem;
const updateCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const item = req.body.item;
    const email = req.body.user.email;
    if (!email || !item.p_id || !item.count || typeof item.selected !== "boolean") {
        return next((0, error_1.CreateError)(401, "You are not authenticated!"));
    }
    try {
        yield db_1.prisma.carts.updateMany({
            where: {
                product_id: item.p_id,
                user_email: email,
            },
            data: {
                selected: item.selected,
                count: item.count,
            },
        });
        return next((0, success_1.CreateSuccess)(200, "Cart Item Updated"));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(501, "Internal Server Issue"));
    }
});
exports.updateCartItem = updateCartItem;
const deleteCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const p_id = req.body.p_id;
    const email = req.body.user.email;
    if (!email || !p_id) {
        return next((0, error_1.CreateError)(401, "You are not authenticated!"));
    }
    try {
        yield db_1.prisma.carts.deleteMany({
            where: {
                product_id: p_id,
                user_email: email,
            },
        });
        return next((0, success_1.CreateSuccess)(200, "Cart Item Deleted"));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(501, "Internal Server Issue"));
    }
});
exports.deleteCartItem = deleteCartItem;
const selectAllCartItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const selectedState = req.body.selectedState;
    const email = req.body.user.email;
    if (!email) {
        return (0, error_1.CreateError)(401, "You are not authenticated!");
    }
    try {
        yield db_1.prisma.carts.updateMany({
            where: {
                user_email: email,
            },
            data: {
                selected: selectedState,
            },
        });
        return next((0, success_1.CreateSuccess)(200, "Cart Items Updated"));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(501, "Internal Server Issue"));
    }
});
exports.selectAllCartItems = selectAllCartItems;
const clearAllCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.user.email;
    if (!email) {
        return next((0, error_1.CreateError)(401, "You are not authenticated!"));
    }
    try {
        yield db_1.prisma.carts.deleteMany({
            where: {
                user_email: email,
            },
        });
        return next((0, success_1.CreateSuccess)(200, "Cart Cleared"));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(501, "Internal Server Issue"));
    }
});
exports.clearAllCart = clearAllCart;
