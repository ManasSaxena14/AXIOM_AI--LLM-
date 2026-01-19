import express from 'express';
import { getDashboardStats } from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);

export default router;
