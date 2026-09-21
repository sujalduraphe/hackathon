import { Router } from 'express';
import {
  listPrograms,
  createProgram,
  getProgram,
  registerForProgram,
  cancelRegistration,
  getMyPrograms,
  getFacultyDashboard,
} from '../controllers/facultyProgramController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/faculty-programs — public listing (with optional auth for registration status)
router.get('/', optionalAuth, listPrograms);

// GET /api/faculty-programs/dashboard — faculty dashboard
router.get('/dashboard', authenticate, authorize('faculty'), getFacultyDashboard);

// GET /api/faculty-programs/my — faculty's registered programs
router.get('/my', authenticate, authorize('faculty'), getMyPrograms);

// GET /api/faculty-programs/:id
router.get('/:id', getProgram);

// POST /api/faculty-programs — industry posts a program
router.post('/', authenticate, authorize('industry'), createProgram);

// POST /api/faculty-programs/:id/register — faculty registers
router.post('/:id/register', authenticate, authorize('faculty'), registerForProgram);

// DELETE /api/faculty-programs/:id/register — cancel registration
router.delete('/:id/register', authenticate, authorize('faculty'), cancelRegistration);

export default router;
