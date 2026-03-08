const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private (Admin)
exports.getAllJobs = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const jobs = await Job.find().populate('createdBy', 'name email role');
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
});

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
exports.deleteJob = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
    }
    await job.deleteOne();
    res.status(200).json({ success: true, message: 'Job deleted' });
});

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getPlatformStats = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const [totalUsers, totalJobs, totalApplications] = await Promise.all([
        User.countDocuments(),
        Job.countDocuments(),
        Application.countDocuments()
    ]);

    res.status(200).json({
        success: true,
        data: {
            totalUsers,
            totalJobs,
            totalApplications
        }
    });
});
