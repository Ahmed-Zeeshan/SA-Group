const mongoose = require("mongoose");
const userModel = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { name, email, contact, password } = req.body;
  try {
    // if user already exists
    userModel.findOne({ email }).then(async (user) => {
      if (user) {
        return res
          .status(400)
          .json({ error: "User already registered with this Email" });
      } else {
        
        const userData = await new userModel({
          name,
          email: email.toLowerCase(),
          password,
          contact,
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(userData.password, salt, async (err, hash) => {
            if (err) throw err;

            userData.password = hash;
            const ifSaved = await userData.save();

            if (ifSaved) {
              return res
                .status(200)
                .json({ message: "Registration Successful.." });
            }

            return res.status(400).json({ error: "Error creating user" });
          });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      user.password = null;

      // Create JWT Payload
      const payload = {
        id: user._id,
        role: user.role,
      };

      // Sign token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: `${process.env.JWT_EXPIRATION}`,
      });
      if (!token) {
        return res.status(500).json({ error: "Error signing token" });
      }
      // Save refresh token
      // const refreshToken = await RefreshToken.createToken(user);

      return res
        .cookie(
          "jwt_tokens",
          { token },
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: process.env.JWT_COOKIE_EXPIRATION * 36000,
          }
        )
        .status(200)
        .json({
          message: "Login Successful",
        });
    } else {
      return res.status(400).json({ error: "Password incorrect" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutUser = (req, res) => {
  return res
    .clearCookie("jwt_tokens")
    .status(200)
    .json({ message: "Successfully logged out" });
};
