import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { AppData } from './types';
import { validateKPIs, validateTrends, validateInsights, validateProductMetrics, validateRecommendations } from './utils/validate';
import { filterTrendsByDateRange, filterInsightsByDateRange, calculateKPIsForDateRange } from './utils/dateFilter';
import Navbar from './components/Navbar';
import Strategy from './pages/Strategy';
import Simulation from './pages/Simulation';
import Performance from './pages/Performance';
import Insights from './pages/Insights';
import ErrorBoundary from './ErrorBoundary';
import type { DateRange } from './types';

interface AppState {
  kpis: AppData['kpis'];
  trends: AppData['trends'];
  insights: AppData['insights'];
  product_metrics: AppData['product_metrics'];
  recommendations: AppData['recommendations'];
}

function App() {
  const [data, setData] = useState<AppState>({
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        
        // Load required files individually for better error handling
        const fileUrls = [
          '/data/processed/kpis.json',
          '/data/processed/trends.json', 
          '/data/processed/insights.json',
          '/data/processed/product_metrics.json',
          '/data/processed/recommendations.json'
        ];

        const results = await Promise.allSettled(
          fileUrls.map(url => fetch(url))
        );

        const loadedData: AppState = {
          kpis: null,
          trends: [],
          insights: [],
          product_metrics: [],
          recommendations: []
        };

        // Process each result
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const url = fileUrls[i];
          const filename = url.split('/').pop() || '';

          if (result.status === 'fulfilled') {
            const response = result.value;
            if (response.ok) {
              try {
                const data = await response.json();
                                
                // Validate and store data
                switch (filename) {
                  case 'kpis.json':
                    loadedData.kpis = validateKPIs(data);
                    break;
                  case 'trends.json':
                    loadedData.trends = validateTrends(data);
                    break;
                  case 'insights.json':
                    loadedData.insights = validateInsights(data);
                    break;
                  case 'product_metrics.json':
                    loadedData.product_metrics = validateProductMetrics(data);
                    break;
                  case 'recommendations.json':
                    loadedData.recommendations = validateRecommendations(data);
                    break;
                }
              } catch (parseErr) {
                              }
            } else {
                          }
          } else {
                      }
        }

        
        // Set data even if some files failed - app should never crash
        setData(loadedData);

      } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
        
        // Set empty data to prevent app crash
        setData({
          kpis: null,
          trends: [],
          insights: [],
          product_metrics: [],
          recommendations: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Only load data once on mount

  // Calculate filtered data based on date range
  const filteredData = {
    kpis: (data.trends || []).length > 0 ? calculateKPIsForDateRange(data.trends || [], dateRange) : null,
    trends: filterTrendsByDateRange(data.trends || [], dateRange),
    insights: filterInsightsByDateRange(data.insights || [], dateRange),
    product_metrics: data.product_metrics || [],
    recommendations: data.recommendations || []
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'strategy':
        return (
          <Strategy 
            recommendations={filteredData.recommendations} 
            insights={filteredData.insights} 
            onPageChange={setCurrentPage} 
          />
        );
      case 'simulation':
        return <Simulation productMetrics={filteredData.product_metrics} />;
      case 'performance':
        return <Performance kpis={filteredData.kpis} trends={filteredData.trends} />;
      case 'insights':
        return <Insights insights={filteredData.insights} />;
      default:
        return (
          <Strategy 
            recommendations={filteredData.recommendations} 
            insights={filteredData.insights} 
            onPageChange={setCurrentPage} 
          />
        );
    }
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-red-500 mb-4">Error loading data</div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          {renderPage()}
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
