import mongoose, { Document, Schema, Model } from 'mongoose';

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface IClaimRequest extends Document {
  item: mongoose.Types.ObjectId;
  claimant: mongoose.Types.ObjectId; // User claiming
  proofDetails: string;
  proofImage?: string;
  status: ClaimStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewComment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClaimRequestSchema = new Schema<IClaimRequest>(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: 'LostFoundItem',
      required: true,
      index: true,
    },
    claimant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    proofDetails: {
      type: String,
      required: true,
      trim: true,
    },
    proofImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewComment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const ClaimRequest: Model<IClaimRequest> = mongoose.model<IClaimRequest>(
  'ClaimRequest',
  ClaimRequestSchema
);
