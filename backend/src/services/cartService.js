import User from "../models/user.js";

export const getCartItems = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Return user's cart
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { userId, productId, name, price, image, quantity } = req.body;
  console.log(req.body)
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the product already exists in the cart
    const existingCartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingCartItem) {
      // Update quantity if the product exists in the cart
      existingCartItem.quantity += quantity;
    } else {
      // Add new product to the cart
      user.cart.push({
        productId,
        name,
        price,
        image,
        quantity,
      });
    }

    await user.save();

    // Return updated cart
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId } = req.body;
  const productId = req.params.productId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Filter out the product from the cart
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();

    // Return updated cart
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const increaseQuantity = async (req, res) => {
  const { userId } = req.body;
  const productId = req.params.productId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    cartItem.quantity++;
    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const decreaseQuantity = async (req, res) => {
  const { userId } = req.body;
  const productId = req.params.productId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    } else {
      user.cart = user.cart.filter(
        (item) => item.productId.toString() !== productId
      );
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};