import React from 'react';
import { HelpSectionTitle, HelpParagraph, HelpTip, HelpLink } from './HelpPanel';

const CropPerformanceHelpContent: React.FC = () => {
  return (
    <div>
      <HelpParagraph>
        The Crop Performance page provides detailed insights into a specific crop's performance, 
        including costs, yields, profitability, and operational metrics.
      </HelpParagraph>

      <div className="mb-4 bg-blue-50 p-3 rounded-md border border-blue-200">
        <div className="font-medium text-blue-800 mb-1">Customize Your Operations Costs</div>
        <HelpLink to="/data/operations">
          <div className="flex items-center text-blue-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Go to Operations Center
          </div>
        </HelpLink>
      </div>
      
      <HelpSectionTitle>Operations Costs</HelpSectionTitle>
      <HelpParagraph>
        Operations costs track the expenses associated with field operations such as cultivating,
        drilling, applications, and harvesting. These costs represent approximately 40% of your
        total production costs.
      </HelpParagraph>
      
      <HelpParagraph>
        By tracking operations costs separately from variable costs (like seed, fertilizer, and chemicals),
        you can gain deeper insights into your crop's cost structure and identify opportunities for optimization.
      </HelpParagraph>

      <HelpTip>
        Use the Cost Categories toggle to switch between "Input Costs" and "Total Costs" views.
        When "Input Costs" is selected, you'll see Gross Margin calculations.
        When "Total Costs" is selected, you'll see Net Margin calculations that include both input and operation costs.
      </HelpTip>

      <HelpSectionTitle>Cost Categories</HelpSectionTitle>
      <HelpParagraph>
        The "Cost Categories" toggle allows you to switch between two cost views:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li><strong>Input Costs:</strong> Includes only seed, fertilizer, and chemicals (60% of total costs). When this option is selected, you'll see Gross Margin calculations.</li>
        <li><strong>Total Costs:</strong> Includes both input costs AND operation costs (cultivating, drilling, applications, and harvesting). When this option is selected, you'll see Net Margin calculations that reflect your complete cost structure.</li>
      </ul>
      
      <HelpParagraph>
        By default, the toggle is set to "Total Costs" to show your complete cost picture and true net margins.
        Switch to "Input Costs" when you want to focus specifically on your input expenses without operations.
      </HelpParagraph>

      <HelpSectionTitle>KPI Cards</HelpSectionTitle>
      <HelpParagraph>
        The KPI cards at the top of the page display key metrics that are affected by your cost category selections:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li><strong>Yield & Production:</strong> Shows your crop's yield performance compared to market benchmarks</li>
        <li><strong>Area Information:</strong> Displays field and area statistics for this crop</li>
        <li><strong>Costs:</strong> Shows per hectare, per tonne, and total costs based on enabled cost categories</li>
        <li><strong>Profitability:</strong> Displays Gross Margin and Net Margin based on enabled cost categories</li>
      </ul>

      <HelpSectionTitle>Unified Cost Chart</HelpSectionTitle>
      <HelpParagraph>
        The cost chart visualizes your cost structure and provides different views to analyze your data:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li><strong>Distribution View:</strong> Shows the breakdown of costs by category</li>
        <li><strong>Financial Impact View:</strong> Illustrates how costs affect your overall profitability</li>
      </ul>

      <HelpParagraph>
        The chart dynamically updates based on your cost category selections, allowing you to see 
        the impact of including or excluding operations costs.
      </HelpParagraph>

      <HelpSectionTitle>Performance Table</HelpSectionTitle>
      <HelpParagraph>
        The Performance Table shows detailed metrics for different varieties, fields, or regions 
        (depending on your grouping selection). The margin columns will display different values 
        based on your cost category selections:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li><strong>Gross Margin:</strong> Shown when only Variable Costs are enabled</li>
        <li><strong>Net Margin:</strong> Shown when both Variable and Operation Costs are enabled</li>
      </ul>

      <HelpSectionTitle>Cost Breakdowns</HelpSectionTitle>
      <HelpParagraph>
        The expandable cost panels at the bottom of the page provide detailed breakdowns of:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li><strong>Variable Costs:</strong> Seed, fertilizer, and chemicals (with subcategories)</li>
        <li><strong>Operation Costs:</strong> Cultivations, drilling, applications, and harvesting</li>
      </ul>

      <HelpParagraph>
        These panels allow you to drill down into specific cost components to identify areas for optimization.
      </HelpParagraph>

      <HelpSectionTitle>Customizing Operations Costs</HelpSectionTitle>
      <HelpParagraph>
        You can customize your operations costs in the Operations Center. This allows you to:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li>Add or remove specific operations</li>
        <li>Adjust cost values for each operation</li>
        <li>Create custom operation categories</li>
        <li>Filter operations by crop, field, or other criteria</li>
      </ul>

      <HelpParagraph>
        Changes made in the Operations Center will be reflected in this Crop Performance page.
      </HelpParagraph>
    </div>
  );
};

export default CropPerformanceHelpContent;