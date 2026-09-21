import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
} from '../controllers/notificationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/notifications
router.get('/', authenticate, getNotifications);

// PUT /api/notifications/read-all
router.put('/read-all', authenticate, markAllAsRead);

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticate, markAsRead);

// DELETE /api/notifications/:id
router.delete('/:id', authenticate, deleteNotification);

// POST /api/notifications — system/admin use
router.post('/', authenticate, authorize('institution'), createNotification);

export default router;
