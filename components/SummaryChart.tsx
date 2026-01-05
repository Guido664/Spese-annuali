import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense, FrequencyMultipliers } from '../types';

interface SummaryChartProps {
  expenses: Expense[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const SummaryChart: React.FC<SummaryChartProps> = ({ expenses }) => {
  // Calculate data for chart (Top 5 expenses + Other)
  const data = expenses.map(e => ({
    name: e.name,
    value: e.amount * FrequencyMultipliers[e.frequency]
  })).sort((a, b) => b.value - a.value);

  const displayData = data.slice(0, 5);
  const otherValue = data.slice(5).reduce((acc, curr) => acc + curr.value, 0);

  if (otherValue > 0) {
    displayData.push({ name: 'Altro', value: otherValue });
  }

  // Calculate total for percentage display
  const totalValue = displayData.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  if (expenses.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Ripartizione Costi Annuali</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {displayData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => {
                const percent = ((value / totalValue) * 100).toFixed(1);
                return [`${formatCurrency(value)} (${percent}%)`, 'Costo Annuo'];
              }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SummaryChart;