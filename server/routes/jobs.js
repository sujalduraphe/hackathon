import { Router } from 'express';
import { body } from 'express-validator';
import {
  listJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
  getMyJobs,
  getJobCandidates,
} from '../controllers/jobController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// GET /api/jobs — public with optional auth (match scoring for students)
router.get('/', optionalAuth, listJobs);

// GET /api/jobs/my — industry user's posted jobs
router.get('/my', authenticate, authorize('industry'), getMyJobs);

// GET /api/jobs/:id
router.get('/:id', optionalAuth, getJob);

// GET /api/jobs/:id/candidates
router.get('/:id/candidates', authenticate, authorize('industry'), getJobCandidates);

// POST /api/jobs
router.post('/', authenticate, authorize('industry'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('type').notEmpty().withMessage('Type is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('deadline').isISO8601().withMessage('Valid deadline date required'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  validate,
], createJob);

// PUT /api/jobs/:id
router.put('/:id', authenticate, authorize('industry'), updateJob);

// DELETE /api/jobs/:id
router.delete('/:id', authenticate, authorize('industry'), deleteJob);

export default router;
