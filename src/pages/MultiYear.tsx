import { useState } from 'react';
import { MultiYearHeader } from '../components/analytics/MultiYearHeader';
import { MultiYearControls } from '../components/analytics/MultiYearControls';
import { MultiYearTable } from '../components/analytics/MultiYearTable';
import { MultiYearGraph } from '../components/analytics/MultiYearGraph';
import { ViewType, UnitType, TabType, MetricType } from '../types/analytics';
import { AVAILABLE_YEARS } from '../constants/analytics';

export default function MultiYear() {
  const [selectedView, setSelectedView] = useState<ViewType>('Variable');
  const [selectedYears, setSelectedYears] = useState<string[]>([...AVAILABLE_YEARS]);
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('£/t');
  const [selectedCrop, setSelectedCrop] = useState('Wheat(Winter)');
  const [selectedFilter, setSelectedFilter] = useState('None');
  const [selectedTab, setSelectedTab] = useState<TabType>('comparison');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('costOfProduction');

  return (
    <div className="p-6">
      <MultiYearHeader 
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        selectedYears={selectedYears}
        setSelectedYears={setSelectedYears}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
      />

      <div className="mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col space-y-4">
            <MultiYearControls
              selectedCrop={selectedCrop}
              setSelectedCrop={setSelectedCrop}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
            
            <MultiYearTable
              selectedView={selectedView}
              selectedYears={selectedYears}
              selectedUnit={selectedUnit}
              setSelectedUnit={setSelectedUnit}
            />
            
            <MultiYearGraph
              selectedView={selectedView}
              selectedYears={selectedYears}
              selectedUnit={selectedUnit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
