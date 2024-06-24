import { db } from "../db/db";
import { Response, Request, NextFunction } from "express";
import { CreateSuccess } from "../utils/success";
import { CreateError } from "../utils/error";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await db.query(`
        SELECT p.id, name, description, price, ROUND(AVG(r.rating), 1) as rating, COUNT(r.id) as reviews,
        pd.imageurls[1] as imageurl
        FROM products p
        JOIN product_details pd ON pd.product_id = p.id
        LEFT JOIN reviews r ON r.product_id = p.id
        GROUP BY p.id, pd.id
    `);

    return next(CreateSuccess(200, "All Products", products.rows));
  } catch (err) {
    console.log(err);
    return next(CreateError(500, "Something went wrong"));
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const data = await db.query(`
      SELECT name, description, price, title, details, originalprice, imageurls, ROUND(AVG(r.rating), 1) as rating, COUNT(r.id) as reviews FROM products p
      JOIN product_details pd ON pd.product_id = p.id
      LEFT JOIN reviews r ON r.product_id = p.id
      GROUP BY r.product_id, p.id, pd.id
      HAVING p.id = '${id}'
    `);
    return next(CreateSuccess(200, "Product", data.rows[0]));
  } catch (err) {
    console.log(err);
    return next(CreateError(500, "Something went wrong"));
  }
};

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const data =
      await db.query(`SELECT profile_img, rating, comment, first_name || ' ' || last_name AS name, time  FROM reviews
        JOIN users ON users.email = reviews.user_email
        WHERE product_id = '${id}'
        ORDER BY time DESC
    `);

    return next(CreateSuccess(200, "Reviews Fetched", data.rows));
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something went wrong"));
  }
};

export const addProductReview = async (req: Request, res: Response, next: NextFunction) => {
  const product_id = req.params.id;
  const { comment, rating } = req.body;
  const user_email = req.body.user.email;

  if (!comment || !rating || !user_email) {
    return next(CreateError(400, "Please fill all the fields"));
  }

  try {
    await db.query(`INSERT INTO reviews 
      (product_id, user_email, rating, comment)
      VALUES (
        '${product_id}', '${user_email}', 
         ${rating}, '${comment}'
      )`);

    return next(CreateSuccess(200, "Review Added"));
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something went wrong"));
  }
};

export const getSearchedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const term = (req.query.term as string) ?? "";
    const limit = req.query.limit;

    if (!term) {
      return next(CreateError(400, "Please enter a search term"));
    }

    let trimmedSearch = term.trim();
    let searchArray = trimmedSearch.split(/\s+/); //split on every whitespace and remove whitespace
    let searchWithStar = searchArray.join(" & ") + ":*"; //join word back together adds AND sign in between an star on last word

    const products = await db.query(`
      SELECT p.id, name, description, price, ROUND(AVG(r.rating), 1) as rating, COUNT(r.id) as reviews,
      ts_rank(ts, to_tsquery('english', '${searchWithStar}')) rank,
      pd.imageurls[1] as imageurl
      FROM products p
      JOIN product_details pd ON pd.product_id = p.id
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE ts @@ to_tsquery('english', '${searchWithStar}')
      GROUP BY p.id, pd.id
      ORDER BY rank DESC
      ${limit ? "LIMIT " + limit : ""}
      `);
    return next(CreateSuccess(200, "Searched Products", products.rows));
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something went wrong"));
  }
};
