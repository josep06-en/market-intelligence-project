import { useState, useMemo } from 'react';
import type { Recommendation, ProductMetric, PricingScenario } from '../types';
import { formatCurrency, formatPercent, getConfidenceColor, getActionColor } from '../utils/format';

interface StrategyProps {
  recommendations: Recommendation[];
  productMetrics: ProductMetric[];
}

const simulatePricingScenarios = (product: ProductMetric): PricingScenario[] => {
  const scenarios = [
    { name: 'decrease_10', price_change: -0.10 },
    { name: 'no_change', price_change: 0.0 },
    { name: 'increase_10', price_change: 0.10 }
  ];

  return scenarios.map(scenario => {
    const new_price = product.current_price * (1 + scenario.price_change);
    const elasticity = product.elasticity || -0.5;
    const price_change_pct = scenario.price_change * 100;
    const quantity_change_pct = elasticity * price_change_pct;
    const new_units = product.avg_daily_units * (1 + quantity_change_pct / 100);
    const new_revenue = new_price * new_units * 365;
    const current_revenue = product.current_price * product.avg_daily_units * 365;
    const revenue_change = ((new_revenue - current_revenue) / current_revenue) * 100;

    return {
      name: scenario.name.replace('_', ' ').toUpperCase(),
      price_change: scenario.price_change,
      new_price: Number(new_price.toFixed(2)),
      new_units: Number(new_units.toFixed(2)),
      revenue_change: Number(revenue_change.toFixed(2))
    };
  });
};

const getRevenueChangeColor = (change: number): string => {
  return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
};

export default function Strategy({ recommendations, productMetrics }: StrategyProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [sortBy, setSortBy] = useState<'revenue_change' | 'confidence'>('revenue_change');

  const selectedProductData = useMemo(() => {
    return productMetrics.find(p => p.product_id === selectedProduct);
  }, [selectedProduct, productMetrics]);

  const pricingScenarios = useMemo(() => {
    return selectedProductData ? simulatePricingScenarios(selectedProductData) : [];
  }, [selectedProductData]);

  const sortedRecommendations = useMemo(() => {
    return [...recommendations].sort((a, b) => {
      if (sortBy === 'revenue_change') {
        return b.expected_revenue_change - a.expected_revenue_change;
      } else {
        const confidenceOrder = { high: 3, medium: 2, low: 1 };
        return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
      }
    });
  }, [recommendations, sortBy]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value as 'revenue_change' | 'confidence';
    setSortBy(newSortBy);
  };

  return (
    <div className="pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Pricing Strategy Engine
        </h1>

        {/* Recommendations Table */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Actionable Recommendations ({sortedRecommendations.length})
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                Sorted by: {sortBy === 'revenue_change' ? 'Revenue Impact' : 'Confidence'}
              </span>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="revenue_change">Sort by Revenue Impact</option>
                <option value="confidence">Sort by Confidence</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table key={`table-${sortBy}`} className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Current Price</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Recommended</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Revenue Impact</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Confidence</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Action</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Reason</th>
                </tr>
              </thead>
              <tbody key={`tbody-${sortBy}`}>
                {sortedRecommendations.map((rec) => (
                  <tr key={rec.product_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div>
                        <div className="font-medium text-gray-900">{rec.product_name}</div>
                        <div className="text-xs text-gray-500">{rec.product_id}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-900">
                      {formatCurrency(rec.current_price)}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-medium ${getActionColor(rec.action)}`}>
                        {formatCurrency(rec.recommended_price)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-medium ${getRevenueChangeColor(rec.expected_revenue_change)}`}>
                        {formatPercent(rec.expected_revenue_change)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(rec.confidence)}`}>
                        {rec.confidence.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-medium text-xs ${getActionColor(rec.action)}`}>
                        {rec.action.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600 text-xs max-w-xs truncate">
                      {rec.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Simulation */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Product Pricing Simulation
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Choose a product...</option>
              {productMetrics.map((product) => (
                <option key={product.product_id} value={product.product_id}>
                  {product.product_name} - {formatCurrency(product.current_price)}
                </option>
              ))}
            </select>
          </div>

          {selectedProductData && (
            <div>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
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

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 mb-3">Scenario Analysis</h3>
                {pricingScenarios.map((scenario) => (
                  <div key={scenario.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                      <span className={`font-medium ${getRevenueChangeColor(scenario.revenue_change)}`}>
                        {formatPercent(scenario.revenue_change)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">New Price</div>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(scenario.new_price)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Daily Units</div>
                        <div className="font-medium text-gray-900">
                          {scenario.new_units.toFixed(1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Annual Revenue</div>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(scenario.new_price * scenario.new_units * 365)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
