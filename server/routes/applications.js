const express = require('express');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const router = express.Router();

// Submit an application (seeker only)
router.post('/', auth(['seeker']), async (req, res) => {
  const { jobId, resume } = req.body;

  if (!jobId || !resume) {
    return res.status(400).json({ message: 'jobId and resume are required' });
  }

  try {
    const application = new Application({
      job: jobId,
      seeker: req.user.id,
      resume,
    });

    await application.save();
    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (err) {
    console.error('Application error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for the logged-in seeker
router.get('/seeker', auth(['seeker']), async (req, res) => {
  try {
    const applications = await Application.find({ seeker: req.user.id })
      .populate('job', 'title') // Populate job title
      .sort({ createdAt: -1 }); // Sort by most recent
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for a specific job (recruiter only)
router.get('/job/:jobId', auth(['recruiter']), async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId }).populate(
      'seeker',
      'name email'
    );
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (recruiter only)
router.put('/:id', auth(['recruiter']), async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    console.error('Error updating application:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

