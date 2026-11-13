import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IResource extends Document {
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  location: string;
  condition: 'new' | 'good' | 'maintenance';
  description?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    condition: {
      type: String,
      enum: ['new', 'good', 'maintenance'],
      default: 'good',
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Resource: Model<IResource> = mongoose.model<IResource>('Resource', ResourceSchema);
