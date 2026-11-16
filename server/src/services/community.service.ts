import mongoose from 'mongoose';
import { LostFoundItem, ILostFoundItem } from '../models/LostFoundItem.js';
import { ClaimRequest, IClaimRequest } from '../models/ClaimRequest.js';
import { Club, IClub } from '../models/Club.js';
import { ClubPost, IClubPost } from '../models/ClubPost.js';
import { Resource, IResource } from '../models/Resource.js';
import { ResourceRequest, IResourceRequest } from '../models/ResourceRequest.js';
import { Course, ICourse } from '../models/Course.js';
import { AttendanceRecord, IAttendanceRecord } from '../models/AttendanceRecord.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { AppError } from '../utils/AppError.js';

export class CommunityService {
  /* ============================================================
     1. LOST & FOUND
     ============================================================ */
  static async getLostFoundItems(query: {
    category?: string;
    type?: string;
  }): Promise<ILostFoundItem[]> {
    const filter: Record<string, unknown> = {};
    if (query.category) filter.category = query.category;
    if (query.type) filter.type = query.type;
    return LostFoundItem.find(filter)
      .populate('reportedBy', 'name email role')
      .sort({ dateReported: -1 });
  }

  static async createLostFoundItem(
    userId: string,
    data: any
  ): Promise<{ item: ILostFoundItem; matches: ILostFoundItem[] }> {
    const item = await LostFoundItem.create({
      ...data,
      reportedBy: userId,
      status: 'open',
    });

    // Match suggestions: find opposite type (lost <-> found) with same category or matching tags/keywords
    const oppositeType = item.type === 'lost' ? 'found' : 'lost';
    const matches = await LostFoundItem.find({
      _id: { $ne: item._id },
      type: oppositeType,
      status: 'open',
      $or: [{ category: item.category }, { tags: { $in: item.tags } }],
    }).limit(5);

    return { item, matches };
  }

  static async submitClaim(
    itemId: string,
    claimantId: string,
    proofDetails: string,
    proofImage?: string
  ): Promise<IClaimRequest> {
    const item = await LostFoundItem.findById(itemId);
    if (!item) throw new AppError('Item not found', 404);

    const claim = await ClaimRequest.create({
      item: itemId,
      claimant: claimantId,
      proofDetails,
      proofImage,
      status: 'pending',
    });

    item.status = 'claimed';
    await item.save();

    // Notify item reporter
    await Notification.create({
      user: item.reportedBy,
      title: 'Claim Request Submitted on Your Post',
      message: `Someone submitted a claim for '${item.title}'. Please review the proof.`,
      type: 'claim_update',
      link: '/lost-found',
    });

    return claim.populate('claimant', 'name email role');
  }

  static async approveClaim(
    claimId: string,
    reviewerId: string,
    approved: boolean
  ): Promise<IClaimRequest> {
    const claim = await ClaimRequest.findById(claimId).populate('item');
    if (!claim) throw new AppError('Claim not found', 404);

    const item = await LostFoundItem.findById(claim.item);
    if (!item) throw new AppError('Associated item not found', 404);

    if (approved) {
      claim.status = 'approved';
      claim.reviewedBy = new mongoose.Types.ObjectId(reviewerId);
      item.status = 'resolved';
      item.resolvedWithClaim = claim._id as mongoose.Types.ObjectId;
      await Promise.all([claim.save(), item.save()]);

      // Notify claimant
      await Notification.create({
        user: claim.claimant,
        title: 'Claim Approved! Item Resolved',
        message: `Your claim for '${item.title}' was approved. Please coordinate pickup.`,
        type: 'claim_update',
        link: '/lost-found',
      });
    } else {
      claim.status = 'rejected';
      item.status = 'open'; // Re-open
      await Promise.all([claim.save(), item.save()]);

      await Notification.create({
        user: claim.claimant,
        title: 'Claim Request Rejected',
        message: `Your claim for '${item.title}' could not be verified.`,
        type: 'claim_update',
        link: '/lost-found',
      });
    }

    return claim;
  }

  /* ============================================================
     2. CLUBS
     ============================================================ */
  static async getAllClubs(): Promise<IClub[]> {
    return Club.find({ isActive: true })
      .populate('lead', 'name email role')
      .populate('members', 'name email role')
      .sort({ name: 1 });
  }

  static async joinClub(clubId: string, userId: string): Promise<IClub> {
    const club = await Club.findById(clubId);
    if (!club) throw new AppError('Club not found', 404);

    const isMember = club.members.some((m) => m.toString() === userId);
    if (isMember) throw new AppError('Already a member of this club', 400);

    club.members.push(new mongoose.Types.ObjectId(userId));
    await club.save();

    // Participation adds activity points to user
    await User.findByIdAndUpdate(userId, { $inc: { activityPoints: 25 } });

    await Notification.create({
      user: userId,
      title: 'Joined Club (+25 Activity Points)',
      message: `Welcome to ${club.name}! Activity points credited.`,
      type: 'system',
      link: '/clubs',
    });

    return club;
  }

  static async leaveClub(clubId: string, userId: string): Promise<IClub> {
    const club = await Club.findById(clubId);
    if (!club) throw new AppError('Club not found', 404);

    club.members = club.members.filter((m) => m.toString() !== userId);
    await club.save();
    return club;
  }

  static async getClubPosts(clubId?: string): Promise<IClubPost[]> {
    const filter = clubId ? { club: clubId } : {};
    return ClubPost.find(filter)
      .populate('club', 'name code category')
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
  }

  static async createClubPost(clubId: string, authorId: string, data: any): Promise<IClubPost> {
    const club = await Club.findById(clubId);
    if (!club) throw new AppError('Club not found', 404);

    const post = await ClubPost.create({
      club: clubId,
      author: authorId,
      title: data.title,
      content: data.content,
      attachments: data.attachments || [],
    });

    // Notify club members
    for (const memberId of club.members) {
      if (memberId.toString() !== authorId) {
        await Notification.create({
          user: memberId,
          title: `New Post in ${club.name}`,
          message: post.title,
          type: 'event_update',
          link: '/clubs',
        });
      }
    }

    return post.populate([
      { path: 'club', select: 'name code' },
      { path: 'author', select: 'name email role' },
    ]);
  }

  /* ============================================================
     3. RESOURCES (Hardware & Labs)
     ============================================================ */
  static async getAllResources(): Promise<IResource[]> {
    return Resource.find().sort({ name: 1 });
  }

  static async getResourceRequests(query: {
    status?: string;
    userId?: string;
  }): Promise<IResourceRequest[]> {
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.userId) filter.user = query.userId;

    return ResourceRequest.find(filter)
      .populate('resource', 'name category totalQuantity availableQuantity location')
      .populate('user', 'name email role department')
      .sort({ createdAt: -1 });
  }

  static async createResourceRequest(userId: string, data: any): Promise<IResourceRequest> {
    const resource = await Resource.findById(data.resourceId);
    if (!resource) throw new AppError('Resource not found', 404);

    // Available quantity check
    if (resource.availableQuantity < data.quantity) {
      throw new AppError(
        `Insufficient quantity. Only ${resource.availableQuantity} unit(s) available currently.`,
        400
      );
    }

    const request = await ResourceRequest.create({
      resource: data.resourceId,
      user: userId,
      quantity: data.quantity,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      purpose: data.purpose,
      status: 'requested',
    });

    return request.populate([
      { path: 'resource', select: 'name category location' },
      { path: 'user', select: 'name email role' },
    ]);
  }

  static async updateRequestStatus(
    requestId: string,
    reviewerId: string,
    status: 'approved' | 'issued' | 'returned' | 'overdue' | 'rejected',
    comment?: string
  ): Promise<IResourceRequest> {
    const request = await ResourceRequest.findById(requestId).populate('resource');
    if (!request) throw new AppError('Resource request not found', 404);

    const resource = await Resource.findById(request.resource);
    if (!resource) throw new AppError('Associated resource not found', 404);

    const previousStatus = request.status;
    request.status = status;
    request.reviewedBy = new mongoose.Types.ObjectId(reviewerId);
    if (comment) request.reviewComment = comment;

    // Available quantity updates at each step:
    // When issued: availableQuantity decreases
    // When returned: availableQuantity increases
    if (status === 'issued' && previousStatus !== 'issued') {
      if (resource.availableQuantity < request.quantity) {
        throw new AppError('Cannot issue: requested quantity no longer available', 400);
      }
      resource.availableQuantity -= request.quantity;
      request.issuedAt = new Date();
    } else if (
      status === 'returned' &&
      (previousStatus === 'issued' || previousStatus === 'overdue')
    ) {
      resource.availableQuantity = Math.min(
        resource.totalQuantity,
        resource.availableQuantity + request.quantity
      );
      request.returnedAt = new Date();
    }

    await Promise.all([request.save(), resource.save()]);

    // Send notification
    await Notification.create({
      user: request.user,
      title: `Resource Request ${status.toUpperCase()}`,
      message: `Your request for ${resource.name} (x${request.quantity}) is now marked as ${status}.`,
      type: 'resource_status',
      link: '/resources',
    });

    return request;
  }

  /* ============================================================
     4. ATTENDANCE
     ============================================================ */
  static async getCourses(facultyId?: string): Promise<ICourse[]> {
    const filter = facultyId ? { faculty: facultyId } : {};
    return Course.find(filter)
      .populate('faculty', 'name email department')
      .populate('enrolledStudents', 'name email rollNumber department')
      .sort({ code: 1 });
  }

  static async bulkMarkAttendance(
    facultyId: string,
    courseId: string,
    dateString: string,
    records: {
      studentId: string;
      status: 'present' | 'absent' | 'late' | 'excused';
      remarks?: string;
    }[]
  ): Promise<{ savedCount: number; warningsDispatched: number }> {
    const course = await Course.findById(courseId);
    if (!course) throw new AppError('Course not found', 404);

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    let savedCount = 0;
    let warningsDispatched = 0;

    for (const rec of records) {
      // Upsert unique record on (course + date + student)
      await AttendanceRecord.findOneAndUpdate(
        { course: courseId, date, student: rec.studentId },
        {
          course: courseId,
          student: rec.studentId,
          date,
          status: rec.status,
          markedBy: facultyId,
          remarks: rec.remarks,
        },
        { upsert: true, new: true }
      );
      savedCount++;

      // Compute student percentage via aggregation
      const stats = await AttendanceRecord.aggregate([
        {
          $match: {
            course: new mongoose.Types.ObjectId(courseId),
            student: new mongoose.Types.ObjectId(rec.studentId),
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            present: {
              $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] },
            },
          },
        },
      ]);

      if (stats.length > 0 && stats[0].total >= 3) {
        const percentage = Math.round((stats[0].present / stats[0].total) * 100);
        // Low attendance trigger (<75%)
        if (percentage < 75) {
          warningsDispatched++;
          await Notification.create({
            user: rec.studentId,
            title: `Low Attendance Warning: ${course.code} (${percentage}%)`,
            message: `Your current attendance in ${course.name} is ${percentage}%, which is below the mandatory 75% requirement.`,
            type: 'attendance_warning',
            link: '/attendance',
          });
        }
      }
    }

    return { savedCount, warningsDispatched };
  }

  static async getStudentAttendance(studentId: string): Promise<any[]> {
    return AttendanceRecord.find({ student: studentId })
      .populate('course', 'name code department semester')
      .sort({ date: -1 });
  }

  static async exportAttendanceCSV(courseId: string): Promise<string> {
    const course = await Course.findById(courseId);
    if (!course) throw new AppError('Course not found', 404);

    const records = await AttendanceRecord.find({ course: courseId })
      .populate('student', 'name rollNumber email')
      .sort({ date: 1 });

    let csv = 'Course Code,Course Name,Student Name,Roll Number,Date,Status,Remarks\n';
    for (const r of records) {
      const student = r.student as any;
      csv += `"${course.code}","${course.name}","${student?.name || ''}","${student?.rollNumber || ''}","${r.date.toISOString().split('T')[0]}","${r.status}","${r.remarks || ''}"\n`;
    }
    return csv;
  }
}
