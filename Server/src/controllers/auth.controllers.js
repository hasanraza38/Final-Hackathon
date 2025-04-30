import User from '../models/auth.models.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens.js';
import jwt from 'jsonwebtoken';

//create admin
const createAdmin = async (req, res) => {
  const { cnic, email, name, password, address } = req.body;

  if (!email) return res.status(400).json({ message: "email required" });
  if (!name) return res.status(400).json({ message: "name required" });
  if (!cnic) return res.status(400).json({ message: "cnic number required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const existingemail = await User.findOne({ email });
  if (existingemail) return res.status(401).json({ message: "admin already registered with email" });
  const existingcnic = await User.findOne({ cnic });
  if (existingcnic) return res.status(401).json({ message: "admin already registered with id card number" });
  

  const user = new User({
    cnic,
    email,
    name,
    password,
    role: 'admin',
    address
  });

  try {
    await user.save();
    res.status(201).json({ message: 'Admin created successfully' });
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
  if (existingemail) return res.status(401).json({ message: "admin already registered with email" });
  const existingcnic = await User.findOne({ cnic });
  if (existingcnic) return res.status(401).json({ message: "admin already registered with id card number" });

  const createUser = await User.create({
    cnic,
    email,
    name,
    password,
  });

  try {
    res.status(201).json({ message: 'User registered successfully', data: createUser });
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }

};
// register user



//login user
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true, 
    sameSite: 'none', 
    });
  res.cookie('refreshToken', refreshToken, 
    { 
      httpOnly: true,
      secure: true,
      sameSite: 'none',
     });
  // console.log(cookies set , { accessToken, refreshToken });

  res.json({ message: 'Logged in', role: user.role });
};
//login user


// logout
const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken',);

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(400).json({ error: error.message });
  }
};
// logout


// authorize user
 const authorizeUser = (req, res) => {
  try {
    res.status(200).json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error('Check Auth Error:', error);
    res.status(401).json({ isAuthenticated: false, message: 'Not authenticated' });
  }
}
// authorize user



const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    res.cookie('accessToken', accessToken, 
      {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
       });
    res.json({ message: 'Token refreshed' });
  });
};

export { register, login, refreshToken, createAdmin, logout , authorizeUser };
