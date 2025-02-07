import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OperationsCenter from './pages/OperationsCenter';
import Explorer from './pages/Explorer';
import CropDetails from './pages/CropDetails';
import MultiYear from './pages/MultiYear';
import Budgets from './pages/Budgets';

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
            <Route path="/analytics/multi-year" element={<MultiYear />} />
            <Route path="/tracker/budgets" element={<Budgets />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;