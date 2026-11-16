import { Router } from 'express';
import { chatWithAI, triageTicket } from '../controllers/ai.controller.js';

const router = Router();

// Chat with campus virtual assistant
router.post('/chat', chatWithAI);

// Auto-triage maintenance issues
router.post('/triage', triageTicket);

export default router;
