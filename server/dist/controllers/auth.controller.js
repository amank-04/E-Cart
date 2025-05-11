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
exports.sendEmail = exports.resetPassword = exports.login = exports.register = void 0;
const db_1 = require("../db/db");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const nodemailer_1 = require("nodemailer");
const error_1 = require("../utils/error");
const success_1 = require("../utils/success");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body.user;
    try {
        if (!firstName || !lastName || !email || !password) {
            return next((0, error_1.CreateError)(400, "All fields are required!"));
        }
        const salt = yield (0, bcrypt_1.genSalt)(10);
        const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
        yield db_1.prisma.users.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                email,
                password: hashedPassword,
            },
        });
        return next((0, success_1.CreateSuccess)(200, "New User Added!"));
    }
    catch (error) {
        return next((0, error_1.CreateError)(501, "Internal Server Error!"));
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return next((0, error_1.CreateError)(400, "All fields are required!"));
        }
        const user = yield db_1.prisma.users
            .findUnique({
            where: { email },
        })
            .then((result) => {
            var _a, _b;
            return result
                ? {
                    id: result.email,
                    firstName: result.first_name,
                    lastName: result.last_name,
                    email: result.email,
                    password: result.password,
                    profile_img: result.profile_img,
                    isAdmin: (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.isAdmin,
                }
                : null;
        });
        if (!user) {
            return next((0, error_1.CreateError)(404, "Wrong Credentials"));
        }
        const isPasswordCorrect = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordCorrect) {
            return next((0, error_1.CreateError)(404, "Wrong Credentials"));
        }
        const token = (0, jsonwebtoken_1.sign)({ email: user.email }, process.env.JWT_SECRET);
        return next((0, success_1.CreateSuccess)(200, "Login Success", { token }));
    }
    catch (error) {
        console.log(error);
        return next((0, error_1.CreateError)(501, "Internal Server Error!"));
    }
});
exports.login = login;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const newPassword = req.body.password;
    if (!token || !newPassword) {
        return next((0, error_1.CreateError)(400, "All fields are required!"));
    }
    try {
        (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return next((0, error_1.CreateError)(500, "Reset Link is Expired!"));
            }
            const user = yield db_1.prisma.users
                .findUnique({
                where: { email: data.email },
            })
                .then((result) => result
                ? {
                    id: result.email,
                    firstName: result.first_name,
                    lastName: result.last_name,
                    email: result.email,
                    password: result.password,
                    profile_img: result.profile_img,
                    isAdmin: false,
                }
                : null);
            if (!user) {
                return next((0, error_1.CreateError)(404, "Wrong Credentials"));
            }
            const salt = yield (0, bcrypt_1.genSalt)(10);
            const encryptedPassword = yield (0, bcrypt_1.hash)(newPassword, salt);
            yield db_1.prisma.users.update({
                where: { email: user.email },
                data: { password: encryptedPassword },
            });
            return next((0, success_1.CreateSuccess)(200, "Password updated!"));
        }));
    }
    catch (error) {
        return next((0, error_1.CreateError)(500, "Something went Wrong!"));
    }
});
exports.resetPassword = resetPassword;
const sendEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = (req.body.email || "").toLowerCase();
    try {
        const user = yield db_1.prisma.users
            .findUnique({
            where: { email },
        })
            .then((result) => result
            ? {
                id: result.email,
                firstName: result.first_name,
                lastName: result.last_name,
                email: result.email,
                password: result.password,
                profile_img: result.profile_img,
                isAdmin: false,
            }
            : null);
        if (!user) {
            return next((0, error_1.CreateError)(404, "Wrong Credentials"));
        }
        const payload = {
            email: user.email,
        };
        const expiryTime = 300;
        const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_SECRET, {
            expiresIn: expiryTime,
        });
        const mailTransporter = (0, nodemailer_1.createTransport)({
            service: "gmail",
            auth: {
                user: process.env.GOOGLE_ID,
                pass: process.env.GOOGLE_SECRET,
            },
        });
        const mailDetails = {
            from: "E-Cart",
            to: email,
            subject: "Reset Password!",
            html: `
        <html>
        <head>
          <title>Password Reset Request</title>
        </head>
        <body>
          <p>Dear ${user.firstName + user.lastName},</p>
          <h1>Password Reset Request</h1>
          <p>We have received a request to reset your password for your account with E-Cart. To complete the password reset process, please click on the button below:</p>
          <a href=${process.env.LIVE_URL}/reset/${token}><button style="background-color: #4CAF50; color: white; padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;">Reset Password</button></a>
          <p>Please note that this link is only valid for a 5mins. If you did not request a password reset, please disregard this message.</p>
          <p>Thank you,</p>
          <p>E-Cart Team</p>        
        </body>
        </html>
      `,
        };
        mailTransporter.sendMail(mailDetails, (err, data) => {
            if (err) {
                console.log(err);
                return next((0, error_1.CreateError)(500, "Something went wrong while sending the email"));
            }
            else {
                return next((0, success_1.CreateSuccess)(200, "Email Sent Successfully!"));
            }
        });
    }
    catch (error) {
        return next((0, error_1.CreateError)(501, "Internal Server Error!"));
    }
});
exports.sendEmail = sendEmail;
