
// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../../context/InterviewContext';
import { useAuth } from '../../context/AuthContext';
import { FaUserTie, FaUsers, FaEdit, FaTrash , FaHourglassHalf, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { toast } from 'react-toastify';
import "./Dashboard.css";

// Modal Component
const UpdateModal = ({ interview, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: interview.title,
    description: interview.description,
    experienceLevel: interview.experienceLevel,
    endDate: new Date(interview.endDate).toISOString().split('T')[0],
    status: interview.status || 'pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(interview._id, formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Interview</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Experience Level:</label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
            >
              <option value="fresher">Fresher</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>

          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="update-btn">Update</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InterviewStatus = ({ interview }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaHourglassHalf />;
      case 'scheduled':
        return <FaCalendarAlt />;
      case 'completed':
        return <FaCheckCircle />;
      case 'cancelled':
        return <FaTimesCircle />;
      case 'in-progress':
        return <GiProgression/>
      default:
        return null;
    }
  };

  return (
    <div className={`interview-status ${interview.status}`}>
      {getStatusIcon(interview.status)} {interview.status}
    </div>
  );
};


const Dashboard = () => {
  const navigate = useNavigate();
  const { interviews, getInterviews, updateInterview, deleteInterview } = useInterview();
  const { user } = useAuth();
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState(null);

  useEffect(() => {
    getInterviews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpdate = async (id, formData) => {
    try {
      await updateInterview(id, formData);
      setSelectedInterview(null);
      toast.success('Interview updated successfully!');
      getInterviews(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update interview');
    }
  };

  const handleDelete = async (id) => {
    setInterviewToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteInterview(interviewToDelete);
      toast.success('Interview deleted successfully!');
      setShowConfirmDelete(false);
      getInterviews(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete interview');
    }
  };

  

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <button
          onClick={() => navigate('/create-interview')}
          className="create-interview-btn"
        >
          Create Interview
        </button>
      </div>

      <div className="interviews-list">
        {interviews.map((interview) => (
          <div key={interview._id} className="interview-card">
            <div className="interview-actions">
              <FaEdit 
                className="edit-icon" 
                onClick={() => setSelectedInterview(interview)} 
              />
              <FaTrash 
                className="delete-icon" 
                onClick={() => handleDelete(interview._id)} 
              />
            </div>
            <h3>{interview.title}</h3>
            <p className="interview-description">{interview.description}</p>
            <div className="interview-details">
              <span>
                <FaUserTie className="icon" /> Experience: {interview.experienceLevel}
              </span>
              <span>
                <FaUsers className="icon" /> Candidates: {interview.candidates.length}
              </span>
              <span>
                <FaCalendarAlt className="icon" /> End Date: {formatDate(interview.endDate)}
              </span>
            </div>
        
            <InterviewStatus  interview={interview} />

          </div>
        ))}
      </div>

      {selectedInterview && (
        <UpdateModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onUpdate={handleUpdate}
        />
      )}

      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content confirm-delete">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this interview?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="delete-btn">Delete</button>
              <button 
                onClick={() => setShowConfirmDelete(false)} 
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;