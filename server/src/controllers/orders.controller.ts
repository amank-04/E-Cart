import { Request, Response, NextFunction } from "express";
import { db } from "../db/db";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.user.email;

  try {
    const orders = await db.query(`SELECT * FROM orders 
    WHERE user_email = '${email}'
    ORDER BY placed DESC`);
    return next(CreateSuccess(200, "Orders Fetched", orders.rows));
  } catch (error) {
    console.log("dont get orders");
    return next(CreateError(501, "Something Went Wrong"));
  }
};
