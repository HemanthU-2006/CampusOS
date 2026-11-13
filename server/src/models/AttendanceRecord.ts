import mongoose, { Document, Schema, Model } from 'mongoose';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface IAttendanceRecord extends Document {
  course: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  date: Date; // Normalized to YYYY-MM-DD
  status: AttendanceStatus;
  markedBy: mongoose.Types.ObjectId; // Faculty
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      default: 'present',
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Unique compound index on course + date + student
AttendanceRecordSchema.index({ course: 1, date: 1, student: 1 }, { unique: true });

export const AttendanceRecord: Model<IAttendanceRecord> = mongoose.model<IAttendanceRecord>(
  'AttendanceRecord',
  AttendanceRecordSchema
);
