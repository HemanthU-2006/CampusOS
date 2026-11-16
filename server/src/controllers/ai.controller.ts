import { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const chatWithAI = asyncHandler(async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    ApiResponse.error(res, 'Message text is required', 400);
    return;
  }

  const reply = await AIService.chat(message.trim(), Array.isArray(history) ? history : []);
  ApiResponse.success(res, { reply }, 'AI response generated');
});

export const triageTicket = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, location } = req.body;

  if (!title || !location) {
    ApiResponse.error(res, 'Title and location are required for triage', 400);
    return;
  }

  const result = await AIService.triageTicket(
    title,
    description || title,
    location
  );

  ApiResponse.success(res, result, 'Ticket triaged successfully');
});
