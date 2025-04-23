import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Home() {
  const [jobs, setJobs] = useState([]);

  // Fetch jobs from the backend API on component mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/jobs')
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        console.error('Error fetching jobs:', err);
      });
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/background.jpg')",
          opacity: 0.3,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto p-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to Job Portal</h1>
        <p className="text-lg mb-8">
          Find your dream job or post opportunities for talented candidates.
        </p>

        {/* Showcase Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Latest Job Postings</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-600">No jobs available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 3).map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-2">
                      {job.description.length > 100
                        ? `${job.description.substring(0, 100)}...`
                        : job.description}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Location:</strong> {job.location}
                    </p>
                    <p className="text-gray-600 mb-4">
                      <strong>Salary:</strong> {job.salary}
                    </p>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Home;