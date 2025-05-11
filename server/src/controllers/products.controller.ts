import { prisma } from "../db/db";
import { Response, Request, NextFunction } from "express";
import { CreateSuccess } from "../utils/success";
import { CreateError } from "../utils/error";
import { Prisma } from "../generated/prisma";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.products
      .findMany({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          product_details: {
            select: {
              imageurls: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      })
      .then((result) =>
        result.map(({ id, name, description, price, product_details, reviews }) => {
          const rating = Number(
            reviews.length
              ? (reviews.reduce((sum, { rating }) => sum + rating, 0) / reviews.length).toFixed(1)
              : null
          );
          const imageurl = product_details[0]?.imageurls[0] ?? ""; // Assuming the second image
          return {
            id,
            name,
            description,
            price,
            rating,
            reviews: reviews.length,
            imageurl,
          };
        })
      );

    return next(CreateSuccess(200, "All Products", products));
  } catch (err) {
    console.log(err);
    return next(CreateError(500, "Something went wrong"));
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const product = await prisma.products.findUnique({
      where: { id },
      select: {
        name: true,
        description: true,
        price: true,
        product_details: {
          select: {
            title: true,
            details: true,
            originalprice: true,
            imageurls: true,
          },
          take: 1, // assuming one-to-one relation
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!product) {
      return next(CreateError(404, "Product Not Found"));
    }

    const { name, description, price, product_details, reviews } = product;

    const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const reviewCount = reviews.length;
    const avgRating = reviewCount > 0 ? Number((ratingSum / reviewCount).toFixed(1)) : null;

    if (typeof product_details[0].details === 'string') {
      product_details[0].details = JSON.parse(product_details[0].details)
    }

    const result = {
      name,
      description,
      price,
      title: product_details[0]?.title,
      details: product_details[0].details,
      originalprice: product_details[0]?.originalprice,
      imageurls: product_details[0]?.imageurls,
      rating: avgRating,
      reviews: reviewCount,
    };

    return next(CreateSuccess(200, "Product", result));
  } catch (err) {
    console.log(err);
    return next(CreateError(500, "Something went wrong"));
  }
};

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const data = await prisma.reviews
      .findMany({
        where: {
          product_id: id,
        },
        orderBy: {
          time: "desc",
        },
        select: {
          rating: true,
          comment: true,
          time: true,
          users: {
            select: {
              profile_img: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      })
      .then((reviews) =>
        reviews.map(({ rating, comment, time, users: { profile_img, first_name, last_name } }) => ({
          profile_img,
          rating,
          comment,
          name: `${first_name} ${last_name}`,
          time,
        }))
      );

    return next(CreateSuccess(200, "Reviews Fetched", data));
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
    await prisma.reviews.create({
      data: {
        product_id: product_id,
        user_email: user_email,
        rating: rating,
        comment: comment,
      },
    });

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

    const products = await prisma.$queryRawUnsafe(`
      SELECT p.id, name, description, price, 
        ROUND(AVG(r.rating), 1) as rating, COUNT(r.id)::int as reviews,
        ts_rank(ts, to_tsquery('english', '${searchWithStar}')) as rank,
        pd.imageurls[1] as imageurl
      FROM products p
      JOIN product_details pd ON pd.product_id = p.id
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE ts @@ to_tsquery('english', '${searchWithStar}')
      GROUP BY p.id, pd.id
      ORDER BY rank DESC
      ${limit ? "LIMIT " + limit : ""}
    `);
    return next(CreateSuccess(200, "Searched Products", products));
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something went wrong"));
  }
};
