import { useMemo } from 'react';
import type { Insight } from '../types';
import { getSeverityColor } from '../utils/format';

interface InsightsProps {
  insights: Insight[];
}

export default function Insights({ insights }: InsightsProps) {
  // Get top insights (6-8 insights sorted by severity)
  const topInsights = useMemo(() => {
    return insights
      .sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .slice(0, 8);
  }, [insights]);

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
          Key Insights
        </h1>

        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Top {topInsights.length} insights sorted by severity
            </p>
          </div>

          <div className="space-y-4">
            {topInsights.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-lg mb-2">No insights available</div>
                <div className="text-sm">Try adjusting the date range to see more insights</div>
              </div>
            ) : (
              topInsights.map((insight) => (
              <div key={insight.id} className="border-l-4 border-gray-200 pl-4 py-3 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(insight.severity)}`}>
                        {insight.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {insight.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {insight.message}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {insight.detail}
                    </p>
                    <div className="text-xs text-gray-500">
                      {insight.affected_period} • {insight.metric}
                    </div>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
}
