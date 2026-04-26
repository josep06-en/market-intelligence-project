import { useMemo } from 'react';
import type { Recommendation, Insight } from '../types';
import { formatCurrency, formatPercent, getActionColor } from '../utils/format';

interface StrategyProps {
  recommendations: Recommendation[];
  insights: Insight[];
  onPageChange: (page: string) => void;
}

export default function Strategy({ recommendations, insights, onPageChange }: StrategyProps) {

  // Calculate global impact
  const globalImpact = useMemo(() => {
    if (!recommendations || recommendations.length === 0) return 0;
    const totalRevenueChange = recommendations.reduce((sum, rec) => sum + (rec?.expected_revenue_change ?? 0), 0);
    const avgImpact = totalRevenueChange / recommendations.length;
    return avgImpact;
  }, [recommendations]);

  // Get top recommendations (5-8 products)
  const topRecommendations = useMemo(() => {
    return (recommendations || [])
      .filter(rec => rec?.action !== 'keep_price')
      .sort((a, b) => (b?.expected_revenue_change ?? 0) - (a?.expected_revenue_change ?? 0))
      .slice(0, 8);
  }, [recommendations]);

  // Get top insights (3 insights)
  const topInsights = useMemo(() => {
    return (insights || [])
      .sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return (severityOrder[b?.severity || 'low'] ?? 1) - (severityOrder[a?.severity || 'low'] ?? 1);
      })
      .slice(0, 3);
  }, [insights]);

  
  // Show loading state if no data
  if ((!recommendations || recommendations.length === 0) && (!insights || insights.length === 0)) {
    return (
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Pricing Strategy
          </h1>
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="text-gray-500">Loading pricing data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Pricing Strategy
        </h1>

        {/* Global Impact Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Total Projected Revenue Impact
            </h2>
            <div className="text-3xl sm:text-4xl font-bold mb-2">
              {formatPercent(globalImpact)}
            </div>
            <p className="text-blue-100 text-sm sm:text-base">
              If all top recommendations are implemented
            </p>
          </div>
        </div>

        {/* Top Recommendations */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Top Recommendations ({topRecommendations.length})
            </h2>
            <button 
              onClick={() => onPageChange('simulation')}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Simulation →
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {topRecommendations.map((rec) => (
              <div key={rec.product_id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                      {rec.product_name}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm">
                      <span className="text-gray-500">Current:</span>
                      <span className="font-medium">{formatCurrency(rec.current_price)}</span>
                      <span className="text-gray-500">→</span>
                      <span className="font-medium">{formatCurrency(rec.recommended_price)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end space-y-2">
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(rec.action)} self-start sm:self-auto`}>
                      {rec.action.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(rec.expected_revenue_change)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Revenue Impact
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => onPageChange('simulation')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <div className="font-medium">Run Pricing Simulation</div>
                <div className="text-sm text-blue-100">Test scenarios for any product</div>
              </button>
              <button 
                onClick={() => onPageChange('performance')}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div className="font-medium">View Performance Metrics</div>
                <div className="text-sm text-gray-500">Track revenue and growth</div>
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Summary Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Recommendations</span>
                <span className="font-medium">{recommendations.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price Increases</span>
                <span className="font-medium text-green-600">
                  {recommendations.filter(r => r.action === 'increase_price').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price Decreases</span>
                <span className="font-medium text-red-600">
                  {recommendations.filter(r => r.action === 'decrease_price').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High Confidence</span>
                <span className="font-medium">
                  {recommendations.filter(r => r.confidence === 'high').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Insights */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Key Insights
          </h2>
          <div className="space-y-3">
            {topInsights.map((insight) => (
              <div key={insight.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  insight.severity === 'high' ? 'bg-red-500' :
                  insight.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">
                    {insight.message}
                  </div>
                  <div className="text-sm text-gray-600">
                    {insight.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
