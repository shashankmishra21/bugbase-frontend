import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBugById, createBug } from '../api/bugService';

const BugDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bug, setBug] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
  });

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
      }
    };
    getBug();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await fetch(`http://127.0.0.1:8000/api/bugs/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...formData, created_by: bug.created_by }),
      });
      alert('Bug updated successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error updating bug:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://127.0.0.1:8000/api/bugs/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      alert('Bug deleted!');
      navigate('/');
    } catch (err) {
      console.error('Error deleting bug:', err);
    }
  };

  if (!bug) return <p>Loading bug details...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Bug Detail</h2>
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
        <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  );
};

export default BugDetail;
