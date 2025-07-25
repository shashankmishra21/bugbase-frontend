import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BugList from './pages/BugListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BugList />} />
      </Routes>
    </Router>
  );
}

export default App;
