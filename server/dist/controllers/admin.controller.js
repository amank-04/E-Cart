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
exports.updateProduct = exports.deleteProduct = exports.addNewProduct = exports.updateOrderStatus = exports.getAllUsers = exports.getAllOrders = void 0;
const db_1 = require("../db/db");
const success_1 = require("../utils/success");
const error_1 = require("../utils/error");
const makeid = () => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 16) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter++;
    }
    return result;
};
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield db_1.prisma.orders.findMany({
            orderBy: {
                placed: "desc",
            },
        });
        return next((0, success_1.CreateSuccess)(200, "Orders Fetched", {
            orders,
        }));
    }
    catch (err) {
        console.log(err);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
});
exports.getAllOrders = getAllOrders;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = (yield db_1.prisma.users.findMany({
            select: {
                email: true,
                profile_img: true,
                first_name: true,
                last_name: true,
            },
        })).map((user) => ({
            email: user.email,
            imageurl: user.profile_img,
            firstname: user.first_name,
            lastname: user.last_name,
        }));
        next((0, success_1.CreateSuccess)(200, "Users Fetched", { users }));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
});
exports.getAllUsers = getAllUsers;
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, newStatus } = req.body;
    if (!id || !newStatus) {
        return next((0, error_1.CreateError)(400, "Order not found"));
    }
    try {
        yield db_1.prisma.orders.update({
            where: { id },
            data: { status: newStatus },
        });
        next((0, success_1.CreateSuccess)(200, "Status Updated"));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something Went Wrong"));
    }
});
exports.updateOrderStatus = updateOrderStatus;
const addNewProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { product: { description, details, imageurls, name, originalprice, price, title }, } = req.body;
    const id = makeid();
    try {
        yield db_1.prisma.products.create({
            data: {
                id,
                name,
                description,
                price,
            },
        });
        yield db_1.prisma.product_details.create({
            data: {
                imageurls,
                title,
                originalprice,
                product_id: id,
                details: JSON.stringify(details),
            },
        });
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
    return next((0, success_1.CreateSuccess)(200, "Product Added"));
});
exports.addNewProduct = addNewProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        yield db_1.prisma.product_details.deleteMany({
            where: { product_id: id },
        });
        yield db_1.prisma.products.delete({
            where: { id },
        });
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
    return next((0, success_1.CreateSuccess)(200, "Product Deleted"));
});
exports.deleteProduct = deleteProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    const { description, details, imageurls, name, title, price } = req.body
        .product;
    const originalprice = req.body.product.originalPrice;
    try {
        yield db_1.prisma.products.update({
            where: { id },
            data: {
                name,
                description,
                price,
            },
        });
        yield db_1.prisma.product_details.updateMany({
            where: { product_id: id },
            data: {
                imageurls,
                details: JSON.stringify(details),
                originalprice,
                title,
            },
        });
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something Went Wrong"));
    }
    return next((0, success_1.CreateSuccess)(200, "Product Updated"));
});
exports.updateProduct = updateProduct;
