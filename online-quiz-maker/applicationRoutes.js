const express = require('express');
const {
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// All application routes are protected
router.use(protect);

// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
router.post('/:jobId', upload.single('resume'), applyToJob);

// @route   GET /api/applications/my
// @access  Private (Candidate)
router.get('/my', getMyApplications);

// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
router.get('/job/:jobId', getJobApplications);

// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
router.put('/:id/status', updateApplicationStatus);

module.exports = router;
