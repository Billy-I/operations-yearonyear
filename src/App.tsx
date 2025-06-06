import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import OperationsCenter from './pages/OperationsCenter';
import Explorer from './pages/Explorer';
import CropDetails from './pages/CropDetails';
import ExplorerCropDetails from './pages/ExplorerCropDetails';
import MultiYear from './pages/MultiYear';
import Budgets from './pages/Budgets';
import BudgetsAlternative from './pages/BudgetsAlternative';
import BudgetsSimple from './pages/BudgetsSimple';
import AddBudget from './pages/AddBudget';
import CropProgress from './pages/CropProgress';
import FieldGroupsPage from './pages/FieldGroupsPage'; // Import the new page
import HiddenDashboard from './pages/HiddenDashboard'; // Import the hidden dashboard

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/data/operations" element={<OperationsCenter />} />
            <Route path="/data/field-groups" element={<FieldGroupsPage />} /> {/* Add route for Field Groups */}
            <Route path="/analytics/explorer" element={<Explorer />} />
            <Route path="/analytics/explorer/:crop" element={<ExplorerCropDetails />} />
            <Route path="/analytics/multi-year" element={<MultiYear />} />
            <Route path="/tracker/budgets" element={<Budgets />} />
            <Route path="/tracker/budgets-alt" element={<BudgetsAlternative />} />
            <Route path="/tracker/budgets-alt/add" element={<AddBudget />} />
            <Route path="/tracker/budgets-simple" element={<BudgetsSimple />} />
            <Route path="/tracker/budgets-simple/add" element={<AddBudget />} />
            <Route path="/tracker/crop-progress" element={<CropProgress />} />
            <Route path="/tracker/crop-progress/:crop" element={<CropDetails />} />
            <Route path="/dashboard-preview-xyz" element={<HiddenDashboard />} /> {/* Add route for Hidden Dashboard */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;