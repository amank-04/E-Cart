import { Request, Response, NextFunction } from "express";
import { db } from "../db/db";
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
    const orders = (await db.query(`SELECT * FROM orders ORDER BY placed DESC`)).rows;
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
      await db.query(`SELECT email, 
    profile_img as imageurl, first_name as firstname, last_name as lastname
    FROM users`)
    ).rows;
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
    await db.query(`UPDATE orders 
        SET status = '${newStatus}'
        WHERE id = ${id}`);

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
    await db.query(`INSERT INTO products
    (id, name, description, price)
    VALUES (
      '${id}', '${name}',
      '${description}', ${price}
    )`);

    const str = JSON.stringify(imageurls);
    const imgs = "{" + str.slice(1, 1) + str.slice(1, str.length - 1) + "}";

    await db.query(`INSERT INTO product_details
    (imageurls, title, originalprice, limiteddeaal, product_id, details) VALUES
    ('${imgs}',
      '${title}', ${originalprice}, 'f', '${id}',
      '${JSON.stringify(details)}'
    )
  `);
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something went wrong"));
  }

  return next(CreateSuccess(200, "Product Added"));
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;

  try {
    await db.query(`DELETE FROM product_details
    WHERE product_id = '${id}'`);

    await db.query(`DELETE FROM products
    WHERE id = '${id}'`);
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
    await db.query(`UPDATE products
    SET name = '${name}',
        description = '${description}',
        price = ${price}
    WHERE id = '${id}'
    `);

    const str = JSON.stringify(imageurls);
    const imgs = "{" + str.slice(1, 1) + str.slice(1, str.length - 1) + "}";

    await db.query(`UPDATE product_details
    SET imageurls = '${imgs}',
        details = '${JSON.stringify(details)}',
        originalprice = ${originalprice},
        title = '${title}'
    WHERE product_id = '${id}'
    `);
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something Went Wrong"));
  }

  return next(CreateSuccess(200, "Product Updated"));
};
