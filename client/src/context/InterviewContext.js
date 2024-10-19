// client/src/context/InterviewContext.js
import React, { createContext, useState, useContext } from 'react';
import api from '../utils/api';

const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const [interviews, setInterviews] = useState([]);

  const createInterview = async (interviewData) => {
    const response = await api.post('/interviews/create', interviewData);
    setInterviews(prev => [...prev, response.data]);
    return response.data;
  };

  const getInterviews = async () => {
    const response = await api.get('/interviews/list');
    setInterviews(response.data);
    return response.data;
  };

  const updateInterview = async (id, data) => {
    const response = await api.patch(`/interviews/${id}`, data);
    setInterviews(prev => prev.map(interview => 
      interview._id === id ? response.data : interview
    ));
    return response.data;
  };

  const deleteInterview = async (id) => {
    await api.delete(`/interviews/${id}`);
    setInterviews(prev => prev.filter(interview => interview._id !== id));
  };

  return (
    <InterviewContext.Provider value={{ 
      interviews, 
      createInterview, 
      getInterviews,
      updateInterview,
      deleteInterview
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => useContext(InterviewContext);