import User from "../models/auth.models.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";
//create admin
const createAdmin = async (req, res) => {
  const { cnic, email, name, password, address } = req.body;

  if (!email) return res.status(400).json({ message: "email required" });
  if (!name) return res.status(400).json({ message: "name required" });
  if (!cnic) return res.status(400).json({ message: "cnic number required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const existingemail = await User.findOne({ email });
  if (existingemail)
    return res
      .status(401)
      .json({ message: "admin already registered with email" });
  const existingcnic = await User.findOne({ cnic });
  if (existingcnic)
    return res
      .status(401)
      .json({ message: "admin already registered with id card number" });

  const user = new User({
    cnic,
    email,
    name,
    password,
    role: "admin",
    address,
  });

  try {
    await user.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//create admin

// register user
const register = async (req, res) => {
  const { cnic, email, name, password } = req.body;

  if (!email) return res.status(400).json({ message: "email required" });
  if (!name) return res.status(400).json({ message: "name required" });
  if (!cnic) return res.status(400).json({ message: "cnic number required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const existingemail = await User.findOne({ email });
  if (existingemail)
    return res
      .status(401)
      .json({ message: "admin already registered with email" });
  const existingcnic = await User.findOne({ cnic });
  if (existingcnic)
    return res
      .status(401)
      .json({ message: "admin already registered with id card number" });

  const createUser = await User.create({
    cnic,
    email,
    name,
    password,
  });

  try {
    res
      .status(201)
      .json({ message: "User registered successfully", data: createUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// register user

//login user
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  console.log(isProduction);
  

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  
  const cookieBase = {
    httpOnly: true,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  };

  const accessCookieOptions = {
    ...cookieBase,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  };

  const refreshCookieOptions = { ...accessCookieOptions };

 
  if (process.env.COOKIE_DOMAIN && isProduction) {
    accessCookieOptions.domain = process.env.COOKIE_DOMAIN;
    refreshCookieOptions.domain = process.env.COOKIE_DOMAIN;
  }

  res.cookie("accessToken", accessToken, accessCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.json({ message: "Logged in", role: user.role });
};
//login user

// logout
const logout = async (req, res) => {
  try {
    console.log("Logout called");
    console.log("   isProduction:", isProduction);
    console.log("   COOKIE_DOMAIN:", process.env.COOKIE_DOMAIN || "not set");
   
    const clearOptions = {
      httpOnly: true,
      path: '/',
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: new Date(0),
      maxAge: 0,
    };

    if (process.env.COOKIE_DOMAIN && isProduction) {
      clearOptions.domain = process.env.COOKIE_DOMAIN;
    }

    console.log("   Clear options:", clearOptions);

    res.cookie("accessToken", "", clearOptions);
    res.cookie("refreshToken", "", clearOptions);

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(400).json({ error: error.message });
  }
};
// logout

// authorize user
const authenticatedUser = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        isAuthenticated: false,
        message: "Not authenticated",
      });
    }

    return res.status(200).json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Authorize User Error:", error);
    return res.status(500).json({
      isAuthenticated: false,
      message: "Server error while checking authentication",
    });
  }
};
// authorize user

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = generateAccessToken({ _id: user.id, role: user.role });
    
    const accessCookieOptions = {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    };

    if (process.env.COOKIE_DOMAIN && isProduction) {
      accessCookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    res.cookie("accessToken", accessToken, accessCookieOptions);

    res.json({ message: "Token refreshed" });
  });
};

export {
  register,
  login,
  refreshToken,
  createAdmin,
  logout,
  authenticatedUser,
};
