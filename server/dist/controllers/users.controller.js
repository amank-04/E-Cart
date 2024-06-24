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
exports.deleteUser = exports.getUserById = exports.getAllUsers = void 0;
const db_1 = require("../db/db");
const error_1 = require("../utils/error");
const success_1 = require("../utils/success");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = (yield db_1.db.query("SELECT * FROM users")).rows;
        res.json({ message: "All users", users });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong!!" });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.id;
        const users = (yield db_1.db.query(`SELECT * FROM users
      WHERE email = '${email}'`)).rows;
        if (!users.length) {
            return next((0, error_1.CreateError)(404, "User Not Found"));
        }
        return next((0, success_1.CreateSuccess)(200, "User Details Found", { data: users[0] }));
    }
    catch (error) {
        return next((0, error_1.CreateError)(500, "Something went wrong!!"));
    }
});
exports.getUserById = getUserById;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.user.email;
    if (!email) {
        return next((0, error_1.CreateError)(400, "All fields are required!!"));
    }
    try {
        yield db_1.db.query(`
      DELETE FROM users
      WHERE email = '${email}'
    `);
        return next((0, success_1.CreateSuccess)(200, "User Deleted"));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(500, "Something went wrong!!"));
    }
});
exports.deleteUser = deleteUser;
