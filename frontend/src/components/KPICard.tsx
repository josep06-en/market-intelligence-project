import type { KPIs } from '../types';
import { formatCurrency, formatNumber, formatPercent, getGrowthColor, formatTopCategory, truncateText } from '../utils/format';

interface KPICardProps {
  kpis: KPIs | null;
}

export default function KPICard({ kpis }: KPICardProps) {
  if (!kpis) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const kpiItems = [
    {
      label: 'Total Revenue',
      value: formatCurrency(kpis.total_revenue),
    },
    {
      label: 'Avg Order Value',
      value: formatCurrency(kpis.avg_order_value),
    },
    {
      label: 'Growth Rate',
      value: formatPercent(kpis.growth_rate),
      valueClass: getGrowthColor(kpis.growth_rate),
    },
    {
      label: 'Total Transactions',
      value: formatNumber(kpis.total_transactions),
    },
    {
      label: 'Top Category',
      value: truncateText(formatTopCategory(kpis.top_category), 24),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {kpiItems.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-4"
        >
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
            {item.label}
          </div>
          <div className={`text-lg font-semibold text-gray-900 ${item.valueClass || ''}`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
