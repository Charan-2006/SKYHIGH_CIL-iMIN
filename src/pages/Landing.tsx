import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Brain,
  Sliders,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  FlaskConical,
  Menu,
  X,
  Activity,
  ChevronDown,
  Users,
  Database,
  HardHat,
  Truck,
  TrendingUp,
  Layers,
  FileText,
  UserCheck,
  Download,
  ExternalLink
} from 'lucide-react';
import { EditorialPipeline } from '../components/landing/EditorialPipeline';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState(0);
  const [activeDemoTab, setActiveDemoTab] = useState<
    'Overview' | 'Coal Quality' | 'Blend Optimization' | 'Dispatch' | 'Model Intelligence' | 'Laboratory' | 'Reports'
  >('Overview');

  // Hero slideshow — 4 heavy equipment slides, automatic movement, inspired by Image 2
  const heroSlides = [
    {
      src: '/images/excavator_hero.jpg',
      tag: 'HEAVY EXTRACTION FLEET',
      title: 'Coal Quality Decision',
      titleAccent: 'Intelligence Platform',
      subtitle: 'Enterprise AI platform for real-time coal quality prediction, explainable AI, blend optimization, and Mining 4.0 decision support across all Coal India subsidiaries.',
      location: 'Gevra Mega Pit • Komatsu PC8000 Fleet'
    },
    {
      src: '/images/dragline_hero.jpg',
      tag: 'DRAGLINE STRIPPING',
      title: 'Real-Time Borehole',
      titleAccent: 'Telemetry Pipeline',
      subtitle: 'Multi-target XGBoost ensemble predicts GCV, Ash, Moisture, Volatile Matter, and Fixed Carbon with strict training/inference parity from borehole telemetry.',
      location: 'Korba Basin • 2570-W Dragline'
    },
    {
      src: '/images/coal_mine_hero.jpg',
      tag: 'OPEN-CAST BASIN',
      title: 'Autonomous Veracity',
      titleAccent: 'Gating Sentinel',
      subtitle: 'ATDIF 5-vector quantitative confidence framework measures training centroid distance, proximate mass balance, model variance, and 3-sigma mining drift.',
      location: 'Dipka Basin • Continuous Pit'
    },
    {
      src: '/images/coal_mine_detail.jpg',
      tag: 'DISPATCH LOADOUT',
      title: 'Certified Thermal',
      titleAccent: 'Blend Optimization',
      subtitle: 'Continuous Linear Programming solves multi-source coal mixing to minimize cost while strictly satisfying target GCV and maximum ash/moisture caps.',
      location: 'SECL Central Basin • Rapid Terminal'
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSlideDirection(1);
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length, isPaused]);

  const handleLaunch = () => {
    setIsTransitioning(true);
    setTimeout(() => navigate('/dashboard'), 850);
  };

  const corePillars = [
    {
      title: 'Multi-Target XGBoost Ensemble',
      tag: 'INFERENCE ENGINE',
      description: 'Simultaneous prediction of Gross Calorific Value (GCV), Ash content, Moisture, Volatile Matter, and Fixed Carbon with strict training/inference parity.',
      stat: '0.886 GCV R²',
      icon: Zap,
      accent: 'from-amber-500 to-orange-500'
    },
    {
      title: 'ATDIF Confidence Sentinel',
      tag: 'DECISION GATING',
      description: '5-vector quantitative confidence framework measuring training centroid distance, proximate mass balance, model variance, and 3-sigma mining drift.',
      stat: '0.85 Threshold',
      icon: ShieldCheck,
      accent: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'SHAP TreeExplainer XAI',
      tag: 'EXPLAINABLE AI',
      description: 'Game-theoretic local feature attributions generate transparent waterfall breakdowns, isolating the impact of borehole logs on predicted thermal value.',
      stat: 'Local Shapley Values',
      icon: Brain,
      accent: 'from-violet-500 to-purple-500'
    },
    {
      title: 'Google OR-Tools Blend Optimizer',
      tag: 'MATHEMATICAL SOLVER',
      description: 'Continuous Linear Programming (GLOP) solves multi-source coal mixing to minimize cost while strictly satisfying target GCV and maximum ash/moisture caps.',
      stat: 'Continuous LP (GLOP)',
      icon: Sliders,
      accent: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'What-If Scenario Simulator',
      tag: 'RISK ANALYSIS',
      description: 'Stress-tests supply chains against monsoon moisture surges, stripping ratio fluctuations, and run-of-mine variations with live side-by-side variance analysis.',
      stat: 'Real-Time Deltas',
      icon: BarChart3,
      accent: 'from-rose-500 to-pink-500'
    },
    {
      title: 'Continuous Laboratory Learning',
      tag: 'GROUND-TRUTH FEEDBACK',
      description: 'Low-confidence samples are automatically routed to certified ISO bomb calorimetry. Actual laboratory results trigger candidate model retraining and validation.',
      stat: 'ISO 1350 Loop',
      icon: FlaskConical,
      accent: 'from-cyan-500 to-sky-500'
    }
  ];

  const operationalMetrics = [
    { label: 'Calibrated Borehole Telemetry', value: '6,000+', unit: 'Geoscientific Datasets' },
    { label: 'GCV Test Set Accuracy (R²)', value: '0.8862', unit: 'MAE: 127.3 kcal/kg' },
    { label: 'Ash Prediction Accuracy (R²)', value: '0.9606', unit: 'MAE: 0.84% Ash' },
    { label: 'CIL Standard Thermal Grades', value: 'G1–G17', unit: 'Automated Classification' },
    { label: 'End-to-End Inference Latency', value: '<45ms', unit: 'Real-Time Edge Telemetry' },
    { label: 'Blend Constraint Satisfaction', value: '100%', unit: 'Zero Infeasible Overrides' }
  ];


  const technologies = [
    { name: 'React 18 + TypeScript', category: 'Frontend', desc: 'Enterprise reactive client with Vite & Tailwind CSS' },
    { name: 'FastAPI (Python 3.11+)', category: 'Backend Engine', desc: 'Asynchronous high-performance REST microservices' },
    { name: 'XGBoost Regressors', category: 'ML Pipeline', desc: 'Gradient boosted ensemble for multi-parameter prediction' },
    { name: 'SHAP TreeExplainer', category: 'Explainability', desc: 'Game-theoretic feature attribution and waterfall synthesis' },
    { name: 'Google OR-Tools', category: 'Mathematical Solver', desc: 'Continuous Linear Programming (GLOP) blend optimizer' },
    { name: 'MongoDB + Mock Resilience', category: 'Operational Ledger', desc: '17 collections with zero-downtime mock engine fallback' },
    { name: 'Leaflet GIS', category: 'Geospatial Telemetry', desc: 'Interactive geographic visualization of CIL coalfields' },
    { name: 'Docker & Compose', category: 'DevOps & Cloud', desc: 'Microservices containerization with Nginx reverse proxy' }
  ];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-30%' : '30%', opacity: 0 })
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] font-sans relative overflow-x-hidden selection:bg-[#C9972B]/20 selection:text-[#8C6615]">

      {/* ============================================================== */}
      {/* TRANSITION OVERLAY                                              */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white border border-stone-200 rounded-2xl flex items-center justify-center mx-auto mb-4 p-2 shadow-xl">
                <img src="/logo.png" alt="CarbonCortex Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-xl font-bold text-[#111] tracking-widest uppercase">CarbonCortex</h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="w-2 h-2 rounded-full bg-[#C9972B] animate-ping"></span>
                <p className="text-xs text-[#C9972B] font-mono tracking-widest uppercase font-semibold">
                  INITIALIZING OPERATION MODULES...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* NAVBAR — GLASS WHITE, FULL-WIDTH, EDGE-ANCHORED                */}
      {/* ============================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-2xl border-b border-stone-200/60 shadow-[0_1px_20px_rgba(0,0,0,0.04)]'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 flex justify-between items-center h-[72px]">
          {/* LEFT: Logo */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-1.5 transition-all duration-300 ${
              isScrolled ? 'bg-white border border-stone-200 shadow-sm' : 'bg-white/20 backdrop-blur-sm border border-white/30'
            }`}>
              <img src="/logo.png" alt="CarbonCortex Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold tracking-wider uppercase transition-colors ${isScrolled ? 'text-[#111]' : 'text-white'}`}>
                CarbonCortex
              </span>
              <span className={`text-[9px] tracking-[0.18em] font-mono uppercase hidden sm:block transition-colors ${isScrolled ? 'text-[#C9972B]' : 'text-[#E5C56B]'}`}>
                Coal India Decision Intelligence
              </span>
            </div>
          </div>

          {/* CENTER: Nav */}
          <nav className={`hidden lg:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${
            isScrolled ? 'text-[#555]' : 'text-white/70'
          }`}>
            {[
              { label: 'Pipeline', href: '#pipeline' },
              { label: 'Intelligence', href: '#features' },
              { label: 'Benchmarks', href: '#benchmarks' },
              { label: 'Technology', href: '#technology' },
            ].map(link => (
              <a key={link.label} href={link.href} className="hover:text-[#C9972B] transition-colors duration-300 py-1">
                {link.label}
              </a>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className={`hidden sm:block text-[11px] font-semibold px-4 py-2 rounded-xl border transition-all cursor-pointer tracking-wider uppercase ${
                isScrolled
                  ? 'text-[#555] border-stone-200 hover:border-[#C9972B]/50 bg-white hover:bg-stone-50'
                  : 'text-white/80 border-white/20 hover:border-white/40 bg-white/10 backdrop-blur-sm'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={handleLaunch}
              className="group text-[11px] font-bold text-white px-5 py-2.5 rounded-xl bg-[#C9972B] hover:bg-[#B8861B] transition-all shadow-[0_4px_20px_rgba(201,151,43,0.3)] hover:shadow-[0_6px_25px_rgba(201,151,43,0.45)] flex items-center gap-2 cursor-pointer tracking-wider uppercase transform hover:-translate-y-0.5"
            >
              <span>Launch</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden transition-colors cursor-pointer ${isScrolled ? 'text-[#555]' : 'text-white/80'}`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-stone-200/60 overflow-hidden"
            >
              <nav className="flex flex-col gap-0 px-6 py-3">
                {['Pipeline', 'Intelligence', 'Benchmarks', 'Technology'].map(item => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-[#444] hover:text-[#C9972B] py-3 border-b border-stone-100 transition-colors tracking-wider uppercase font-semibold last:border-b-0"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* HERO: DYNAMIC INDUSTRIAL SPLIT INSPIRED BY IMAGE 2             */}
      {/* ============================================================== */}
      <section
        className="relative h-screen min-h-[720px] flex items-center overflow-hidden bg-[#07080A]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Full-width heavy equipment background slideshow */}
        <AnimatePresence initial={false} custom={slideDirection} mode="sync">
          <motion.div
            key={activeSlide}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
          >
            <motion.img
              src={heroSlides[activeSlide].src}
              alt={heroSlides[activeSlide].title}
              className="w-full h-full object-cover object-center lg:object-[65%_center]"
              animate={{ scale: [1, 1.05] }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* DYNAMIC ANGLED SPLIT OVERLAY (MATCHING IMAGE 2 COMPOSITION) */}
        {/* High-contrast dark carbon diagonal slash across the left, allowing the excavator machinery on the right to burst through */}
        <div 
          className="absolute inset-0 bg-[#07080A] z-10 hidden lg:block opacity-95 pointer-events-none"
          style={{ clipPath: 'polygon(0 0, 58% 0, 38% 100%, 0% 100%)' }}
        />
        {/* Subtle diagonal transition gradient along the split seam */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080A] via-[#07080A]/90 to-transparent z-10 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080A] via-transparent to-[#07080A]/40 z-10" />

        {/* HERO TEXT — LEFT-ALIGNED ON THE HIGH-CONTRAST DARK SLASH */}
        <div className="relative z-20 w-full px-6 sm:px-10 lg:px-16 pt-20">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`hero-text-${activeSlide}`}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Tech Tag Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-[10px] font-mono font-bold tracking-[0.22em] text-[#FBBF24] uppercase mb-6 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#E5A919] animate-pulse" />
                  {heroSlides[activeSlide].tag}
                </div>

                {/* Massive Bold Headline matching Image 2 */}
                <h1 className="text-4xl sm:text-6xl lg:text-[68px] xl:text-[76px] font-extrabold text-white tracking-[-0.03em] leading-[1.04] uppercase mb-6 drop-shadow-sm">
                  {heroSlides[activeSlide].title}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A919] via-[#FBBF24] to-[#E5A919]">
                    {heroSlides[activeSlide].titleAccent}
                  </span>
                </h1>

                {/* Short, crisp subtitle */}
                <p className="text-sm sm:text-base text-stone-300/80 max-w-lg leading-relaxed">
                  {heroSlides[activeSlide].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>



        {/* RIGHT EDGE: Live Model Precision Tickers */}
        <div className="absolute right-6 sm:right-10 lg:right-16 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-6 items-end">
          {[
            { v: '0.886', l: 'GCV R² ACCURACY' },
            { v: '0.961', l: 'ASH R² ACCURACY' },
            { v: '<45ms', l: 'EDGE LATENCY' },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              className="text-right"
            >
              <span className="text-xl font-mono font-extrabold text-white/90 block leading-none">{m.v}</span>
              <span className="text-[8px] font-mono text-[#E5A919]/80 tracking-[0.2em] uppercase">{m.l}</span>
            </motion.div>
          ))}
        </div>

        {/* Centered Minimal Scroll Cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-1.5 text-white/30"
        >
          <span className="text-[8px] font-mono tracking-[0.3em] uppercase">SCROLL</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================== */}
      {/* FLOATING METRICS STRIP — SPANS EDGES WITH GLASS MORPHISM       */}
      {/* ============================================================== */}
      <section className="relative z-20 -mt-10 px-6 sm:px-10 lg:px-16">
        <div className="bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-[20px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { num: '/1', title: 'Real-Time ML', sub: 'GCV & Ash XGBoost', icon: Zap },
              { num: '/2', title: 'ATDIF Gating', sub: '0.85 Veracity Sentinel', icon: ShieldCheck },
              { num: '/3', title: 'OR-Tools GLOP', sub: 'Optimal Coal Blending', icon: Sliders },
              { num: '/4', title: 'ISO 1350 Loop', sub: 'Bomb Calorimeter Retrain', icon: FlaskConical },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`group p-6 lg:p-7 flex items-start gap-4 transition-colors hover:bg-stone-50/80 ${
                  idx < 3 ? 'md:border-r border-stone-200/60' : ''
                } ${idx < 2 ? 'border-b md:border-b-0 border-stone-200/60' : ''} ${idx === 2 ? 'border-b md:border-b-0 border-stone-200/60' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#C9972B]/10 border border-[#C9972B]/20 flex items-center justify-center text-[#C9972B] shrink-0 group-hover:shadow-sm transition-shadow">
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold text-[#C9972B] block mb-0.5">{item.num}</span>
                  <h4 className="text-sm font-bold text-[#111] mb-0.5 truncate">{item.title}</h4>
                  <p className="text-[11px] text-[#888] leading-snug">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* REDESIGNED EDITORIAL PIPELINE SECTION (FROM SCRATCH)           */}
      {/* ============================================================== */}
      <EditorialPipeline />

      {/* ============================================================== */}
      {/* CORE INTELLIGENCE — SHAPED BENTO GRID                          */}
      {/* ============================================================== */}
      <section id="features" className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

        <div className="px-6 sm:px-10 lg:px-16">
          {/* RIGHT-ALIGNED header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl ml-auto text-right mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9972B]/8 border border-[#C9972B]/20 text-[10px] font-mono font-bold tracking-[0.2em] text-[#9E7012] uppercase mb-5">
              <Activity className="w-3 h-3" />
              PLATFORM PILLARS
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111] tracking-tight leading-[1.1]">
              Enterprise Mining<br />Intelligence Modules
            </h2>
            <p className="text-base text-[#888] mt-4 leading-relaxed">
              Engineered specifically for Coal India open-cast pits, washeries, thermal utility grids, and metallurgical dispatch terminals.
            </p>
          </motion.div>

          {/* BENTO GRID — mixed sizes for visual dynamism */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
            {corePillars.map((pillar, idx) => {
              // Varied spans: first card wide, others alternate
              const spanClass = idx === 0
                ? 'lg:col-span-7'
                : idx === 1
                ? 'lg:col-span-5'
                : idx === 2
                ? 'lg:col-span-4'
                : idx === 3
                ? 'lg:col-span-4'
                : idx === 4
                ? 'lg:col-span-4'
                : 'lg:col-span-12';

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  onMouseEnter={() => setHoveredPillar(idx)}
                  onMouseLeave={() => setHoveredPillar(null)}
                  className={`${spanClass} group relative bg-[#FAFAF8] rounded-[20px] border border-stone-200/80 p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-400 cursor-default overflow-hidden ${
                    idx === 5 ? 'flex flex-col md:flex-row md:items-center gap-6' : 'flex flex-col justify-between'
                  }`}
                >
                  {/* Hover gradient */}
                  <div className={`absolute inset-0 rounded-[20px] bg-gradient-to-br ${pillar.accent} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-400`} />

                  <div className={`relative z-10 ${idx === 5 ? 'flex-1' : ''}`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-xs ${
                        hoveredPillar === idx
                          ? 'bg-[#C9972B] border-[#C9972B] text-white shadow-[0_6px_20px_rgba(201,151,43,0.3)]'
                          : 'bg-white border-stone-200 text-[#C9972B]'
                      }`}>
                        <pillar.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-[#bbb] group-hover:text-[#9E7012] tracking-[0.12em] uppercase px-2.5 py-1 bg-stone-100/80 border border-stone-200/50 rounded-full transition-colors">
                        {pillar.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111] mb-2 leading-tight">{pillar.title}</h3>
                    <p className="text-xs text-[#888] leading-relaxed mb-6">
                      {pillar.description}
                    </p>
                  </div>

                  <div className={`relative z-10 pt-4 border-t border-stone-200/60 flex items-center justify-between ${idx === 5 ? 'md:border-t-0 md:border-l md:pl-6 md:pt-0 md:flex-col md:items-end md:gap-1' : ''}`}>
                    <span className="text-[10px] font-mono text-[#bbb] tracking-wider uppercase">BENCHMARK</span>
                    <span className="text-xs font-mono font-bold text-[#555] group-hover:text-[#C9972B] transition-colors">
                      {pillar.stat}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* BENCHMARKS — FULL-WIDTH WITH ALTERNATING BG                    */}
      {/* ============================================================== */}
      <section id="benchmarks" className="py-28 bg-[#F5F4EF] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stone-300/50 to-transparent" />
        {/* Large decorative text */}
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-[280px] font-extrabold text-[#111]/[0.015] leading-none pointer-events-none select-none hidden lg:block">
          4.0
        </div>

        <div className="px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9972B]/8 border border-[#C9972B]/20 text-[10px] font-mono font-bold tracking-[0.2em] text-[#9E7012] uppercase mb-5">
                SYSTEM VERACITY
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111] tracking-tight">
                Quantitative Operational Scale
              </h2>
            </motion.div>
            <p className="text-xs sm:text-sm text-[#888] max-w-md lg:text-right leading-relaxed">
              Evaluated against test splits on 6,000 synthetic geological samples modeled directly after Coal India's largest subsidiary basins.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {operationalMetrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="group bg-white rounded-[20px] border border-stone-200/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)] hover:border-[#C9972B]/30 transition-all duration-300"
              >
                <span className="text-2xl sm:text-3xl font-extrabold text-[#111] font-mono block mb-2 group-hover:text-[#C9972B] transition-colors leading-none">
                  {metric.value}
                </span>
                <span className="text-[11px] font-bold text-[#444] block mb-1 leading-tight">
                  {metric.label}
                </span>
                <span className="text-[9px] font-mono font-semibold text-[#C9972B]/60 block tracking-wider leading-tight">
                  {metric.unit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* TECHNOLOGY — STICKY SIDEBAR + SCROLLING GRID                   */}
      {/* ============================================================== */}
      <section id="technology" className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

        <div className="px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* LEFT: Sticky header + mine image */}
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9972B]/8 border border-[#C9972B]/20 text-[10px] font-mono font-bold tracking-[0.2em] text-[#9E7012] uppercase mb-5">
                  STACK SPECIFICATION
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111] tracking-tight mb-5 leading-tight">
                  Enterprise Technology Architecture
                </h2>
                <p className="text-sm text-[#888] leading-relaxed mb-8">
                  Engineered with zero third-party cloud lock-in. 100% self-hosted microservices architecture.
                </p>

                {/* Mine image card */}
                <div className="relative h-48 sm:h-56 rounded-[20px] overflow-hidden border border-stone-200/80 shadow-sm hidden lg:block">
                  <img src="/images/coal_mine_detail.jpg" alt="Coal Mine Detail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[9px] font-mono text-[#C9972B] tracking-[0.2em] uppercase block mb-1">DEPLOYMENT READY</span>
                    <span className="text-xs text-white/80 font-semibold">Docker + Nginx Reverse Proxy</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Tech grid */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {technologies.map((tech, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-[#FAFAF8] rounded-[20px] border border-stone-200/80 p-6 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)] hover:border-[#C9972B]/30 transition-all duration-300"
                  >
                    <span className="text-[9px] font-mono font-bold text-[#C9972B]/60 uppercase tracking-[0.2em] block mb-3">
                      {tech.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#111] mb-1.5 group-hover:text-[#C9972B] transition-colors">{tech.name}</h3>
                    <p className="text-xs text-[#888] leading-relaxed">{tech.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FINAL CTA — PRODUCTION-GRADE ENTERPRISE MOCKUP & ROLE GRID     */}
      {/* ============================================================== */}
      <section className="relative pt-24 pb-36 bg-[#FAF9F5] overflow-hidden select-none">
        
        {/* Subtle Topographic & Architectural Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Real Open-cast Coal Pit Background at Bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[480px] z-0 pointer-events-none overflow-hidden">
          <img
            src="/images/coal_mine_hero.jpg"
            alt="Open-cast Coal Pit Operations"
            className="w-full h-full object-cover object-bottom opacity-35 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#FAF9F5]/70 to-[#FAF9F5]" />
        </div>

        {/* Top Right Geoscientific Coordinate Stamp */}
        <div className="absolute top-10 right-12 text-right font-mono text-xs text-stone-400 select-none hidden lg:block z-10">
          <div>22.54° N</div>
          <div>82.68° E</div>
        </div>

        <div className="w-[92%] max-w-[1720px] mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* ---------------------------------------------------------- */}
            {/* LEFT COLUMN: HEADLINE, CTAS & FEATURE POINTS               */}
            {/* ---------------------------------------------------------- */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              
              {/* Tag pill */}
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="text-xs font-mono font-extrabold tracking-[0.2em] text-[#0D0E11] uppercase">
                  CARBONCORTEX
                </span>
                <span className="text-stone-300">|</span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#8C6615] bg-[#C9972B]/15 px-2.5 py-0.5 rounded-md border border-[#C9972B]/20 uppercase">
                  MINING 4.0
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0D0E11] tracking-[-0.03em] leading-[1.06] mb-6">
                Deploy <span className="text-[#C9972B]">Mining 4.0</span><br />
                Intelligence Today
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-stone-600 max-w-lg leading-relaxed mb-9">
                Access the live decision console pre-seeded with Chief Administrator, Mining Engineer,
                Laboratory Technician, and Executive Viewer roles.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
                <button
                  onClick={handleLaunch}
                  className="group px-7 py-4 bg-[#C9972B] hover:bg-[#B8861B] text-white font-extrabold rounded-2xl shadow-[0_4px_25px_rgba(201,151,43,0.35)] hover:shadow-[0_6px_30px_rgba(201,151,43,0.5)] transition-all flex items-center justify-center gap-2.5 cursor-pointer text-xs font-mono tracking-wider uppercase transform hover:-translate-y-0.5"
                >
                  <span>LAUNCH OPERATIONAL PLATFORM</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-7 py-4 bg-white border border-stone-200/90 hover:border-stone-300 hover:bg-stone-50 text-[#0D0E11] font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-xs font-mono tracking-wider uppercase"
                >
                  SIGN IN WITH ENTERPRISE ROLE
                </button>
              </div>

              {/* 3 Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-8 border-t border-stone-200/70">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C9972B]/10 border border-[#C9972B]/20 flex items-center justify-center text-[#C9972B] shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0D0E11] leading-tight">Pre-seeded Personnel</h4>
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">4 Enterprise Roles</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C9972B]/10 border border-[#C9972B]/20 flex items-center justify-center text-[#C9972B] shrink-0 mt-0.5">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0D0E11] leading-tight">Zero Cloud Dependency</h4>
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">On-Prem or Private Cloud</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C9972B]/10 border border-[#C9972B]/20 flex items-center justify-center text-[#C9972B] shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0D0E11] leading-tight">Full Test Suite Verified</h4>
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">Production Ready</p>
                  </div>
                </div>
              </div>

            </div>

            {/* ---------------------------------------------------------- */}
            {/* RIGHT COLUMN: FLOATING DASHBOARD MOCKUP & 4 ROLE SELECTORS */}
            {/* ---------------------------------------------------------- */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              
              {/* THE FLOATING DASHBOARD MOCKUP */}
              <div className="bg-white rounded-[24px] border border-stone-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] p-5 sm:p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_25px_70px_-15px_rgba(201,151,43,0.14)]">
                
                {/* Mockup Top Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-stone-900 flex items-center justify-center p-1">
                      <img src="/logo.png" alt="CarbonCortex" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold tracking-wider text-[#0D0E11] font-mono">CARBONCORTEX</span>
                    <span className="text-[9px] font-mono text-[#8C6615] bg-[#C9972B]/15 px-2 py-0.5 rounded font-bold">
                      MINING 4.0
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>System Online</span>
                    </div>
                    <div className="text-[10px] font-mono text-stone-500 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200 flex items-center gap-1">
                      <span>Gevra Mega Project • Korba</span>
                      <ChevronDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </div>
                </div>

                {/* Mockup Body: Mini Sidebar + Mini Content */}
                <div className="grid grid-cols-12 gap-5 items-start">
                  
                  {/* Left Mini Sidebar */}
                  <div className="col-span-12 sm:col-span-3 border-b sm:border-b-0 sm:border-r border-stone-100 pb-3 sm:pb-0 sm:pr-3 space-y-1">
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-visible gap-1.5 sm:gap-1 no-scrollbar">
                      {[
                        { id: 'Overview', label: 'Overview', icon: Layers, route: '/dashboard' },
                        { id: 'Coal Quality', label: 'Coal Quality', icon: Activity, route: '/evaluation' },
                        { id: 'Blend Optimization', label: 'Blend Optimization', icon: Sliders, route: '/blend' },
                        { id: 'Dispatch', label: 'Dispatch', icon: Truck, route: '/dispatch' },
                        { id: 'Model Intelligence', label: 'Model Intelligence', icon: Brain, route: '/models' },
                        { id: 'Laboratory', label: 'Laboratory', icon: FlaskConical, route: '/evaluation' },
                        { id: 'Reports', label: 'Reports', icon: FileText, route: '/report' }
                      ].map((item) => {
                        const isActive = activeDemoTab === item.id;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveDemoTab(item.id as typeof activeDemoTab)}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-medium transition-all cursor-pointer whitespace-nowrap text-left w-full ${
                              isActive
                                ? 'bg-[#C9972B] text-white font-bold shadow-xs'
                                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                            }`}
                          >
                            <Icon className="w-3 h-3 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Main Mini Dashboard Content (Dynamic per tab) */}
                  <div className="col-span-12 sm:col-span-9 space-y-4">
                    
                    {/* ======================================================== */}
                    {/* TAB 1: OVERVIEW                                          */}
                    {/* ======================================================== */}
                    {activeDemoTab === 'Overview' && (
                      <motion.div
                        key="Overview"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-[#0D0E11] tracking-tight">Operational Decision Console</h4>
                            <p className="text-[10px] text-stone-400 font-mono">Real-time coal quality prediction and dispatch intelligence</p>
                          </div>
                          <button
                            onClick={() => navigate('/dashboard')}
                            className="text-[9px] font-mono text-[#C9972B] hover:text-[#B8861B] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Open Platform</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* 4 Mini KPI Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70 relative overflow-hidden">
                            <div className="flex items-center justify-between text-[8.5px] font-mono text-stone-400 mb-0.5">
                              <span>GCV (kcal/kg)</span>
                              <TrendingUp className="w-2.5 h-2.5 text-stone-300" />
                            </div>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight tracking-tight">4,920</div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[8.5px] font-mono text-emerald-600 font-bold">▲ 2.4%</span>
                              <svg className="w-10 h-3" viewBox="0 0 40 12">
                                <path d="M 0,10 Q 15,2 25,6 T 40,2" fill="none" stroke="#C9972B" strokeWidth="1.5" />
                              </svg>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70 relative overflow-hidden">
                            <div className="flex items-center justify-between text-[8.5px] font-mono text-stone-400 mb-0.5">
                              <span>Ash Content (%)</span>
                              <TrendingUp className="w-2.5 h-2.5 text-stone-300" />
                            </div>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight tracking-tight">24.50</div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[8.5px] font-mono text-emerald-600 font-bold">▼ 1.2%</span>
                              <svg className="w-10 h-3" viewBox="0 0 40 12">
                                <path d="M 0,8 Q 15,11 25,5 T 40,3" fill="none" stroke="#C9972B" strokeWidth="1.5" />
                              </svg>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-200/70 relative overflow-hidden">
                            <div className="flex items-center justify-between text-[8.5px] font-mono text-emerald-800 mb-0.5">
                              <span>ATDIF Score</span>
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                            </div>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight tracking-tight">0.85</div>
                            <div className="mt-1">
                              <span className="inline-flex items-center text-[7.5px] font-mono font-extrabold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded tracking-wider">
                                VERACITY PASS
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70 relative overflow-hidden">
                            <div className="text-[8.5px] font-mono text-stone-400 mb-0.5">Dispatch Status</div>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="text-xs font-black text-emerald-700 font-mono tracking-wide">APPROVED</span>
                              <Truck className="w-3.5 h-3.5 text-[#C9972B]" />
                            </div>
                            <div className="text-[7.5px] font-mono text-stone-400 mt-1">Gevra - Pit #04</div>
                          </div>
                        </div>

                        {/* Dual Analytics Panels */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                          <div className="sm:col-span-7 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-[9px] font-mono mb-2">
                              <span className="font-bold text-stone-700">Coal Quality Trend</span>
                              <div className="flex items-center gap-2.5 text-stone-400 text-[8px]">
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#C9972B]" /> GCV</span>
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-stone-400" /> Ash (scaled)</span>
                              </div>
                            </div>
                            <div className="relative h-20 my-1 flex items-center">
                              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[7px] font-mono text-stone-300 pr-1 select-none">
                                <span>6,000</span>
                                <span>4,000</span>
                                <span>2,000</span>
                                <span>0</span>
                              </div>
                              <div className="w-full h-full pl-6">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 160 50" preserveAspectRatio="none">
                                  <line x1="0" y1="12" x2="160" y2="12" stroke="#E7E5E4" strokeWidth="0.5" strokeDasharray="2 2" />
                                  <line x1="0" y1="26" x2="160" y2="26" stroke="#E7E5E4" strokeWidth="0.5" strokeDasharray="2 2" />
                                  <line x1="0" y1="40" x2="160" y2="40" stroke="#E7E5E4" strokeWidth="0.5" strokeDasharray="2 2" />
                                  <path d="M 0,26 Q 25,18 50,20 T 95,28 T 130,22 T 160,18" fill="none" stroke="#C9972B" strokeWidth="1.8" />
                                  <circle cx="50" cy="20" r="1.5" fill="#C9972B" />
                                  <circle cx="95" cy="28" r="1.5" fill="#C9972B" />
                                  <circle cx="160" cy="18" r="1.5" fill="#C9972B" />
                                  <path d="M 0,38 Q 30,42 60,36 T 110,40 T 160,37" fill="none" stroke="#78716C" strokeWidth="1.2" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex justify-between text-[7.5px] font-mono text-stone-400 pl-6 pt-1 border-t border-stone-200/50">
                              <span>06:00</span>
                              <span>09:00</span>
                              <span>12:00</span>
                              <span>15:00</span>
                              <span>18:00</span>
                            </div>
                          </div>

                          <div className="sm:col-span-5 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col justify-between">
                            <div className="text-[9px] font-mono font-bold text-stone-800 mb-2">Seam Analysis</div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-16 h-14 rounded-lg overflow-hidden border border-stone-300 shrink-0 shadow-xs">
                                <img src="/images/coal_mine_detail.jpg" alt="Seam Strata" className="w-full h-full object-cover" />
                              </div>
                              <div className="text-[8.5px] font-mono space-y-1 flex-1">
                                <div className="flex items-center justify-between"><span className="text-stone-400">Depth</span> <span className="font-bold text-[#0D0E11]">182.4 m</span></div>
                                <div className="flex items-center justify-between"><span className="text-stone-400">Seam</span> <span className="font-bold text-[#0D0E11]">SECL - Pit #04</span></div>
                                <div className="flex items-center justify-between"><span className="text-stone-400">Lithology</span> <span className="text-[8px] font-semibold text-stone-600">Banded Coal</span></div>
                              </div>
                            </div>
                            <div className="pt-1">
                              <div className="flex justify-between text-[8px] font-mono text-stone-500 mb-1">
                                <span>Confidence</span>
                                <span className="font-extrabold text-[#0D0E11]">0.92</span>
                              </div>
                              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-600 w-[92%] rounded-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ======================================================== */}
                    {/* TAB 2: COAL QUALITY                                      */}
                    {/* ======================================================== */}
                    {activeDemoTab === 'Coal Quality' && (
                      <motion.div
                        key="CoalQuality"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-[#0D0E11] tracking-tight">Coal Quality Evaluation & Proximate Telemetry</h4>
                            <p className="text-[10px] text-stone-400 font-mono">Multi-target XGBoost prediction & real-time CIL Grade classification</p>
                          </div>
                          <button
                            onClick={() => navigate('/evaluation')}
                            className="text-[9px] font-mono text-[#C9972B] hover:text-[#B8861B] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Open Evaluation</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* 4 KPIs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                            <span className="text-[8.5px] font-mono text-amber-800 block mb-0.5">Predicted Grade</span>
                            <div className="text-lg font-black text-[#8C6615] font-mono leading-tight">G9 Grade</div>
                            <span className="text-[7.5px] font-mono text-amber-700/80 block mt-1">4,900–5,200 Band</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Inherent Moisture</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">7.82%</div>
                            <span className="text-[7.5px] font-mono text-emerald-600 block mt-1">±0.14% Std Dev</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Volatile Matter</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">27.40%</div>
                            <span className="text-[7.5px] font-mono text-amber-700 bg-amber-100/80 px-1 py-0.2 rounded font-bold inline-block mt-1">COMBUSTION OK</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Fixed Carbon</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">40.28%</div>
                            <span className="text-[7.5px] font-mono text-stone-500 block mt-1">100% Mass Closure</span>
                          </div>
                        </div>

                        {/* Panels */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                          <div className="sm:col-span-7 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 space-y-3">
                            <div className="flex items-center justify-between text-[9px] font-mono">
                              <span className="font-bold text-stone-700">Proximate Mass Balance</span>
                              <span className="text-emerald-700 font-bold">Sum = 100.00%</span>
                            </div>
                            {/* Stacked bar */}
                            <div className="h-3 w-full rounded-md overflow-hidden flex">
                              <div style={{ width: '40.28%' }} className="bg-stone-900" title="Fixed Carbon: 40.28%" />
                              <div style={{ width: '27.40%' }} className="bg-[#C9972B]" title="Volatile Matter: 27.40%" />
                              <div style={{ width: '24.50%' }} className="bg-stone-400" title="Ash: 24.50%" />
                              <div style={{ width: '7.82%' }} className="bg-sky-500" title="Moisture: 7.82%" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[8px] font-mono pt-1">
                              <div className="flex items-center justify-between bg-white p-1.5 rounded border border-stone-200/60">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-xs bg-stone-900" /> Fixed Carbon</span>
                                <span className="font-bold text-stone-800">40.28%</span>
                              </div>
                              <div className="flex items-center justify-between bg-white p-1.5 rounded border border-stone-200/60">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-xs bg-[#C9972B]" /> Volatile Matter</span>
                                <span className="font-bold text-[#8C6615]">27.40%</span>
                              </div>
                              <div className="flex items-center justify-between bg-white p-1.5 rounded border border-stone-200/60">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-xs bg-stone-400" /> Ash Content</span>
                                <span className="font-bold text-stone-700">24.50%</span>
                              </div>
                              <div className="flex items-center justify-between bg-white p-1.5 rounded border border-stone-200/60">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-xs bg-sky-500" /> Inherent Moisture</span>
                                <span className="font-bold text-sky-700">7.82%</span>
                              </div>
                            </div>
                          </div>

                          <div className="sm:col-span-5 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col justify-between">
                            <span className="text-[9px] font-mono font-bold text-stone-800 block mb-1">Geophysical Sensor Core</span>
                            <div className="space-y-1.5 text-[8.5px] font-mono">
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">Borehole ID</span><span className="font-bold text-stone-900">BH-GEVRA-108</span></div>
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">Natural Gamma</span><span className="font-bold text-stone-900">48 API Units</span></div>
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">Bulk Density</span><span className="font-bold text-stone-900">1.42 g/cm³</span></div>
                              <div className="flex justify-between py-1"><span className="text-stone-400">Verification</span><span className="text-emerald-700 font-bold">CMPDI Certified ✓</span></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ======================================================== */}
                    {/* TAB 3: BLEND OPTIMIZATION                                */}
                    {/* ======================================================== */}
                    {activeDemoTab === 'Blend Optimization' && (
                      <motion.div
                        key="BlendOptimization"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-[#0D0E11] tracking-tight">Continuous Linear Programming Blend Engine</h4>
                            <p className="text-[10px] text-stone-400 font-mono">Google OR-Tools solver optimizing multi-source coal mixing to target spec</p>
                          </div>
                          <button
                            onClick={() => navigate('/blend')}
                            className="text-[9px] font-mono text-[#C9972B] hover:text-[#B8861B] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Open Optimizer</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* 4 KPIs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Target GCV</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">4,800 kcal</div>
                            <span className="text-[7.5px] font-mono text-emerald-600 block mt-1 font-bold">4,815 Achieved</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Target Ash Cap</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">≤ 24.50%</div>
                            <span className="text-[7.5px] font-mono text-emerald-600 block mt-1 font-bold">24.30% Solved ✓</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-200/70">
                            <span className="text-[8.5px] font-mono text-emerald-800 block mb-0.5">Projected Savings</span>
                            <div className="text-lg font-extrabold text-emerald-800 font-mono leading-tight">₹42.8 Lakhs</div>
                            <span className="text-[7.5px] font-mono text-emerald-700 bg-emerald-100/80 px-1 py-0.2 rounded font-bold inline-block mt-1">PER 100K MT</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Solver Status</span>
                            <div className="text-sm font-black text-emerald-700 font-mono leading-tight mt-1">OPTIMAL</div>
                            <span className="text-[7.5px] font-mono text-stone-400 block mt-1">GLOP (18ms)</span>
                          </div>
                        </div>

                        {/* Panels */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                          <div className="sm:col-span-7 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 space-y-2.5">
                            <div className="flex items-center justify-between text-[9px] font-mono">
                              <span className="font-bold text-stone-700">Multi-Stockpile Mix Ratio</span>
                              <span className="text-[#C9972B] font-bold">GLOP Solved</span>
                            </div>
                            <div className="space-y-1.5 text-[8px] font-mono">
                              <div className="flex justify-between items-center"><span className="text-stone-500">Pit #04 High-Ash (₹1,420/T)</span><span className="font-bold text-stone-800">45% ratio</span></div>
                              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-stone-700 w-[45%]" /></div>

                              <div className="flex justify-between items-center pt-1"><span className="text-stone-500">Pit #02 Sweetener (₹2,100/T)</span><span className="font-bold text-[#8C6615]">35% ratio</span></div>
                              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-[#C9972B] w-[35%]" /></div>

                              <div className="flex justify-between items-center pt-1"><span className="text-stone-500">Washery Rejects (₹950/T)</span><span className="font-bold text-stone-600">20% ratio</span></div>
                              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-stone-400 w-[20%]" /></div>
                            </div>
                          </div>

                          <div className="sm:col-span-5 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col justify-between">
                            <span className="text-[9px] font-mono font-bold text-stone-800 block mb-1">Offtaker SLA Gating</span>
                            <div className="space-y-1.5 text-[8.5px] font-mono">
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">Consignee</span><span className="font-bold text-stone-900">NTPC Sipat</span></div>
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">Ash SLA Compliance</span><span className="text-emerald-700 font-bold">100.0% Pass</span></div>
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">Penalty Exposure</span><span className="text-emerald-700 font-bold">₹0 (Zero Risk)</span></div>
                              <div className="flex justify-between py-1"><span className="text-stone-400">CIL Bonus Grade</span><span className="text-[#8C6615] font-bold">+₹18.40/T</span></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ======================================================== */}
                    {/* TAB 4: DISPATCH                                          */}
                    {/* ======================================================== */}
                    {activeDemoTab === 'Dispatch' && (
                      <motion.div
                        key="Dispatch"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-[#0D0E11] tracking-tight">Commercial Rake Dispatch & Logistics Gating</h4>
                            <p className="text-[10px] text-stone-400 font-mono">Automated grade billing, weighbridge integration & RFID logistics</p>
                          </div>
                          <button
                            onClick={() => navigate('/dispatch')}
                            className="text-[9px] font-mono text-[#C9972B] hover:text-[#B8861B] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Open Dispatch</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* 4 KPIs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Active Rake ID</span>
                            <div className="text-base font-extrabold text-[#0D0E11] font-mono leading-tight">BOXN-8821</div>
                            <span className="text-[7.5px] font-mono text-stone-500 block mt-1">58 Wagons Full</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Net Payload</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">3,842 MT</div>
                            <span className="text-[7.5px] font-mono text-emerald-600 block mt-1 font-bold">RLS Continuous</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Consignee</span>
                            <div className="text-sm font-bold text-[#0D0E11] font-mono leading-tight mt-0.5 truncate">NTPC Korba</div>
                            <span className="text-[7.5px] font-mono text-blue-700 bg-blue-50 px-1 py-0.2 rounded font-bold inline-block mt-1">THERMAL GRID</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-200/70">
                            <span className="text-[8.5px] font-mono text-emerald-800 block mb-0.5">Gate Clearance</span>
                            <div className="text-sm font-black text-emerald-700 font-mono leading-tight mt-0.5">CLEARED</div>
                            <span className="text-[7.5px] font-mono text-stone-400 block mt-1">RFID Gate #02</span>
                          </div>
                        </div>

                        {/* Panels */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                          <div className="sm:col-span-7 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 space-y-2">
                            <div className="flex items-center justify-between text-[9px] font-mono">
                              <span className="font-bold text-stone-700">Rapid Loadout System (RLS) Wagons</span>
                              <span className="text-emerald-700 font-bold">58 / 58 Loaded</span>
                            </div>
                            <div className="grid grid-cols-10 gap-1 pt-1">
                              {Array.from({ length: 30 }).map((_, i) => (
                                <div key={i} className="h-2.5 bg-emerald-500 rounded-xs" title={`Wagon #${i + 1}: Passed`} />
                              ))}
                            </div>
                            <div className="flex justify-between text-[7.5px] font-mono text-stone-500 pt-1 border-t border-stone-200/50">
                              <span>Gross: 5,420 MT</span>
                              <span>Tare: 1,578 MT</span>
                              <span className="font-bold text-stone-800">Variance: ±0.3% Ash</span>
                            </div>
                          </div>

                          <div className="sm:col-span-5 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col justify-between">
                            <span className="text-[9px] font-mono font-bold text-stone-800 block mb-1">Commercial Billing & Seal</span>
                            <div className="space-y-1.5 text-[8.5px] font-mono">
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">Invoice Net</span><span className="font-bold text-stone-900">₹1.15 Crores</span></div>
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">E-Way Bill</span><span className="font-bold text-stone-900">EWB-9042-8821</span></div>
                              <div className="flex justify-between py-1"><span className="text-stone-400">Load Time</span><span className="text-emerald-700 font-bold">14 Mins (Fast)</span></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ======================================================== */}
                    {/* TAB 5: MODEL INTELLIGENCE                                */}
                    {/* ======================================================== */}
                    {activeDemoTab === 'Model Intelligence' && (
                      <motion.div
                        key="ModelIntelligence"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-[#0D0E11] tracking-tight">ATDIF Veracity & Explainable AI (SHAP)</h4>
                            <p className="text-[10px] text-stone-400 font-mono">5-vector confidence gating & game-theoretic feature attribution</p>
                          </div>
                          <button
                            onClick={() => navigate('/models')}
                            className="text-[9px] font-mono text-[#C9972B] hover:text-[#B8861B] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Open Models</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* 4 KPIs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">ATDIF Score</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">0.852</div>
                            <span className="text-[7.5px] font-mono text-emerald-600 block mt-1 font-bold">Gate Passed &gt; 0.80</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Centroid Distance</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">1.42 σ</div>
                            <span className="text-[7.5px] font-mono text-stone-500 block mt-1">Within Distribution</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Inference Latency</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">38 ms</div>
                            <span className="text-[7.5px] font-mono text-purple-700 bg-purple-100/80 px-1 py-0.2 rounded font-bold inline-block mt-1">EDGE ONNX</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Model Ensemble</span>
                            <div className="text-base font-bold text-[#0D0E11] font-mono leading-tight mt-0.5">XGB+CAT</div>
                            <span className="text-[7.5px] font-mono text-stone-400 block mt-1">±34 kcal Variance</span>
                          </div>
                        </div>

                        {/* Panels */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                          <div className="sm:col-span-7 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 space-y-2">
                            <div className="flex items-center justify-between text-[9px] font-mono">
                              <span className="font-bold text-stone-700">SHAP Feature Attributions</span>
                              <span className="text-[#C9972B] font-bold">TreeExplainer</span>
                            </div>
                            <div className="space-y-1.5 text-[8px] font-mono">
                              <div className="flex justify-between"><span className="text-stone-500">Geological Depth (m)</span><span className="text-emerald-700 font-bold">+240 kcal/kg</span></div>
                              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-600 w-[75%]" /></div>

                              <div className="flex justify-between pt-1"><span className="text-stone-500">Bulk Density (Gamma)</span><span className="text-red-700 font-bold">-180 kcal/kg</span></div>
                              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[55%]" /></div>

                              <div className="flex justify-between pt-1"><span className="text-stone-500">Seam Thickness</span><span className="text-emerald-700 font-bold">+95 kcal/kg</span></div>
                              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-600 w-[38%]" /></div>
                            </div>
                          </div>

                          <div className="sm:col-span-5 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col justify-between">
                            <span className="text-[9px] font-mono font-bold text-stone-800 block mb-1">Drift & OOD Sentinel</span>
                            <div className="space-y-1.5 text-[8.5px] font-mono">
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">KS-Test Drift</span><span className="text-emerald-700 font-bold">p=0.42 (No Drift)</span></div>
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">OOD Sentinel</span><span className="text-emerald-700 font-bold">PASSED (0.0% Anomaly)</span></div>
                              <div className="flex justify-between py-1"><span className="text-stone-400">Retraining Corpus</span><span className="font-bold text-stone-900">6,000 Core Splits</span></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ======================================================== */}
                    {/* TAB 6: LABORATORY                                        */}
                    {/* ======================================================== */}
                    {activeDemoTab === 'Laboratory' && (
                      <motion.div
                        key="Laboratory"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-[#0D0E11] tracking-tight">Proximate Lab Benchmarking & Validation</h4>
                            <p className="text-[10px] text-stone-400 font-mono">Bomb calorimeter ground-truth cross-validation vs AI prediction</p>
                          </div>
                          <button
                            onClick={() => navigate('/evaluation')}
                            className="text-[9px] font-mono text-[#C9972B] hover:text-[#B8861B] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Open Laboratory</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* 4 KPIs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Sample ID</span>
                            <div className="text-base font-extrabold text-[#0D0E11] font-mono leading-tight">LAB-9042</div>
                            <span className="text-[7.5px] font-mono text-stone-500 block mt-1">Core Drill Sample</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Bomb Calorimeter</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">4,912 kcal</div>
                            <span className="text-[7.5px] font-mono text-stone-500 block mt-1">ASTM D5865 Spec</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">AI Prediction</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">4,920 kcal</div>
                            <span className="text-[7.5px] font-mono text-emerald-700 bg-emerald-100/80 px-1 py-0.2 rounded font-bold inline-block mt-1">PARITY 99.8%</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-200/70">
                            <span className="text-[8.5px] font-mono text-emerald-800 block mb-0.5">Variance Delta</span>
                            <div className="text-sm font-black text-emerald-700 font-mono leading-tight mt-0.5">0.16% ERR</div>
                            <span className="text-[7.5px] font-mono text-emerald-600 block mt-1 font-bold">Statutory Pass</span>
                          </div>
                        </div>

                        {/* Panels */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                          <div className="sm:col-span-7 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 space-y-2">
                            <div className="flex items-center justify-between text-[9px] font-mono">
                              <span className="font-bold text-stone-700">Empirical Lab vs Model Benchmark</span>
                              <span className="text-emerald-700 font-bold">Grade Parity: Both G9</span>
                            </div>
                            <div className="space-y-2 text-[8px] font-mono pt-1">
                              <div>
                                <div className="flex justify-between text-stone-500 mb-0.5"><span>Bomb Calorimeter: 4,912 kcal/kg</span><span>99.8%</span></div>
                                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-stone-700 w-[99.8%]" /></div>
                              </div>
                              <div>
                                <div className="flex justify-between text-stone-500 mb-0.5"><span>AI Model: 4,920 kcal/kg (+8 kcal)</span><span>100.0%</span></div>
                                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-[#C9972B] w-full" /></div>
                              </div>
                              <div className="pt-1 text-[7.5px] text-stone-400">Cross-validation strictly within CIL 1.5% analytical repeatability threshold.</div>
                            </div>
                          </div>

                          <div className="sm:col-span-5 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col justify-between">
                            <span className="text-[9px] font-mono font-bold text-stone-800 block mb-1">Chemist Sign-Off & Audit</span>
                            <div className="space-y-1.5 text-[8.5px] font-mono">
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">Chief Chemist</span><span className="font-bold text-stone-900">Rajesh Kumar</span></div>
                              <div className="flex justify-between py-1 border-b border-stone-200/50"><span className="text-stone-400">Laboratory</span><span className="font-bold text-stone-900">SECL Central Lab</span></div>
                              <div className="flex justify-between py-1"><span className="text-stone-400">Ledger Entry</span><span className="text-emerald-700 font-bold">Committed to Corpus ✓</span></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ======================================================== */}
                    {/* TAB 7: REPORTS                                           */}
                    {/* ======================================================== */}
                    {activeDemoTab === 'Reports' && (
                      <motion.div
                        key="Reports"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-[#0D0E11] tracking-tight">Automated Statutory & Commercial Reporting</h4>
                            <p className="text-[10px] text-stone-400 font-mono">Instant generation of CCO audit trails, dispatch certificates & grade audits</p>
                          </div>
                          <button
                            onClick={() => navigate('/report')}
                            className="text-[9px] font-mono text-[#C9972B] hover:text-[#B8861B] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Open Reports</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* 4 KPIs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Daily Reports</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">14 Shift</div>
                            <span className="text-[7.5px] font-mono text-emerald-600 block mt-1 font-bold">Auto-compiled</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">CCO Compliance</span>
                            <div className="text-lg font-extrabold text-[#0D0E11] font-mono leading-tight">100.0%</div>
                            <span className="text-[7.5px] font-mono text-emerald-600 block mt-1 font-bold">Statutory Audit</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                            <span className="text-[8.5px] font-mono text-stone-400 block mb-0.5">Audit Records</span>
                            <div className="text-base font-extrabold text-[#0D0E11] font-mono leading-tight mt-0.5">1,248 Log</div>
                            <span className="text-[7.5px] font-mono text-emerald-700 bg-emerald-100/80 px-1 py-0.2 rounded font-bold inline-block mt-1">IMMUTABLE</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-200/70">
                            <span className="text-[8.5px] font-mono text-emerald-800 block mb-0.5">Export Status</span>
                            <div className="text-sm font-black text-emerald-700 font-mono leading-tight mt-0.5">CERTIFIED</div>
                            <span className="text-[7.5px] font-mono text-stone-400 block mt-1">SHA-256 Signed</span>
                          </div>
                        </div>

                        {/* Panels */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                          <div className="sm:col-span-7 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 space-y-2">
                            <div className="flex items-center justify-between text-[9px] font-mono">
                              <span className="font-bold text-stone-700">Official Shift & Statutory Bulletins</span>
                              <span className="text-[#C9972B] font-bold">Ready</span>
                            </div>
                            <div className="space-y-1.5 text-[8px] font-mono">
                              <div className="flex justify-between items-center bg-white p-1.5 rounded border border-stone-200/60">
                                <span className="flex items-center gap-1.5 font-medium text-stone-800">📄 Daily Shift Quality & Dispatch Bulletin</span>
                                <span className="text-emerald-700 font-bold">Approved • 1.4 MB</span>
                              </div>
                              <div className="flex justify-between items-center bg-white p-1.5 rounded border border-stone-200/60">
                                <span className="flex items-center gap-1.5 font-medium text-stone-800">📊 Monthly Linear Blend Optimization Ledger</span>
                                <span className="text-emerald-700 font-bold">Approved • 2.8 MB</span>
                              </div>
                              <div className="flex justify-between items-center bg-white p-1.5 rounded border border-stone-200/60">
                                <span className="flex items-center gap-1.5 font-medium text-stone-800">📋 CCO Grade Verification & Commercial Bill</span>
                                <span className="text-emerald-700 font-bold">Ready • 840 KB</span>
                              </div>
                            </div>
                          </div>

                          <div className="sm:col-span-5 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col justify-between">
                            <span className="text-[9px] font-mono font-bold text-stone-800 block mb-1">Quick Export & Signature</span>
                            <div className="space-y-2 text-[8px] font-mono">
                              <button
                                onClick={() => navigate('/report')}
                                className="w-full py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Download className="w-2.5 h-2.5" />
                                <span>Export Shift Summary (PDF)</span>
                              </button>
                              <div className="text-[7.5px] text-stone-400 text-center">Digitally sealed with SECL subsidiary watermark & CCO SHA-256 certificate.</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </div>

                </div>

              </div>

              {/* -------------------------------------------------------- */}
              {/* 4 ROLE SELECTOR PILLS BELOW THE DASHBOARD                */}
              {/* -------------------------------------------------------- */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    title: 'Chief Administrator',
                    sub: 'System Configuration & User Management',
                    icon: UserCheck,
                    tab: 'Overview' as const
                  },
                  {
                    title: 'Mining Engineer',
                    sub: 'Real-time Analytics & Dispatch Decisions',
                    icon: HardHat,
                    tab: 'Dispatch' as const
                  },
                  {
                    title: 'Laboratory Technician',
                    sub: 'Sample Analysis & Model Validation',
                    icon: FlaskConical,
                    tab: 'Laboratory' as const
                  },
                  {
                    title: 'Executive Viewer',
                    sub: 'Strategic Insights & Reports',
                    icon: BarChart3,
                    tab: 'Reports' as const
                  }
                ].map((role, idx) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedRole(idx);
                        setActiveDemoTab(role.tab);
                      }}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/50 border-[#C9972B] shadow-[0_4px_20px_rgba(201,151,43,0.18)] ring-1 ring-[#C9972B]'
                          : 'bg-white/95 border-stone-200/90 hover:border-stone-300 hover:bg-white shadow-xs'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 transition-colors ${
                        isSelected
                          ? 'bg-[#C9972B]/15 text-[#8C6615]'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-bold text-[#0D0E11] leading-tight mb-1">
                        {role.title}
                      </h5>
                      <p className="text-[10px] text-stone-500 leading-snug">
                        {role.sub}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* FOOTER                                                         */}
      {/* ============================================================== */}
      <footer className="py-12 bg-white border-t border-stone-200/60 text-xs text-[#999]">
        <div className="px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FAFAF8] border border-stone-200 flex items-center justify-center p-1.5 shadow-xs">
              <img src="/logo.png" alt="CarbonCortex Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-[#333] uppercase tracking-wider block text-[11px]">CarbonCortex</span>
              <span className="text-[9px] text-[#bbb] font-mono">Coal India Limited Decision Support</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold text-[#888]">
            <a href="#pipeline" className="hover:text-[#C9972B] transition-colors">Pipeline</a>
            <a href="#features" className="hover:text-[#C9972B] transition-colors">Features</a>
            <a href="#benchmarks" className="hover:text-[#C9972B] transition-colors">Benchmarks</a>
            <a href="#technology" className="hover:text-[#C9972B] transition-colors">Stack</a>
            <button onClick={() => navigate('/login')} className="hover:text-[#C9972B] transition-colors cursor-pointer">
              Enterprise Access
            </button>
          </div>

          <div className="text-[10px] font-mono text-[#ccc]">
            © 2026 CarbonCortex. All Industrial Telemetry Systems Active.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
