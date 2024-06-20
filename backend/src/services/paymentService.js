import { Cashfree } from "cashfree-pg";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

Cashfree.XClientId = process.env.PAYMENT_CLIENT_ID;
Cashfree.XClientSecret = process.env.PAYMENT_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

export const getSessionKey = async (req, res) => {
    console.log(req.body)
  try {
    const { orderAmount, orderCurrency, customerData } = req.body;

    let request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: new mongoose.Types.ObjectId().toString(),
      customer_details: {
        customer_id: customerData.userId,
        customer_phone: customerData.phone,
        customer_name: customerData.name,
        customer_email: customerData.email,
      },
      order_meta: {
        payment_methods: "cc,dc,upi",
      },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    return res.status(200).send({ data: response.data });
  } catch (error) {
    console.error(
      "Error getting session id!",
      error.response ? error.response.data : error.message
    );
    return res
      .status(500)
      .send({ message: "Failed to get session id for payments..." });
  }
};

export const verifySessionKey = async (req, res) => {};