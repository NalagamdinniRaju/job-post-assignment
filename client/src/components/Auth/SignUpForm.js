import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePhone } from '../../utils/validators';
import { FaUser, FaPhone, FaBuilding, FaEnvelope, FaUsers } from 'react-icons/fa';
import './SignUpForm.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

   // Form state management
   const [formData, setFormData] = useState({
    name: '',
    phone: '',
    companyName: '',
    companyEmail: '',
    employeeSize: ''
  });
  const [loading, setLoading] = useState(false);

  // Form validation
  const validateForm = () => {
    if (!validateEmail(formData.companyEmail)) {
      toast.error('Please enter a valid email');
      return false;
    }
    if (!validatePhone(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(formData);
      toast.success('Registration successful! Please verify your email.');
      navigate('/verification', { 
        state: { email: formData.companyEmail } 
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-content-container">
        <div className="signup-left-content">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley
          </p>
        </div>
        
        <div className="signup-form-container">
          <h2 className="signup-title">Sign Up</h2>
          <p className="signup-subtitle">Lorem Ipsum is simply dummy text</p>
          
          <form onSubmit={handleSubmit}>
            <div className="signup-input-container">
              <FaUser className="signup-input-icon" />
              <input
                type="text"
                placeholder="Name"
                className="signup-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required

              />
            </div>

            <div className="signup-input-container">
              <FaPhone className="signup-input-icon" />
              <input
                type="tel"
                placeholder="Phone no."
                className="signup-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required

              />
            </div>

            <div className="signup-input-container">
              <FaBuilding className="signup-input-icon" />
              <input
                type="text"
                placeholder="Company Name"
                className="signup-input"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required

              />
            </div>

            <div className="signup-input-container">
              <FaEnvelope className="signup-input-icon" />
              <input
                type="email"
                placeholder="Company Email"
                className="signup-input"
                value={formData.companyEmail}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                required

              />
            </div>

            <div className="signup-input-container">
              <FaUsers className="signup-input-icon" />
              <input
                type="text"
                placeholder="Employee Size"
                className="signup-input"
                value={formData.employeeSize}
                onChange={(e) => setFormData({ ...formData, employeeSize: e.target.value })}
                required

              />
            </div>
         

            <p className="signup-terms-text">
            <p >
           Already have an account{' '}
            <span 
              className="signin-signup-link"
              onClick={() => navigate('/login')}
            >
              Sign Up
            </span>
          </p>
              By clicking on proceed you will accept our{' '}
              <a href="#" className="signup-terms-link">Terms & Conditions</a>
            </p>
             <button 
              type="submit" 
              className="signup-submit-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
