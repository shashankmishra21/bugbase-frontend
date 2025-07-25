import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BugList from './pages/BugListPage';
import BugDetail from './pages/BugDetailPage';
import Login from './pages/LoginPage'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BugList />} />
        <Route path="/bugs/:id" element={<BugDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
