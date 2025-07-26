// src/pages/Login.tsx

import { useState } from 'react';
import { loginUser } from '../api/bugService';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginUser(credentials);
      const token = response.data.token;

      // Store token and username
      localStorage.setItem('token', token);
      localStorage.setItem('username', credentials.username);

      // Fetch user info
      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user/`, {
        headers: { Authorization: `Token ${token}` },
      });

      const { id, username, is_superuser } = userResponse.data;

      // Store extra user info
      localStorage.setItem('user_id', id.toString());
      localStorage.setItem('is_superuser', is_superuser.toString());

      navigate('/bugs');
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login to BugBase</h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
