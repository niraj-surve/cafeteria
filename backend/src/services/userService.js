import { users } from "../data/data.js";
import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    res.status(200).send(generateTokenResponse(user));
    return;
  }

  res.status(400).send('Username or password is invalid!');
};

export const generateTokenResponse = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    "mysecret",
    {
      expiresIn: "30d",
    }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    token,
  };
};
