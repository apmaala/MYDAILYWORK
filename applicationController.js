const Application = require('../models/Application');
const Job = require('../models/Job');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
exports.applyToJob = asyncHandler(async (req, res, next) => {
    // Only allow Candidates to apply
    if (req.user.role !== 'Candidate') {
        return res.status(403).json({
            success: false,
            message: 'Only Candidates can apply for jobs'
        });
    }

    const jobId = req.params.jobId;
    const candidateId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
        job: jobId,
        candidate: candidateId
    });

    if (existingApplication) {
        return res.status(400).json({
            success: false,
            message: 'You have already applied for this job'
        });
    }

    // Create application
    const application = await Application.create({
        job: jobId,
        candidate: candidateId,
        resume: req.file ? req.file.path : null
    });

    res.status(201).json({
        success: true,
        message: 'Applied successfully',
        data: application
    });
});

// @desc    Get logged-in candidate's applications
// @route   GET /api/applications/my
// @access  Private (Candidate)
exports.getMyApplications = asyncHandler(async (req, res, next) => {
    // Only allow Candidates
    if (req.user.role !== 'Candidate') {
        return res.status(403).json({
            success: false,
            message: 'Only Candidates can view their applications'
        });
    }

    const applications = await Application.find({ candidate: req.user.id })
        .populate({
            path: 'job',
            select: 'title company location salary jobType'
        })
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
    });
});

// @desc    Get all applications for a specific job (Employer only)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
exports.getJobApplications = asyncHandler(async (req, res, next) => {
    const jobId = req.params.jobId;

    // Check if job exists and belongs to logged-in employer
    const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        });
    }

    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized access to job applications'
        });
    }

    const applications = await Application.find({ job: jobId })
        .populate('candidate', 'name email')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
    });
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
exports.updateApplicationStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;

    if (!['Applied', 'Shortlisted', 'Rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status'
        });
    }

    let application = await Application.findById(req.params.id).populate('job');

    if (!application) {
        return res.status(404).json({
            success: false,
            message: 'Application not found'
        });
    }

    // Check if the job belongs to the logged-in employer
    if (application.job.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized to update this application status'
        });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
        success: true,
        data: application
    });
});
