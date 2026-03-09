const express = require('express');
const { createJob, getAllJobs, getEmployerDashboardStats, getMyJobs, getJobById } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/jobs/my
// @access  Private (Employer)
router.get('/my', protect, getMyJobs);

// @route   GET /api/jobs/employer/dashboard
// @access  Private (Employer)
router.get('/employer/dashboard', protect, getEmployerDashboardStats);

// @route   GET /api/jobs/stats
// @access  Private (Employer)
router.get('/stats', protect, getEmployerDashboardStats);

// @route   POST /api/jobs
// @access  Private (Employer)
router.post('/', protect, createJob);

// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', getJobById);

// @route   GET /api/jobs
// @access  Public
router.get('/', getAllJobs);

module.exports = router;
