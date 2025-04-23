import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(err => console.log('Error fetching job:', err));
  }, [id]);

  const handleApply = async () => {
    if (!user || user.role !== 'seeker') {
      alert('Please login as a job seeker');
      return;
    }
    if (!resume) {
      alert('Please enter a resume URL');
      return;
    }
    if (window.confirm('Are you sure you want to apply for this job?')) {
      try {
        await axios.post('http://localhost:5000/api/applications', { jobId: id, resume }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Application submitted successfully!');
        setResume('');
      } catch (err) {
        alert('Application failed. Please try again.');
        console.error('Application error:', err);
      }
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Skills:</strong> {job.skills.join(', ')}</p>
      {user?.role === 'seeker' && (
        <div className="mt-6">
          <label className="block mb-2 font-semibold">Resume URL</label>
          <input
            type="text"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Enter your resume URL"
            className="border border-gray-300 p-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
            disabled={!resume}
          >
            Apply Now
          </button>
        </div>
      )}
    </div>
  );
}

export default JobDetail;