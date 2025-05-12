import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";
import { OrderItem } from "../models/Orders.model";
import { prisma } from "../db/db";
const stripe = new Stripe(process.env.STRIPE_SECRET as string);

export const createCheckout = async (req: Request, res: Response, next: NextFunction) => {
  const { user_email, orderdItems } = req.body;

  try {
    if (!user_email || !orderdItems) {
      return next(CreateError(400, "Please fill all the fields"));
    }

    const origin = req.headers.origin;
    const session = await stripe.checkout.sessions.create({
      line_items: orderdItems.map((item: OrderItem) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
            images: [item.imageurl],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.count,
      })),
      mode: "payment",
      customer_email: user_email,
      success_url: origin + "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin,
    });

    const products = typeof orderdItems === 'string' ? JSON.parse(orderdItems) : orderdItems;
    const { amount_total, id, customer_email } = session;

    await prisma.orders.create({
      data: {
        total: amount_total! / 100,
        user_email: customer_email ?? "",
        products,
      },
    });

    return next(CreateSuccess(201, "Checkout Completed", { id }));
  } catch (error) {
    console.log(error);
    next(CreateError(501, "Stripe Payment Error!"));
  }
};

export const verifySessionId = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.body.sessionId as string;

  try {
    await stripe.checkout.sessions.retrieve(sessionId);
    return next(CreateSuccess(200, "Token Verified"));
  } catch (error) {
    next(CreateError(404, "Token is Invalid!"));
  }
};
