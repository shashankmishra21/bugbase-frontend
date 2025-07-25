import React from 'react';
import { useParams } from 'react-router-dom';

const BugDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Bug Detail - ID: {id}</h1>
      <p>This page will show details of a specific bug.</p>
    </div>
  );
};

export default BugDetail;
