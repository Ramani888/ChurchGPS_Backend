import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
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

  // fallback → prefix + nanoid
  return `${prefix}${nanoid(6)}`;
}