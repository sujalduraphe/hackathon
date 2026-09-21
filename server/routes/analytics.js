import { Router } from 'express';
import {
  getInstitutionAnalytics,
  getIndustryAnalytics,
  getSkillDemand,
} from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/analytics/institution — institution placement + skill dashboard
router.get('/institution', authenticate, authorize('institution'), getInstitutionAnalytics);

// GET /api/analytics/industry — industry recruitment pipeline
router.get('/industry', authenticate, authorize('industry'), getIndustryAnalytics);

// GET /api/analytics/skill-demand — public skill demand data
router.get('/skill-demand', getSkillDemand);

export default router;
