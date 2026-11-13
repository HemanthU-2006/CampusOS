import mongoose, { Document, Schema, Model } from 'mongoose';

export type TicketStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface IMaintenanceComment {
  author: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IMaintenanceTicket extends Document {
  title: string;
  description: string;
  category: 'electrical' | 'plumbing' | 'furniture' | 'hvac' | 'it_hardware' | 'cleaning' | 'other';
  priority: TicketPriority;
  status: TicketStatus;
  location: string;
  reportedBy: mongoose.Types.ObjectId; // Student / staff
  assignedTo?: mongoose.Types.ObjectId; // Maintenance staff
  photos: string[];
  comments: IMaintenanceComment[];
  resolutionNotes?: string;
  resolvedAt?: Date;
  rating?: number; // 1-5 rating given by student
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceTicketSchema = new Schema<IMaintenanceTicket>(
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
      enum: ['electrical', 'plumbing', 'furniture', 'hvac', 'it_hardware', 'cleaning', 'other'],
      default: 'other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    comments: [
      {
        author: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resolutionNotes: {
      type: String,
      trim: true,
    },
    resolvedAt: {
      type: Date,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const MaintenanceTicket: Model<IMaintenanceTicket> = mongoose.model<IMaintenanceTicket>(
  'MaintenanceTicket',
  MaintenanceTicketSchema
);
