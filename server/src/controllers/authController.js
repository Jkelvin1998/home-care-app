import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
   throw new Error('JWT_SECRET environment variable is required');
}

function signToken(user) {
   return jwt.sign(
      { sub: user._id.toString(), email: user.email },
      JWT_SECRET,
      {
         expiresIn: '7d',
      },
   );
}

export async function signup(req, res) {
   const { name, email, password, profilePicture } = req.body;

   if (!name || !email || !password) {
      return res
         .status(400)
         .json({ message: 'Name, email and password are required' });
   }

   const existing = await User.findOne({ email: email.toLowerCase() });

   if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
   }

   const passwordHash = await bcrypt.hash(password, 10);
   const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      profilePicture: typeof profilePicture === 'string' ? profilePicture : '',
   });
   const token = signToken(user);

   return res.status(201).json({
      token,
      user: {
         id: user._id.toString(),
         name: user.name,
         email: user.email,
         profilePicture: user.profilePicture,
      },
   });
}

export async function login(req, res) {
   const { email, password } = req.body;

   if (!email || !password) {
      return res
         .status(400)
         .json({ message: 'Email and password are required' });
   }

   const user = await User.findOne({ email: email.toLowerCase() });

   if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
   }

   const ok = await bcrypt.compare(password, user.passwordHash);

   if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
   }

   const token = signToken(user);

   return res.json({
      token,
      user: {
         id: user._id.toString(),
         name: user.name,
         email: user.email,
         profilePicture: user.profilePicture,
      },
   });
}

export async function getUser(req, res) {
   const user = await User.findById(req.user.id).select(
      '_id name email profilePicture',
   );

   if (!user) {
      return res.status(404).json({ message: 'User not found' });
   }

   return res.json({
      user: {
         id: user._id.toString(),
         name: user.name,
         email: user.email,
         profilePicture: user.profilePicture,
      },
   });
}
