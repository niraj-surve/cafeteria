import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import crypto from "crypto";
dotenv.config();

const paymentId = process.env.PAYMENT_ID;
const paymentSecret = process.env.PAYMENT_SECRET;
const serverURL = process.env.SERVER_URL;
const clientURL = process.env.CLIENT_URL;

export const createPaymentSession = async (req, res) => {
  try {
    const merchantTransactionId = new mongoose.Types.ObjectId().toString();

    const data = {
      merchantId: paymentId,
      merchantTransactionId,
      merchantUserId: req.body.MID,
      name: req.body.name,
      amount: req.body.amount * 100,
      redirectUrl: `${serverURL}/api/v1/payment/${merchantTransactionId}`,
      redirectMode: "POST",
      mobileNumber: req.body.phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + paymentSecret;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const prod_URL =
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: { request: payloadMain },
    };

    axios
      .request(options)
      .then((response) => {
        return res.send(response.data.data.instrumentResponse.redirectInfo.url);
      })
      .catch((err) => {
        console.error("Error Response Data:", err.response.data);
        res.status(400).send({
          message: err.message,
          success: false,
        });
      });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

export const validatePayment = async (req, res) => {
  try {
    const { merchantTransactionId } = req.params;

    const keyIndex = 1;
    const string =
      `/pg/v1/status/${paymentId}/${merchantTransactionId}` + paymentSecret;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const options = {
      method: "GET",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${paymentId}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT_ID": `${paymentId}`,
      },
    };

    axios
      .request(options)
      .then((response) => {
        if (response.data.success) {
          res.redirect(
            `${clientURL}/successPayment?status=success`
          );
        } else {
          res.status(400).send("Payment verification failed");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  } catch (error) {}
};
