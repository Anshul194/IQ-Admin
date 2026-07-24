import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import StudentMaster from './pages/StudentMaster';
import Results from './pages/Results';
import ResultDetail from './pages/ResultDetail';
import Certificates from './pages/Certificates';
import { useSelector } from 'react-redux';

function App() {
    const { user } = useSelector((state) => state.auth);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/assessment"
                    element={user ? <Assessment user={user} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/results"
                    element={user ? <Results user={user} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/results/:id"
                    element={user ? <ResultDetail /> : <Navigate to="/login" />}
                />
                <Route
                    path="/certificates"
                    element={user ? <Certificates user={user} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/students"
                    element={user ? <StudentMaster user={user} /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
}

export default App;
