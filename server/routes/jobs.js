const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('recruiter', 'name');
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new job (recruiter only)
router.post('/', auth(['recruiter']), async (req, res) => {
  const { title, description, salary, location, type, skills } = req.body;

  // Input validation
  if (!title || !description || !salary || !location || !type || !skills) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const job = new Job({
      title,
      description,
      salary,
      location,
      type,
      skills,
      recruiter: req.user.id,
      status: 'open', // Default status
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a job (recruiter only)
router.put('/:id', auth(['recruiter']), async (req, res) => {
  const { title, description, salary, location, type, skills, status } = req.body;

  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate status if provided
    if (status && !['open', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "open" or "closed".' });
    }

    // Update fields if provided
    job.title = title || job.title;
    job.description = description || job.description;
    job.salary = salary || job.salary;
    job.location = location || job.location;
    job.type = type || job.type;
    job.skills = skills || job.skills;
    job.status = status || job.status;

    await job.save();
    res.json(job);
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a job (recruiter only)
router.delete('/:id', auth(['recruiter']), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await job.remove();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;