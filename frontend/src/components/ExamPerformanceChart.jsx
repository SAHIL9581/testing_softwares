// FILE: src/components/ExamPerformanceChart.jsx

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';

// Custom Tooltip for better styling and information
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800 dark:text-gray-200">{label}</p>
        <p style={{ color: payload[0].color }}>
          {`${payload[0].name}: ${payload[0].value.toFixed(1)}%`}
        </p>
        <p style={{ color: payload[1].color }}>
          {`${payload[1].name}: ${payload[1].value.toFixed(1)}%`}
        </p>
      </div>
    );
  }
  return null;
};

export const ExamPerformanceChart = ({ data }) => {
  return (
    // ResponsiveContainer makes the chart fit its parent's size
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
        <XAxis 
          dataKey="name" 
          angle={-20} 
          textAnchor="end" 
          height={70} 
          interval={0} 
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          tickFormatter={(tick) => `${tick}%`}
          domain={[0, 100]}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(206, 206, 206, 0.2)' }} />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar 
          dataKey="averageScore" 
          fill="hsl(var(--primary))" 
          name="Average Score" 
          radius={[4, 4, 0, 0]}
        >
          <LabelList dataKey="averageScore" position="top" formatter={(value) => `${value.toFixed(0)}%`} fill="hsl(var(--foreground))" />
        </Bar>
        <Bar 
          dataKey="participationRate" 
          fill="hsl(var(--secondary-foreground))" 
          fillOpacity={0.6}
          name="Participation Rate" 
          radius={[4, 4, 0, 0]}
        >
          <LabelList dataKey="participationRate" position="top" formatter={(value) => `${value.toFixed(0)}%`} fill="hsl(var(--muted-foreground))" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};