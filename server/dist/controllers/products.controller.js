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
        const products = yield db_1.prisma.products
            .findMany({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                product_details: {
                    select: {
                        imageurls: true,
                    },
                },
                reviews: {
                    select: {
                        rating: true,
                    },
                },
            },
        })
            .then((result) => result.map(({ id, name, description, price, product_details, reviews }) => {
            var _a, _b;
            const rating = Number(reviews.length
                ? (reviews.reduce((sum, { rating }) => sum + rating, 0) / reviews.length).toFixed(1)
                : null);
            const imageurl = (_b = (_a = product_details[0]) === null || _a === void 0 ? void 0 : _a.imageurls[0]) !== null && _b !== void 0 ? _b : ""; // Assuming the second image
            return {
                id,
                name,
                description,
                price,
                rating,
                reviews: reviews.length,
                imageurl,
            };
        }));
        return next((0, success_1.CreateSuccess)(200, "All Products", products));
    }
    catch (err) {
        console.log(err);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
});
exports.getAllProducts = getAllProducts;
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const id = req.params.id;
    try {
        const product = yield db_1.prisma.products.findUnique({
            where: { id },
            select: {
                name: true,
                description: true,
                price: true,
                product_details: {
                    select: {
                        title: true,
                        details: true,
                        originalprice: true,
                        imageurls: true,
                    },
                    take: 1, // assuming one-to-one relation
                },
                reviews: {
                    select: {
                        rating: true,
                    },
                },
            },
        });
        if (!product) {
            return next((0, error_1.CreateError)(404, "Product Not Found"));
        }
        const { name, description, price, product_details, reviews } = product;
        const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
        const reviewCount = reviews.length;
        const avgRating = reviewCount > 0 ? Number((ratingSum / reviewCount).toFixed(1)) : null;
        const result = {
            name,
            description,
            price,
            title: (_a = product_details[0]) === null || _a === void 0 ? void 0 : _a.title,
            details: product_details[0].details,
            originalprice: (_b = product_details[0]) === null || _b === void 0 ? void 0 : _b.originalprice,
            imageurls: (_c = product_details[0]) === null || _c === void 0 ? void 0 : _c.imageurls,
            rating: avgRating,
            reviews: reviewCount,
        };
        return next((0, success_1.CreateSuccess)(200, "Product", result));
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
        const data = yield db_1.prisma.reviews
            .findMany({
            where: {
                product_id: id,
            },
            orderBy: {
                time: "desc",
            },
            select: {
                rating: true,
                comment: true,
                time: true,
                users: {
                    select: {
                        profile_img: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        })
            .then((reviews) => reviews.map(({ rating, comment, time, users: { profile_img, first_name, last_name } }) => ({
            profile_img,
            rating,
            comment,
            name: `${first_name} ${last_name}`,
            time,
        })));
        return next((0, success_1.CreateSuccess)(200, "Reviews Fetched", data));
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
        yield db_1.prisma.reviews.create({
            data: {
                product_id: product_id,
                user_email: user_email,
                rating: rating,
                comment: comment,
            },
        });
        return next((0, success_1.CreateSuccess)(200, "Review Added"));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
});
exports.addProductReview = addProductReview;
const getSearchedProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const term = (_d = req.query.term) !== null && _d !== void 0 ? _d : "";
        const limit = req.query.limit;
        if (!term) {
            return next((0, error_1.CreateError)(400, "Please enter a search term"));
        }
        let trimmedSearch = term.trim();
        let searchArray = trimmedSearch.split(/\s+/); //split on every whitespace and remove whitespace
        let searchWithStar = searchArray.join(" & ") + ":*"; //join word back together adds AND sign in between an star on last word
        const products = yield db_1.prisma.$queryRawUnsafe(`
      SELECT p.id, name, description, price, 
        ROUND(AVG(r.rating), 1) as rating, COUNT(r.id)::int as reviews,
        ts_rank(ts, to_tsquery('english', '${searchWithStar}')) as rank,
        pd.imageurls[1] as imageurl
      FROM products p
      JOIN product_details pd ON pd.product_id = p.id
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE ts @@ to_tsquery('english', '${searchWithStar}')
      GROUP BY p.id, pd.id
      ORDER BY rank DESC
      ${limit ? "LIMIT " + limit : ""}
    `);
        return next((0, success_1.CreateSuccess)(200, "Searched Products", products));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something went wrong"));
    }
});
exports.getSearchedProducts = getSearchedProducts;
