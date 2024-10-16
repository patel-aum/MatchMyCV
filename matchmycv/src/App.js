import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard'; 
import ResultsPage from './components/ResultsPage'; // Import the Results page

const App = () => {
  const isLoggedIn = localStorage.getItem('session') !== null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/results" 
          element={isLoggedIn ? <ResultsPage /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;

