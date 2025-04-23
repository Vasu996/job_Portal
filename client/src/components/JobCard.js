import { Link } from 'react-router-dom';

function JobCard({ job }) {
  return (
    <div className="border p-4 mb-4 rounded shadow">
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p>{job.description.substring(0, 100)}...</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <Link to={`/jobs/${job._id}`} className="text-blue-600">View Details</Link>
    </div>
  );
}

export default JobCard;