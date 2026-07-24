import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw, Cpu, TrendingUp, Check } from 'lucide-react';

interface LoaderProps {
  onComplete?: () => void;
  durationMs?: number;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete, durationMs = 5000 }) => {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Phases and sub-steps matching the slide
  const steps = [
    { phase: 'INGESTION PHASE', icon: RefreshCw, items: ['Reading Laboratory Report...', 'Cleaning Data...', 'Feature Engineering...'] },
    { phase: 'INFERENCE ENGINE', icon: Cpu, items: ['Running XGBoost Regression...', 'Predicting GCV...', 'Calculating Confidence...'] },
    { phase: 'DECISION LAYER', icon: TrendingUp, items: ['Generating SHAP Explanation...', 'Running Blend Optimizer...', 'Preparing Executive Recommendation...'] }
  ];

  const totalSubsteps = steps.reduce((acc, step) => acc + step.items.length, 0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);

      // Determine which sub-step is active
      const currentSubIndex = Math.floor((pct / 100) * totalSubsteps);
      setActiveStep(Math.min(currentSubIndex, totalSubsteps - 1));

      if (elapsed >= durationMs) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [durationMs, onComplete, totalSubsteps]);

  // Helper to determine state of each sub-step
  const getSubstepState = (stepIndex: number, itemIndex: number) => {
    let absoluteIndex = 0;
    for (let s = 0; s < stepIndex; s++) {
      absoluteIndex += steps[s].items.length;
    }
    absoluteIndex += itemIndex;

    if (absoluteIndex < activeStep) return 'completed';
    if (absoluteIndex === activeStep) return 'active';
    return 'pending';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-5xl mx-auto py-8">
      {/* Concentric rotating glowing rings */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-10 select-none">
        {/* Outer glowing background */}
        <div className="absolute inset-0 bg-radial-gradient from-gold-500/5 to-transparent rounded-full blur-xl animate-pulse"></div>

        {/* Outer spinning gold dash ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute w-full h-full border border-dashed border-gold-500/30 rounded-full"
        ></motion.div>

        {/* Middle reverse spinning ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[80%] h-[80%] border border-gold-500/10 border-t-gold-500/60 rounded-full"
        ></motion.div>

        {/* Inner solid white core with shadow */}
        <div className="absolute w-[65%] h-[65%] bg-white border border-cortex-border rounded-full shadow-premium-xl flex flex-col items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center text-gold-500 border border-gold-500/20 mb-2"
          >
            <Zap className="w-6 h-6 fill-current" />
          </motion.div>
          <span className="text-[10px] tracking-widest font-mono font-bold text-gold-900">
            CORTEX.CORE
          </span>
        </div>
      </div>

      {/* Main Status Text */}
      <h2 className="text-2xl font-bold text-cortex-dark tracking-tight text-center mb-1.5">
        Processing Neural Architecture
      </h2>
      <p className="text-xs text-cortex-gray text-center mb-10 max-w-lg">
        Engineered intelligence optimizing thermal-energy coefficients for high-grade bituminous coal.
      </p>

      {/* Structured workflow grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
        {steps.map((step, sIdx) => (
          <div 
            key={sIdx}
            className={`border rounded-xl p-5 bg-white transition-all shadow-premium ${
              Math.floor(activeStep / 3) === sIdx 
                ? 'border-gold-500/50 ring-1 ring-gold-500/10 shadow-premium-lg' 
                : 'border-cortex-border opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold tracking-wider text-cortex-gray uppercase">
                {step.phase}
              </span>
              <step.icon className={`w-4 h-4 ${Math.floor(activeStep / 3) === sIdx ? 'text-gold-500 animate-spin' : 'text-cortex-light-gray'}`} />
            </div>

            <ul className="flex flex-col gap-3">
              {step.items.map((item, iIdx) => {
                const state = getSubstepState(sIdx, iIdx);
                return (
                  <li key={iIdx} className="flex items-center gap-3 text-xs">
                    {state === 'completed' ? (
                      <span className="w-5 h-5 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center border border-gold-500/30">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : state === 'active' ? (
                      <span className="w-5 h-5 bg-gold-50 text-gold-500 rounded-full flex items-center justify-center border border-gold-500/40">
                        <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-gold-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold-600"></span>
                      </span>
                    ) : (
                      <span className="w-5 h-5 border border-cortex-border rounded-full flex items-center justify-center text-cortex-light-gray bg-cortex-bg-secondary">
                        {/* Empty dot */}
                      </span>
                    )}
                    <span className={state === 'active' ? 'font-semibold text-cortex-dark' : 'text-cortex-gray'}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Progress Bar and percentage */}
      <div className="w-full bg-cortex-border h-1 rounded-full overflow-hidden mb-2 relative">
        <motion.div 
          className="bg-gold-500 h-full rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="w-full flex justify-between text-[10px] font-mono text-cortex-gray font-semibold">
        <span>SYSTEM LATENCY: 24MS</span>
        <span>{Math.round(progress)}% COMPLETE</span>
      </div>
    </div>
  );
};
export default Loader;
