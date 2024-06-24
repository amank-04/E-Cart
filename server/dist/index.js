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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db/db");
const products_1 = __importDefault(require("./routes/products"));
const cart_1 = __importDefault(require("./routes/cart"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const checkout_1 = __importDefault(require("./routes/checkout"));
const orders_1 = __importDefault(require("./routes/orders"));
const admin_1 = __importDefault(require("./routes/admin"));
const timers_1 = require("timers");
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)({
    origin: process.env.HOST,
}));
app.use(express_1.default.json());
// Routes
app.use("/api/cart", cart_1.default);
app.use("/api/products", products_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/checkout", checkout_1.default);
app.use("/api/orders", orders_1.default);
app.use("/api/admin/", admin_1.default);
// Response Handler Middleware
app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong!";
    return res.status(statusCode).json({
        success: [200, 201, 204].some((a) => a === obj.status),
        status: statusCode,
        message: message,
        data: obj.data,
    });
});
const query = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db_1.db.query(`
      ALTER TABLE product_details
      DROP COLUMN limiteddeaal;
    `);
        console.log(data.rows);
    }
    catch (error) {
        console.log(error);
    }
});
// query();
// Database
db_1.db.connect()
    .then(() => console.log("🟢 Connected to Database"))
    .catch(() => console.log("❌ Database Connection Failed"));
(0, timers_1.setInterval)(() => {
    db_1.db.query("");
}, 290000);
app.listen(PORT, () => {
    console.log(`Server at: http://localhost:${PORT}`);
});
