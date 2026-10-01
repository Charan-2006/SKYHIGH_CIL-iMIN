import React from 'react';
import type { ShapValue } from '../types';

interface ShapWaterfallProps {
  shapValues: ShapValue[];
  baseValue: number;
  predictionValue: number;
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({
  shapValues,
  baseValue,
  predictionValue
}) => {
  // Let's determine scaling boundaries
  // Typically GCV ranges between 2500 and 7500. We will base percentages on this range.
  const minRange = 2500;
  const maxRange = 7500;
  const range = maxRange - minRange;

  const getPercent = (value: number) => {
    return ((value - minRange) / range) * 100;
  };

  const getWidthPercent = (value: number) => {
    return (Math.abs(value) / range) * 100;
  };

  // We trace the cumulative values to draw the waterfall segments
  let currentCumulative = baseValue;

  return (
    <div className="w-full bg-white border border-cortex-border rounded-xl p-6 shadow-premium">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-cortex-border/50 pb-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-cortex-dark uppercase tracking-wide">
            SHAP Contribution Analysis
          </h3>
          <p className="text-xs text-cortex-gray mt-0.5">
            Local Feature Importance (Waterfall Chart)
          </p>
        </div>
        
        {/* Legends */}
        <div className="flex gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gold-500"></span>
            <span className="text-cortex-gray">Positive Impact</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cortex-gray"></span>
            <span className="text-cortex-gray">Negative Impact</span>
          </div>
        </div>
      </div>

      {/* Axis markers */}
      <div className="relative w-full h-8 mb-2">
        <div className="absolute left-[30%] -translate-x-1/2 text-[10px] font-bold text-cortex-light-gray font-mono">3,000</div>
        <div className="absolute left-[50%] -translate-x-1/2 text-[10px] font-bold text-cortex-light-gray font-mono">5,000</div>
        <div className="absolute left-[70%] -translate-x-1/2 text-[10px] font-bold text-cortex-light-gray font-mono">7,000</div>
        {/* Baseline grid line */}
        <div 
          className="absolute bottom-0 h-4 w-[1px] bg-cortex-border"
          style={{ left: `${getPercent(baseValue)}%` }}
        ></div>
      </div>

      {/* Waterfall Rows */}
      <div className="flex flex-col gap-4 relative">
        {/* Center baseline reference line running vertically */}
        <div 
          className="absolute top-0 bottom-0 w-[1.5px] bg-cortex-border/60 border-dashed border-l border-cortex-light-gray/30"
          style={{ left: `${getPercent(baseValue)}%` }}
        ></div>

        {/* 1. Base Value Row */}
        <div className="flex items-center justify-between text-xs py-1 z-10">
          <div className="w-1/3 flex flex-col">
            <span className="font-bold text-cortex-dark">E[f(X)] BASE VALUE</span>
            <span className="text-[10px] text-cortex-gray">Baseline Expectation</span>
          </div>
          
          <div className="w-2/3 relative h-6">
            {/* Indicator Dot */}
            <div 
              className="absolute h-4 w-4 rounded-full bg-white border-2 border-cortex-gray -translate-x-1/2 top-1 shadow-sm"
              style={{ left: `${getPercent(baseValue)}%` }}
            ></div>
            <span 
              className="absolute text-[10px] font-bold text-cortex-dark font-mono -translate-x-1/2 -top-4"
              style={{ left: `${getPercent(baseValue)}%` }}
            >
              {baseValue} kcal/kg
            </span>
          </div>
        </div>

        {/* 2. Feature Contributions Rows */}
        {shapValues.map((item, index) => {
          const startVal = currentCumulative;
          currentCumulative += item.value;
          const endVal = currentCumulative;

          const startPct = getPercent(Math.min(startVal, endVal));
          const widthPct = getWidthPercent(item.value);
          const isPositive = item.impact === 'positive';

          return (
            <div key={index} className="flex items-center justify-between text-xs py-1.5 z-10 border-t border-cortex-border/30">
              {/* Feature Details */}
              <div className="w-1/3 flex flex-col">
                <span className="font-bold text-cortex-dark">{item.feature}</span>
                <span className="text-[10px] text-cortex-gray">Value: {item.actualValue || (item as any).actual_value}</span>
              </div>

              {/* Waterfall bar */}
              <div className="w-2/3 relative h-8 flex items-center">
                <div 
                  className={`absolute h-4.5 rounded transition-all ${
                    isPositive ? 'bg-gold-500' : 'bg-cortex-gray'
                  }`}
                  style={{ 
                    left: `${startPct}%`,
                    width: `${Math.max(1, widthPct)}%`
                  }}
                ></div>
                
                {/* Numeric Impact Badge */}
                <span 
                  className={`absolute text-[10px] font-bold font-mono ${
                    isPositive ? 'text-gold-800' : 'text-cortex-gray'
                  }`}
                  style={{ 
                    left: `${getPercent(Math.max(startVal, endVal)) + 1.5}%`
                  }}
                >
                  {isPositive ? `+${item.value}` : item.value}
                </span>
              </div>
            </div>
          );
        })}

        {/* 3. Final Prediction Result Row */}
        <div className="flex items-center justify-between text-xs py-3 border-t-2 border-cortex-border z-10">
          <div className="w-1/3 flex flex-col">
            <span className="font-extrabold text-gold-900 tracking-wide">f(x) PREDICTION</span>
            <span className="text-[10px] text-cortex-gray">Final Predicted GCV</span>
          </div>

          <div className="w-2/3 relative h-8 flex items-center">
            {/* Long solid gold bar representing final value from 0 to prediction */}
            <div 
              className="absolute h-5 bg-gold-800 rounded shadow-sm border border-gold-900/10"
              style={{ 
                left: `${getPercent(minRange)}%`,
                width: `${getPercent(predictionValue)}%`
              }}
            ></div>

            {/* Display value badge */}
            <span 
              className="absolute text-xs font-bold text-white bg-gold-900 px-2 py-0.5 rounded shadow-sm font-mono -translate-x-1/2 -top-1"
              style={{ left: `${getPercent(predictionValue)}%` }}
            >
              {predictionValue} GCV
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShapWaterfall;
