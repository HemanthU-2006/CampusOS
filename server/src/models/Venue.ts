import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IVenue extends Document {
  name: string;
  code: string;
  capacity: number;
  building: string;
  floor: number;
  amenities: string[];
  isAvailable: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VenueSchema = new Schema<IVenue>(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    building: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: Number,
      default: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Venue: Model<IVenue> = mongoose.model<IVenue>('Venue', VenueSchema);
