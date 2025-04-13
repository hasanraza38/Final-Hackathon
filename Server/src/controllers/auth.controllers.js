import User from '../models/auth.models.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens.js';
import sendEmail from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  const { cnic, email, name } = req.body;

  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const user = new User({ cnic, email, name, password: hashedPassword });
  await user.save();

  await sendEmail(email, 'Your Temporary Password', `Your temporary password is: ${tempPassword}`);

  res.status(201).json({ message: 'User registered. Check your email for password.' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });

  res.json({ message: 'Logged in', role: user.role });
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ message: 'Token refreshed' });
  });
};

export {register, login, refreshToken}
