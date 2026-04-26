export interface KPIs {
  total_revenue: number;
  avg_order_value: number;
  growth_rate: number;
  total_transactions: number;
  top_category: string;
  generated_at: string;
}

export interface TrendPoint {
  date: string;
  revenue: number;
  transactions: number;
  avg_order_value: number;
}

export interface Insight {
  id: string;
  type: 'alert' | 'recommendation' | 'info' | 'pricing_opportunity' | 'risk';
  severity: 'high' | 'medium' | 'low';
  message: string;
  detail: string;
  affected_period: string;
  metric: string;
}

export interface ProductMetric {
  product_id: string;
  product_name: string;
  category: string;
  current_price: number;
  avg_daily_units: number;
  revenue: number;
  price_volatility: number;
  demand_trend: 'up' | 'down' | 'stable';
  elasticity: number;
  elasticity_category?: string;
}

export interface Recommendation {
  product_id: string;
  product_name: string;
  current_price: number;
  recommended_price: number;
  expected_revenue_change: number;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  action: 'increase_price' | 'decrease_price' | 'keep_price';
  elasticity?: number;
  current_revenue?: number;
}

export interface PricingScenario {
  name: string;
  price_change: number;
  new_price: number;
  new_units: number;
  revenue_change: number;
}

export interface AppData {
  kpis: KPIs | null;
  trends: TrendPoint[];
  insights: Insight[];
  product_metrics: ProductMetric[];
  recommendations: Recommendation[];
}

export interface DateRange {
  start: string;
  end: string;
}
