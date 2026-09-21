import { Router } from 'express';
import {
  listStudents,
  getStudent,
  updateSkills,
  getStudentApplications,
  getStudentAssessments,
  getStudentDashboard,
} from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/students — industry & institution can list students
router.get('/', authenticate, authorize('industry', 'institution'), listStudents);

// GET /api/students/me/dashboard — logged-in student's dashboard
router.get('/me/dashboard', authenticate, authorize('student'), getStudentDashboard);

// GET /api/students/:id
router.get('/:id', authenticate, getStudent);

// PUT /api/students/:id/skills
router.put('/:id/skills', authenticate, authorize('student'), updateSkills);

// GET /api/students/:id/applications
router.get('/:id/applications', authenticate, getStudentApplications);

// GET /api/students/:id/assessments
router.get('/:id/assessments', authenticate, getStudentAssessments);

export default router;
