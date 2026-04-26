import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TrendPoint, DateRange } from '../types';
import { formatDate, formatK } from '../utils/format';

interface TrendsProps {
  trends: TrendPoint[];
  dateRange: DateRange;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <div className="text-sm font-medium text-gray-900 mb-1">
          {label}
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>Revenue: ${formatK(data.revenue)}</div>
          <div>Transactions: {data.transactions}</div>
          <div>Avg Order: ${data.avg_order_value.toFixed(2)}</div>
        </div>
      </div>
    );
  }
  return null;
};

export default function Trends({ trends, dateRange }: TrendsProps) {
  const filteredTrends = trends.filter(trend => {
    return trend.date >= dateRange.start && trend.date <= dateRange.end;
  });

  const chartData = filteredTrends.map(trend => ({
    ...trend,
    displayDate: formatDate(trend.date),
  }));

  return (
    <div className="pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Revenue Trends
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="displayDate" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${formatK(value)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
