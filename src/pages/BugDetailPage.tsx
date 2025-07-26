import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBugById } from '../api/bugService';
import CommentSection from '../components/CommentSection';

const BugDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bug, setBug] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);

  const API_BASE = `${process.env.REACT_APP_API_URL}/bugs`;

  useEffect(() => {
    const getBug = async () => {
      try {
        const res = await fetchBugById(Number(id));
        setBug(res.data);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          status: res.data.status,
        });
      } catch (err) {
        console.error('Error fetching bug:', err);
        alert("Failed to load bug details.");
      } finally {
        setLoading(false);
      }
    };
    getBug();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");

      const response = await fetch(`${API_BASE}/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Update failed");

      alert('✅ Bug updated successfully!');
      navigate('/bugs');
    } catch (err) {
      console.error('❌ Error updating bug:', err);
      alert("Failed to update bug.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");

      const confirm = window.confirm("Are you sure you want to delete this bug?");
      if (!confirm) return;

      const response = await fetch(`${API_BASE}/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) throw new Error("Delete failed");

      alert('🗑️ Bug deleted successfully!');
      navigate('/bugs');
    } catch (err) {
      console.error('❌ Error deleting bug:', err);
      alert("Failed to delete bug.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading bug details...</p>;
  if (!bug) return <p className="text-center mt-10 text-red-600">Bug not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">🐞 Bug Detail</h2>

      <label className="block mb-2 font-semibold">Title:</label>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2 font-semibold">Description:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2 font-semibold">Status:</label>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <div className="flex justify-between">
        <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          💾 Save
        </button>
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          🗑️ Delete
        </button>
      </div>

      <hr className="my-6" />

      <CommentSection bugId={Number(id)} />
    </div>
  );
};

export default BugDetail;
