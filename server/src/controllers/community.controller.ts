import { Request, Response } from 'express';
import { CommunityService } from '../services/community.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.js';

/* 1. Lost & Found */
export const getLostFound = asyncHandler(async (req: Request, res: Response) => {
  const { category, type } = req.query;
  const items = await CommunityService.getLostFoundItems({
    category: category as string,
    type: type as string,
  });
  ApiResponse.success(res, { items }, 'Lost & found items retrieved');
});

export const createLostFound = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const { item, matches } = await CommunityService.createLostFoundItem(userId, req.body);
  ApiResponse.success(
    res,
    { item, matches },
    matches.length > 0
      ? `Item logged. Found ${matches.length} potential matching report(s)!`
      : 'Item posted to campus board.',
    201
  );
});

export const submitClaim = asyncHandler(async (req: AuthRequest, res: Response) => {
  const claimantId = req.user!._id.toString();
  const { proofDetails, proofImage } = req.body;
  const claim = await CommunityService.submitClaim(
    req.params.id,
    claimantId,
    proofDetails,
    proofImage
  );
  ApiResponse.success(res, { claim }, 'Claim submitted for verification', 201);
});

export const approveClaim = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reviewerId = req.user!._id.toString();
  const { approved } = req.body;
  const claim = await CommunityService.approveClaim(req.params.id, reviewerId, approved === true);
  ApiResponse.success(res, { claim }, `Claim ${approved ? 'approved' : 'rejected'}`);
});

/* 2. Clubs */
export const getClubs = asyncHandler(async (_req: Request, res: Response) => {
  const clubs = await CommunityService.getAllClubs();
  ApiResponse.success(res, { clubs }, 'Campus clubs retrieved');
});

export const joinClub = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const club = await CommunityService.joinClub(req.params.id, userId);
  ApiResponse.success(res, { club }, 'Joined club successfully (+25 activity points)');
});

export const leaveClub = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const club = await CommunityService.leaveClub(req.params.id, userId);
  ApiResponse.success(res, { club }, 'Left club');
});

export const getClubPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await CommunityService.getClubPosts(req.query.clubId as string);
  ApiResponse.success(res, { posts }, 'Club posts retrieved');
});

export const createClubPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const authorId = req.user!._id.toString();
  const post = await CommunityService.createClubPost(req.params.id, authorId, req.body);
  ApiResponse.success(res, { post }, 'Announcement published', 201);
});

/* 3. Resources */
export const getResources = asyncHandler(async (_req: Request, res: Response) => {
  const resources = await CommunityService.getAllResources();
  ApiResponse.success(res, { resources }, 'Resources retrieved');
});

export const getResourceRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, myOnly } = req.query;
  const userId = myOnly === 'true' && req.user ? req.user._id.toString() : undefined;
  const requests = await CommunityService.getResourceRequests({ status: status as string, userId });
  ApiResponse.success(res, { requests }, 'Resource checkout requests retrieved');
});

export const createResourceRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const request = await CommunityService.createResourceRequest(userId, req.body);
  ApiResponse.success(res, { request }, 'Resource request submitted', 201);
});

export const updateResourceStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reviewerId = req.user!._id.toString();
  const { status, comment } = req.body;
  const request = await CommunityService.updateRequestStatus(
    req.params.id,
    reviewerId,
    status,
    comment
  );
  ApiResponse.success(res, { request }, `Resource request marked as ${status}`);
});

/* 4. Attendance */
export const getCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const facultyId = req.user?.role === 'faculty' ? req.user._id.toString() : undefined;
  const courses = await CommunityService.getCourses(facultyId);
  ApiResponse.success(res, { courses }, 'Courses retrieved');
});

export const bulkMarkAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const facultyId = req.user!._id.toString();
  const { courseId, date, records } = req.body;
  const result = await CommunityService.bulkMarkAttendance(facultyId, courseId, date, records);
  ApiResponse.success(
    res,
    result,
    `Attendance recorded for ${result.savedCount} students. Dispatched ${result.warningsDispatched} low-attendance warning notice(s).`
  );
});

export const getStudentAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user!._id.toString();
  const records = await CommunityService.getStudentAttendance(studentId);
  ApiResponse.success(res, { records }, 'Student attendance records');
});

export const exportAttendanceCSV = asyncHandler(async (req: Request, res: Response) => {
  const csv = await CommunityService.exportAttendanceCSV(req.params.courseId);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=attendance-${req.params.courseId}.csv`
  );
  res.status(200).send(csv);
});
