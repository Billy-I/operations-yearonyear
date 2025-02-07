import React, { useState } from 'react';
import AddBudgetPanel from '../components/AddBudgetPanel';

interface SummaryCardProps {
  title: string;
  value: string;
  info?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, info }) => (
  <div className="p-4 border border-gray-200 rounded-lg">
    <div className="flex items-center gap-1">
      <span className="text-sm text-gray-600">{title}</span>
      {info && (
        <span className="text-gray-400 hover:text-gray-600 cursor-help" title={info}>
          ⓘ
        </span>
      )}
    </div>
    <div className="mt-1 text-lg font-medium text-gray-900">{value}</div>
  </div>
);

interface CropRowProps {
  crop: string;
  area: string;
  seed: string;
  fertiliser: string;
  chemical: string;
  yield: string;
  price: string;
  gm: string;
}

const CropRow: React.FC<CropRowProps> = ({ crop, area, seed, fertiliser, chemical, yield: yieldValue, price, gm }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="py-3 px-4 text-gray-900">{crop}</td>
    <td className="py-3 px-4 text-gray-600">{area}</td>
    <td className="py-3 px-4 text-gray-600">{seed}</td>
    <td className="py-3 px-4 text-gray-600">{fertiliser}</td>
    <td className="py-3 px-4 text-gray-600">{chemical}</td>
    <td className="py-3 px-4 text-gray-600">{yieldValue}</td>
    <td className="py-3 px-4 text-gray-600">{price}</td>
    <td className="py-3 px-4 text-gray-600">{gm}</td>
    <td className="py-3 px-4">
      <button className="text-gray-600 hover:text-gray-900">
        ✏️
      </button>
    </td>
  </tr>
);

interface OperationsRowProps {
  crop: string;
  cultivation: string;
  drilling: string;
  application: string;
  harvesting: string;
  other: string;
}

const OperationsRow: React.FC<OperationsRowProps> = ({ 
  crop, 
  cultivation,
  drilling,
  application,
  harvesting,
  other
}) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="py-3 px-4 text-gray-900">{crop}</td>
    <td className="py-3 px-4 text-gray-600">{cultivation}</td>
    <td className="py-3 px-4 text-gray-600">{drilling}</td>
    <td className="py-3 px-4 text-gray-600">{application}</td>
    <td className="py-3 px-4 text-gray-600">{harvesting}</td>
    <td className="py-3 px-4 text-gray-600">{other}</td>
    <td className="py-3 px-4">
      <button className="text-gray-600 hover:text-gray-900">
        ✏️
      </button>
    </td>
  </tr>
);

const Budgets: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [variableCosts, setVariableCosts] = useState<CropRowProps[]>([
    {
      crop: "Wheat (Winter)",
      area: "130.00 ha",
      seed: "£130.00 /ha",
      fertiliser: "£130.00 /ha",
      chemical: "£130.00 /ha",
      yield: "130.00 t/ha",
      price: "£130.00 /t",
      gm: "£16,510.00 /ha"
    },
    {
      crop: "Triticale (Spring)",
      area: "182.00 ha",
      seed: "£182.00 /ha",
      fertiliser: "£182.00 /ha",
      chemical: "£182.00 /ha",
      yield: "182.00 t/ha",
      price: "£182.00 /t",
      gm: "£32,578.00 /ha"
    },
    {
      crop: "Vining Pea",
      area: "108.00 ha",
      seed: "£108.00 /ha",
      fertiliser: "£108.00 /ha",
      chemical: "£108.00 /ha",
      yield: "108.00 t/ha",
      price: "£108.00 /t",
      gm: "£11,340.00 /ha"
    }
  ]);

  const [operationsCosts, setOperationsCosts] = useState<OperationsRowProps[]>([
    {
      crop: "Wheat (Winter)",
      cultivation: "£6,500.00",
      drilling: "£3,900.00",
      application: "£2,600.00",
      harvesting: "£5,200.00",
      other: "£1,300.00"
    },
    {
      crop: "Triticale (Spring)",
      cultivation: "£9,100.00",
      drilling: "£5,460.00",
      application: "£3,640.00",
      harvesting: "£7,280.00",
      other: "£1,820.00"
    }
  ]);

  const handleAddBudget = (data: any) => {
    // For Variable costs, calculate GM if yield and price are provided
    if (data.type === 'variable') {
      const grossMargin = data.yield && data.price 
        ? (Number(data.yield) * Number(data.price)).toFixed(2)
        : '0.00';

      const newVariableCost: CropRowProps = {
        crop: data.crop,
        area: data.area ? `${data.area} ha` : '0.00 ha',
        seed: data.seed ? `£${data.seed} /ha` : '£0.00 /ha',
        fertiliser: data.fertiliser ? `£${data.fertiliser} /ha` : '£0.00 /ha',
        chemical: data.chemical ? `£${data.chemical} /ha` : '£0.00 /ha',
        yield: data.yield ? `${data.yield} t/ha` : '0.00 t/ha',
        price: data.price ? `£${data.price} /t` : '£0.00 /t',
        gm: `£${grossMargin} /ha`
      };

      // Check if the crop already exists in variable costs
      const existingIndex = variableCosts.findIndex(cost => cost.crop === data.crop);
      if (existingIndex >= 0) {
        // Update existing entry
        const updatedCosts = [...variableCosts];
        updatedCosts[existingIndex] = newVariableCost;
        setVariableCosts(updatedCosts);
      } else {
        // Add new entry
        setVariableCosts([...variableCosts, newVariableCost]);
      }
    }

    // For Operations costs
    if (data.type === 'operations') {
      const newOperationsCost: OperationsRowProps = {
        crop: data.crop,
        cultivation: data.cultivation ? `£${data.cultivation}` : '£0.00',
        drilling: data.drilling ? `£${data.drilling}` : '£0.00',
        application: data.application ? `£${data.application}` : '£0.00',
        harvesting: data.harvesting ? `£${data.harvesting}` : '£0.00',
        other: data.other ? `£${data.other}` : '£0.00'
      };

      // Check if the crop already exists in operations costs
      const existingIndex = operationsCosts.findIndex(cost => cost.crop === data.crop);
      if (existingIndex >= 0) {
        // Update existing entry
        const updatedCosts = [...operationsCosts];
        updatedCosts[existingIndex] = newOperationsCost;
        setOperationsCosts(updatedCosts);
      } else {
        // Add new entry
        setOperationsCosts([...operationsCosts, newOperationsCost]);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">Budgets</h1>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">2025</span>
        </div>
        <select className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 bg-white">
          <option>2025</option>
          <option>2024</option>
        </select>
      </div>

      <h2 className="text-xl font-medium text-gray-900 mb-4">Summary</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <SummaryCard 
          title="Total area" 
          value="2209.17 ha" 
          info="Total area across all crops"
        />
        <SummaryCard 
          title="Total cost" 
          value="£1,139,903.55"
          info="Sum of all variable and operations costs"
        />
        <SummaryCard 
          title="Total sales" 
          value="£46,244,631.76"
          info="Projected total sales based on yield and price"
        />
        <SummaryCard 
          title="Budgeted Gross Margin" 
          value="£45,104,728.21"
          info="Total sales minus total costs"
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900">Crops</h2>
          <button 
            onClick={() => setIsPanelOpen(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            + Add budgets
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Variable Costs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Crop</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Area</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Seed</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Fertiliser</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Chemical</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Yield</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Price</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">GM</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {variableCosts.map((cost, index) => (
                  <CropRow key={index} {...cost} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Operations Costs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Crop</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Cultivation</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Drilling</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Application</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Harvesting</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Other</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {operationsCosts.map((cost, index) => (
                  <OperationsRow key={index} {...cost} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddBudgetPanel 
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onAdd={handleAddBudget}
      />
    </div>
  );
};

export default Budgets;