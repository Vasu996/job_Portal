import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JobListing from './pages/JobListing';
import JobDetail from './pages/JobDetail';
import SeekerDashboard from './pages/SeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import Applications from './pages/Applications';
import RecruiterApplications from './pages/RecruiterApplications'; // Add this import
import { AuthContext } from './context/AuthContext';
import SeekerProfile from './pages/SeekerProfile';
//           { status: newStatus },
import { useContext } from 'react';

function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  if (!user || (role && user.role !== role)) {
    return <div>Access Denied</div>;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs" element={<JobListing />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route
            path="/seeker/dashboard"
            element={
              <ProtectedRoute role="seeker">
                <SeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/new"
            element={
              <ProtectedRoute role="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seeker/applications"
            element={
              <ProtectedRoute role="seeker">
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:jobId/applications"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterApplications />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;