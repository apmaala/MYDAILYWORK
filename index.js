const express = require('express');
const router = express.Router();

// Routes will be defined here
router.get('/test', (req, res) => res.json({ msg: 'Routes are working' }));

module.exports = router;
