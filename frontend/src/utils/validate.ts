import type { KPIs, TrendPoint, Insight, ProductMetric, Recommendation } from '../types';

export const validateKPIs = (data: any): KPIs | null => {
  if (!data || typeof data !== 'object') return null;
  
  const required = ['total_revenue', 'avg_order_value', 'growth_rate', 'total_transactions', 'top_category', 'generated_at'];
  for (const field of required) {
    if (!(field in data)) return null;
  }
  
  return {
    total_revenue: Number(data.total_revenue) || 0,
    avg_order_value: Number(data.avg_order_value) || 0,
    growth_rate: Number(data.growth_rate) || 0,
    total_transactions: Number(data.total_transactions) || 0,
    top_category: String(data.top_category || ''),
    generated_at: String(data.generated_at || ''),
  };
};

export const validateTrends = (data: any): TrendPoint[] => {
  if (!Array.isArray(data)) return [];
  
  return data.filter((item): item is TrendPoint => {
    if (!item || typeof item !== 'object') return false;
    return ['date', 'revenue', 'transactions', 'avg_order_value'].every(field => field in item);
  }).map(item => ({
    date: String(item.date || ''),
    revenue: Number(item.revenue) || 0,
    transactions: Number(item.transactions) || 0,
    avg_order_value: Number(item.avg_order_value) || 0,
  }));
};

export const validateInsights = (data: any): Insight[] => {
  if (!Array.isArray(data)) return [];
  
  return data.filter((item): item is Insight => {
    if (!item || typeof item !== 'object') return false;
    const required = ['id', 'type', 'severity', 'message', 'detail', 'affected_period', 'metric'];
    return required.every(field => field in item);
  }).map(item => ({
    id: String(item.id || ''),
    type: (['alert', 'recommendation', 'info', 'pricing_opportunity', 'risk'].includes(item.type)) ? item.type : 'info' as const,
    severity: (item.severity === 'high' || item.severity === 'medium' || item.severity === 'low') ? item.severity : 'low' as const,
    message: String(item.message || ''),
    detail: String(item.detail || ''),
    affected_period: String(item.affected_period || ''),
    metric: String(item.metric || ''),
  }));
};

export const validateProductMetrics = (data: any): ProductMetric[] => {
  if (!Array.isArray(data)) return [];
  
  return data.filter((item): item is ProductMetric => {
    if (!item || typeof item !== 'object') return false;
    const required = ['product_id', 'product_name', 'category', 'current_price', 'avg_daily_units', 'revenue', 'price_volatility', 'demand_trend', 'elasticity'];
    return required.every(field => field in item);
  }).map(item => ({
    product_id: String(item.product_id || ''),
    product_name: String(item.product_name || ''),
    category: String(item.category || ''),
    current_price: Number(item.current_price) || 0,
    avg_daily_units: Number(item.avg_daily_units) || 0,
    revenue: Number(item.revenue) || 0,
    price_volatility: Number(item.price_volatility) || 0,
    demand_trend: (['up', 'down', 'stable'].includes(item.demand_trend)) ? item.demand_trend : 'stable' as const,
    elasticity: Number(item.elasticity) || 0,
    elasticity_category: String(item.elasticity_category || ''),
  }));
};

export const validateRecommendations = (data: any): Recommendation[] => {
  if (!Array.isArray(data)) return [];
  
  return data.filter((item): item is Recommendation => {
    if (!item || typeof item !== 'object') return false;
    const required = ['product_id', 'product_name', 'current_price', 'recommended_price', 'expected_revenue_change', 'confidence', 'reason', 'action'];
    return required.every(field => field in item);
  }).map(item => ({
    product_id: String(item.product_id || ''),
    product_name: String(item.product_name || ''),
    current_price: Number(item.current_price) || 0,
    recommended_price: Number(item.recommended_price) || 0,
    expected_revenue_change: Number(item.expected_revenue_change) || 0,
    confidence: (['high', 'medium', 'low'].includes(item.confidence)) ? item.confidence : 'low' as const,
    reason: String(item.reason || ''),
    action: (['increase_price', 'decrease_price', 'keep_price'].includes(item.action)) ? item.action : 'keep_price' as const,
    elasticity: Number(item.elasticity) || 0,
    current_revenue: Number(item.current_revenue) || 0,
  }));
};
