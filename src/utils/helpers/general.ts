import bcrypt from 'bcryptjs';
// Using dynamic import for nanoid
import slugify from 'slugify';
import { User } from '../../models/user.model';

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