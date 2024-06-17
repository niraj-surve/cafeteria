let cartData = {
  items: [],
};

export const getCartItems = (req, res) => {
  res.send(cartData.items);
};

export const addToCart = (req, res) => {
  const { id, name, price, image } = req.body;
  const existingItem = cartData.items.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartData.items.push({ id, name, price, image, quantity: 1 });
  }
  res.send(cartData.items);
};

export const updateQuantity = (req, res) => {
  const { id, quantity } = req.body;
  const itemToUpdate = cartData.items.find((item) => item.id === id);

  if (itemToUpdate) {
    itemToUpdate.quantity = quantity;
    res.send(cartData.items);
  } else {
    res.status(404).send({ message: "Item not found" });
  }
};

export const removeFromCart = (req, res) => {
  const { id } = req.body;
  cartData.items = cartData.items.filter((item) => item.id !== id);
  res.send(cartData.items);
};

export const clearCart = (req, res) => {
  cartData.items = [];
  res.send(cartData.items);
};