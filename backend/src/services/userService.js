import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { name, email, password, address, isAdmin } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      address,
      isAdmin,
    });

    const savedUser = await user.save();

    res.status(201).send({message: "User registered successfully!"});
  } catch (error) {
    res.status(500).send({ message: "Error registering new user." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).send(generateTokenResponse(user));
      return;
    }

    res.status(400).send({ message: "Username or password is invalid!" });
  } catch (error) {
    res.status(500).send({ error: "Error logging in." });
  }
};

export const generateTokenResponse = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    "mysecret",
    {
      expiresIn: "30d",
    }
  );

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    favourites: user.favourites,
    token,
  };
};

export const authenticateUser = (req, res, next) => {
  // Get token from headers
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, "mysecret");

    // Attach user information to request object
    req.user = decoded;

    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(401).send("Invalid token.");
  }
};

export const authenticateAdmin = (req, res, next) => {
  // Check if user is authenticated first
  authenticateUser(req, res, () => {
    // Check if authenticated user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).send("Access denied. Admin privileges required.");
    }

    // If admin, proceed to the next middleware or route handler
    next();
  });
};