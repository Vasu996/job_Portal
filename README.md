# Job Portal

A full-stack job portal application that connects job seekers and recruiters. The platform allows users to browse job listings, apply for jobs, and manage job postings.

## Features

- **Job Seekers**:
  - Browse job listings.
  - View job details.
  - Apply for jobs.
  - Manage applications in the dashboard.
  - Update profile information.

- **Recruiters**:
  - Post new job listings.
  - View applications for posted jobs.
  - Manage job postings in the dashboard.

- **Authentication**:
  - User signup and login.
  - Role-based access control (Job Seeker or Recruiter).

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **React Router**: For routing and navigation.
- **Context API**: For managing authentication state.

### Backend
- **Node.js**: For server-side logic.
- **Express.js**: For building RESTful APIs.
- **MongoDB**: For database management.
- **Mongoose**: For MongoDB object modeling.

### Other Tools
- **JWT**: For authentication and authorization.
- **Dotenv**: For environment variable management.

## Installation

### Prerequisites
- Node.js installed on your system.
- MongoDB instance running locally or on the cloud (e.g., MongoDB Atlas).

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Vasu996/job_Portal.git
   cd job_Portal
2.Install dependencies for the server:
cd server
npm install
3.Install dependencies for the client:
cd ../client
npm install
4.Create a .env file in the server directory and add the following:
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
5.Start the server:
cd ../server
npm start
6.Start the client:
cd ../client
npm start

Usage
Job Seekers:

Sign up as a job seeker.
Browse jobs, view details, and apply.
Manage applications in the dashboard.
Recruiters:

Sign up as a recruiter.
Post jobs and view applications.
Manage job postings in the dashboard.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

License
This project is licensed under the MIT License.

You can save this content in a file named `README.md` in the root of your project. Let me know if you need further assistance!
