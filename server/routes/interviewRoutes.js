// server/routes/interviewRoutes.js
const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.post('/create', interviewController.createInterview);
router.get('/list', interviewController.getInterviews);
router.get('/:id', interviewController.getInterviewById);
router.patch('/:id', interviewController.updateInterview);
router.delete('/:id', interviewController.deleteInterview);

module.exports = router;