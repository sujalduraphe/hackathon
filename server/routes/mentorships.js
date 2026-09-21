import { Router } from 'express';
import { body } from 'express-validator';
import {
  listMentorships,
  requestMentorship,
  updateMentorshipStatus,
  listMentors,
} from '../controllers/mentorshipController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// GET /api/mentorships — role-filtered list
router.get('/', authenticate, listMentorships);

// GET /api/mentorships/mentors — available mentors (faculty + industry)
router.get('/mentors', authenticate, authorize('student'), listMentors);

// POST /api/mentorships — student requests mentorship
router.post('/', authenticate, authorize('student'), [
  body('mentorId').notEmpty().withMessage('Mentor ID is required'),
  validate,
], requestMentorship);

// PUT /api/mentorships/:id/status — mentor responds
router.put('/:id/status', authenticate, authorize('faculty', 'industry'), [
  body('status').isIn(['accepted', 'rejected', 'completed']).withMessage('Invalid status'),
  validate,
], updateMentorshipStatus);

export default router;
