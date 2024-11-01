import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import RegisterStudentForm from './Components/StudentRegistration/StudentRegistrationForm';
import LoginForm from './Components/Login/LoginForm'; // Asegúrate de importar tu componente de Login
import Dashboard from './Pages/Dashboard'; // Cambia esto por el componente que uses para el dashboard

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterStudentForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
