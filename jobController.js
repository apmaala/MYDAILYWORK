const Job = require('../models/Job');
const Application = require('../models/Application');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer only)
exports.createJob = asyncHandler(async (req, res, next) => {
    // Only allow Employers to create jobs
    if (req.user.role !== 'Employer' && req.user.role !== 'Admin') {
        return res.status(403).json({
            success: false,
            message: 'Only Employers or Admins can post a job'
        });
    }

    // Add user to req.body
    req.body.createdBy = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
        success: true,
        data: job
    });
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = asyncHandler(async (req, res, next) => {
    const { title, location, jobType } = req.query;
    let query = {};

    // Search by title (regex for partial match, case-insensitive)
    if (title) {
        query.title = { $regex: title, $options: 'i' };
    }

    // Filter by location
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }

    // Filter by jobType
    if (jobType) {
        query.jobType = jobType;
    }

    const jobs = await Job.find(query).populate('createdBy', 'name company');

    res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
    });
});

// @desc    Get dashboard stats for Employer
// @route   GET /api/jobs/dashboard/stats
// @access  Private (Employer)
exports.getEmployerDashboardStats = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'Employer' && req.user.role !== 'Admin') {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized access to dashboard stats'
        });
    }

    const employerId = req.user.id;

    // 1. Total jobs created by this employer
    const totalJobs = await Job.countDocuments({ createdBy: employerId });

    // 2. Get all job IDs created by this employer
    const employerJobs = await Job.find({ createdBy: employerId }).select('_id');
    const jobIds = employerJobs.map(job => job._id);

    // 3. Total applications for these jobs
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });

    // 4. Group applications by month
    const applicationsPerMonth = await Application.aggregate([
        {
            $match: { job: { $in: jobIds } }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 }
        }
    ]);

    res.status(200).json({
        success: true,
        data: {
            totalJobs,
            totalApplications,
            applicationsPerMonth
        }
    });
});
// @desc    Get jobs posted by the logged-in employer
// @route   GET /api/jobs/my
// @access  Private (Employer)
exports.getMyJobs = asyncHandler(async (req, res, next) => {
    const jobs = await Job.find({ createdBy: req.user.id });

    res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
    });
});
// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = asyncHandler(async (req, res, next) => {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name company');

    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        });
    }

    res.status(200).json({
        success: true,
        data: job
    });
});
