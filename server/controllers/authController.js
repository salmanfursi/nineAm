const User = require("../models/User");
const Shop = require("../models/Shop");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require('dotenv').config();

const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: minLength && hasNumber && hasSpecialChar,
    errors: [
      !minLength && "Password must be at least 8 characters long",
      !hasNumber && "Password must contain at least one number",
      !hasSpecialChar && "Password must contain at least one special character",
    ].filter(Boolean),
  };
};

exports.signup = async (req, res) => {
  try {
    const { username, password, shops } = req.body;
    if (!username || !password || !shops) {
      return res
        .status(400)
        .json({ message: "Username, password, and shops are required" });
    }
    if (!Array.isArray(shops) || shops.length < 3) {
      return res
        .status(400)
        .json({ message: "At least 3 shop names are required" });
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: "Password validation failed",
        errors: passwordValidation.errors,
      });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const normalizedShops = shops.map((shop) => shop.trim().toLowerCase());
    const existingShops = await Shop.find({ name: { $in: normalizedShops } });
    if (existingShops.length > 0) {
      const duplicateShops = existingShops.map((shop) => shop.name);
      return res
        .status(400)
        .json({ message: "Some shop names are already taken", duplicateShops });
    }
    const user = new User({
      username,
      password,
      shops: shops.map((shop) => shop.trim()),
    });
    await user.save();
    const shopEntries = normalizedShops.map((shopName) => ({
      name: shopName,
      owner: user._id,
    }));
    await Shop.insertMany(shopEntries);
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: "30m" }
    );
    const maxAge = 30 * 60 * 1000; // 30 minutes
     
    console.log("token----------||", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ REQUIRED when using SameSite=None
      sameSite: "none", // ✅ Enables cross-subdomain cookies
      // domain: "localhost", // ✅ Allows subdomain access like shopname.localhost
      domain: process.env.COOKIE_DOMAIN || "localhost",
      maxAge: maxAge,
    });
    
    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, username: user.username, shops: user.shops },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};


exports.signin = async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const expiresIn = rememberMe ? "7d" : "30m";
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn }
    );
     
    // console.log('token----------||',token)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ REQUIRED when using SameSite=None
      sameSite: "none", // ✅ Enables cross-subdomain cookies
      // domain: "localhost", // ✅ Allows subdomain access like shopname.localhost
      domain: process.env.COOKIE_DOMAIN || "localhost",
      maxAge: maxAge,
    });
    
    res.json({
      message: "Login successful",
      user: { id: user._id, username: user.username, shops: user.shops },
      expiresIn: rememberMe ? "7 days" : "30 minutes",
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error during signin" });
  }
};

exports.profile = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        shops: req.user.shops,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
  
exports.authenticateToken = async (req, res, next) => {
    console.log("1Shop route accessed for:", req.params.shopname); // Changed from shopName to shopname
    console.log("2Cookies received:", req.cookies);
    console.log("3Cookies token:", req.cookies.token);
    console.log("4Headers received:", req.headers.cookie);
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies.token;

    // Try Authorization header if cookie not found
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
