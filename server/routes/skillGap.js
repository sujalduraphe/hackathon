import { Router } from 'express';
import {
  getSkillGap,
  getRecommendations,
  getIndustryDemand,
} from '../controllers/skillGapController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/skill-gap — compute gaps for logged-in student (or specify studentId for institution)
router.get('/', authenticate, getSkillGap);

// GET /api/skill-gap/recommendations — personalized learning path
router.get('/recommendations', authenticate, getRecommendations);

// GET /api/skill-gap/industry-demand — public skill demand scores
router.get('/industry-demand', getIndustryDemand);

export default router;
