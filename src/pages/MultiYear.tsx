import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { MultiYearHeader } from '../components/analytics/MultiYearHeader';
import { MultiYearControls } from '../components/analytics/MultiYearControls';
import { FieldRotationControls } from '../components/analytics/FieldRotationControls';
import { MultiYearTable } from '../components/analytics/MultiYearTable';
import { FieldRotationTable } from '../components/analytics/FieldRotationTable';
import { MultiYearGraph } from '../components/analytics/MultiYearGraph';
import { MultiYearPDFWrapper } from '../components/analytics/MultiYearPDF';
import { ViewType, UnitType, TabType } from '../types/analytics';
import { AVAILABLE_YEARS, AVAILABLE_CROPS } from '../constants/analytics';
import { fieldsData } from '../data/fieldData';
import { HelpPanel, MultiYearHelpContent, FeatureNotification } from '../components/help';

// Get the type of available crops from the constant
type AvailableCrop = typeof AVAILABLE_CROPS[number];

export default function MultiYear() {
  const location = useLocation();
  const referrer = location.state?.from || '/analytics/explorer';
  const [selectedView, setSelectedView] = useState<ViewType>('Total');
  const [selectedYears, setSelectedYears] = useState<string[]>([...AVAILABLE_YEARS]);
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('£/t');
  const [selectedCrop, setSelectedCrop] = useState<AvailableCrop>(AVAILABLE_CROPS[0]);
  const [selectedFilter, setSelectedFilter] = useState('None');
  const [selectedTab, setSelectedTab] = useState<TabType>('comparison');
  const [selectedField, setSelectedField] = useState(fieldsData[0].id);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  // Always show both variable and operations costs
  const costFilters = {
    variable: true,
    operations: true
  };

  return (
    <div>
      <MultiYearPDFWrapper>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link to={referrer} className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <div className="text-sm text-gray-600">Explorer / Multi year</div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold">Multi Year Analysis</h1>
                    <button
                      onClick={() => setShowHelpPanel(true)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      aria-label="Help"
                    >
                      <HelpCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/analytics/explorer" className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                  Explorer Overview
                </Link>
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
                  <div className="relative">
                    <button
                      className="bg-transparent border-none focus:ring-0 flex items-center space-x-2"
                      onClick={(e) => {
                        const target = e.currentTarget.nextElementSibling;
                        if (target) {
                          target.classList.toggle('hidden');
                        }
                      }}
                    >
                      <span>{selectedYears.length} years selected</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute top-full right-0 mt-1 bg-white border rounded-md shadow-lg z-50 hidden">
                      {AVAILABLE_YEARS.map((year) => (
                        <label key={year} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedYears.includes(year)}
                            onChange={(e) => {
                              const newSelectedYears = e.target.checked
                                ? [...selectedYears, year]
                                : selectedYears.filter((y) => y !== year);
                              setSelectedYears(AVAILABLE_YEARS.filter(y => newSelectedYears.includes(y)));
                            }}
                            className="mr-2"
                          />
                          {year}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Notification */}
          {showNotification && (
            <div className="mt-4 mb-4">
              <FeatureNotification
                title="New Feature: Multi-Year Analysis with Operations Costs"
                message={
                  <>
                    <p className="mb-2">Welcome to the Multi-Year Analysis page! This powerful tool allows you to compare crop performance across multiple years, helping you identify trends and make data-driven decisions.</p>
                    <p className="mb-2">We've now integrated operations costs (cultivating, drilling, etc.) alongside traditional input costs to provide a more complete picture of your farm's financial performance over time.</p>
                    <p>Use the tabs to switch between Crop Comparison and Field Rotation views, and explore how your costs and margins have evolved over the years.</p>
                  </>
                }
                onLearnMore={() => setShowHelpPanel(true)}
                onDismiss={() => setShowNotification(false)}
              />
            </div>
          )}

          <div className="mt-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col space-y-4">
                <div className="non-printable">
                  {selectedTab === 'comparison' ? (
                    <MultiYearControls
                      selectedCrop={selectedCrop}
                      setSelectedCrop={(crop: AvailableCrop) => setSelectedCrop(crop)}
                      selectedFilter={selectedFilter}
                      setSelectedFilter={setSelectedFilter}
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                      selectedUnit={selectedUnit}
                      setSelectedUnit={setSelectedUnit}
                    />
                  ) : (
                    <FieldRotationControls
                      selectedField={selectedField}
                      setSelectedField={setSelectedField}
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                      selectedUnit={selectedUnit}
                      setSelectedUnit={setSelectedUnit}
                    />
                  )}
                </div>

                <div className="printable-content" style={{ minHeight: '600px' }}>
                  <MultiYearGraph
                    selectedView={selectedView}
                    selectedYears={selectedYears}
                    selectedUnit={selectedUnit}
                    selectedTab={selectedTab}
                    selectedField={selectedField}
                    costFilters={costFilters}
                  />
                  
                  {selectedTab === 'comparison' ? (
                    <MultiYearTable
                      selectedView={selectedView}
                      selectedYears={selectedYears}
                      selectedUnit={selectedUnit}
                      setSelectedUnit={setSelectedUnit}
                      costFilters={costFilters}
                    />
                  ) : (
                    <FieldRotationTable
                      selectedView={selectedView}
                      selectedYears={selectedYears}
                      selectedUnit={selectedUnit}
                      setSelectedUnit={setSelectedUnit}
                      selectedField={selectedField}
                      costFilters={costFilters}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MultiYearPDFWrapper>

      {/* Help Panel */}
      <HelpPanel
        isOpen={showHelpPanel}
        onClose={() => setShowHelpPanel(false)}
        title="Multi-Year Analysis Help"
        content={<MultiYearHelpContent />}
      />
    </div>
  );
}
