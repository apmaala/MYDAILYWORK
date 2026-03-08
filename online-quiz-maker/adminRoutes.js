const express = require('express');
const {
    getAllUsers,
    getAllJobs,
    deleteUser,
    deleteJob,
    getPlatformStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes and restrict to Admin only
router.use(protect);
router.use(authorize('Admin'));

// @route   GET /api/admin/users
router.get('/users', getAllUsers);

// @route   GET /api/admin/jobs
router.get('/jobs', getAllJobs);

// @route   DELETE /api/admin/user/:id
router.delete('/user/:id', deleteUser);

// @route   DELETE /api/admin/job/:id
router.delete('/job/:id', deleteJob);

// @route   GET /api/admin/stats
router.get('/stats', getPlatformStats);

module.exports = router;
