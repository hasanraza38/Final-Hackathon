import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router'; // Use react-router-dom and Routes
import LandingPage from './pages/landingpage.jsx';
import Login from './pages/login.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import UserDashboard from './pages/Dashboard.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Router>
      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}
      <Routes>
        <Route path="/" element={<LandingPage setShowRegister={setShowRegister} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;