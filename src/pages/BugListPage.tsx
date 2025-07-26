import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBugs } from '../api/bugService';

interface Bug {
  id: number;
  title: string;
  description: string;
  status: string;
  ai_suggestion: string;
  created_at: string;
}

const BugList: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: get username from localStorage or from backend (if available)
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);

    fetchBugs()
      .then((res) => setBugs(res.data))
      .catch((err) => {
        console.error("❌ Failed to fetch bugs:", err);
        alert("Failed to fetch bugs");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">👋 Welcome, {username || 'User'}</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/create')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ➕ New Bug
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">🐞 Bug List</h2>
      <ul className="space-y-4">
        {bugs.map((bug) => (
          <li key={bug.id} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{bug.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{bug.description}</p>
            <p className="text-sm"><strong>Status:</strong> {bug.status}</p>
            <p className="text-sm"><strong>AI Suggestion:</strong> {bug.ai_suggestion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BugList;
