import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Sliders, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  Activity,
  FlaskConical,
  Cpu,
  FileCheck,
  Map
} from 'lucide-react';
import Button from '../components/Button';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLaunch = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000); // Cinematic transition timing
  };

  const features = [
    {
      title: 'Real-Time Prediction',
      description: 'Run instant XGBoost models to determine GCV and Ash content directly from sensor logs.',
      icon: Zap
    },
    {
      title: 'Explainable AI',
      description: 'Game-theoretic SHAP attributions demystify model outputs for transparent audits.',
      icon: Brain
    },
    {
      title: 'Confidence Engine',
      description: 'Quantify data drift and calculate prediction confidence margins in real-time.',
      icon: ShieldCheck
    },
    {
      title: 'Blend Optimization',
      description: 'Solver algorithms compile cost-optimal mixing ratios from varied coal subsidiaries.',
      icon: Sliders
    },
    {
      title: 'Mining Analytics',
      description: 'Analyze distribution timelines, quality metrics, and performance charts.',
      icon: BarChart3
    },
    {
      title: 'Interactive Maps',
      description: 'Visualize Coal India subsidiaries on a responsive geospatial Leaflet mapping layer.',
      icon: Map
    }
  ];

  const timelineSteps = [
    { title: 'Laboratory Sample', desc: 'Proximate chemical values loaded', icon: FlaskConical },
    { title: 'AI Processing', desc: 'Features processed by neural pipelines', icon: Cpu },
    { title: 'Prediction', desc: 'XGBoost outputs GCV & Ash metrics', icon: Zap },
    { title: 'Explainability', desc: 'SHAP waterfall values generated', icon: Brain },
    { title: 'Optimization', desc: 'Blend mixing ratios computed', icon: Sliders },
    { title: 'Decision Report', desc: 'Executive printable PDF generated', icon: FileCheck }
  ];

  const technologies = [
    { name: 'React', desc: 'Modern reactive frontend context', category: 'Frontend' },
    { name: 'FastAPI', desc: 'High-performance Python backend', category: 'Backend' },
    { name: 'XGBoost', desc: 'Supervised gradient boosted trees', category: 'ML Engine' },
    { name: 'SHAP', desc: 'Neural narrative local explanations', category: 'Explainability' },
    { name: 'PostgreSQL', desc: 'Robust relational database ledger', category: 'Database' },
    { name: 'Leaflet', desc: 'Geospatial mapping layer', category: 'GIS Telemetry' },
    { name: 'Recharts', desc: 'Premium SVG analytics charting', category: 'Visualization' },
    { name: 'Docker', desc: 'Standardized microservices container', category: 'DevOps' }
  ];

  const orbitTags = [
    { label: 'GCV', angle: 0, radius: 150 },
    { label: 'ASH', angle: 36, radius: 150 },
    { label: 'Moisture', angle: 72, radius: 150 },
    { label: 'Blend', angle: 108, radius: 150 },
    { label: 'AI', angle: 144, radius: 150 },
    { label: 'Confidence', angle: 180, radius: 150 },
    { label: 'Mining', angle: 216, radius: 150 },
    { label: 'Prediction', angle: 252, radius: 150 },
    { label: 'SHAP', angle: 288, radius: 150 },
    { label: 'Optimization', angle: 324, radius: 150 }
  ];

  return (
    <div className="min-h-screen text-white font-sans relative overflow-x-hidden selection:bg-gold-200 selection:text-gold-900 scroll-smooth">
      
      {/* 1. FIXED HTML5 BACKGROUND VIDEO */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="fixed inset-0 w-screen h-screen object-cover pointer-events-none z-[-2]"
      >
        <source src="/videos/glass-animation-5.mp4" type="video/mp4" />
      </video>

      {/* 2. SEMI-TRANSPARENT BLACK OVERLAY */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-[-1] bg-black/35 backdrop-blur-[1px]"></div>

      {/* Cinematic Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/5 border border-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-gold-500 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-widest uppercase">CarbonCortex</h2>
              <p className="text-xs text-gold-400 font-mono mt-2 tracking-widest">INITIALIZING OPERATION MODULES...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle grid lines over background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-[-1]"></div>

      {/* CONTENT SCROLLING WRAPPER */}
      <div className="relative z-10 w-full">
        
        {/* Navigation Header */}
        <header className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex justify-between items-center bg-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-gold-500 border border-white/10">
              <Brain className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">CarbonCortex</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#features" className="text-xs font-semibold text-white/70 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-xs font-semibold text-white/70 hover:text-white transition-colors">Workflow</a>
            <a href="#technology" className="text-xs font-semibold text-white/70 hover:text-white transition-colors">Technology</a>
            <Button onClick={handleLaunch} size="sm" className="font-bold border border-gold-500/30 bg-gold-600 hover:bg-gold-700 text-white cursor-pointer transition-all">
              Launch CarbonCortex
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[85vh]">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 border border-gold-500/30 rounded-full text-[10px] font-bold text-gold-400 tracking-wider mb-6">
                <Activity className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
                <span>COAL INDIA DECISION INTEL PLATFORM</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
                Coal Quality <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                  Decision Intelligence
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-white/80 max-w-xl leading-relaxed font-normal mb-10"
            >
              CarbonCortex is an enterprise AI platform for intelligent coal quality prediction, explainable AI, blend optimization, and Mining 4.0 decision support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={handleLaunch}
                className="px-8 py-4 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 group cursor-pointer hover:shadow-gold-500/10"
              >
                <span>Launch CarbonCortex</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <a 
                href="#features"
                className="px-8 py-4 bg-white/5 border border-white/10 hover:border-gold-500/40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
              >
                Learn More
              </a>
            </motion.div>
          </div>

          {/* Right Hero Circular Animation */}
          <div className="lg:col-span-5 relative flex items-center justify-center h-[420px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              className="relative w-[340px] h-[340px]"
            >
              {/* Outer dashed orbit */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border border-white/10 border-dashed rounded-full"
              ></motion.div>

              {/* Inner dashed orbit */}
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-10 border border-white/10 border-dashed rounded-full"
              ></motion.div>

              {/* Center CarbonCortex Logo Container */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-black/40 backdrop-blur-md border border-gold-500/20 rounded-full shadow-2xl flex flex-col items-center justify-center z-10">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500 mb-2">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-widest font-extrabold text-gold-400 font-mono">CARBON.CORTEX</span>
                <span className="text-[7px] tracking-wider text-white/50 uppercase font-bold mt-1">Telemetry Active</span>
              </div>

              {/* Orbiting floating chips */}
              {orbitTags.map((tag, idx) => {
                const angleRad = (tag.angle * Math.PI) / 180;
                const x = Math.cos(angleRad) * tag.radius;
                const y = Math.sin(angleRad) * tag.radius;

                return (
                  <motion.div
                    key={idx}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <motion.div 
                      className="absolute bg-black/60 backdrop-blur-sm border border-white/10 text-white rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5 text-[9px] font-bold pointer-events-auto hover:border-gold-500/40 transition-colors"
                      style={{ x, y }}
                      animate={{ 
                        rotate: -360,
                        y: [y, y - 6, y]
                      }}
                      transition={{ 
                        rotate: { duration: 65, repeat: Infinity, ease: 'linear' },
                        y: { duration: 4 + (idx % 3), repeat: Infinity, ease: 'easeInOut' }
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                      <span>{tag.label}</span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Section 2: Why CarbonCortex? (Luxury dark glassmorphism) */}
        <section id="features" className="py-24 sm:py-32 bg-black/40 border-t border-white/5 backdrop-blur-[2px]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 text-left">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mb-16"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-gold-500">Platform Pillars</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">Why CarbonCortex?</h3>
              <p className="text-sm text-white/60 mt-4 leading-relaxed max-w-xl">
                An institutional platform engineered for physical valuation, coal grade compliance, and downstream logistics optimization.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-8 hover:border-gold-500/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500/20 transition-colors">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wider mb-2">{feature.title}</h4>
                  <p className="text-xs leading-relaxed text-white/60 font-normal">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section id="how-it-works" className="py-24 sm:py-32 bg-transparent">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mb-16"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-gold-500">Operational Pipeline</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">How It Works</h3>
            </motion.div>

            {/* Horizontal Timeline (Scrollable on mobile) */}
            <div className="overflow-x-auto pb-6 scrollbar-thin">
              <div className="flex gap-8 min-w-[900px] relative">
                {timelineSteps.map((step, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className="flex-1 relative flex flex-col text-left"
                  >
                    {/* Arrow Connector */}
                    {idx < timelineSteps.length - 1 && (
                      <div className="absolute top-6 left-12 right-0 h-[1px] bg-white/10 z-0"></div>
                    )}
                    
                    {/* Step Circle & Icon */}
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold-500 mb-6 shadow-sm hover:border-gold-500/40 transition-colors backdrop-blur-sm">
                      <step.icon className="w-5 h-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="pr-4">
                      <span className="text-[10px] font-bold text-gold-400 uppercase font-mono">0{idx + 1}. Step</span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider mt-1">{step.title}</h4>
                      <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Technology */}
        <section id="technology" className="bg-black/40 py-24 sm:py-32 border-t border-b border-white/5 backdrop-blur-[2px]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mb-16"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-gold-500">Technology Architecture</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">Our Core Engine</h3>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {technologies.map((tech, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:border-gold-500/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="text-[9px] font-bold text-gold-400 uppercase tracking-widest block mb-2 font-mono">
                    {tech.category}
                  </span>
                  <h4 className="text-sm font-bold text-white">{tech.name}</h4>
                  <p className="text-[10px] text-white/50 mt-1 leading-normal font-normal">{tech.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Footer */}
        <footer className="bg-transparent py-12 text-xs text-white/50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-gold-500">
                <Brain className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white">CarbonCortex</span>
            </div>
            
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">API Portal</a>
              <a href="#" className="hover:text-white transition-colors">Security Specification</a>
              <a href="#" className="hover:text-white transition-colors">Legal Terms</a>
            </div>
            
            <div>
              © 2026 CarbonCortex. All Industrial Telemetry Systems Active.
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
};

export default Landing;
