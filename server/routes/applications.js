import { Router } from 'express';
import { body } from 'express-validator';
import {
  applyToJob,
  listApplications,
  updateApplicationStatus,
  withdrawApplication,
} from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// GET /api/applications — role-filtered
router.get('/', authenticate, listApplications);

// POST /api/applications — apply to a job
router.post('/', authenticate, authorize('student'), [
  body('jobId').notEmpty().withMessage('Job ID is required'),
  validate,
], applyToJob);

// PUT /api/applications/:id/status — update status (industry)
router.put('/:id/status', authenticate, authorize('industry'), [
  body('status').isIn(['applied', 'assessment', 'shortlisted', 'interview', 'offered', 'rejected'])
    .withMessage('Invalid status'),
  validate,
], updateApplicationStatus);

// DELETE /api/applications/:id — withdraw (student)
router.delete('/:id', authenticate, authorize('student'), withdrawApplication);

export default router;
