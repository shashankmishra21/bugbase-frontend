// src/pages/CreateBug.tsx
import { useState } from 'react';
import { createBug } from '../api/bugService';
import { useNavigate } from 'react-router-dom';

const CreateBug = () => {
  const [form, setForm] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBug(form);
      alert('Bug created successfully');
      navigate('/bugs');
    } catch (err) {
      alert('Failed to create bug');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Report a Bug</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Bug Title"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Describe the bug"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Bug
        </button>
      </form>
    </div>
  );
};

export default CreateBug;
