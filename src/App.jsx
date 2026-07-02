import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Team from './pages/Team/Team';
import Student from './pages/Student/Student';
import Results from './pages/Results/Results';
import QuizSet from './pages/QuizSet/QuizSet';
import AptitudeResults from './pages/AptitudeResults/AptitudeResults';
import AptitudeSettings from './pages/AptitudeSettings/AptitudeSettings';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

const TrendyBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
    <motion.div
      animate={{
        x: [0, 50, 0],
        y: [0, 30, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/20 rounded-full blur-[120px]"
    />
    <motion.div
      animate={{
        x: [0, -40, 0],
        y: [0, 60, 0],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-fuchsia-200/20 rounded-full blur-[100px]"
    />
    <div className="absolute top-[20%] right-[15%] w-[15%] h-[15%] bg-violet-100/10 rounded-full blur-[60px]" />
  </div>
);

const Layout = ({ children }) => {
  return (
    <div className="flex bg-[#fcfaff] min-h-screen relative font-sans">
      <TrendyBackground />
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/team"
          element={
            isAuthenticated ? (
              <Layout>
                <Team />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/students"
          element={
            isAuthenticated ? (
              <Layout>
                <Student />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/results"
          element={
            isAuthenticated ? (
              <Layout>
                <Results />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/quiz-set"
          element={
            isAuthenticated ? (
              <Layout>
                <QuizSet />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/aptitude-results"
          element={
            isAuthenticated ? (
              <Layout>
                <AptitudeResults />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/aptitude-settings"
          element={
            isAuthenticated ? (
              <Layout>
                <AptitudeSettings />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
