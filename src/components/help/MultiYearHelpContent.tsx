import React from 'react';
import { HelpSectionTitle, HelpParagraph, HelpTip, HelpLink } from './HelpPanel';

const MultiYearHelpContent: React.FC = () => {
  return (
    <div>
      <HelpParagraph>
        The Multi-Year Analysis page allows you to compare crop performance across multiple years,
        helping you identify trends, make data-driven decisions, and optimize your farm's profitability.
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
      
      <HelpSectionTitle>What is Multi-Year Analysis?</HelpSectionTitle>
      
      <HelpParagraph>
        Multi-Year Analysis is a powerful tool that enables you to track and compare your farm's 
        performance metrics across multiple growing seasons. By analyzing historical data alongside 
        current figures, you can:
      </HelpParagraph>
      
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li>Identify long-term trends in crop performance</li>
        <li>Evaluate the impact of different farming practices over time</li>
        <li>Make more informed decisions about crop selection and rotation</li>
        <li>Better understand the year-to-year variability in costs and margins</li>
        <li>Set realistic benchmarks based on historical performance</li>
      </ul>

      <HelpTip>
        Use the year selector at the top of the page to choose which years to include in your analysis.
        You can select multiple years to compare or focus on specific time periods.
      </HelpTip>

      <HelpSectionTitle>Analysis Tabs</HelpSectionTitle>
      <HelpParagraph>
        The Multi-Year Analysis page offers two different analysis views:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li><strong>Crop Comparison:</strong> Compare the performance of a specific crop across multiple years</li>
        <li><strong>Field Rotation:</strong> Analyze how different crops have performed in the same field over time</li>
      </ul>

      <HelpSectionTitle>Operations Costs in Multi-Year Analysis</HelpSectionTitle>
      <HelpParagraph>
        The Multi-Year Analysis now includes operations costs alongside traditional input costs, 
        providing a more complete picture of your farm's financial performance over time.
      </HelpParagraph>
      
      <HelpParagraph>
        Operations costs track expenses associated with field activities such as cultivating, 
        drilling, applications, and harvesting. These costs typically represent approximately 
        40% of total production costs and are now fully integrated into your multi-year analysis.
      </HelpParagraph>

      <HelpParagraph>
        By analyzing operations costs across multiple years, you can:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li>Identify which operations have become more or less expensive over time</li>
        <li>Compare the operational efficiency of different crops</li>
        <li>Evaluate the impact of changing practices on your overall cost structure</li>
        <li>Make more informed decisions about machinery investments and operational strategies</li>
      </ul>

      <HelpTip>
        The Multi-Year Analysis always shows both variable and operations costs to provide the most 
        complete picture of your farm's financial performance over time.
      </HelpTip>

      <HelpSectionTitle>Data Visualization</HelpSectionTitle>
      <HelpParagraph>
        The Multi-Year Analysis page includes both tabular data and graphical representations:
      </HelpParagraph>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li><strong>Tables:</strong> Provide detailed numerical data for precise comparisons</li>
        <li><strong>Graphs:</strong> Visualize trends and patterns that might not be immediately apparent in the raw data</li>
      </ul>

      <HelpParagraph>
        You can switch between different view types (Total, Per Hectare, Per Tonne) and units (£/ha, £/t) 
        to analyze your data from different perspectives.
      </HelpParagraph>

      <HelpSectionTitle>Exporting Your Analysis</HelpSectionTitle>
      <HelpParagraph>
        You can export your Multi-Year Analysis as a PDF report to share with partners, advisors, 
        or for your own records. The PDF includes all the tables and graphs from your current view.
      </HelpParagraph>
    </div>
  );
};

export default MultiYearHelpContent;