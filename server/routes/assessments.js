import { Router } from 'express';
import { body } from 'express-validator';
import {
  getQuestions,
  submitAssessment,
  getMyAssessments,
  getAssessmentResult,
} from '../controllers/assessmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// GET /api/assessments/questions?category=Core CS
router.get('/questions', getQuestions);

// GET /api/assessments/my
router.get('/my', authenticate, authorize('student'), getMyAssessments);

// POST /api/assessments/submit
router.post('/submit', authenticate, authorize('student'), [
  body('category').notEmpty().withMessage('Category is required'),
  body('answers').isObject().withMessage('Answers must be an object'),
  validate,
], submitAssessment);

// GET /api/assessments/:id
router.get('/:id', authenticate, getAssessmentResult);

export default router;
