import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Cpu, ShieldCheck, Sliders, RefreshCw } from 'lucide-react';

export const EditorialPipeline: React.FC = () => {
  const stages = [
    {
      num: '01',
      title: 'SENSOR TELEMETRY',
      desc: 'Gamma Ray · Resistivity · Density',
      icon: Radio,
      tag: 'INGESTION',
      accent: 'border-stone-200 hover:border-[#C9972B]/40'
    },
    {
      num: '02',
      title: 'AI PREDICTION',
      desc: 'XGBoost → GCV · Ash · Moisture',
      icon: Cpu,
      tag: 'INFERENCE',
      accent: 'border-stone-200 hover:border-[#C9972B]/40'
    },
    {
      num: '03',
      title: 'ATDIF CONFIDENCE',
      desc: '0.85 Veracity Gate',
      icon: ShieldCheck,
      tag: 'GATING',
      isCenterpiece: true,
      accent: 'border-emerald-300 bg-white shadow-[0_8px_30px_rgba(16,185,129,0.08)]'
    },
    {
      num: '04',
      title: 'OPTIMIZATION',
      desc: 'SHAP + OR-Tools',
      icon: Sliders,
      tag: 'SOLVER',
      accent: 'border-stone-200 hover:border-[#C9972B]/40'
    },
    {
      num: '05',
      title: 'DISPATCH + RETRAINING',
      desc: 'Dispatch → Ground Truth → Learning',
      icon: RefreshCw,
      tag: 'CLOSED LOOP',
      accent: 'border-stone-200 hover:border-[#C9972B]/40'
    }
  ];

  return (
    <section id="pipeline" className="py-24 sm:py-32 bg-[#F8F7F4] relative overflow-hidden select-none">
      
      {/* Subtle architectural background dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="w-[90%] max-w-[1720px] mx-auto relative z-10">
        
        {/* ============================================================== */}
        {/* SECTION HEADER — CLEAN, MINIMAL, EDITORIAL                     */}
        {/* ============================================================== */}
        <div className="max-w-4xl mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#8C6615] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9972B] animate-pulse" />
            INTELLIGENCE PIPELINE / MINING 4.0
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#0D0E11] tracking-[-0.03em] leading-[1.08] mb-5">
            From Raw Borehole Telemetry<br />
            to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8861B] via-[#C9972B] to-[#D4AF37]">Commercial Dispatch</span>
          </h2>
          
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl font-normal leading-relaxed">
            Raw geological data is transformed into AI predictions, validated by confidence gating,
            optimized for blending, and converted into dispatch decisions.
          </p>
        </div>

        {/* ============================================================== */}
        {/* DESKTOP HORIZONTAL PROCESS (01 → 02 → 03 → 04 → 05)            */}
        {/* ============================================================== */}
        <div className="hidden lg:block relative pb-8">
          
          {/* Continuous thin connecting line across all stages */}
          <div className="absolute top-[88px] left-[6%] right-[6%] h-[1.5px] bg-stone-200/90 z-0">
            {/* Subtle animated moving light packet */}
            <motion.div
              className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-[#C9972B] to-transparent"
              animate={{ left: ['-10%', '110%'] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
            />
          </div>

          {/* 5-STAGE HORIZONTAL GRID */}
          <div className="grid grid-cols-5 gap-6 sm:gap-8 relative z-10 items-start">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;

              // STAGE 03 (ATDIF) — SLIGHTLY MORE PROMINENT
              if (stage.isCenterpiece) {
                return (
                  <motion.div
                    key={stage.num}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="flex flex-col items-center text-center -mt-4"
                  >
                    {/* Top small number */}
                    <span className="text-xs font-mono font-extrabold tracking-[0.2em] text-emerald-700 mb-3">
                      {stage.num}
                    </span>

                    {/* CIRCULAR INDICATOR (0.85 VERACITY) */}
                    <div className="w-28 h-28 rounded-full bg-white border-2 border-emerald-500 shadow-[0_4px_24px_rgba(16,185,129,0.18)] flex flex-col items-center justify-center relative mb-5 transition-transform hover:scale-105 duration-300">
                      
                      {/* Subtle pulse ring */}
                      <div className="absolute -inset-1 rounded-full border border-emerald-400/40 animate-ping opacity-25 pointer-events-none" />

                      <div className="text-2xl font-black text-[#0D0E11] font-mono leading-none tracking-tight">
                        0.85
                      </div>
                      <span className="text-[9px] font-mono font-extrabold text-emerald-700 tracking-wider uppercase mt-1">
                        VERACITY
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-extrabold text-[#0D0E11] tracking-tight uppercase mb-1">
                      {stage.title}
                    </h3>
                    
                    {/* Supporting Line */}
                    <p className="text-sm text-stone-500 font-medium mb-4">
                      {stage.desc}
                    </p>

                    {/* TWO SIMPLE BRANCH OUTCOMES (NO BIG CARDS) */}
                    <div className="w-full max-w-[210px] space-y-1.5 pt-2 border-t border-stone-200/80">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-50/90 py-1.5 px-2.5 rounded-lg border border-emerald-200/80">
                        <span>✓ Trusted</span>
                        <span className="text-emerald-400">→</span>
                        <span>Dispatch</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-semibold text-amber-800 bg-amber-50/90 py-1.5 px-2.5 rounded-lg border border-amber-200/80">
                        <span>! Uncertain</span>
                        <span className="text-amber-400">→</span>
                        <span>Lab</span>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // STANDARD STAGES (01, 02, 04, 05)
              return (
                <motion.div
                  key={stage.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Top small number */}
                  <span className="text-xs font-mono font-extrabold tracking-[0.2em] text-[#C9972B] mb-3">
                    {stage.num}
                  </span>

                  {/* Clean circular icon node */}
                  <div className="w-16 h-16 rounded-full bg-white border border-stone-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center justify-center text-stone-700 group-hover:text-[#C9972B] group-hover:border-[#C9972B]/50 group-hover:shadow-[0_4px_20px_rgba(201,151,43,0.12)] transition-all duration-300 mb-5">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-extrabold text-[#0D0E11] tracking-tight uppercase mb-1.5 leading-snug">
                    {stage.title}
                  </h3>

                  {/* One short supporting line */}
                  <p className="text-sm text-stone-500 font-medium leading-relaxed max-w-[210px]">
                    {stage.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* ============================================================== */}
        {/* MOBILE & TABLET VERTICAL STACK (01 ↓ 02 ↓ 03 ↓ 04 ↓ 05)        */}
        {/* ============================================================== */}
        <div className="lg:hidden relative space-y-8 pl-6">
          {/* Vertical connecting line */}
          <div className="absolute left-[31px] top-6 bottom-6 w-[1.5px] bg-stone-200 z-0" />

          {stages.map((stage) => {
            const Icon = stage.icon;

            if (stage.isCenterpiece) {
              return (
                <div key={stage.num} className="relative z-10 flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-emerald-500 shadow-md flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-black font-mono text-[#0D0E11] leading-none">0.85</span>
                    <span className="text-[7px] font-mono font-bold text-emerald-700 uppercase">GATE</span>
                  </div>
                  <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-emerald-700">{stage.num}</span>
                      <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">VERACITY</span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#0D0E11] uppercase mb-1">{stage.title}</h3>
                    <p className="text-xs text-stone-500 font-medium mb-3">{stage.desc}</p>
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-stone-100 text-xs font-mono">
                      <span className="text-emerald-700 font-bold">✓ Trusted → Dispatch</span>
                      <span className="text-amber-800 font-semibold">! Uncertain → Lab</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={stage.num} className="relative z-10 flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs flex-1">
                  <span className="text-xs font-mono font-bold text-[#C9972B] block mb-1">{stage.num}</span>
                  <h3 className="text-base font-extrabold text-[#0D0E11] uppercase mb-1">{stage.title}</h3>
                  <p className="text-xs text-stone-500 font-medium">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default EditorialPipeline;
