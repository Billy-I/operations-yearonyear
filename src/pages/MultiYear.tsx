import { useState } from 'react';
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

// Get the type of available crops from the constant
type AvailableCrop = typeof AVAILABLE_CROPS[number];

export default function MultiYear() {
  const [selectedView, setSelectedView] = useState<ViewType>('Variable');
  const [selectedYears, setSelectedYears] = useState<string[]>([...AVAILABLE_YEARS]);
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('£/t');
  const [selectedCrop, setSelectedCrop] = useState<AvailableCrop>(AVAILABLE_CROPS[0]);
  const [selectedFilter, setSelectedFilter] = useState('None');
  const [selectedTab, setSelectedTab] = useState<TabType>('comparison');
  const [selectedField, setSelectedField] = useState(fieldsData[0].id);

  return (
    <div>
      <MultiYearPDFWrapper>
        <div className="p-6">
          <MultiYearHeader
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
            selectedUnit={selectedUnit}
          />

          <div className="mt-6">
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
                    />
                  ) : (
                    <FieldRotationControls
                      selectedField={selectedField}
                      setSelectedField={setSelectedField}
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                    />
                  )}
                </div>

                <div className="printable-content" style={{ minHeight: '600px' }}>
                  {selectedTab === 'comparison' ? (
                    <MultiYearTable
                      selectedView={selectedView}
                      selectedYears={selectedYears}
                      selectedUnit={selectedUnit}
                      setSelectedUnit={setSelectedUnit}
                    />
                  ) : (
                    <FieldRotationTable
                      selectedView={selectedView}
                      selectedYears={selectedYears}
                      selectedUnit={selectedUnit}
                      setSelectedUnit={setSelectedUnit}
                      selectedField={selectedField}
                    />
                  )}
                  
                  <MultiYearGraph
                    selectedView={selectedView}
                    selectedYears={selectedYears}
                    selectedUnit={selectedUnit}
                    selectedTab={selectedTab}
                    selectedField={selectedField}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MultiYearPDFWrapper>
    </div>
  );
}
