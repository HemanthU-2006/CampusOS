import mongoose, { Document, Schema, Model } from 'mongoose';

export type RegistrationStatus = 'registered' | 'waitlisted' | 'cancelled' | 'attended';

export interface IEventRegistration extends Document {
  event: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  status: RegistrationStatus;
  ticketCode: string;
  waitlistPosition?: number;
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['registered', 'waitlisted', 'cancelled', 'attended'],
      default: 'registered',
      index: true,
    },
    ticketCode: {
      type: String,
      required: true,
      unique: true,
    },
    waitlistPosition: {
      type: Number,
    },
    checkedInAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// One registration per user per event
EventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

export const EventRegistration: Model<IEventRegistration> = mongoose.model<IEventRegistration>(
  'EventRegistration',
  EventRegistrationSchema
);
