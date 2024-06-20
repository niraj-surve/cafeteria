import mongoose from "mongoose";
import User from "../models/user.js";

export const addOrder = async (req, res) => {
  try {
    const { orderId, userId, products, name, totalPrice, paymentOption } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Missing userId in request body" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!products || !paymentOption) {
      return res
        .status(400)
        .json({ message: "Missing required order details" });
    }

    const newOrder = {
      orderId: orderId ? orderId : new mongoose.Types.ObjectId().toString(),
      products,
      name,
      totalPrice,
      paymentOption,
      orderDate: new Date(),
    };

    user.orders.push(newOrder);
    await user.save();

    res
      .status(201)
      .json({ message: "Order added successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error adding order", error });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    const { orderId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Missing userId in request body" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderIndex = user.orders.findIndex(
      (order) => order.orderId === orderId
    );

    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" });
    }

    user.orders.splice(orderIndex, 1);
    await user.save();

    res.status(200).json({ message: "Order canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling order", error });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Missing userId in request body" });
    }

    const user = await User.findById(userId).select("orders");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ orders: user.orders });
  } catch (error) {
    res.status(500).json({ message: "Error getting orders", error });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { userId } = req.query;
    const { orderId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Missing userId in request body" });
    }

    const user = await User.findById(userId).select("orders");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = user.orders.find((order) => order.orderId === orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Error getting order", error });
  }
};