import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { KPIs, TrendPoint } from '../types';
import { formatCurrency, formatNumber, formatPercent, getGrowthColor } from '../utils/format';

interface PerformanceProps {
  kpis: KPIs | null;
  trends: TrendPoint[];
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

export default function Performance({ kpis, trends }: PerformanceProps) {
  const chartData = trends.map(trend => ({
    ...trend,
    displayDate: formatDate(trend.date),
  }));

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Performance Metrics
        </h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          {kpis ? (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                  Total Revenue
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(kpis.total_revenue)}
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                  Growth Rate
                </div>
                <div className={`text-2xl font-bold ${getGrowthColor(kpis.growth_rate)}`}>
                  {formatPercent(kpis.growth_rate)}
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                  Total Transactions
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(kpis.total_transactions)}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Revenue Trends
          </h2>
          <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 300 : 400}>
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatK(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}
