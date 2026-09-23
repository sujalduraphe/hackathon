import { Router } from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../middleware/auth.js';
import { ah } from '../utils/http.js';
import * as auth from '../controllers/authController.js';
import * as students from '../controllers/studentController.js';
import * as jobs from '../controllers/jobController.js';
import * as applications from '../controllers/applicationController.js';
import * as assessments from '../controllers/assessmentController.js';
import * as analytics from '../controllers/analyticsController.js';
import * as programs from '../controllers/programController.js';
import * as market from '../controllers/marketController.js';

const r = Router();

// resumes are kept in memory, then stored in MongoDB; PDF only, max 2 MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype === 'application/pdf'),
});

// Auth
r.post('/auth/register', ah(auth.register));
r.post('/auth/login', ah(auth.login));
r.get('/auth/me', authenticate, ah(auth.me));
r.get('/auth/providers', auth.providers);
r.post('/auth/google', ah(auth.google));
r.post('/auth/social/complete', ah(auth.completeSocialSignup));
r.get('/auth/linkedin/start', ah(auth.linkedinStart));
r.get('/auth/linkedin/callback', ah(auth.linkedinCallback));

// Students / talent pool
r.get('/students/me', authenticate, authorize('student'), ah(students.myProfile));
r.get('/students', authenticate, authorize('industry', 'institution'), ah(students.listStudents));
r.post('/students/me/resume', authenticate, authorize('student'), upload.single('resume'), ah(students.uploadResume));
r.delete('/students/me/resume', authenticate, authorize('student'), ah(students.deleteResume));
r.get('/students/:id/resume', authenticate, ah(students.downloadResume));
r.post('/students/me/skills', authenticate, authorize('student'), ah(students.addSkills));
r.post('/students/me/portfolio/:kind', authenticate, authorize('student'), ah(students.addPortfolioItem));
r.delete('/students/me/portfolio/:kind/:itemId', authenticate, authorize('student'), ah(students.removePortfolioItem));
r.patch('/students/:id/portfolio/:kind/:itemId', authenticate, authorize('institution'), ah(students.verifyPortfolioItem));

// Jobs
r.get('/jobs', authenticate, ah(jobs.listJobs));
r.post('/jobs', authenticate, authorize('industry'), ah(jobs.createJob));
r.post('/jobs/extract-skills', authenticate, authorize('industry'), ah(jobs.extractFromDescription));
r.get('/jobs/:id/candidates', authenticate, authorize('industry'), ah(jobs.rankedCandidates));

// Applications
r.get('/applications', authenticate, ah(applications.listApplications));
r.post('/applications', authenticate, authorize('student'), ah(applications.apply));
r.patch('/applications/:id', authenticate, authorize('industry'), ah(applications.updateStatus));

// Assessments
r.get('/assessments', authenticate, authorize('student'), ah(assessments.mine));
r.post('/assessments', authenticate, authorize('student'), ah(assessments.submit));

// Programs: training, workshops, mentorship, challenges, live projects, FDPs,
// industrial training, faculty internships, consultancy, research, guest lectures
r.get('/programs', authenticate, ah(programs.listPrograms));
r.post('/programs', authenticate, authorize('industry'), ah(programs.createProgram));
r.delete('/programs/:id', authenticate, authorize('industry'), ah(programs.deleteProgram));
r.post('/programs/:id/register', authenticate, authorize('student', 'faculty'), ah(programs.register));
r.get('/programs/:id/registrations', authenticate, authorize('industry'), ah(programs.programRegistrations));
r.get('/registrations', authenticate, authorize('student', 'faculty'), ah(programs.myRegistrations));
r.patch('/registrations/:id', authenticate, authorize('industry'), ah(programs.decide));

// Market demand from imported real-world job descriptions (e.g. Glassdoor exports)
const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /csv|text|excel/.test(file.mimetype) || file.originalname.toLowerCase().endsWith('.csv')),
});
r.get('/market/summary', authenticate, ah(market.summary));
r.post('/market/import', authenticate, authorize('institution'), csvUpload.single('file'), ah(market.importCSV));
r.delete('/market/batches/:batch', authenticate, authorize('institution'), ah(market.deleteBatch));

// Institution analytics
r.get('/analytics/institution', authenticate, authorize('institution'), ah(analytics.institutionOverview));

export default r;
