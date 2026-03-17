import React from 'react';

const MetricCard = ({ title, value, unit, changePercent, changeValue, description, isPositive }) => {
  const changeClass = isPositive ? 'text-green-500' : 'text-red-500';
  const arrow = isPositive ? '▲' : '▼';

  return (
    <div className="bg-card shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-6 rounded-xl shadow-lg flex-1">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="text-4xl font-bold mt-1">
        {value.toLocaleString('en-US')}
        <span className="text-lg text-gray-500 ml-1">XAF</span>
      </div>
      <div className="mt-4">
        <span className={`${changeClass} font-semibold mr-2`}>
          {arrow} {changePercent}%
        </span>
        <span className="text-xs text-gray-500">
          {changeValue} transactions
        </span>
      </div>
      <p className="text-sm text-gray-400 mt-2">
        {description}
      </p>
    </div>
  );
};

export default MetricCard;