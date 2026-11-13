import mongoose, { Document, Schema, Model } from 'mongoose';

export type UserRole = 'student' | 'faculty' | 'club_head' | 'maintenance' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department?: string;
  rollNumber?: string;
  phone?: string;
  activityPoints: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'club_head', 'maintenance', 'admin'],
      default: 'student',
      index: true,
    },
    department: {
      type: String,
      trim: true,
      default: 'General',
    },
    rollNumber: {
      type: String,
      trim: true,
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    activityPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Never expose password in toJSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
