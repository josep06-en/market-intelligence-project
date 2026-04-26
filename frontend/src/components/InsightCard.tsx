import type { Insight } from '../types';
import { getSeverityColor, getSeverityTextColor, getSeverityBgColor } from '../utils/format';

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const barColor = getSeverityColor(insight.severity);
  const textColor = getSeverityTextColor(insight.severity);
  const bgColor = getSeverityBgColor(insight.severity);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start space-x-4">
      {/* Left color bar */}
      <div className={`w-1 h-full rounded-full ${barColor} min-h-[60px]`}></div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Badges */}
        <div className="flex items-center space-x-2 mb-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${textColor} ${bgColor}`}>
            {insight.severity.toUpperCase()}
          </span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
          </span>
        </div>
        
        {/* Message */}
        <div className="text-base font-medium text-gray-900 mb-1">
          {insight.message}
        </div>
        
        {/* Detail */}
        <div className="text-sm text-gray-600 mb-2">
          {insight.detail}
        </div>
        
        {/* Affected period */}
        <div className="text-xs font-mono text-gray-500">
          {insight.affected_period}
        </div>
      </div>
    </div>
  );
}
