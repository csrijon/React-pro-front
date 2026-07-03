import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const PAYPAL_BASE = "https://api-m.sandbox.paypal.com";

console.log("CLIENT ID:", process.env.PAYPAL_PUBLICKEY);
console.log(
  "CLIENT SECRET:",
  process.env.PAYPAL_SECRETKEY
    ? "Loaded Successfully ✅"
    : "Not Found ❌"
);

// =========================
// Generate Access Token
// =========================

async function generateAccessToken() {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_PUBLICKEY}:${process.env.PAYPAL_SECRETKEY}`
    ).toString("base64");

    const { data } = await axios.post(
      `${PAYPAL_BASE}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return data.access_token;
  } catch (error) {
    console.log("Access Token Error");
    console.log(error.response?.data || error.message);
    throw error;
  }
}

// =========================
// Home
// =========================

app.get("/", (req, res) => {
  res.send("PayPal Backend Running");
});

// =========================
// Create Order
// =========================

app.post("/payment", async (req, res) => {
  try {
    const { amount } = req.body;

    const accessToken = await generateAccessToken();

    const { data } = await axios.post(
      `${PAYPAL_BASE}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      orderID: data.id,
    });
  } catch (error) {
    console.log("Create Order Error");
    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Order Creation Failed",
    });
  }
});

// =========================
// Capture Order
// =========================

app.post("/capture/:orderID", async (req, res) => {
  try {
    const accessToken = await generateAccessToken();

    const { data } = await axios.post(
      `${PAYPAL_BASE}/v2/checkout/orders/${req.params.orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      payment: data,
    });
  } catch (error) {
    console.log("Capture Error");
    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Payment Capture Failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});