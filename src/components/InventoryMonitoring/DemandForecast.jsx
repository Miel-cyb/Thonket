import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, Calendar, Package } from 'lucide-react';

const DemandForecasting = () => {
  const [selectedProducts, setSelectedProducts] = useState(['coca-cola', 'bread', 'milk']);

  // Sample FMCG products with realistic demand patterns
  const products = {
    'coca-cola': {
      name: 'Coca-Cola (330ml)',
      color: '#e11d48',
      data: [
        { period: '4 Wks Ago', value: 850 },
        { period: '3 Wks Ago', value: 920 },
        { period: '2 Wks Ago', value: 780 },
        { period: 'Last Week', value: 890 },
        { period: 'This Week', value: 950 },
        { period: 'Next Week', value: 980 },
        { period: 'In 2 Wks', value: 1020 }
      ]
    },
    'bread': {
      name: 'Wonder Bread (Loaf)',
      color: '#f59e0b',
      data: [
        { period: '4 Wks Ago', value: 450 },
        { period: '3 Wks Ago', value: 380 },
        { period: '2 Wks Ago', value: 420 },
        { period: 'Last Week', value: 390 },
        { period: 'This Week', value: 440 },
        { period: 'Next Week', value: 460 },
        { period: 'In 2 Wks', value: 480 }
      ]
    },
    'milk': {
      name: 'Fresh Milk (1L)',
      color: '#3b82f6',
      data: [
        { period: '4 Wks Ago', value: 320 },
        { period: '3 Wks Ago', value: 280 },
        { period: '2 Wks Ago', value: 340 },
        { period: 'Last Week', value: 360 },
        { period: 'This Week', value: 380 },
        { period: 'Next Week', value: 400 },
        { period: 'In 2 Wks', value: 420 }
      ]
    },
    'rice': {
      name: 'Basmati Rice (5kg)',
      color: '#10b981',
      data: [
        { period: '4 Wks Ago', value: 180 },
        { period: '3 Wks Ago', value: 220 },
        { period: '2 Wks Ago', value: 200 },
        { period: 'Last Week', value: 240 },
        { period: 'This Week', value: 210 },
        { period: 'Next Week', value: 250 },
        { period: 'In 2 Wks', value: 270 }
      ]
    },
    'detergent': {
      name: 'Tide Detergent (2kg)',
      color: '#8b5cf6',
      data: [
        { period: '4 Wks Ago', value: 150 },
        { period: '3 Wks Ago', value: 130 },
        { period: '2 Wks Ago', value: 160 },
        { period: 'Last Week', value: 140 },
        { period: 'This Week', value: 170 },
        { period: 'Next Week', value: 180 },
        { period: 'In 2 Wks', value: 190 }
      ]
    },
    'cooking-oil': {
      name: 'Sunflower Oil (1L)',
      color: '#f97316',
      data: [
        { period: '4 Wks Ago', value: 290 },
        { period: '3 Wks Ago', value: 310 },
        { period: '2 Wks Ago', value: 280 },
        { period: 'Last Week', value: 320 },
        { period: 'This Week', value: 340 },
        { period: 'Next Week', value: 360 },
        { period: 'In 2 Wks', value: 380 }
      ]
    }
  };

  // Combine data for chart
  const chartData = products[Object.keys(products)[0]].data.map(item => {
    const dataPoint = { period: item.period };
    selectedProducts.forEach(productKey => {
      if (products[productKey]) {
        const productData = products[productKey].data.find(d => d.period === item.period);
        dataPoint[productKey] = productData ? productData.value : 0;
      }
    });
    return dataPoint;
  });

  // Calculate forecast info for selected products
  const getForecastInfo = () => {
    const threeWeeksAgo = selectedProducts.map(key => {
      const product = products[key];
      if (!product) return null;
      const value = product.data.find(d => d.period === '3 Wks Ago')?.value || 0;
      return { name: product.name, value };
    }).filter(Boolean);

    return threeWeeksAgo;
  };

  const toggleProduct = (productKey) => {
    setSelectedProducts(prev => 
      prev.includes(productKey) 
        ? prev.filter(key => key !== productKey)
        : [...prev, productKey]
    );
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => {
            const product = products[entry.dataKey];
            return (
              <div key={index} className="flex items-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-700">{product?.name}:</span>
                <span className="text-sm font-medium text-gray-900">{entry.value} units</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const maxValue = Math.max(...selectedProducts.flatMap(key => 
    products[key]?.data.map(d => d.value) || []
  ));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-purple-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Demand Forecasting</h2>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        AI-powered demand forecast for top-moving products based on historical sales data and market trends.
      </p>

      {/* Forecast Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">3 Wks Ago Forecast</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {getForecastInfo().map((item, index) => (
            <div key={index} className="text-sm">
              <span className="text-gray-600">{item.name}:</span>
              <span className="ml-1 font-medium text-gray-900">{item.value} units</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                domain={[0, Math.ceil(maxValue * 1.2 / 100) * 100]}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
                label={{ value: 'units', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '12px' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              {selectedProducts.map(productKey => {
                const product = products[productKey];
                if (!product) return null;
                return (
                  <Line
                    key={productKey}
                    type="monotone"
                    dataKey={productKey}
                    stroke={product.color}
                    strokeWidth={2}
                    dot={{ fill: product.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: product.color, strokeWidth: 2 }}
                    name={product.name}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Selection */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Select Products</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {Object.entries(products).map(([key, product]) => (
            <button
              key={key}
              onClick={() => toggleProduct(key)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedProducts.includes(key)
                  ? 'bg-gray-100 text-gray-900 border border-gray-300'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: product.color }}
              />
              {product.name}
            </button>
          ))}
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          Click products to toggle visibility in the chart
        </div>
      </div>
    </div>
  );
};

export default DemandForecasting;