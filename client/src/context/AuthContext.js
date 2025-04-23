import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUser(res.data)).catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const login = async (email, password, role) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const signup = async (email, password, role, name) => {
    const res = await axios.post('http://localhost:5000/api/auth/signup', { email, password, role, name });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};