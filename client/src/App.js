
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import PrivateRoute from './utils/PrivateRoute';
import SignUpForm from './components/Auth/SignUpForm';
import SignInForm from './components/Auth/SignInForm'; 
import VerificationPage from './components/Auth/VerificationPage';
import Dashboard from './components/Dashboard/Dashboard';
import CreateInterview from './components/Interview/CreateInterview';
import Navbar from './components/Navbar/NavBar.js';
import Sidebar from './components/Sidebar/Sidebar.js';

const App = () => {
  return (
    <AuthProvider>
      <InterviewProvider>
        <BrowserRouter>
          <div className="app">
            <Navbar />
            <div className="content-wrapper">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<SignUpForm />} />
                  <Route path="/login" element={<SignInForm />} />
                  <Route path="/verification" element={<VerificationPage />} />
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/create-interview" element={
                    <PrivateRoute>
                      <CreateInterview />
                    </PrivateRoute>
                  } />
                </Routes>
              </main>
            </div>
          </div>
          <ToastContainer />
        </BrowserRouter>
      </InterviewProvider>
    </AuthProvider>
  );
};

export default App;

