import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function RecruiterApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    // Fetch the job title
    axios
      .get(`http://localhost:5000/api/jobs/${jobId}`)
      .then((res) => setJobTitle(res.data.title))
      .catch((err) => console.error('Error fetching job:', err));

    // Fetch applications for the job
    axios
      .get(`http://localhost:5000/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error('Error fetching applications:', err));
  }, [jobId]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
      alert(`Application ${status} successfully!`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update application status.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        Applications for {jobTitle || 'Job'}
      </h2>
      {applications.length === 0 ? (
        <p className="text-gray-600">No applications for this job yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Applicant:</strong> {app.seeker.name}
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
              </div>
              <div className="space-x-2">
                {app.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'accepted')}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecruiterApplications;