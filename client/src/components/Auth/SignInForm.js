import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/validators';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './SignInForm.css';

const SignInForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form states
  const [step, setStep] = useState(1); // 1 for email, 2 for OTP
  const [formData, setFormData] = useState({
    email: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);

  // Validate email
  const validateForm = () => {
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid company email');
      return false;
    }
    return true;
  };

  // Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login({ email: formData.email, requestOTP: true });
      toast.success('OTP has been sent to your email');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and login
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      await login({
        email: formData.email,
        otp: formData.otp
      });
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page-container">
      <div className="signin-content-container">
        <div className="signin-left-content">
          <p>
            Welcome back! Sign in to access your account and manage your interviews.
          </p>
        </div>

        <div className="signin-form-container">
          <h2 className="signin-title">Sign In</h2>
          <p className="signin-subtitle">Enter your credentials to continue</p>

          {step === 1 ? (
            <form onSubmit={handleRequestOTP}>
              <div className="signin-input-container">
                <FaEnvelope className="signin-input-icon" />
                <input
                  type="email"
                  placeholder="Company Email"
                  className="signin-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="signin-submit-button"
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Request OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className="signin-input-container">
                <FaLock className="signin-input-icon" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="signin-input"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  maxLength={6}
                  required
                />
              </div>

              <button 
                type="button" 
                className="signin-resend-button"
                onClick={() => {
                  setStep(1);
                  setFormData({ ...formData, otp: '' });
                }}
              >
                Resend OTP
              </button>

              <button 
                type="submit" 
                className="signin-submit-button"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </button>
            </form>
          )}

          <p className="signin-signup-text">
            Don't have an account?{' '}
            <span 
              className="signin-signup-link"
              onClick={() => navigate('/')}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;