
// // import React, { useState ,useEffect} from 'react';
// // import { FaUser , FaChevronDown, FaCog, FaSignOutAlt } from 'react-icons/fa';
// // import { useAuth } from '../../context/AuthContext';
// // import { useInterview } from '../../context/InterviewContext';
// // import { useNavigate } from 'react-router-dom';
// // import './Navbar.css';

// // const Navbar = ({ profilePhoto, jobPosts }) => {
// //   const [showDropdown, setShowDropdown] = useState(false);
// //   const { interviews, getInterviews } = useInterview();
// //   const { user, logout } = useAuth();
// //   const navigate = useNavigate();

  
// //   useEffect(() => {
// //     getInterviews();
// //   }, []);


// //   const handleLogout = () => {
// //     logout();
// //     navigate('/');
// //   };

// //   return (
// //     <nav className="nav-navbar">
// //       <div className="nav-content">
// //         <img src="/cuvette-logo.png" alt="Civette" className="nav-logo" />
// //       </div>

// //       <div className="nav-right">
// //         <span className="nav-contact-button">Contact</span>
// //         <div className="nav-profile-container" onClick={() => setShowDropdown(!showDropdown)}>
// //           <div className="nav-profile-photo">
// //             {profilePhoto ? (
// //               <img src={profilePhoto} alt="profile" className="nav-profile-image" />
// //             ) : (
// //               <FaUser  className="nav-default-avatar" />
// //             )}
// //           </div>
// //           <span className="nav-profile-name">{user ? user.name : 'Your Name'}</span>
// //           <FaChevronDown className="nav-dropdown-icon" />

// //           {showDropdown && (
// //             <div className="nav-dropdown-menu">
// //               <div className="nav-profile-header">
// //                 <div className="nav-profile-photo-large">
// //                   {profilePhoto ? (
// //                     <img src={profilePhoto} alt="profile" className="nav-profile-image-large" />
// //                   ) : (
// //                     <FaUser  className="nav-default-avatar-large" />
// //                   )}
// //                 </div>
// //                 <div className="nav-profile-info">
// //                   <span className="nav-profile-name-large">{user ? user.name : 'Your Name'}</span>
// //                   <span className="nav-company-name">{user ? user.companyName : 'Company Name'}</span>
// //                   <span className="nav-company-email">{user ? user.companyEmail : 'company@email.com'}</span>
// //                 </div>
// //               </div>

// //               <div className="nav-stats-container">
// //                 <div className="nav-stat-item">
// //                   <span className="nav-stat-number">{interviews.length || 0}</span>
// //                   <span className="nav-stat-label">Job Posts</span>
// //                 </div>
// //                 <div className="nav-stat-item">
// //                   <span className="nav-stat-number">0</span>
// //                   <span className="nav-stat-label">Analytics</span>
// //                 </div>
// //               </div>

// //               <div className="nav-dropdown-divider"></div>

// //               <div className="nav-dropdown-item">
// //                 <FaUser  className="nav-dropdown-icon-item" />
// //                 <span>Profile</span>
// //               </div>
// //               <div className="nav-dropdown-item">
// //                 <FaCog className="nav-dropdown-icon-item" />
// //                 <span>Settings</span>
// //               </div>
// //               <button onClick={handleLogout} className="nav-dropdown-item">
// //                 <FaSignOutAlt className="nav-dropdown-icon-item" />
// //                 <span>Logout</span>
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;
// import React, { useState, useEffect } from 'react';
// import { FaUser, FaChevronDown, FaCog, FaSignOutAlt } from 'react-icons/fa';
// import { useAuth } from '../../context/AuthContext';
// import { useInterview } from '../../context/InterviewContext';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './Navbar.css';

// const Navbar = ({ profilePhoto }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const { interviews, getInterviews } = useInterview();
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Call getInterviews only after the user logs in
//   useEffect(() => {
//     if (user) {
//       getInterviews(); // Fetch interviews when the user is logged in
//     }
//   }, [user]); // Dependency on user state

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

//   return (
//     <nav className="nav-navbar">
//       <div className="nav-content">
//         <img src="/cuvette-logo.png" alt="Cuvette" className="nav-logo" />
//       </div>

//       <div className="nav-right">
//         <span className="nav-contact-button">Contact</span>

//         {user && !isAuthPage && (
//           <div
//             className="nav-profile-container"
//             onClick={() => setShowDropdown(!showDropdown)}
//           >
//             <div className="nav-profile-photo">
             
//                 <FaUser className="nav-default-avatar" />
            
//             </div>
//             <span className="nav-profile-name">{user.name}</span>
//             <FaChevronDown className="nav-dropdown-icon" />

//             {showDropdown && (
//               <div className="nav-dropdown-menu">
//                 <div className="nav-profile-header">
//                   <div className="nav-profile-photo-large">
//                     {profilePhoto ? (
//                       <img
//                         src={profilePhoto}
//                         alt="profile"
//                         className="nav-profile-image-large"
//                       />
//                     ) : (
//                       <FaUser className="nav-default-avatar-large" />
//                     )}
//                   </div>
//                   <div className="nav-profile-info">
//                     <span className="nav-profile-name-large">{user.name}</span>
//                     <span className="nav-company-name">
//                       {user.companyName || 'Company Name'}
//                     </span>
//                     <span className="nav-company-email">
//                       {user.companyEmail || 'company@email.com'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="nav-stats-container">
//                   <div className="nav-stat-item">
//                     <span className="nav-stat-number">
//                       {interviews.length || 0}
//                     </span>
//                     <span className="nav-stat-label">Job Posts</span>
//                   </div>
//                   <div className="nav-stat-item">
//                     <span className="nav-stat-number">0</span>
//                     <span className="nav-stat-label">Analytics</span>
//                   </div>
//                 </div>

//                 <div className="nav-dropdown-divider"></div>

//                 {/* <div className="nav-dropdown-item">
//                   <FaUser className="nav-dropdown-icon-item" />
//                   <span>Profile</span>
//                 </div>
//                 <div className="nav-dropdown-item">
//                   <FaCog className="nav-dropdown-icon-item" />
//                   <span>Settings</span>
//                 </div> */}
//                 <button onClick={handleLogout} className="nav-dropdown-item">
//                   <FaSignOutAlt className="nav-dropdown-icon-item" />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

//  export default Navbar;
import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaChevronDown, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaUserPlus 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useInterview } from '../../context/InterviewContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = ({ profilePhoto }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { interviews, getInterviews } = useInterview();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Call getInterviews only after the user logs in
  useEffect(() => {
    if (user) {
      getInterviews().catch(error => {
        toast.error('Failed to fetch interviews');
      });
    }
  }, [user]);

  const handleLogout = () => {
    try {
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/';

  return (
    <nav className="nav-navbar">
      <div className="nav-content">
        <img 
          src="/cuvette-logo.png" 
          alt="Cuvette" 
          className="nav-logo" 
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="nav-right">
        <span className="nav-contact-button">Contact</span>

        { !user && (
          <div className="nav-auth-buttons">
            <button 
              className="nav-auth-button" 
              onClick={() => navigate('/login')}
            >
              <FaSignInAlt className="nav-button-icon" />
              Sign In
            </button>
            <button 
              className="nav-auth-button" 
              onClick={() => navigate('/')}
            >
              <FaUserPlus className="nav-button-icon" />
              Sign Up
            </button>
          </div>
        )}

        {user && !isAuthPage && (
          <div
            className="nav-profile-container"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="nav-profile-photo">
              <FaUser className="nav-default-avatar" />
            </div>
            <span className="nav-profile-name">{user.name}</span>
            <FaChevronDown className="nav-dropdown-icon" />

            {showDropdown && (
              <div className="nav-dropdown-menu">
                <div className="nav-profile-header">
                  <div className="nav-profile-photo-large">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="profile"
                        className="nav-profile-image-large"
                      />
                    ) : (
                      <FaUser className="nav-default-avatar-large" />
                    )}
                  </div>
                  <div className="nav-profile-info">
                    <span className="nav-profile-name-large">{user.name}</span>
                    <span className="nav-company-name">
                      {user.companyName || 'Company Name'}
                    </span>
                    <span className="nav-company-email">
                      {user.companyEmail || 'company@email.com'}
                    </span>
                  </div>
                </div>

                <div className="nav-stats-container">
                  <div className="nav-stat-item">
                    <span className="nav-stat-number">
                      {interviews?.length || 0}
                    </span>
                    <span className="nav-stat-label">Job Posts</span>
                  </div>
                  <div className="nav-stat-item">
                    <span className="nav-stat-number">0</span>
                    <span className="nav-stat-label">Analytics</span>
                  </div>
                </div>

                <div className="nav-dropdown-divider"></div>

                <button onClick={handleLogout} className="nav-dropdown-item">
                  <FaSignOutAlt className="nav-dropdown-icon-item" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;