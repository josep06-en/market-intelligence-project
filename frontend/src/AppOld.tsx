import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Strategy from './pages/Strategy';
import Simulation from './pages/Simulation';
import Performance from './pages/Performance';
import Insights from './pages/Insights';
import type { AppData, DateRange } from './types';
import { validateKPIs, validateTrends, validateInsights, validateProductMetrics, validateRecommendations } from './utils/validate';
import { filterTrendsByDateRange, filterInsightsByDateRange, calculateKPIsForDateRange } from './utils/dateFilter';

// Import embedded data for Vercel fallback
import { embeddedData } from './data';

function App() {
  const [rawData, setRawData] = useState<AppData>({
    kpis: null,
    trends: [],
    insights: [],
    product_metrics: [],
    recommendations: []
  });
  const [currentPage, setCurrentPage] = useState('strategy');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: '2025-01-01',
    end: '2025-12-31'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Calculate filtered data based on date range
  const filteredData = {
    kpis: rawData.trends.length > 0 ? calculateKPIsForDateRange(rawData.trends, dateRange) : null,
    trends: filterTrendsByDateRange(rawData.trends, dateRange),
    insights: filterInsightsByDateRange(rawData.insights),
    product_metrics: rawData.product_metrics, // Not date-filtered for now
    recommendations: rawData.recommendations // Not date-filtered for now
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [kpisResponse, trendsResponse, insightsResponse, productMetricsResponse, recommendationsResponse] = await Promise.all([
          fetch('/data/processed/kpis.json'),
          fetch('/data/processed/trends.json'),
          fetch('/data/processed/insights.json'),
          fetch('/data/processed/product_metrics.json'),
          fetch('/data/processed/recommendations.json')
        ]);

        if (!kpisResponse.ok || !trendsResponse.ok || !insightsResponse.ok || !productMetricsResponse.ok || !recommendationsResponse.ok) {
          throw new Error('Failed to load data files');
        }

        const [kpisData, trendsData, insightsData, productMetricsData, recommendationsData] = await Promise.all([
          kpisResponse.json(),
          trendsResponse.json(),
          insightsResponse.json(),
          productMetricsResponse.json(),
          recommendationsResponse.json()
        ]);

        setRawData({
          kpis: validateKPIs(kpisData),
          trends: validateTrends(trendsData),
          insights: validateInsights(insightsData),
          product_metrics: validateProductMetrics(productMetricsData),
          recommendations: validateRecommendations(recommendationsData)
        });
      } catch (err) {
        console.error('Detailed error:', err);
        console.error('Error type:', typeof err);
        console.error('Error message:', err instanceof Error ? err.message : String(err));
        
        // Fallback to embedded data for Vercel deployment
        console.warn('Using embedded data fallback for Vercel deployment');
        setRawData({
          kpis: validateKPIs(embeddedData.kpis),
          trends: validateTrends(embeddedData.trends),
          insights: validateInsights(embeddedData.insights),
          product_metrics: validateProductMetrics(embeddedData.product_metrics),
          recommendations: validateRecommendations(embeddedData.recommendations)
        });
        
        setError(null); // Clear error since we're using fallback
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Only load data once on mount

  useEffect(() => {
    if (rawData.trends.length > 0) {
      setIsFiltering(true);
      // Brief delay to show filtering state
      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [dateRange, rawData.trends.length]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-sm text-gray-600">Loading market intelligence data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('App error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error loading data</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        isFiltering={isFiltering}
      />
      {renderPage()}
    </div>
  );
}

export default App;
