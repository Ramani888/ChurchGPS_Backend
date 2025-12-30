import bcrypt from 'bcryptjs';
// Using dynamic import for nanoid
import slugify from 'slugify';
import { User } from '../../models/user.model';
import jwt from 'jsonwebtoken';
const env = process.env;

export const encryptPassword = (password: string) => {
    return new Promise((resolve) => {
      bcrypt.genSalt(5, function (err, salt) {
        if (err || !salt) {
          return resolve(undefined);
        }
        bcrypt.hash(password, salt, function (err, hash) {
          return resolve(hash);
        });
      });
    });
};

export const generateUniqueUsername = async (email: string) => {
  const prefix = slugify(email.split('@')[0], { lower: true, strict: true }).slice(0, 18) || 'user';
  
  // check existing usernames
  const regex = new RegExp(`^${prefix}(-?\\d*)?$`, 'i');
  const existing = await User.find({ username: regex }).select('username').lean();

  if (!existing.length) return prefix;

  const used = new Set(existing.map(u => u.username));
  for (let i = 1; i < 10000; i++) {
    const candidate = `${prefix}${i}`;
    if (!used.has(candidate)) return candidate;
  }

  // Dynamically import nanoid when needed
  const { nanoid } = await import('nanoid');
  // fallback → prefix + nanoid
  return `${prefix}${nanoid(6)}`;
}

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const comparePassword = (storedPassword: string, validatePassword: string): Promise<boolean> => {
  if (storedPassword === validatePassword) {
      return Promise.resolve(true);
  }
  return new Promise((resolve, reject) => {
    bcrypt.compare(storedPassword, validatePassword, (err: Error | null, result?: boolean) => {
      if (err) return reject(err);
      return result ? resolve(result) : reject(new Error('Passwords do not match.'));
    });
  });
};

export function authenticateToken(req: any, res: any, next: any) {
  const token = req.header('Authorization');
  const SECRET_KEY: any = env.SECRET_KEY;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = user;
    next();
  });
}

export const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const getDistanceMiles = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (value: number): number => (value * Math.PI) / 180;
  const R: number = 3958.8; // Earth radius in miles

  const dLat: number = toRad(lat2 - lat1);
  const dLon: number = toRad(lon2 - lon1);

  const a: number =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};