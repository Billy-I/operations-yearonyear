import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Leaf, Filter, X, Check } from 'lucide-react';
import { MultiYearHeader } from '../components/analytics/MultiYearHeader';
import { MultiYearControls } from '../components/analytics/MultiYearControls';
import { FieldRotationControls } from '../components/analytics/FieldRotationControls';
import { MultiYearTable } from '../components/analytics/MultiYearTable';
import { FieldRotationTable } from '../components/analytics/FieldRotationTable';
import { MultiYearGraph } from '../components/analytics/MultiYearGraph';
import { MultiYearPDFWrapper } from '../components/analytics/MultiYearPDF';
import { ViewType, UnitType, TabType, ViewLevel, MetricsData } from '../types/analytics';

// Define the metric types
type BasicMetricType = Exclude<keyof MetricsData, 'chemicalBreakdown'>;
type CompositeMetricType = 'variableCosts' | 'operationsCosts' | 'totalCosts';
type DataMetricType = BasicMetricType | CompositeMetricType;
import { AVAILABLE_YEARS, AVAILABLE_CROPS, AVAILABLE_FILTERS } from '../constants/analytics';
import { fieldsData } from '../data/fieldData';
import { HelpPanel, MultiYearHelpContent, FeatureNotification } from '../components/help';
import { ExpandableSection } from '../components/analytics/ExpandableSection';
import { CropSummaryCard, FieldSummaryCard } from '../components/analytics/SummaryCards';

// Get the type of available crops from the constant
type AvailableCrop = typeof AVAILABLE_CROPS[number];

export default function MultiYear() {
  const location = useLocation();
  const referrer = location.state?.from || '/analytics/explorer';
  const [selectedView, setSelectedView] = useState<ViewType>('Total');
  const [selectedYears, setSelectedYears] = useState<string[]>([...AVAILABLE_YEARS]);
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('£/t');
  const [selectedCrop, setSelectedCrop] = useState<AvailableCrop>(AVAILABLE_CROPS[0]);
  const [selectedCrops, setSelectedCrops] = useState<AvailableCrop[]>([AVAILABLE_CROPS[0]]);
  const [selectedFilter, setSelectedFilter] = useState('None');
  const [selectedTab, setSelectedTab] = useState<TabType>('comparison');
  const [selectedField, setSelectedField] = useState(fieldsData[0].id);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  
  // New state for the progressive disclosure approach
  const [viewLevel, setViewLevel] = useState<ViewLevel>('farm');
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [selectedComparisonMetric, setSelectedComparisonMetric] = useState<DataMetricType>('grossMargin');

  // Always show both variable and operations costs
  const costFilters = {
    variable: true,
    operations: true
  };

  // Handle view level changes
  useEffect(() => {
    if (viewLevel === 'crop') {
      setSelectedTab('comparison');
      if (selectedEntity) {
        // For backward compatibility
        setSelectedCrop(selectedEntity as AvailableCrop);
        // Initialize selectedCrops with the single selected crop
        setSelectedCrops([selectedEntity as AvailableCrop]);
      }
    } else if (viewLevel === 'field') {
      setSelectedTab('rotation');
      if (selectedEntity) {
        setSelectedField(selectedEntity);
      }
    }
  }, [viewLevel, selectedEntity]);

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
                    <p>Use the View Level selector to switch between Farm Overview, Crop Analysis, and Field Analysis views.</p>
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
                {/* Controls Section */}
                <div className="flex justify-between items-center mb-4">
                  {/* Left side controls */}
                  <div className="flex items-end space-x-4">
                    {/* View Level selector */}
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">View Level</label>
                      <select 
                        value={viewLevel}
                        onChange={(e) => {
                          setViewLevel(e.target.value as ViewLevel);
                          setSelectedEntity(null);
                        }}
                        className="bg-gray-50 px-3 py-2 rounded-md"
                      >
                        <option value="farm">Farm Overview</option>
                        <option value="crop">Crop Analysis</option>
                        <option value="field">Field Analysis</option>
                      </select>
                    </div>
                    
                    {/* Entity selector - shown only when in crop view */}
                    {viewLevel === 'crop' && (
                      <>
                        {/* Multi-select Crop selector */}
                        <div>
                          <label className="text-sm text-gray-600 mb-2 block">Crop(s)</label>
                          <div className="relative">
                            <div
                              className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md cursor-pointer"
                              onClick={() => setShowCropDropdown(!showCropDropdown)}
                            >
                              <Leaf className="w-5 h-5 text-gray-500" />
                              <div className="flex-1 min-w-[200px]">
                                {selectedCrops.length === 1 ? (
                                  <span>{selectedCrops[0]}</span>
                                ) : (
                                  <span>{selectedCrops.length} crops selected</span>
                                )}
                              </div>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            
                            {showCropDropdown && (
                              <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-50 w-full">
                                {AVAILABLE_CROPS.map(crop => (
                                  <label key={crop} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={selectedCrops.includes(crop)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedCrops([...selectedCrops, crop]);
                                          // For backward compatibility
                                          setSelectedCrop(crop);
                                        } else {
                                          // Don't allow deselecting all crops
                                          if (selectedCrops.length > 1) {
                                            const newSelectedCrops = selectedCrops.filter(c => c !== crop);
                                            setSelectedCrops(newSelectedCrops);
                                            // For backward compatibility
                                            setSelectedCrop(newSelectedCrops[0]);
                                          }
                                        }
                                      }}
                                      className="mr-2"
                                    />
                                    {crop}
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Metrics Selector */}
                        <div>
                          <label className="text-sm text-gray-600 mb-2 block">Metrics</label>
                          <select
                            value={selectedComparisonMetric}
                            onChange={(e) => setSelectedComparisonMetric(e.target.value as DataMetricType)}
                            className="bg-gray-50 px-3 py-2 rounded-md"
                          >
                            <optgroup label="General">
                              <option value="production">Production</option>
                              <option value="yield">Yield</option>
                            </optgroup>
                            
                            <optgroup label="Input Costs">
                              <option value="costOfProduction">Cost of Production</option>
                              <option value="seed">Seed</option>
                              <option value="fertiliser">Fertiliser</option>
                              <option value="chemicals">Chemicals</option>
                              <option value="variableCosts">Input Costs</option>
                              <option value="grossMargin">Gross Margin</option>
                            </optgroup>
                            
                            <optgroup label="Operations Costs">
                              <option value="cultivating">Cultivating</option>
                              <option value="drilling">Drilling</option>
                              <option value="applications">Applications</option>
                              <option value="harvesting">Harvesting</option>
                              <option value="other">Other</option>
                              <option value="operationsCosts">Operations Costs</option>
                            </optgroup>
                            
                            <optgroup label="Combined">
                              <option value="totalCosts">Total Costs</option>
                              <option value="netMargin">Net Margin</option>
                            </optgroup>
                          </select>
                        </div>
                      </>
                    )}
                    
                    {/* Field selector - shown only in field view */}
                    {viewLevel === 'field' && (
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">Field</label>
                        <select 
                          value={selectedEntity || selectedField}
                          onChange={(e) => setSelectedEntity(e.target.value)}
                          className="bg-gray-50 px-3 py-2 rounded-md"
                        >
                          {fieldsData.map(field => (
                            <option key={field.id} value={field.id}>{field.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - Unit selector */}
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Display Units</label>
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
                      <div className="flex items-center space-x-2">
                        <button
                          className={`px-2 py-1 text-xs rounded ${selectedUnit === '£/t' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                          onClick={() => setSelectedUnit('£/t')}
                        >
                          £/t
                        </button>
                        <button
                          className={`px-2 py-1 text-xs rounded ${selectedUnit === '£/ha' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                          onClick={() => setSelectedUnit('£/ha')}
                        >
                          £/ha
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main visualization components */}
                <div className="printable-content" style={{ minHeight: '600px' }}>
                  <MultiYearGraph
                    selectedView={selectedView}
                    selectedYears={selectedYears}
                    selectedUnit={selectedUnit}
                    selectedTab={viewLevel === 'field' ? 'rotation' : 'comparison'}
                    selectedField={viewLevel === 'field' ? (selectedEntity || selectedField) : undefined}
                    selectedCrop={selectedCrop}
                    selectedCrops={selectedCrops}
                    costFilters={costFilters}
                    selectedMetric={selectedComparisonMetric}
                  />
                  
                  {viewLevel === 'field' ? (
                    <FieldRotationTable
                      selectedView={selectedView}
                      selectedYears={selectedYears}
                      selectedUnit={selectedUnit}
                      setSelectedUnit={setSelectedUnit}
                      selectedField={selectedEntity || selectedField}
                      costFilters={costFilters}
                    />
                  ) : (
                    <MultiYearTable
                      selectedView={selectedView}
                      selectedYears={selectedYears}
                      selectedUnit={selectedUnit}
                      setSelectedUnit={setSelectedUnit}
                      selectedCrop={selectedCrop}
                      selectedCrops={selectedCrops}
                      costFilters={costFilters}
                      selectedComparisonMetric={selectedComparisonMetric}
                      setSelectedComparisonMetric={setSelectedComparisonMetric}
                    />
                  )}
                </div>

                {/* Progressive disclosure sections removed as requested */}

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
