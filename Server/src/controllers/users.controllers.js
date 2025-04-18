import Users from "../models/users.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//generate accesstoken
const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "6h",
  });
};
//generate accesstoken


//generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
};
//generate refresh token


//Register User
const registerUser = async (req, res) => {
  try {
    const { username,name,nic,phone, email, password, role} = req.body;

    if (!username) return res.status(400).json({ message: "user Name required" }); 
    if (!name) return res.status(400).json({ message: "Name required" }); 
    if (!nic) return res.status(400).json({ message: "NIC number required" });
    if (!phone) return res.status(400).json({ message: "phone number required" });
    if (!email) return res.status(400).json({ message: "email required" });
    if (!password) return res.status(400).json({ message: "password required" });
    if (!role) return res.status(400).json({ message: "role required" });

    const userName = await Users.findOne({ username: username });
    if (userName) return res.status(401).json({ message: "username not available" });

    const user = await Users.findOne({ email: email });
    if (user) return res.status(401).json({ message: "user already exist" });

    const createUser = await Users.create({
      username,
      name,
      email,
      password,
      phone,
      nic,
      role

    });

    res.status(201).json({ message: "user registered successfully", data: createUser });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
//Register User



// login User
const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username) return res.status(400).json({ message: "user Name required" });
  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const user = await Users.findOne({ email });
  if (!user) return res.status(400).json({ message: "user not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
  return res.status(400).json({ message: "incorrect password" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, { http: true, secure: true });

  res.json({
    message: "user logged in successfuly",
    accessToken,
    refreshToken,
    data: user,
  });
};
// login User



// refresh token
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "refresh token not found" });
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

    const user = await Users.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(404).json({ message: "invalid token" });
    }

    const generateToken = generateAccessToken(user);
    return res.json({ message: "access token generated", accessToken: generateToken });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// refresh token



// logout user
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "user logout successfully" });
};
// logout user



export { registerUser, loginUser, refreshToken, logoutUser, };
