import { NextFunction, Request, Response } from "express";
import { User } from "../models/User.model";
import { db } from "../db/db";
import { compare, genSalt, hash } from "bcrypt";
import { QueryResult } from "pg";
import { sign, verify } from "jsonwebtoken";
import { createTransport } from "nodemailer";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password }: User = req.body.user;

  try {
    if (!firstName || !lastName || !email || !password) {
      return next(CreateError(400, "All fields are required!"));
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    await db.query(`INSERT INTO
    users (first_name, last_name, email, password)
    VALUES ('${firstName}', '${lastName}', '${email}', 
    '${hashedPassword}')`);

    return next(CreateSuccess(200, "New User Added!"));
  } catch (error: any) {
    return next(CreateError(501, "Internal Server Error!"));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next(CreateError(400, "All fields are required!"));
    }

    const data: QueryResult<User> = await db.query(`SELECT * FROM users
      WHERE email = '${email}'
    `);

    if (!data.rowCount) {
      return next(CreateError(404, "Wrong Credentials"));
    }

    const user = data.rows[0];
    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return next(CreateError(404, "Wrong Credentials"));
    }
    const token = sign({ email: user.email }, process.env.JWT_SECRET as string);

    return next(CreateSuccess(200, "Login Success", { token }));
  } catch (error) {
    return next(CreateError(501, "Internal Server Error!"));
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  if (!token || !newPassword) {
    return next(CreateError(400, "All fields are required!"));
  }
  try {
    verify(token, process.env.JWT_SECRET as string, async (err: any, data: any) => {
      if (err) {
        return next(CreateError(500, "Reset Link is Expired!"));
      }

      const user: User = await (
        await db.query(`SELECT * FROM users WHERE email = '${data.email}' LIMIT 1`)
      ).rows[0];

      const salt = await genSalt(10);
      const encryptedPassword = await hash(newPassword, salt);

      await db.query(`UPDATE users 
          SET password = '${encryptedPassword}'
          WHERE email = '${user.email}'`);

      return next(CreateSuccess(200, "Password updated!"));
    });
  } catch (error) {
    return next(CreateError(500, "Something went Wrong!"));
  }
};

export const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  const email = ((req.body.email as string) || "").toLowerCase();

  try {
    const users: QueryResult<User> = await db.query(`SELECT * FROM users
    WHERE email = '${email}' 
    LIMIT 1`);

    if (!users.rowCount) {
      return next(CreateError(404, "Wrong Credentials"));
    }

    const user = users.rows[0];
    const payload = {
      email: user.email,
    };
    const expiryTime = 300;

    const token = sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: expiryTime,
    });

    const mailTransporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_ID,
        pass: process.env.GOOGLE_SECRET,
      },
    });

    const mailDetails = {
      from: "E-Cart",
      to: email,
      subject: "Reset Password!",
      html: `
        <html>
        <head>
          <title>Password Reset Request</title>
        </head>
        <body>
          <p>Dear ${user.firstName + user.lastName},</p>
          <h1>Password Reset Request</h1>
          <p>We have received a request to reset your password for your account with E-Cart. To complete the password reset process, please click on the button below:</p>
          <a href=${
            process.env.LIVE_URL
          }/reset/${token}><button style="background-color: #4CAF50; color: white; padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;">Reset Password</button></a>
          <p>Please note that this link is only valid for a 5mins. If you did not request a password reset, please disregard this message.</p>
          <p>Thank you,</p>
          <p>E-Cart Team</p>        
        </body>
        </html>
      `,
    };

    mailTransporter.sendMail(mailDetails, (err, data) => {
      if (err) {
        console.log(err);
        return next(CreateError(500, "Something went wrong while sending the email"));
      } else {
        return next(CreateSuccess(200, "Email Sent Successfully!"));
      }
    });
  } catch (error) {
    return next(CreateError(501, "Internal Server Error!"));
  }
};
