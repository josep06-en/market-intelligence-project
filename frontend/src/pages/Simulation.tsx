import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ProductMetric, PricingScenario } from '../types';
import { formatCurrency, formatPercent, getConfidenceColor, getActionColor } from '../utils/format';

interface SimulationProps {
  productMetrics: ProductMetric[];
}

const simulatePricingScenarios = (product: ProductMetric): PricingScenario[] => {
  const scenarios = [
    { name: 'Price Decrease', price_change: -0.10 },
    { name: 'Current', price_change: 0.0 },
    { name: 'Price Increase', price_change: 0.10 }
  ];

  return scenarios.map(scenario => {
    const currentPrice = product?.current_price ?? 10;
    const avgDailyUnits = product?.avg_daily_units ?? 100;
    const elasticity = product?.elasticity ?? -0.5;
    
    const new_price = currentPrice * (1 + scenario.price_change);
    const price_change_pct = scenario.price_change * 100;
    const quantity_change_pct = elasticity * price_change_pct;
    const new_units = avgDailyUnits * (1 + quantity_change_pct / 100);
    const new_revenue = new_price * new_units * 365;
    const current_revenue = currentPrice * avgDailyUnits * 365;
    const revenue_change = current_revenue > 0 ? ((new_revenue - current_revenue) / current_revenue) * 100 : 0;

    return {
      name: scenario.name,
      price_change: scenario.price_change,
      new_price: Number(new_price.toFixed(2)),
      new_units: Number(new_units.toFixed(2)),
      revenue_change: Number(revenue_change.toFixed(2))
    };
  });
};

const getBestScenario = (scenarios: PricingScenario[]): PricingScenario => {
  return scenarios.reduce((best, current) => 
    current.revenue_change > best.revenue_change ? current : best
  );
};

const getScenarioColor = (scenario: PricingScenario): string => {
  if (scenario.price_change < 0) return '#3B82F6'; // Blue for decrease
  if (scenario.price_change > 0) return '#10B981'; // Green for increase
  return '#6B7280'; // Gray for current
};

export default function Simulation({ productMetrics }: SimulationProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const selectedProductData = useMemo(() => {
    return (productMetrics || []).find(p => p?.product_id === selectedProduct);
  }, [selectedProduct, productMetrics]);

  const pricingScenarios = useMemo(() => {
    return selectedProductData ? simulatePricingScenarios(selectedProductData) : [];
  }, [selectedProductData]);

  const bestScenario = useMemo(() => {
    return pricingScenarios.length > 0 ? getBestScenario(pricingScenarios) : null;
  }, [pricingScenarios]);

  const chartData = useMemo(() => {
    return pricingScenarios.map(scenario => ({
      name: scenario.name,
      revenue: scenario.new_price * scenario.new_units * 365,
      revenueChange: scenario.revenue_change
    }));
  }, [pricingScenarios]);

  const confidence = useMemo(() => {
    if (!bestScenario) return 'low';
    if (Math.abs(bestScenario.revenue_change) > 10) return 'high';
    if (Math.abs(bestScenario.revenue_change) > 5) return 'medium';
    return 'low';
  }, [bestScenario]);

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
          Pricing Simulation Lab
        </h1>

        {/* Product Selector */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Select a Product to Simulate
            </h2>
            <p className="text-sm text-gray-600">
              Compare pricing scenarios to find the optimal strategy
            </p>
          </div>

          <div className="max-w-md mx-auto sm:max-w-lg">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a product...</option>
              {productMetrics.map((product) => (
                <option key={product.product_id} value={product.product_id}>
                  {product.product_name} - {formatCurrency(product.current_price)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedProductData && (
          <>
            {/* Scenario Comparison Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                Revenue Comparison by Scenario
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis 
                    tickFormatter={(value) => formatK(value)} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value), 'Annual Revenue']}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={getScenarioColor(pricingScenarios[index])} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Decision Box */}
            {bestScenario && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-xl p-8 mb-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Recommended Action
                  </h3>
                  
                  <div className="mb-6">
                    <div className={`inline-block px-6 py-3 rounded-lg text-lg font-semibold ${getActionColor(bestScenario.price_change > 0 ? 'increase_price' : 'decrease_price')}`}>
                      {bestScenario.price_change > 0 ? 'Increase Price' : 'Decrease Price'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">New Price</div>
                      <div className="text-xl font-semibold text-gray-900">
                        {formatCurrency(bestScenario.new_price)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Expected Impact</div>
                      <div className={`text-xl font-semibold ${bestScenario.revenue_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercent(bestScenario.revenue_change)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Confidence</div>
                      <div className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getConfidenceColor(confidence)}`}>
                        {confidence.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 max-w-2xl mx-auto">
                    {bestScenario.price_change > 0 
                      ? `Increase price by ${formatPercent(bestScenario.price_change * 100)} to maximize revenue. 
                         Price elasticity suggests minimal volume loss with significant revenue gain.`
                      : `Decrease price by ${formatPercent(Math.abs(bestScenario.price_change) * 100)} to drive volume. 
                         Elastic demand indicates strong revenue potential from increased sales.`
                    }
                  </div>
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Current Product Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Current Price</div>
                  <div className="font-medium text-gray-900">
                    {formatCurrency(selectedProductData.current_price)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Daily Units</div>
                  <div className="font-medium text-gray-900">
                    {selectedProductData.avg_daily_units.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Elasticity</div>
                  <div className="font-medium text-gray-900">
                    {selectedProductData.elasticity.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Demand Trend</div>
                  <div className="font-medium text-gray-900 capitalize">
                    {selectedProductData.demand_trend}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function formatK(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}
