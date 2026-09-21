import { Router } from 'express';
import {
  getPortfolio,
  updatePortfolio,
  addCertification,
  addProject,
  removeCertification,
} from '../controllers/portfolioController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/portfolio/:studentId — public (for shared portfolios)
router.get('/:studentId', optionalAuth, getPortfolio);

// PUT /api/portfolio/:studentId — update entire portfolio
router.put('/:studentId', authenticate, authorize('student'), updatePortfolio);

// POST /api/portfolio/:studentId/certifications
router.post('/:studentId/certifications', authenticate, authorize('student'), addCertification);

// POST /api/portfolio/:studentId/projects
router.post('/:studentId/projects', authenticate, authorize('student'), addProject);

// DELETE /api/portfolio/:studentId/certifications/:certId
router.delete('/:studentId/certifications/:certId', authenticate, authorize('student'), removeCertification);

export default router;
