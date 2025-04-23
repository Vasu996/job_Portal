import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function SeekerDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Job Seeker Dashboard</h2>
      <p>Welcome, {user.name}!</p>
      <div className="mt-4">
        <Link to="/jobs" className="bg-blue-600 text-white p-2 rounded mr-2">Browse Jobs</Link>
        <Link to="/seeker/applications" className="bg-blue-600 text-white p-2 rounded">View Applications</Link>
      </div>
    </div>
  );
}

export default SeekerDashboard;