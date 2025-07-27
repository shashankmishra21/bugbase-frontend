// components/CommentSection.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
  id: number;
  text: string;
  created_by: string;
  created_at: string;
}

interface Props {
  bugId: number;
}

const CommentSection: React.FC<Props> = ({ bugId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments/?bug=${bugId}`, {
        headers: { Authorization: `Token ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!text.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/comments/`,
        { bug: bugId, text },
        { headers: { Authorization: `Token ${token}` } }
      );
      setText('');
      await fetchComments();
    } catch (err) {
      console.error('❌ Failed to add comment:', err);
      alert("Couldn't add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [bugId]);

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-4">💬 Comments</h3>

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="border p-2 rounded bg-gray-50">
              <p className="text-sm">{comment.text}</p>
              <p className="text-xs text-gray-500">– {comment.created_by} on {new Date(comment.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          disabled={submitting}
        >
          ➕ {submitting ? 'Adding...' : 'Add Comment'}
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
