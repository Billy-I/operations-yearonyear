import React from 'react';
import { HelpSectionTitle, HelpParagraph, HelpTip, HelpLink } from './HelpPanel';

const ExplorerHelpContent: React.FC = () => {
  return (
    <div>
      <HelpParagraph>
        The Explorer page provides a comprehensive overview of your farm's performance, 
        including costs, margins, and crop-specific metrics.
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
        Operations costs are a new feature that tracks the expenses associated with field operations
        such as cultivating, drilling, applications, and harvesting. These costs represent approximately
        40% of your total production costs.
      </HelpParagraph>
      
      <HelpParagraph>
        By tracking operations costs separately from variable costs (like seed, fertilizer, and chemicals),
        you can gain deeper insights into your farm's cost structure and identify opportunities for optimization.
      </HelpParagraph>

      <HelpTip>
        Use the "Total costs" checkbox to control which costs are displayed.
        When checked, you'll see Net Margin calculations that include both input and operation costs.
        When unchecked, you'll see Gross Margin calculations based only on input costs.
      </HelpTip>

      <HelpSectionTitle>Cost Categories</HelpSectionTitle>
      <HelpParagraph>
        The "Total costs" checkbox allows you to control which costs are displayed:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li><strong>Checkbox unchecked:</strong> Shows only input costs (seed, fertilizer, and chemicals), which represent about 60% of total costs. When in this mode, you'll see Gross Margin calculations.</li>
        <li><strong>Checkbox checked:</strong> Shows total costs, including both input costs AND operation costs (cultivating, drilling, applications, and harvesting). When in this mode, you'll see Net Margin calculations that reflect your complete cost structure.</li>
      </ul>

      <HelpParagraph>
        By default, the checkbox is checked to show your complete cost picture and true net margins.
        Uncheck it when you want to focus specifically on your input expenses without operations.
      </HelpParagraph>

      <HelpSectionTitle>Farm Overview</HelpSectionTitle>
      <HelpParagraph>
        The Farm Overview section displays key metrics that are affected by your cost category selections:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li><strong>Margin:</strong> Changes between Gross Margin and Net Margin based on selected cost categories</li>
        <li><strong>Total Cost:</strong> Reflects the sum of all enabled cost categories</li>
        <li><strong>Cost per Hectare:</strong> Shows the per-hectare cost based on enabled categories</li>
      </ul>

      <HelpSectionTitle>Crop Performance Table</HelpSectionTitle>
      <HelpParagraph>
        The Crop Performance table shows detailed metrics for each crop. The margin column 
        will display different values based on your cost category selections:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li><strong>GM (Gross Margin):</strong> Shown when only Variable Costs are enabled</li>
        <li><strong>Net Margin:</strong> Shown when both Variable and Operation Costs are enabled</li>
        <li><strong>Margin:</strong> Shown when neither cost category is enabled (revenue only)</li>
      </ul>

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
        Changes made in the Operations Center will be reflected in the Explorer and Crop Performance pages.
      </HelpParagraph>
    </div>
  );
};

export default ExplorerHelpContent;