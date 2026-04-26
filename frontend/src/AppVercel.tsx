import { useState } from 'react';
import { embeddedData } from './data';
import type { AppData } from './types';
import { validateKPIs, validateTrends, validateInsights, validateProductMetrics, validateRecommendations } from './utils/validate';
import { filterTrendsByDateRange, filterInsightsByDateRange, calculateKPIsForDateRange } from './utils/dateFilter';
import Navbar from './components/Navbar';
import Strategy from './pages/Strategy';
import Simulation from './pages/Simulation';
import Performance from './pages/Performance';
import Insights from './pages/Insights';
import type { DateRange } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('strategy');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: '2025-01-01',
    end: '2025-12-31'
  });

  // Use embedded data for Vercel deployment
  const rawData: AppData = {
    kpis: validateKPIs(embeddedData.kpis),
    trends: validateTrends(embeddedData.trends),
    insights: validateInsights(embeddedData.insights),
    product_metrics: validateProductMetrics(embeddedData.product_metrics),
    recommendations: validateRecommendations(embeddedData.recommendations)
  };

  // Calculate filtered data based on date range
  const filteredData = {
    kpis: rawData.trends.length > 0 ? calculateKPIsForDateRange(rawData.trends, dateRange) : null,
    trends: filterTrendsByDateRange(rawData.trends, dateRange),
    insights: filterInsightsByDateRange(rawData.insights),
    product_metrics: rawData.product_metrics, // Not date-filtered for now
    recommendations: rawData.recommendations // Not date-filtered for now
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'strategy':
        return <Strategy recommendations={filteredData.recommendations} insights={filteredData.insights} onPageChange={setCurrentPage} />;
      case 'simulation':
        return <Simulation productMetrics={filteredData.product_metrics} />;
      case 'performance':
        return <Performance kpis={filteredData.kpis} trends={filteredData.trends} />;
      case 'insights':
        return <Insights insights={filteredData.insights} />;
      default:
        return <Strategy recommendations={filteredData.recommendations} insights={filteredData.insights} onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      {renderPage()}
    </div>
  );
}

export default App;
