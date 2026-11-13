import mongoose, { Document, Schema, Model } from 'mongoose';

export type EventStatus = 'draft' | 'published' | 'completed' | 'cancelled';

export interface IEvent extends Document {
  title: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  club?: mongoose.Types.ObjectId;
  venue: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  status: EventStatus;
  bannerImage?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
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
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
    },
    venue: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    waitlistCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'completed', 'cancelled'],
      default: 'draft',
      index: true,
    },
    bannerImage: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> = mongoose.model<IEvent>('Event', EventSchema);
