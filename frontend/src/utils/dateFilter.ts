import type { TrendPoint, Insight, DateRange } from '../types';

export const filterTrendsByDateRange = (trends: TrendPoint[], dateRange: DateRange): TrendPoint[] => {
  if (!trends || trends.length === 0) return [];
  
  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);
  
  return trends.filter(trend => {
    const trendDate = new Date(trend.date);
    return trendDate >= startDate && trendDate <= endDate;
  });
};

export const filterInsightsByDateRange = (insights: Insight[], dateRange: DateRange): Insight[] => {
  if (!insights || insights.length === 0) return [];
  
  // For now, return all insights since they don't have specific dates
  // In a real implementation, insights would have actual dates
  return insights;
};

export const calculateKPIsForDateRange = (trends: TrendPoint[], dateRange: DateRange) => {
  const filteredTrends = filterTrendsByDateRange(trends, dateRange);
  
  if (filteredTrends.length === 0) {
    return {
      total_revenue: 0,
      avg_order_value: 0,
      growth_rate: 0,
      total_transactions: 0,
      top_category: 'N/A',
      generated_at: new Date().toISOString()
    };
  }
  
  const totalRevenue = filteredTrends.reduce((sum, trend) => sum + trend.revenue, 0);
  const totalTransactions = filteredTrends.reduce((sum, trend) => sum + trend.transactions, 0);
  const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  
  // Calculate growth rate (comparing first and last period)
  const growthRate = filteredTrends.length > 1 
    ? ((filteredTrends[filteredTrends.length - 1].revenue - filteredTrends[0].revenue) / filteredTrends[0].revenue) * 100
    : 0;
  
  return {
    total_revenue: totalRevenue,
    avg_order_value: avgOrderValue,
    growth_rate: growthRate / 100, // Convert to decimal
    total_transactions: totalTransactions,
    top_category: 'beverages', // Default - could be calculated from product data
    generated_at: new Date().toISOString()
  };
};
