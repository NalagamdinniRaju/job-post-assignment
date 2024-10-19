
import React, { useState } from 'react';
import './CreateInterview.css';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useInterview } from '../../context/InterviewContext';
import { validateEmail, validateDate } from '../../utils/validators';

const CreateInterview = () => {
  const { createInterview } = useInterview();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    experienceLevel: '',
    candidates: [],
    endDate: ''
  });
  const [candidateEmail, setCandidateEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
    if (formData.candidates.length === 0) newErrors.candidates = 'At least one candidate email is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    else if (!validateDate(formData.endDate)) newErrors.endDate = 'End date must be in the future';

    if (Object.keys(newErrors).length) {
      Object.values(newErrors).forEach(error => toast.error(error));
      return false;
    }
    return true;
  };

  const handleAddCandidate = () => {
    if (!candidateEmail) return toast.error('Email is required');
    if (!validateEmail(candidateEmail)) return toast.error('Invalid email format');
    if (formData.candidates.includes(candidateEmail)) return toast.error('Email already added');

    setFormData({
      ...formData,
      candidates: [...formData.candidates, candidateEmail]
    });
    setCandidateEmail('');
  };

  const removeCandidate = (email) => {
    setFormData({
      ...formData,
      candidates: formData.candidates.filter(c => c !== email)
    });
    toast.info(`Removed ${email} from candidates`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCandidate();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const interviewData = { ...formData };

      await createInterview(interviewData);
      toast.success('Interview created successfully and emails sent to candidates!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        experienceLevel: '',
        candidates: [],
        endDate: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-interview-container">
      <form className="create-interview-form" onSubmit={handleSubmit}>
        <div className="create-interview-row">
          <label className="create-interview-label">Job Title</label>
          <input
            type="text"
            placeholder="Enter Job Title"
            className="create-interview-input"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="create-interview-row">
          <label className="create-interview-label">Job Description</label>
          <textarea
            placeholder="Enter Job Description"
            className="create-interview-input"
            style={{ height: '140px' }}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="create-interview-row">
          <label className="create-interview-label">Experience Level</label>
          <select
            className="create-interview-input"
            value={formData.experienceLevel}
            onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
          >
            <option value="">Select Experience Level</option>
            <option value="fresher">Fresher</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>

        <div className="create-interview-row">
          <label className="create-interview-label">Add Candidates</label>
          <div className="create-interview-chip-input">
            {formData.candidates.map((email, index) => (
              <div key={index} className="create-interview-chip">
                <span>{email}</span>
                <FaTimes
                  className="create-interview-chip-remove"
                  onClick={() => removeCandidate(email)}
                />
              </div>
            ))}
            <input
              type="email"
              placeholder="Add candidate email"
              className="create-interview-chip-input-field"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        <div className="create-interview-row">
          <label className="create-interview-label">End Date</label>
          <input
            type="date"
            className="create-interview-input"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            min={today}
          />
        </div>

        <button
          type="submit"
          className="create-interview-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default CreateInterview;
