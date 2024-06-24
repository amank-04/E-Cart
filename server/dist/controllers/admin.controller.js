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
        const orders = (yield db_1.db.query(`SELECT * FROM orders ORDER BY placed DESC`)).rows;
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
        const users = (yield db_1.db.query(`SELECT email, 
    profile_img as imageurl, first_name as firstname, last_name as lastname
    FROM users`)).rows;
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
        yield db_1.db.query(`UPDATE orders 
        SET status = '${newStatus}'
        WHERE id = ${id}`);
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
        yield db_1.db.query(`INSERT INTO products
    (id, name, description, price)
    VALUES (
      '${id}', '${name}',
      '${description}', ${price}
    )`);
        const str = JSON.stringify(imageurls);
        const imgs = "{" + str.slice(1, 1) + str.slice(1, str.length - 1) + "}";
        yield db_1.db.query(`INSERT INTO product_details
    (imageurls, title, originalprice, limiteddeaal, product_id, details) VALUES
    ('${imgs}',
      '${title}', ${originalprice}, 'f', '${id}',
      '${JSON.stringify(details)}'
    )
  `);
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
        yield db_1.db.query(`DELETE FROM product_details
    WHERE product_id = '${id}'`);
        yield db_1.db.query(`DELETE FROM products
    WHERE id = '${id}'`);
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
        yield db_1.db.query(`UPDATE products
    SET name = '${name}',
        description = '${description}',
        price = ${price}
    WHERE id = '${id}'
    `);
        const str = JSON.stringify(imageurls);
        const imgs = "{" + str.slice(1, 1) + str.slice(1, str.length - 1) + "}";
        yield db_1.db.query(`UPDATE product_details
    SET imageurls = '${imgs}',
        details = '${JSON.stringify(details)}',
        originalprice = ${originalprice},
        title = '${title}'
    WHERE product_id = '${id}'
    `);
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something Went Wrong"));
    }
    return next((0, success_1.CreateSuccess)(200, "Product Updated"));
});
exports.updateProduct = updateProduct;
