import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CreateError } from "./error";
import { CreateSuccess } from "./success";
import { prisma } from "../db/db";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.body.token ?? "";

  if (!token) {
    return next(CreateError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return next(CreateError(403, "Token is not valid!"));
    } else {
      user.is_admin = user.email === process.env.ADMIN_ID;
      req.body.user = user;
    }
    next();
  });
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    if (req.body.user?.is_admin) {
      next();
    } else {
      return next(CreateError(403, "You are not authenticated!"));
    }
  });
};

export const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body.user;
    const { isAdmin, email, first_name, last_name, profile_img } = {
      ...(await prisma.users.findUnique({
        where: { email: user.email },
        select: {
          first_name: true,
          last_name: true,
          email: true,
          profile_img: true,
        },
      })),
      isAdmin: false,
    };

    const userDeatils = {
      email,
      firstname: first_name,
      lastname: last_name,
      isAdmin: user.email === (process.env.ADMIN_ID as string),
      imageurl: profile_img,
    };

    return next(CreateSuccess(200, "Authentication Success", { user: userDeatils }));
  } catch (error) {
    return next(CreateError(500, "Something went wrong"));
  }
};
