import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BugList from './pages/BugListPage';
import BugDetail from './pages/BugDetailPage';
import Login from './pages/LoginPage';
import Signup from './pages/Signup';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/bugs" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bugs" element={isAuthenticated ? <BugList /> : <Navigate to="/login" />} />
        <Route path="/bugs/:id" element={isAuthenticated ? <BugDetail /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
