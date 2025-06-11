import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface CashFlowDataPoint {
  month: string;
  salesWheat?: number;
  salesBarley?: number;
  salesOats?: number;
  salesOilseedRape?: number;
  invoiceSeed?: number;
  invoiceFertiliser?: number;
  invoiceChemical?: number;
  netCashFlow: number;
}

interface CashFlowWidgetProps {
  data: CashFlowDataPoint[];
  title: string;
}

const COLORS = {
  salesWheat: '#F59E0B', // Accent-1 400 (Yellow-Orange)
  salesBarley: '#3B82F6', // Graph color-1 500 (Blue)
  salesOats: '#F97316', // Warning 500 (Orange)
  salesOilseedRape: '#1E40AF', // Graph color-1 700 (Dark Blue)
  invoiceSeed: '#059855', // Success 400 (Green)
  invoiceFertiliser: '#10B981', // Success 500 (Bright Green)
  invoiceChemical: '#DC2626', // Danger 500 (Red)
  netCashFlow: '#1F2937', // Neutral-1 700 (Dark Gray)
};

const CashFlowWidget: React.FC<CashFlowWidgetProps> = ({ data, title }) => {
  // Prepare data for stacked bars. Invoices should be negative for stacking below zero.
  const chartData = data.map(item => ({
    ...item,
    // Sales are positive
    salesWheat: item.salesWheat || 0,
    salesBarley: item.salesBarley || 0,
    salesOats: item.salesOats || 0,
    salesOilseedRape: item.salesOilseedRape || 0,
    // Invoices are negative (or will be plotted to appear as such)
    invoiceSeed: item.invoiceSeed ? -Math.abs(item.invoiceSeed) : 0,
    invoiceFertiliser: item.invoiceFertiliser ? -Math.abs(item.invoiceFertiliser) : 0,
    invoiceChemical: item.invoiceChemical ? -Math.abs(item.invoiceChemical) : 0,
  }));

  return (
    <div 
      className="p-4 md:p-6"
      style={{
        background: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
    >
      <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-700">{title}</h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis 
              tickFormatter={(value) => `${value}`} 
              label={{ value: 'Cash Flow (£000)', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12, dy: 40 }}
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']} // Auto domain based on data, e.g. [-300, 150]
            />
            <Tooltip formatter={(value: number, name: string) => [`£${value.toFixed(2)}k`, name.replace(/([A-Z])/g, ' $1').trim()]} />
            <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => value.replace(/([A-Z])/g, ' $1').trim()} />
            
            {/* Sales Bars (Positive Stack) */}
            <Bar dataKey="salesWheat" stackId="sales" fill={COLORS.salesWheat} name="Sale - Wheat" />
            <Bar dataKey="salesBarley" stackId="sales" fill={COLORS.salesBarley} name="Sale - Barley" />
            <Bar dataKey="salesOats" stackId="sales" fill={COLORS.salesOats} name="Sale - Oats" />
            <Bar dataKey="salesOilseedRape" stackId="sales" fill={COLORS.salesOilseedRape} name="Sale - Oilseed Rape" />

            {/* Invoice Bars (Negative Stack - plotted as negative values) */}
            <Bar dataKey="invoiceSeed" stackId="invoices" fill={COLORS.invoiceSeed} name="Invoice - Seed" />
            <Bar dataKey="invoiceFertiliser" stackId="invoices" fill={COLORS.invoiceFertiliser} name="Invoice - Fertiliser" />
            <Bar dataKey="invoiceChemical" stackId="invoices" fill={COLORS.invoiceChemical} name="Invoice - Chemical" />
            
            <Line type="monotone" dataKey="netCashFlow" stroke={COLORS.netCashFlow} strokeWidth={2} dot={{ r: 4 }} name="Net Cash Flow" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowWidget;
