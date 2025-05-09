import { CartItem } from "../models/Cart.model";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../db/db";
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
    const cartItems: CartItem[] = await prisma.carts
      .findMany({
        where: { user_email: email },
        select: {
          product_id: true,
          selected: true,
          count: true,
          products: {
            select: {
              description: true,
              name: true,
              price: true,
              product_details: {
                select: {
                  imageurls: true,
                },
              },
            },
          },
        },
      })
      .then((items) =>
        items.map(({ products, product_id, selected, count }) => ({
          id: product_id,
          imageurl: products.product_details[0]?.imageurls[0] ?? "",
          selected,
          description: products.description,
          count,
          name: products.name,
          price: products.price,
        }))
      );

    return next(CreateSuccess(200, "Cart Items", cartItems));
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
    await prisma.carts.create({
      data: {
        count: item.count,
        product_id: item.p_id,
        user_email: email,
        selected: item.selected,
      },
    });

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
    await prisma.carts.updateMany({
      where: {
        product_id: item.p_id,
        user_email: email,
      },
      data: {
        selected: item.selected,
        count: item.count,
      },
    });

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
    await prisma.carts.deleteMany({
      where: {
        product_id: p_id,
        user_email: email,
      },
    });

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
    await prisma.carts.updateMany({
      where: {
        user_email: email,
      },
      data: {
        selected: selectedState,
      },
    });

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
    await prisma.carts.deleteMany({
      where: {
        user_email: email,
      },
    });

    return next(CreateSuccess(200, "Cart Cleared"));
  } catch (error) {
    console.log(error);
    return next(CreateError(501, "Internal Server Issue"));
  }
};
