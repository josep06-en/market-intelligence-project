import type { KPIs } from '../types';
import KPICard from '../components/KPICard';

interface OverviewProps {
  kpis: KPIs | null;
}

export default function Overview({ kpis }: OverviewProps) {
  return (
    <div className="pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Market Intelligence Overview
        </h1>
        <KPICard kpis={kpis} />
      </div>
    </div>
  );
}
