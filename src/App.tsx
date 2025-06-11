import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import BottomNavigation from './components/BottomNavigation';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
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
import AIForecasterOverview from './pages/AIForecasterOverview'; // Import AI Forecaster
import FieldAnalysisPage from './pages/FieldAnalysisPage'; // Import Field Analysis

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <MobileHeader onMenuClick={toggleSidebar} />
          
          {/* Page content with bottom navigation spacing */}
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/ai-forecaster" element={<AIForecasterOverview />} />
              <Route path="/ai-forecaster/field/:fieldId" element={<FieldAnalysisPage />} />
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
          </main>
          
          {/* Bottom Navigation for Mobile */}
          <BottomNavigation />
          
          {/* Floating AI Assistant for Mobile */}
          <FloatingAIAssistant />
        </div>
      </div>
    </Router>
  );
}

export default App;
