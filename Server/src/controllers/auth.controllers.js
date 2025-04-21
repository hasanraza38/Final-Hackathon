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

  const admin = await User.findOne({ email });
  if (admin) return res.status(401).json({ message: "user already exist" });

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

  const user = await User.findOne({ email });
  if (user) return res.status(401).json({ message: "user already exist" });

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
     secure: false, 
     sameSite: "secure",  
    });
  res.cookie('refreshToken', refreshToken, 
    { 
      httpOnly: true,
      secure: false, 
      sameSite: 'secure'
     });
  // console.log('Cookies set:', { accessToken, refreshToken });

  res.json({ message: 'Logged in', role: user.role });
};
//login user



const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ message: 'Token refreshed' });
  });
};

export { register, login, refreshToken, createAdmin }
