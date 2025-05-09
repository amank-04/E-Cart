import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/db";
import { CreateSuccess } from "../utils/success";
import { CreateError } from "../utils/error";
import { ProductDetails } from "../models/Product.model";

type NewProduct = {
  name: string;
  title: string;
  description: string;
  price: number;
  originalprice: number;
  imageurls: string[];
  details: object;
};

const makeid = (): string => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 16) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter++;
  }
  return result;
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: {
        placed: "desc",
      },
    });

    return next(
      CreateSuccess(200, "Orders Fetched", {
        orders,
      })
    );
  } catch (err) {
    console.log(err);
    return next(CreateError(500, "Something went wrong"));
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = (
      await prisma.users.findMany({
        select: {
          email: true,
          profile_img: true,
          first_name: true,
          last_name: true,
        },
      })
    ).map((user) => ({
      email: user.email,
      imageurl: user.profile_img,
      firstname: user.first_name,
      lastname: user.last_name,
    }));

    next(CreateSuccess(200, "Users Fetched", { users }));
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something went wrong"));
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id, newStatus } = req.body;
  if (!id || !newStatus) {
    return next(CreateError(400, "Order not found"));
  }

  try {
    await prisma.orders.update({
      where: { id },
      data: { status: newStatus },
    });

    next(CreateSuccess(200, "Status Updated"));
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something Went Wrong"));
  }
};

export const addNewProduct = async (req: Request, res: Response, next: NextFunction) => {
  const {
    product: { description, details, imageurls, name, originalprice, price, title },
  } = req.body as { product: NewProduct };
  const id = makeid();

  try {
    await prisma.products.create({
      data: {
        id,
        name,
        description,
        price,
      },
    });

    await prisma.product_details.create({
      data: {
        imageurls,
        title,
        originalprice,
        product_id: id,
        details: JSON.stringify(details),
      },
    });
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something went wrong"));
  }

  return next(CreateSuccess(200, "Product Added"));
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;

  try {
    await prisma.product_details.deleteMany({
      where: { product_id: id },
    });

    await prisma.products.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something went wrong"));
  }

  return next(CreateSuccess(200, "Product Deleted"));
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.body.id as string;
  const { description, details, imageurls, name, title, price } = req.body
    .product as ProductDetails;

  const originalprice = req.body.product.originalPrice;

  try {
    await prisma.products.update({
      where: { id },
      data: {
        name,
        description,
        price,
      },
    });

    await prisma.product_details.updateMany({
      where: { product_id: id },
      data: {
        imageurls,
        details: JSON.stringify(details),
        originalprice,
        title,
      },
    });
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something Went Wrong"));
  }

  return next(CreateSuccess(200, "Product Updated"));
};
