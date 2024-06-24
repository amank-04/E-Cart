import { NextFunction, Request, Response } from "express";
import { db } from "../db/db";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = (await db.query("SELECT * FROM users")).rows;
    res.json({ message: "All users", users });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!!" });
  }
};
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.id;
    const users = (
      await db.query(`SELECT * FROM users
      WHERE email = '${email}'`)
    ).rows;

    if (!users.length) {
      return next(CreateError(404, "User Not Found"));
    }
    return next(CreateSuccess(200, "User Details Found", { data: users[0] }));
  } catch (error) {
    return next(CreateError(500, "Something went wrong!!"));
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.user.email;

  if (!email) {
    return next(CreateError(400, "All fields are required!!"));
  }

  try {
    await db.query(`
      DELETE FROM users
      WHERE email = '${email}'
    `);

    return next(CreateSuccess(200, "User Deleted"));
  } catch (error) {
    console.log(error);
    return next(CreateError(500, "Something went wrong!!"));
  }
};
