import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Applications() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios
        .get('http://localhost:5000/api/applications/seeker', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => {
          setApplications(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching applications:', err);
          setError('Failed to load applications. Please try again later.');
          setLoading(false);
        });
    }
  }, [user]);

  if (!user || user.role !== 'seeker') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>
      {loading ? (
        <p className="text-gray-600">Loading applications...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">Job Title</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Applied At</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b">
                  <td className="py-2 px-4">
                    <Link
                      to={`/jobs/${app.job}`}
                      className="text-blue-600 hover:underline"
                    >
                      {app.jobTitle || 'Untitled Job'}
                    </Link>
                  </td>
                  <td className="py-2 px-4">{app.status}</td>
                  <td className="py-2 px-4">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Applications;