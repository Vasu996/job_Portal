import { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';

function JobListing() {
  const [jobs, setJobs] = useState([]);
  const [location, setLocation] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  const filteredJobs = jobs.filter(job => !location || job.location.toLowerCase().includes(location.toLowerCase()));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
      <div className="mb-4">
        <label className="block mb-2">Filter by Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div>
        {filteredJobs.map(job => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobListing;