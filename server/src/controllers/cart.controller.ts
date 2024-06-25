import { QueryResult } from "pg";
import { CartItem } from "../models/Cart.model";
import { NextFunction, Request, Response } from "express";
import { db } from "../db/db";
import { CreateSuccess } from "../utils/success";
import { CreateError } from "../utils/error";

type CartData = {
  selected: boolean;
  count: number;
  p_id: string;
};

export const getAllCartItems = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.user.email as string;

  try {
    const cartItems: QueryResult<CartItem> =
      await db.query(`SELECT pd.product_id as id, c.selected, p.description,
      c.count, p.name, p.price, pd.imageurls[1] imageurl 
      FROM carts c
      JOIN products p ON p.id = c.product_id
      JOIN product_details pd ON c.product_id = pd.product_id
      WHERE c.user_email = '${email}'
      `);

    return next(CreateSuccess(200, "Cart Items", cartItems.rows));
  } catch (error) {
    console.log(error);
    return next(CreateError(501, "Internal Server Issue"));
  }
};

export const createCartItem = async (req: Request, res: Response, next: NextFunction) => {
  const item: CartData = req.body.item;
  const email = req.body.user.email as string;

  if (!email || !item.p_id) {
    return next(CreateError(401, "You are not authenticated!"));
  }

  try {
    await db.query(`
      INSERT INTO carts (count, product_id, user_email, selected) 
      VALUES (${item.count}, '${item.p_id}', '${email}', ${item.selected})
    `);

    return next(CreateSuccess(200, "Cart Item Added"));
  } catch (error) {
    console.log(error);
    return next(CreateError(501, "Internal Server Issue"));
  }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  const item: CartData = req.body.item;
  const email = req.body.user.email as string;

  if (!email || !item.p_id || !item.count || typeof item.selected !== "boolean") {
    return next(CreateError(401, "You are not authenticated!"));
  }

  try {
    await db.query(`UPDATE carts 
      SET selected = ${item.selected}, count = ${item.count}
      WHERE product_id = '${item.p_id}' AND user_email = '${email}';
      `);
    return next(CreateSuccess(200, "Cart Item Updated"));
  } catch (error) {
    console.log(error);
    return next(CreateError(501, "Internal Server Issue"));
  }
};

export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  const p_id: string = req.body.p_id;
  const email = req.body.user.email as string;

  if (!email || !p_id) {
    return next(CreateError(401, "You are not authenticated!"));
  }

  try {
    await db.query(`DELETE FROM carts 
        WHERE product_id = '${p_id}' 
        AND user_email = '${email}'`);
    return next(CreateSuccess(200, "Cart Item Deleted"));
  } catch (error) {
    console.log(error);
    return next(CreateError(501, "Internal Server Issue"));
  }
};

export const selectAllCartItems = async (req: Request, res: Response, next: NextFunction) => {
  const selectedState: boolean = req.body.selectedState;
  const email = req.body.user.email as string;

  if (!email) {
    return CreateError(401, "You are not authenticated!");
  }

  try {
    await db.query(`UPDATE carts 
      SET selected = ${selectedState}
      WHERE user_email = '${email}'`);
    return next(CreateSuccess(200, "Cart Items Updated"));
  } catch (error) {
    console.log(error);
    return next(CreateError(501, "Internal Server Issue"));
  }
};
export const clearAllCart = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.user.email as string;
  if (!email) {
    return next(CreateError(401, "You are not authenticated!"));
  }
  try {
    await db.query(`DELETE FROM carts WHERE user_email = '${email}'`);
    return next(CreateSuccess(200, "Cart Cleared"));
  } catch (error) {
    console.log(error);
    return next(CreateError(501, "Internal Server Issue"));
  }
};
