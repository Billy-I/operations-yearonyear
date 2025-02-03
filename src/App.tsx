import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OperationsCenter from './pages/OperationsCenter';
import Explorer from './pages/Explorer';
import CropDetails from './pages/CropDetails';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/data/operations" replace />} />
            <Route path="/data/operations" element={<OperationsCenter />} />
            <Route path="/analytics/explorer" element={<Explorer />} />
            <Route path="/analytics/explorer/:crop" element={<CropDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;