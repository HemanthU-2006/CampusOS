import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IClubPost extends Document {
  club: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  title: string;
  content: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ClubPostSchema = new Schema<IClubPost>(
  {
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const ClubPost: Model<IClubPost> = mongoose.model<IClubPost>('ClubPost', ClubPostSchema);
