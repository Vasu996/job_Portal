import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function RecruiterDashboard() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null); // Track which job's applicants are expanded

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios
        .get('http://localhost:5000/api/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => {
          const recruiterJobs = res.data.filter((job) => job.recruiter._id === user._id);
          // Fetch applications for each job
          Promise.all(
            recruiterJobs.map((job) =>
              axios
                .get(`http://localhost:5000/api/applications/job/${job._id}`, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then((appRes) => ({ ...job, applications: appRes.data }))
                .catch((err) => {
                  console.error(`Error fetching applications for job ${job._id}:`, err);
                  return { ...job, applications: [] };
                })
            )
          )
            .then((jobsWithApplications) => {
              setJobs(jobsWithApplications);
              setLoading(false);
            })
            .catch((err) => {
              console.error('Error processing jobs:', err);
              setJobs(recruiterJobs);
              setLoading(false);
            });
        })
        .catch((err) => {
          console.error('Error fetching jobs:', err);
          setError('Failed to load jobs. Please try again later.');
          setLoading(false);
        });
    }
  }, [user]);

  // Toggle job status (open/closed)
  const toggleJobStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    if (window.confirm(`Are you sure you want to mark this job as ${newStatus}?`)) {
      try {
        await axios.put(
          `http://localhost:5000/api/jobs/${jobId}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, status: newStatus } : job
          )
        );
        alert(`Job marked as ${newStatus} successfully!`);
      } catch (err) {
        console.error('Error updating job status:', err);
        alert('Failed to update job status.');
      }
    }
  };

  // Delete a job
  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        alert('Job deleted successfully!');
      } catch (err) {
        console.error('Error deleting job:', err);
        alert('Failed to delete job.');
      }
    }
  };

  // Toggle expanded state for viewing applicants
  const toggleApplicants = (jobId) => {
    setExpandedJobId((prev) => (prev === jobId ? null : jobId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 text-center">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
        <p className="mt-2">Manage your job postings and review applications</p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/recruiter/jobs/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Post a New Job
          </Link>
          <p className="text-gray-600">Total Jobs Posted: {jobs.length}</p>
        </div>

        <h3 className="text-xl font-semibold mb-4">Your Posted Jobs</h3>
        {loading ? (
          <p className="text-gray-600">Loading jobs...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600">You haven't posted any jobs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 relative"
              >
                {/* Job Status Badge */}
                <span
                  className={`absolute top-4 right-4 px-2 py-1 rounded-full text-sm font-semibold ${
                    job.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {job.status === 'open' ? 'Open' : 'Closed'}
                </span>

                <h4 className="text-lg font-bold mb-2">{job.title}</h4>
                <p className="text-gray-600 mb-1">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Salary:</strong> {job.salary}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Type:</strong> {job.type}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Applications:</strong> {job.applications ? job.applications.length : 0}
                </p>

                {/* Toggle Applicants Button */}
                <button
                  onClick={() => toggleApplicants(job._id)}
                  className="text-blue-600 hover:underline font-semibold mb-2"
                >
                  {expandedJobId === job._id ? 'Hide Applicants' : 'Show Applicants'}
                </button>

                {/* Applicants List (Collapsible) */}
                {expandedJobId === job._id && (
                  <div className="mt-4 border-t pt-4">
                    {job.applications && job.applications.length > 0 ? (
                      <ul className="space-y-3">
                        {job.applications.map((app) => (
                          <li key={app._id} className="border-b pb-2">
                            <p>
                              <strong>Name:</strong> {app.seeker.name}
                            </p>
                            <p>
                              <strong>Email:</strong> {app.seeker.email}
                            </p>
                            <p>
                              <strong>Resume:</strong>{' '}
                              <a
                                href={app.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Resume
                              </a>
                            </p>
                            <p>
                              <strong>Status:</strong> {app.status}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No applications for this job yet.</p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/recruiter/jobs/${job._id}/applications`}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Manage Applications
                  </Link>
                  <div className="space-x-2">
                    <button
                      onClick={() => toggleJobStatus(job._id, job.status || 'open')}
                      className={`px-3 py-1 rounded-md text-white ${
                        job.status === 'open'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {job.status === 'open' ? 'Close' : 'Open'}
                    </button>
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;