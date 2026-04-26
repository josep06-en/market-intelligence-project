import { useState } from 'react';
import type { DateRange } from '../types';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
  isFiltering?: boolean;
}

export default function Navbar({ currentPage, onPageChange, dateRange, onDateRangeChange, isFiltering = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'strategy', label: 'Strategy' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'performance', label: 'Performance' },
    { id: 'insights', label: 'Insights' },
  ];

  const datePresets = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 90 Days', value: 90 },
    { label: 'Last 60 Days', value: 60 },
    { label: 'Last 30 Days', value: 30 },
    { label: 'Last 7 Days', value: 7 },
  ];

  const getDateRange = (days: number | 'all'): DateRange => {
    if (days === 'all') {
      return { start: '2025-01-01', end: '2025-12-31' };
    }
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  };

  const handleDatePresetChange = (preset: number | 'all') => {
    const newRange = getDateRange(preset);
    onDateRangeChange(newRange);
  };

  const getCurrentPreset = () => {
    // Check if it's "all time"
    if (dateRange.start === '2025-01-01' && dateRange.end === '2025-12-31') {
      return 'all';
    }
    
    // Find matching preset
    for (const preset of datePresets) {
      if (preset.value !== 'all') {
        const presetRange = getDateRange(preset.value as number);
        if (presetRange.start === dateRange.start && presetRange.end === dateRange.end) {
          return preset.value;
        }
      }
    }
    
    return 'all'; // Default to 'all' if no match found
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-full px-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between h-14">
          {/* Logo */}
          <div className="font-mono text-sm font-semibold">
            MIDE<span className="text-blue-500">.</span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-gray-900 underline underline-offset-4'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                value={getCurrentPreset()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'all') {
                    handleDatePresetChange('all');
                  } else {
                    handleDatePresetChange(parseInt(value));
                  }
                }}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {datePresets.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded flex items-center space-x-1">
              {isFiltering && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
              {dateRange.start} → {dateRange.end}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="font-mono text-sm font-semibold">
              MIDE<span className="text-blue-500">.</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="py-4 border-t border-gray-200">
              {/* Navigation Links */}
              <div className="space-y-2 mb-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Date Range Selector */}
              <div className="px-3 py-2">
                <div className="mb-2">
                  <label className="text-xs font-medium text-gray-700">Date Range</label>
                </div>
                <select
                  value={getCurrentPreset()}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'all') {
                      handleDatePresetChange('all');
                    } else {
                      handleDatePresetChange(parseInt(value));
                    }
                  }}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  {datePresets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded flex items-center space-x-1">
                  {isFiltering && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                  {dateRange.start} → {dateRange.end}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
