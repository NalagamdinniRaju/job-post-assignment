
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import api from '../utils/api';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Add this line
//         const response = await api.get('/auth/user');
//         setUser(response.data);
//       } catch (error) {
//         localStorage.removeItem('token');
//         delete api.defaults.headers.common['Authorization']; // Add this line
//       }
//     }
//     setLoading(false);
//   };

//   const signup = async (userData) => {
//     const response = await api.post('/auth/signup', userData);
//     return response.data;
//   };

//   const verifyEmail = async (data) => {
//     const response = await api.post('/auth/verify-email', data);
//     return response.data;
//   };

//   const login = async (data) => {
//     if (data.requestOTP) {
//       const response = await api.post('/auth/request-otp', { email: data.email });
//       return response.data;
//     } else {
//       const response = await api.post('/auth/login', {
//         email: data.email,
//         otp: data.otp
//       });
//       localStorage.setItem('token', response.data.token);
//       api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`; // Add this line
//       await checkAuth();
//       return response.data;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete api.defaults.headers.common['Authorization']; // Add this line
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signup, verifyEmail, login, logout }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
// client/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/user');
        setUser(response.data);
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const verifyEmail = async (data) => {
    try {
      const response = await api.post('/auth/verify-email', data);
      // Store token after email verification
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        await checkAuth();
      }
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  };

  const login = async (data) => {
    try {
      if (data.requestOTP) {
        const response = await api.post('/auth/request-otp', { email: data.email });
        return response.data;
      } else {
        const response = await api.post('/auth/login', {
          email: data.email,
          otp: data.otp
        });
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        await checkAuth();
        return response.data;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signup, 
      verifyEmail, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);