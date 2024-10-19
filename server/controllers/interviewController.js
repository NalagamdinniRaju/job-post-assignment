
// server/controllers/interviewController.js
const Interview = require('../models/Interview');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const interviewController = {
  // Create new interview
  createInterview: async (req, res) => {
    try {
      const { title, description, experienceLevel, candidates, endDate } = req.body;
      const user = req.user; // Current logged in user

      // Validate end date
      if (new Date(endDate) < new Date()) {
        return res.status(400).json({ message: 'End date cannot be in the past' });
      }

      const interview = new Interview({
        creator: user._id,
        title,
        description,
        experienceLevel,
        candidates,
        endDate
      });

      await interview.save();

      // Send emails to candidates with enhanced template
      const emailPromises = candidates.map(candidateEmail => {
        return transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: candidateEmail,
          subject: `Interview Invitation for ${title} Position at ${user.companyName}`,
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
                <div style="padding: 20px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50;">${user.companyName}</h1>
                  </div>
                  
                  <h2 style="color: #2c3e50;">Interview Invitation</h2>
                  
                  <p>Dear Candidate,</p>
                  
                  <p>We are pleased to inform you that your application for the <strong>${title}</strong> position at ${user.companyName} has been reviewed, and we would like to invite you for an interview.</p>
                  
                  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #2c3e50; margin-top: 0;">Position Details:</h3>
                    <p><strong>Role:</strong> ${title}</p>
                    <p><strong>Description:</strong> ${description}</p>
                    <p><strong>Required Experience:</strong> ${experienceLevel}</p>
                    <p><strong>Application Window Closes:</strong> ${new Date(endDate).toLocaleDateString()}</p>
                  </div>
                  
                  <p>Next Steps:</p>
                  <ol>
                    <li>Please confirm your interest by responding to this email within 48 hours</li>
                    <li>Choose your preferred interview slot by replying to this email</li>
                    <li>Review the job description and prepare accordingly</li>
                  </ol>
                  
                  <p>What to Expect:</p>
                  <ul style="list-style-type: none; padding-left: 0;">
                    <li>✓ Interview duration: Approximately 45-60 minutes</li>
                    <li>✓ Format: Video Call</li>
                    <li>✓ Interviewer(s): ${user.companyName} team</li>
                  </ul>
                  
                  <p style="margin-top: 20px;">If you have any questions or need to reschedule, please contact us at ${user.companyEmail} or ${user.phone}.</p>
                  
                  <p>Best regards,<br>
                  ${user.name}<br>
                  ${user.companyName}</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px;">
                  <p>Company Size: ${user.employeeSize} employees</p>
                  <p>© ${new Date().getFullYear()} ${user.companyName}. All rights reserved.</p>
                </div>
              </body>
            </html>
          `
        });
      });

      await Promise.all(emailPromises);

      res.status(201).json(interview);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all interviews for a user
  getInterviews: async (req, res) => {
    try {
      const interviews = await Interview.find({ creator: req.user._id })
        .sort({ createdAt: -1 });
      res.json(interviews);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get single interview
  getInterviewById: async (req, res) => {
    try {
      const interview = await Interview.findOne({
        _id: req.params.id,
        creator: req.user._id
      });

      if (!interview) {
        return res.status(404).json({ message: 'Interview not found' });
      }

      res.json(interview);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update interview
  updateInterview: async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['title', 'description', 'experienceLevel', 'endDate', 'status'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
      }

      const interview = await Interview.findOne({
        _id: req.params.id,
        creator: req.user._id
      });

      if (!interview) {
        return res.status(404).json({ message: 'Interview not found' });
      }

      updates.forEach(update => interview[update] = req.body[update]);
      await interview.save();

      res.json(interview);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete interview
  deleteInterview: async (req, res) => {
    try {
      const interview = await Interview.findOneAndDelete({
        _id: req.params.id,
        creator: req.user._id
      });

      if (!interview) {
        return res.status(404).json({ message: 'Interview not found' });
      }

      res.json({ message: 'Interview deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = interviewController;

// module.exports = interviewController;