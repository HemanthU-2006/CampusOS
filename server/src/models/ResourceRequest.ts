import mongoose, { Document, Schema, Model } from 'mongoose';

export type ResourceRequestStatus =
  | 'requested'
  | 'approved'
  | 'issued'
  | 'returned'
  | 'overdue'
  | 'rejected';

export interface IResourceRequest extends Document {
  resource: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  quantity: number;
  startDate: Date;
  endDate: Date;
  status: ResourceRequestStatus;
  purpose: string;
  reviewedBy?: mongoose.Types.ObjectId;
  issuedAt?: Date;
  returnedAt?: Date;
  reviewComment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceRequestSchema = new Schema<IResourceRequest>(
  {
    resource: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['requested', 'approved', 'issued', 'returned', 'overdue', 'rejected'],
      default: 'requested',
      index: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    issuedAt: {
      type: Date,
    },
    returnedAt: {
      type: Date,
    },
    reviewComment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const ResourceRequest: Model<IResourceRequest> = mongoose.model<IResourceRequest>(
  'ResourceRequest',
  ResourceRequestSchema
);
