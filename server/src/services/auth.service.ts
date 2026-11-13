import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  department?: string;
  rollNumber?: string;
  phone?: string;
}

export class AuthService {
  static generateToken(user: IUser): string {
    return jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  static async register(data: RegisterDTO): Promise<{ user: IUser; token: string }> {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new AppError('An account with this email already exists', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  static async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  static async getCurrentUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}
