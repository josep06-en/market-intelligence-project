import { useState } from 'react';
import type { Insight, DateRange } from '../types';
import InsightCard from '../components/InsightCard';

type SeverityFilter = 'all' | 'high' | 'medium' | 'low';

interface InsightsProps {
  insights: Insight[];
  dateRange: DateRange;
}

export default function Insights({ insights, dateRange }: InsightsProps) {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');

  const filteredInsights = insights.filter(insight => {
    // Filter by severity
    if (severityFilter !== 'all' && insight.severity !== severityFilter) {
      return false;
    }
    
    // Filter by date range (check if affected_period overlaps with selected range)
    const [start, end] = insight.affected_period.split(' / ');
    if (start && end) {
      const insightStart = start.trim();
      const insightEnd = end.trim();
      return insightStart <= dateRange.end && insightEnd >= dateRange.start;
    }
    
    return true;
  });

  const severityButtons: SeverityFilter[] = ['all', 'high', 'medium', 'low'];

  return (
    <div className="pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Market Insights
        </h1>
        
        {/* Filter Row */}
        <div className="flex space-x-2 mb-6">
          {severityButtons.map((filter) => (
            <button
              key={filter}
              onClick={() => setSeverityFilter(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                severityFilter === filter
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Insights List */}
        {filteredInsights.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="text-gray-500 text-sm">
              No insights for this period
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
