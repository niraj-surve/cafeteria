import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import { getClient } from "../config/mail.config.js";

dotenv.config();

const apiSecret = process.env.API_SECRET;
const mailgunDomain = process.env.MAILGUN_DOMAIN;

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const mailClient = getClient();

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    mailClient.messages
      .create(mailgunDomain, {
        from: "Cafeteria <support@cafeteria.com>",
        to: email,
        subject: `Password Reset`,
        html: getResetPasswordHtml(resetToken),
      })
      .then((msg) => {
        return res.status(200).send({ message: msg });
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getResetPasswordHtml = (resetToken) => {
  return `
<html>

<head>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .reset-container {
            padding: 2rem;
            margin: 3rem;
        }

        .container h2 {
            align-self: center;
            color: #907ad6;
            margin-bottom: 20px;
        }

        p {
            line-height: 1.4rem;
            color: #4c5454;
            margin-bottom: 20px;
        }

        .btn {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }

        .btn a button {
            padding: 10px;
            border: 1px solid #907ad6;
            background-color: #907ad6;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }

        .btn a button:hover {
            background-color: white;
            color: #907ad6;
            transition: all .3s ease-in-out;
        }

        .lastP {
            color: red;
        }
    </style>
</head>

<body>
    <div class="reset-container">
        <h2>RESET PASSWORD</h2>
        <p class="heading">Hello Buddy!</p>
        <p>
            You are receiving this because you (or someone else) have requested the
            reset of the password for your account. Please click on the following
            link, or paste this into your browser to complete the process:
        </p>
        <div class="btn">
            <a href="http://localhost:5173/reset-password/${resetToken}">
                <button>Reset Password</button>
            </a>
        </div>
        <p class="lastP">
            Note: If you did not request this, please ignore this email and your password
            will remain unchanged.
        </p>
    </div>
</body>

</html>

`;
};

export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    // Set new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

export const register = async (req, res) => {
  const { name, email, phone, password, isAdmin, favourites } = req.body;

  try {
    // Check if user with the same email exists
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Check if user with the same phone number exists
    const existingPhoneUser = await User.findOne({ phone });
    if (existingPhoneUser) {
      return res
        .status(400)
        .json({ message: "User with this phone number already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      isAdmin,
      favourites: favourites || [],
    });

    // Save the user to the database
    await newUser.save();

    // Send success response
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    // Handle errors
    console.error("Error registering new user:", error);
    res.status(500).json({ message: "Error registering new user." });
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

export const toggleFavorite = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.favourites.indexOf(productId);

    if (index === -1) {
      // Product not in favorites, add it
      user.favourites.push(productId);
    } else {
      // Product already in favorites, remove it
      user.favourites.splice(index, 1);
    }

    await user.save();

    res.status(200).json({ favourites: user.favourites });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Error toggling favorite" });
  }
};

export const updateProfile = async (req, res) => {
  const { userId, name, phone } = req.body;

  try {
    // Find user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user object
    user.name = name;
    user.phone = phone;

    // Save updated user to database
    await user.save();

    res.status(200).send(generateTokenResponse(user));
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const generateTokenResponse = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    apiSecret,
    {
      expiresIn: "30d",
    }
  );

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    phone: user.phone,
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
