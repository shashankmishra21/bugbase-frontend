import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchBugs()
      .then((res) => {
        setBugs(res.data);
      })
      .catch((err) => {
        console.error('Error fetching bugs:', err);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🐞 Bug List</h1>
      <ul className="space-y-4">
        {bugs.map((bug) => (
          <li key={bug.id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{bug.title}</h2>
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
