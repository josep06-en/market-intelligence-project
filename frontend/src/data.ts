// Embedded data for Vercel deployment
// This avoids file loading issues on serverless deployment

import kpisData from '../../data/processed/kpis.json';
import trendsData from '../../data/processed/trends.json';
import insightsData from '../../data/processed/insights.json';
import productMetricsData from '../../data/processed/product_metrics.json';
import recommendationsData from '../../data/processed/recommendations.json';

export const embeddedData = {
  kpis: kpisData,
  trends: trendsData,
  insights: insightsData,
  product_metrics: productMetricsData,
  recommendations: recommendationsData
};
