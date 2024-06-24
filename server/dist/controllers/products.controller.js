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
exports.getSearchedProducts = exports.addProductReview = exports.getProductReviews = exports.getProduct = exports.getAllProducts = void 0;
const db_1 = require("../db/db");
const success_1 = require("../utils/success");
const error_1 = require("../utils/error");
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield db_1.db.query(`
        SELECT p.id, name, description, price, ROUND(AVG(r.rating), 1) as rating, COUNT(r.id) as reviews,
        pd.imageurls[1] as imageurl, pd.limiteddeaal as limiteddeal
        FROM products p
        JOIN product_details pd ON pd.product_id = p.id
        LEFT JOIN reviews r ON r.product_id = p.id
        GROUP BY p.id, pd.id
    `);
        return next((0, success_1.CreateSuccess)(200, "All Products", products.rows));
    }
    catch (err) {
        console.log(err);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
});
exports.getAllProducts = getAllProducts;
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield db_1.db.query(`
      SELECT name, description, price, title, details, originalprice, imageurls, limiteddeaal, ROUND(AVG(r.rating), 1) as rating, COUNT(r.id) as reviews FROM products p
      JOIN product_details pd ON pd.product_id = p.id
      LEFT JOIN reviews r ON r.product_id = p.id
      GROUP BY r.product_id, p.id, pd.id
      HAVING p.id = '${id}'
    `);
        return next((0, success_1.CreateSuccess)(200, "Product", data.rows[0]));
    }
    catch (err) {
        console.log(err);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
});
exports.getProduct = getProduct;
const getProductReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield db_1.db.query(`SELECT profile_img, rating, comment, first_name || ' ' || last_name AS name, time  FROM reviews
        JOIN users ON users.email = reviews.user_email
        WHERE product_id = '${id}'
        ORDER BY time DESC
    `);
        return next((0, success_1.CreateSuccess)(200, "Reviews Fetched", data.rows));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
});
exports.getProductReviews = getProductReviews;
const addProductReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product_id = req.params.id;
    const { comment, rating } = req.body;
    const user_email = req.body.user.email;
    if (!comment || !rating || !user_email) {
        return next((0, error_1.CreateError)(400, "Please fill all the fields"));
    }
    try {
        yield db_1.db.query(`INSERT INTO reviews 
      (product_id, user_email, rating, comment)
      VALUES (
        '${product_id}', '${user_email}', 
         ${rating}, '${comment}'
      )`);
        return next((0, success_1.CreateSuccess)(200, "Review Added"));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
});
exports.addProductReview = addProductReview;
const getSearchedProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const term = (_a = req.query.term) !== null && _a !== void 0 ? _a : "";
        const limit = req.query.limit;
        if (!term) {
            return next((0, error_1.CreateError)(400, "Please enter a search term"));
        }
        let trimmedSearch = term.trim();
        let searchArray = trimmedSearch.split(/\s+/); //split on every whitespace and remove whitespace
        let searchWithStar = searchArray.join(" & ") + ":*"; //join word back together adds AND sign in between an star on last word
        const products = yield db_1.db.query(`
      SELECT p.id, name, description, price, ROUND(AVG(r.rating), 1) as rating, COUNT(r.id) as reviews,
      ts_rank(ts, to_tsquery('english', '${searchWithStar}')) rank,
      pd.imageurls[1] as imageurl, pd.limiteddeaal as limiteddeal
      FROM products p
      JOIN product_details pd ON pd.product_id = p.id
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE ts @@ to_tsquery('english', '${searchWithStar}')
      GROUP BY p.id, pd.id
      ORDER BY rank DESC
      ${limit ? "LIMIT " + limit : ""}
      `);
        return next((0, success_1.CreateSuccess)(200, "Searched Products", products.rows));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
});
exports.getSearchedProducts = getSearchedProducts;
