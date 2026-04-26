
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatK = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getGrowthColor = (growthRate: number): string => {
  return growthRate >= 0 ? 'text-green-600' : 'text-red-600';
};

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-amber-100 text-amber-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getSeverityTextColor = (severity: string): string => {
  switch (severity) {
    case 'high':
      return 'text-red-700';
    case 'medium':
      return 'text-amber-700';
    case 'low':
      return 'text-green-700';
    default:
      return 'text-gray-700';
  }
};

export const getSeverityBgColor = (severity: string): string => {
  switch (severity) {
    case 'high':
      return 'bg-red-50';
    case 'medium':
      return 'bg-amber-50';
    case 'low':
      return 'bg-green-50';
    default:
      return 'bg-gray-50';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const formatTopCategory = (category: string): string => {
  return category.replace(/_/g, ' ');
};

export const getConfidenceColor = (confidence: string): string => {
  switch (confidence) {
    case 'high':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-amber-100 text-amber-800';
    case 'low':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getActionColor = (action: string): string => {
  switch (action) {
    case 'increase_price':
      return 'text-green-600';
    case 'decrease_price':
      return 'text-red-600';
    case 'keep_price':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
};

