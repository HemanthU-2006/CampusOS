import mongoose, { Document, Schema, Model } from 'mongoose';

export type LostFoundType = 'lost' | 'found';
export type LostFoundStatus = 'open' | 'claimed' | 'resolved';

export interface ILostFoundItem extends Document {
  title: string;
  description: string;
  category: string;
  type: LostFoundType;
  status: LostFoundStatus;
  location: string;
  dateReported: Date;
  reportedBy: mongoose.Types.ObjectId; // User
  image?: string;
  tags: string[];
  resolvedWithClaim?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LostFoundItemSchema = new Schema<ILostFoundItem>(
  {
    title: {
      type: String,
      required: true,
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
      index: true,
    },
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'claimed', 'resolved'],
      default: 'open',
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    dateReported: {
      type: Date,
      default: Date.now,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    image: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    resolvedWithClaim: {
      type: Schema.Types.ObjectId,
      ref: 'ClaimRequest',
    },
  },
  { timestamps: true }
);

// Text index for search & match suggestions
LostFoundItemSchema.index({ title: 'text', description: 'text', location: 'text', tags: 'text' });

export const LostFoundItem: Model<ILostFoundItem> = mongoose.model<ILostFoundItem>(
  'LostFoundItem',
  LostFoundItemSchema
);
