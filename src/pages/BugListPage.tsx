import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBugs, deleteBug } from '../api/bugService';
import CommentSection from '../components/CommentSection';
import axios from 'axios';

interface Bug {
  id: number;
  title: string;
  description: string;
  status: string;
  ai_suggestion: string;
  created_at: string;
  created_by: number;
}

const BugList: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [username, setUsername] = useState('');
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('user_id');
    const superFlag = localStorage.getItem('is_superuser');
    const storedUsername = localStorage.getItem('username');

    if (storedId) setUserId(parseInt(storedId));
    if (superFlag) setIsSuperUser(superFlag === 'true');
    if (storedUsername) setUsername(storedUsername);

    fetchBugs()
      .then((res) => {
        setBugs(res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch bugs:", err);
        alert("Failed to fetch bugs");
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDelete = async (bugId: number) => {
    if (!window.confirm('Are you sure you want to delete this bug?')) return;
    try {
      await deleteBug(bugId);
      setBugs((prev) => prev.filter((bug) => bug.id !== bugId));
      alert('Bug deleted!');
    } catch (err) {
      console.error("❌ Failed to delete bug:", err);
      alert("You don't have permission to delete this bug.");
    }
  };

  const handleExportCSV = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("No token found. Please login again.");
    return;
  }

  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/export-bugs/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
      responseType: 'blob', // <- important for downloading files!
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bugs.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("❌ Export failed:", err);
    alert("Failed to export CSV. Check if you're a superuser.");
  }
};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl font-semibold">👋 Welcome, {username || 'User'}</h1>
        <div className="flex gap-4 flex-wrap">
          {isSuperUser && (
            <button
              onClick={handleExportCSV}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              📄 Export CSV
            </button>
          )}
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
          <li key={bug.id} className="border p-4 rounded-lg shadow-md bg-white">
            <h3 className="text-lg font-semibold">{bug.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{bug.description}</p>
            <p className="text-sm"><strong>Status:</strong> {bug.status}</p>
            <p className="text-sm"><strong>AI Suggestion:</strong> {bug.ai_suggestion}</p>

            {(userId !== null && (bug.created_by === userId || isSuperUser)) && (
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => navigate(`/bugs/${bug.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(bug.id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Delete
                </button>
              </div>
            )}

            <div className="mt-3">
              <button
                onClick={() =>
                  setOpenCommentId(openCommentId === bug.id ? null : bug.id)
                }
                className="text-sm text-indigo-600 hover:underline"
              >
                💬 {openCommentId === bug.id ? 'Hide Comments' : 'Add/View Comments'}
              </button>
            </div>

            {openCommentId === bug.id && (
              <div className="mt-4">
                <CommentSection bugId={bug.id} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BugList;
