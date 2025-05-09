import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { prisma } from "./db/db";
import productRouter from "./routes/products";
import cartRouter from "./routes/cart";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import checkoutRouter from "./routes/checkout";
import ordersRouter from "./routes/orders";
import adminRouter from "./routes/admin";
import { setInterval } from "timers";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: process.env.HOST ?? "*",
  })
);
app.use(express.json());

// Routes
app.use("/api/cart", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin/", adminRouter);

// Response Handler Middleware
app.use((obj: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = obj.status || 500;
  const message = obj.message || "Something went wrong!";

  return res.status(statusCode).json({
    success: [200, 201, 204].some((a) => a === obj.status),
    status: statusCode,
    message: message,
    data: obj.data,
  });
});

// Database
prisma
  .$connect()
  .then(() => console.log("🟢 Connected to Database"))
  .catch(() => console.log("❌ Database Connection Failed"));

setInterval(() => {
  prisma.$queryRawUnsafe("");
}, 290000);

app.listen(PORT, () => {
  console.log(`Server at: http://localhost:${PORT}`);
});
