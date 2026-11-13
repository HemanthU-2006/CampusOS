import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IClub extends Document {
  name: string;
  code: string;
  description: string;
  category: string;
  lead: mongoose.Types.ObjectId; // User (club_head)
  members: mongoose.Types.ObjectId[];
  logo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClubSchema = new Schema<IClub>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    lead: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    logo: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Club: Model<IClub> = mongoose.model<IClub>('Club', ClubSchema);
