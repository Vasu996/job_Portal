import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext) || {}; // Guard against undefined context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">Job Portal</Link>
        <div>
          <Link to="/jobs" className="mr-4">Jobs</Link>
          {user ? (
            <>
              {user.role === 'seeker' && <Link to="/seeker/dashboard" className="mr-4">Dashboard</Link>}
              {user.role === 'recruiter' && <Link to="/recruiter/dashboard" className="mr-4">Dashboard</Link>}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
