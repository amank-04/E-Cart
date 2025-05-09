import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/db";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.user.email;

  try {
    const orders = await prisma.orders.findMany({
      where: {
        user_email: email,
      },
      orderBy: {
        placed: "desc",
      },
    });

    return next(CreateSuccess(200, "Orders Fetched", orders));
  } catch (error) {
    console.log("dont get orders");
    return next(CreateError(501, "Something Went Wrong"));
  }
};
