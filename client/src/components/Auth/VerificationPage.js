

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaEnvelope, FaPhone,FaCheckCircle } from 'react-icons/fa';
// import React, { useState } from 'react';
// import { FaEnvelope, FaPhone, FaCheckCircle } from 'react-icons/fa';

import "./VerificationPage.css"

const VerificationPage = () => {
   const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  // const [emailOtp, setEmailOtp] = useState('');
  // const [phoneOtp, setPhoneOtp] = useState('');

  // const handleEmailVerify = () => {
  //   if (emailOtp) setEmailVerified(true); // Mock verification logic
  // };

  const handlePhoneVerify = () => {
    if (phoneOtp) setPhoneVerified(true); // Mock verification logic
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, login } = useAuth();

  // State management
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes timer

  // Timer countdown effect
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  // Email verification handler
  // const handleEmailVerify = async () => {
  //   if (!emailOtp) {
  //     toast.error('Please enter OTP');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     await verifyEmail({
  //       email: location.state?.email,
  //       otp: emailOtp
  //     });
      
  //     // Login after successful verification
  //     await login({
  //       email: location.state?.email,
  //       otp: emailOtp
  //     });

  //     setEmailVerified(true)

  //     toast.success('Email verified successfully!');
  //     navigate('/dashboard');
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Verification failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // components/VerificationPage/VerificationPage.js

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  

  const getMobileOtp = () => {
    toast.success(`${generateOTP()}  
     Enter This OTP`)
  }

const handleEmailVerify = async () => {
  if (!emailOtp) {
    toast.error('Please enter OTP');
    return;
  }

  setLoading(true);
  try {
    // First verify email
    await verifyEmail({
      email: location.state?.email,
      otp: emailOtp
    });

    setEmailVerified(true);
    toast.success('Email verified successfully!');

    // Wait a moment before redirecting
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
    
  } catch (error) {
    console.error('Verification error:', error);
    toast.error(error.response?.data?.message || 'Verification failed');
    // If verification fails, stay on the verification page
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="verification-page-container">
      <div className="verification-content-container">
        <div className="verification-left-content">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley.
          </p>
        </div>

        <div className="verification-form-container">
          <h2 className="verification-title">Sign Up</h2>
          <p className="verification-subtitle">Lorem Ipsum is simply dummy text</p>

          <div className="verification-fields-container">
            {/* Email Verification */}
            <div className="verification-field">
              <div className="verification-header">
                <div className="verification-icon-group">
                  <FaEnvelope className="verification-icon" />
                  <span>Email OTP</span>
                </div>
                {emailVerified && <FaCheckCircle className="verification-verified-icon" />}
              </div>
              {!emailVerified && (
                <div className="verification-otp-input-container">
                  <input
                    // type="text"
                    // value={emailOtp}
                    // onChange={(e) => setEmailOtp(e.target.value)}
                     className="verification-otp-input"
                    // placeholder="Enter Email OTP"
                    type="text"
                    placeholder="Enter Email OTP"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    maxLength={6}
                  />
                  <button 
            onClick={handleEmailVerify}
            disabled={loading}
            className="verification-verify-button"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
                </div>
                
              )}
          <label>Time remaining: {Math.floor(timer / 60)}:{timer % 60}</label>

            </div>
            {/* Phone Verification */}
            <div className="verification-field">
              <div className="verification-header">
                <div className="verification-icon-group">
                  <FaPhone className="verification-icon" />
                  <span>Mobile OTP</span>
                </div>
                {phoneVerified && <FaCheckCircle className="verification-verified-icon" />}
              </div>
              {!phoneVerified && (
                <div className="verification-otp-input-container">
                  <input
                    type="text"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    className="verification-otp-input"
                    placeholder="Enter Mobile OTP"
                  />
                  <button
                    onClick={handlePhoneVerify}
                    className="verification-verify-button"
                  >
                    Verify
                  </button>
                  <label onClick={getMobileOtp}>Get OTP</label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
