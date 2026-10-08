export interface MineOperationalPoint {
  id: string;
  name: string;
  code: string;
  category: 'excavator' | 'truck' | 'stockpile' | 'sensor' | 'lab' | 'sector';
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'HAULING' | 'LOADING' | 'CALIBRATING' | 'READY';
  telemetry: {
    primaryMetric: string;
    primaryValue: string;
    secondaryMetric: string;
    secondaryValue: string;
    operatorOrModel?: string;
    lastUpdated: string;
    gcvOrAsh?: string;
  };
  description: string;
}

// ---------------------------------------------------------------------------
// OPERATIONAL POINTS ACCURATELY DISTRIBUTED ACROSS THE OPEN-CAST PIT
// Centered at 21.7605° N, 83.8154° E (Matching Reference Satellite Layout)
// ---------------------------------------------------------------------------
export const MINE_OPERATIONAL_POINTS: MineOperationalPoint[] = [
  // 1. Excavators & Shovels (Amber glowing rings)
  {
    id: 'ex-03',
    name: 'Liebherr R9800 Hydraulic Shovel #03',
    code: 'EX-03',
    category: 'excavator',
    latitude: 21.7672,
    longitude: 83.8075,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Excavation Output',
      primaryValue: '4,850 T/hr',
      secondaryMetric: 'Bench Elevation',
      secondaryValue: 'Upper Northwest (+214m RL)',
      operatorOrModel: 'Operator: K. R. Sharma (Shift A)',
      lastUpdated: 'Live Telemetry (Real-Time)',
      gcvOrAsh: 'Estimated GCV: 4,920 kcal/kg (G9)'
    },
    description: 'Active extraction on northwest terrace bench directly loading electric haul truck fleet.'
  },
  {
    id: 'ex-02',
    name: 'P&H 4100XPC Electric Rope Shovel #02',
    code: 'EX-02',
    category: 'excavator',
    latitude: 21.7660,
    longitude: 83.8265,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Stripping Rate',
      primaryValue: '5,600 m³/hr',
      secondaryMetric: 'Overburden Bench',
      secondaryValue: 'Northeast Cut Seam IV',
      operatorOrModel: 'Operator: Amit Verma (Shift A)',
      lastUpdated: 'Live Telemetry (Real-Time)',
      gcvOrAsh: 'Stripping Ratio: 1:0.92'
    },
    description: 'Northeast highwall overburden stripping creating primary haul access to lower sweetening seams.'
  },
  {
    id: 'ex-01',
    name: 'Komatsu PC8000 Central Pit Shovel #01',
    code: 'EX-01',
    category: 'excavator',
    latitude: 21.7602,
    longitude: 83.8142,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Cycle Duration',
      primaryValue: '26.8 Seconds',
      secondaryMetric: 'Bucket Payload',
      secondaryValue: '42.0 MT / Pass',
      operatorOrModel: 'Operator: D. Sen (Shift A)',
      lastUpdated: 'Live Telemetry (Real-Time)',
      gcvOrAsh: 'Ash Content: 22.8% (Target Met)'
    },
    description: 'Central floor high-velocity shovel feeding central arterial haul spine.'
  },
  {
    id: 'ex-04',
    name: 'Caterpillar 6060 Hydraulic Digger #04',
    code: 'EX-04',
    category: 'excavator',
    latitude: 21.7530,
    longitude: 83.8115,
    status: 'LOADING',
    telemetry: {
      primaryMetric: 'Floor Depth',
      primaryValue: '182.4 Meters Depth',
      secondaryMetric: 'Seam Thickness',
      secondaryValue: '14.2m Continuous Seam',
      operatorOrModel: 'Operator: V. P. Rao',
      lastUpdated: 'Live Telemetry (Real-Time)',
      gcvOrAsh: 'Estimated GCV: 5,140 kcal/kg'
    },
    description: 'Southwest lower terrace extracting high-calorific bottom seam coal.'
  },
  {
    id: 'ex-05',
    name: 'Marion 201-M Excavator #05',
    code: 'EX-05',
    category: 'excavator',
    latitude: 21.7505,
    longitude: 83.8235,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Shift Tonnage',
      primaryValue: '24,200 MT Extracted',
      secondaryMetric: 'Bench Slope',
      secondaryValue: 'Stable (+65° Face)',
      operatorOrModel: 'Operator: M. Joshi',
      lastUpdated: 'Live Telemetry (Real-Time)',
      gcvOrAsh: 'Ash: 24.10% | Moisture: 7.9%'
    },
    description: 'Southeast pit deep bench stripping under continuous telemetry monitoring.'
  },

  // 2. Heavy Haul Fleet (Electric Blue glowing rings along roads)
  {
    id: 'ht-01',
    name: 'Haul Unit #01 — Caterpillar 797F (360 MT)',
    code: 'HT-01',
    category: 'truck',
    latitude: 21.7650,
    longitude: 83.8068,
    status: 'HAULING',
    telemetry: {
      primaryMetric: 'Payload Weight',
      primaryValue: '354 MT',
      secondaryMetric: 'Ramp Velocity',
      secondaryValue: '24 km/h (Grade -6%)',
      operatorOrModel: 'Fleet Unit #CAT-901',
      lastUpdated: 'Telemetry Live (1s ago)',
      gcvOrAsh: 'Destination: Central Spine'
    },
    description: 'Descending northwest switchback ramp en route to central distribution junction.'
  },
  {
    id: 'ht-02',
    name: 'Haul Unit #02 — Komatsu 930E (290 MT)',
    code: 'HT-02',
    category: 'truck',
    latitude: 21.7668,
    longitude: 83.8188,
    status: 'HAULING',
    telemetry: {
      primaryMetric: 'Payload Weight',
      primaryValue: '288 MT',
      secondaryMetric: 'Tire Pressure',
      secondaryValue: '102 PSI (Optimal)',
      operatorOrModel: 'Fleet Unit #KOM-412',
      lastUpdated: 'Telemetry Live (2s ago)',
      gcvOrAsh: 'Destination: Stockpile SP-02'
    },
    description: 'North-central arterial transit hauling raw run-of-mine coal to northeast surge yard.'
  },
  {
    id: 'ht-03',
    name: 'Haul Unit #03 — BelAZ 75710 (450 MT)',
    code: 'HT-03',
    category: 'truck',
    latitude: 21.7615,
    longitude: 83.8182,
    status: 'HAULING',
    telemetry: {
      primaryMetric: 'Payload Weight',
      primaryValue: '442 MT',
      secondaryMetric: 'Fuel Efficiency',
      secondaryValue: '18.4 L/hr Normal',
      operatorOrModel: 'Fleet Unit #BEL-108',
      lastUpdated: 'Telemetry Live (1s ago)',
      gcvOrAsh: 'Destination: Sector 02 Rail Siding'
    },
    description: 'Ultra-class haul truck navigating central intersection heading toward rapid loading rail siding.'
  },
  {
    id: 'ht-04',
    name: 'Haul Unit #04 — BEML BH205E (205 MT)',
    code: 'HT-04',
    category: 'truck',
    latitude: 21.7552,
    longitude: 83.8152,
    status: 'HAULING',
    telemetry: {
      primaryMetric: 'Payload Weight',
      primaryValue: '202 MT',
      secondaryMetric: 'Speed Telemetry',
      secondaryValue: '28 km/h Flat Grade',
      operatorOrModel: 'Fleet Unit #BEML-77',
      lastUpdated: 'Telemetry Live (3s ago)',
      gcvOrAsh: 'Destination: Stockpile SP-03'
    },
    description: 'Ascending south arterial ramp delivering sweetener grade coal to intermediate blending bunker.'
  },
  {
    id: 'ht-05',
    name: 'Haul Unit #05 — Caterpillar 793D (240 MT)',
    code: 'HT-05',
    category: 'truck',
    latitude: 21.7510,
    longitude: 83.8185,
    status: 'HAULING',
    telemetry: {
      primaryMetric: 'Payload Weight',
      primaryValue: '238 MT',
      secondaryMetric: 'Engine Temp',
      secondaryValue: '88°C (Normal)',
      operatorOrModel: 'Fleet Unit #CAT-403',
      lastUpdated: 'Telemetry Live (1s ago)',
      gcvOrAsh: 'Destination: Railhead Loadout'
    },
    description: 'Approaching south perimeter haul loop connecting bottom cut to eastern rail terminal.'
  },
  {
    id: 'ht-06',
    name: 'Haul Unit #06 — Komatsu 830E (240 MT)',
    code: 'HT-06',
    category: 'truck',
    latitude: 21.7550,
    longitude: 83.8282,
    status: 'READY',
    telemetry: {
      primaryMetric: 'Discharge Status',
      primaryValue: 'Unloading into Silo Hoppers',
      secondaryMetric: 'Cycle Time',
      secondaryValue: '14.2 Mins Complete',
      operatorOrModel: 'Fleet Unit #KOM-221',
      lastUpdated: 'Telemetry Live (1s ago)',
      gcvOrAsh: 'Unload Tonnage: 236 MT'
    },
    description: 'Discharging crushed coal at rail loading bunker for direct 58-wagon train loadout.'
  },

  // 3. Stockpiles (Dark slate circle with white triangle)
  {
    id: 'sp-01',
    name: 'North Stockyard #01 — ROM Surge Buffer',
    code: 'SP-01',
    category: 'stockpile',
    latitude: 21.7660,
    longitude: 83.8138,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Stored Reserve',
      primaryValue: '165,000 MT',
      secondaryMetric: 'Average GCV',
      secondaryValue: '4,920 kcal/kg (G9)',
      operatorOrModel: 'Automated Stack/Reclaim Array',
      lastUpdated: 'Proximate Scan (8m ago)',
      gcvOrAsh: 'Ash: 24.50% | Moisture: 7.8%'
    },
    description: 'Primary surge stockpile buffering raw coal between pit excavation and overland conveyor.'
  },
  {
    id: 'sp-02',
    name: 'Southwest Stockpile #02 — Sweetener Reserve',
    code: 'SP-02',
    category: 'stockpile',
    latitude: 21.7565,
    longitude: 83.8055,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Stored Reserve',
      primaryValue: '94,200 MT',
      secondaryMetric: 'Average GCV',
      secondaryValue: '5,350 kcal/kg (G8)',
      operatorOrModel: 'Quality Controller: S. Sen',
      lastUpdated: 'Proximate Scan (4m ago)',
      gcvOrAsh: 'Ash: 18.20% (Low-Ash Premium)'
    },
    description: 'High-energy sweetening coal stockpile managed by continuous linear programming optimizer.'
  },
  {
    id: 'sp-03',
    name: 'Southeast Stockpile #03 — Thermal Commercial Feed',
    code: 'SP-03',
    category: 'stockpile',
    latitude: 21.7562,
    longitude: 83.8242,
    status: 'READY',
    telemetry: {
      primaryMetric: 'Stored Reserve',
      primaryValue: '182,000 MT',
      secondaryMetric: 'Average GCV',
      secondaryValue: '4,815 kcal/kg (G10)',
      operatorOrModel: 'Dispatch Blend Silo',
      lastUpdated: 'Proximate Scan (12m ago)',
      gcvOrAsh: 'Ash: 24.30% (SLA Satisfied)'
    },
    description: 'Commercial dispatch grade reserve pre-certified for NTPC thermal utility contracts.'
  },

  // 4. Sensors & Geotechnical Telemetry Nodes (Compact green pins with signal wave)
  {
    id: 'sn-01',
    name: 'Northwest Highwall Slope Radar #01',
    code: 'SN-01',
    category: 'sensor',
    latitude: 21.7702,
    longitude: 83.8088,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Displacement Rate',
      primaryValue: '0.02 mm/day (Ultra Stable)',
      secondaryMetric: 'Safety Factor',
      secondaryValue: '1.92 (Exceeds DGMS Norm)',
      operatorOrModel: 'Interferometric Radar 24GHz',
      lastUpdated: 'Real-Time Continuous',
      gcvOrAsh: 'Risk Status: GREEN PASS'
    },
    description: 'Continuous millimeter radar monitoring stability of the northwest 200m highwall crest.'
  },
  {
    id: 'sn-02',
    name: 'North Bench Crest Strain Gauge #02',
    code: 'SN-02',
    category: 'sensor',
    latitude: 21.7682,
    longitude: 83.8168,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Borehole Inclinometer',
      primaryValue: '0.00° Deflection',
      secondaryMetric: 'Piezometric Pressure',
      secondaryValue: '12 kPa (Dry Strata)',
      operatorOrModel: 'IoT Geotechnical Mesh',
      lastUpdated: 'Real-Time Continuous',
      gcvOrAsh: 'Strata: Sandstone Massive'
    },
    description: 'Subsurface geotechnical probe measuring bench floor integrity above central active cut.'
  },
  {
    id: 'sn-03',
    name: 'Northeast Boundary Methane Sentinel #03',
    code: 'SN-03',
    category: 'sensor',
    latitude: 21.7668,
    longitude: 83.8292,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'CH4 Methane Level',
      primaryValue: '0.01% (Safe Threshold)',
      secondaryMetric: 'PM10 Ambient Dust',
      secondaryValue: '38 µg/m³ (Compliant)',
      operatorOrModel: 'DGMS Statutory Environmental',
      lastUpdated: 'Real-Time Continuous',
      gcvOrAsh: 'Statutory Status: PASS'
    },
    description: 'Statutory atmospheric sensor array transmitting ambient gas and particulate readings.'
  },
  {
    id: 'sn-04',
    name: 'West Rim Geotechnical Seismograph #04',
    code: 'SN-04',
    category: 'sensor',
    latitude: 21.7598,
    longitude: 83.8022,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Peak Particle Velocity',
      primaryValue: '2.4 mm/s (Within Limit)',
      secondaryMetric: 'Blast Vibration Alert',
      secondaryValue: 'NORMAL (No Damage)',
      operatorOrModel: 'Triaxial Seismograph Unit',
      lastUpdated: 'Real-Time Continuous',
      gcvOrAsh: 'DGMS Blast Compliance: 100%'
    },
    description: 'Real-time ground vibration monitor guarding western perimeter during production blasting.'
  },
  {
    id: 'sn-05',
    name: 'West Bench Slope Extensometer #05',
    code: 'SN-05',
    category: 'sensor',
    latitude: 21.7560,
    longitude: 83.8040,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Tension Crack Sensor',
      primaryValue: '0.00 mm Extension',
      secondaryMetric: 'Battery Health',
      secondaryValue: '98% Solar Charged',
      operatorOrModel: 'LoRaWAN Edge Node #55',
      lastUpdated: 'Real-Time Continuous',
      gcvOrAsh: 'Bench Stability: 100%'
    },
    description: 'Wireless bench crest extensometer continuously transmitting ground displacement data.'
  },
  {
    id: 'sn-06',
    name: 'Central Slope Inclinometer #06',
    code: 'SN-06',
    category: 'sensor',
    latitude: 21.7558,
    longitude: 83.8090,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Shear Plane Monitor',
      primaryValue: 'Stable (Zero Movement)',
      secondaryMetric: 'Subsurface Moisture',
      secondaryValue: '4.8% (Well Drained)',
      operatorOrModel: 'Time-Domain Reflectometer',
      lastUpdated: 'Real-Time Continuous',
      gcvOrAsh: 'Integrity: Optimum'
    },
    description: 'Deep borehole geotechnical probe installed through central coal partition pillars.'
  },
  {
    id: 'sn-07',
    name: 'South Highwall Crest Monitor #07',
    code: 'SN-07',
    category: 'sensor',
    latitude: 21.7482,
    longitude: 83.8092,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Crest Displacement',
      primaryValue: '0.01 mm/day',
      secondaryMetric: 'Acoustic Emission',
      secondaryValue: 'Zero Micro-Fractures',
      operatorOrModel: 'Acoustic Wave Sentinel',
      lastUpdated: 'Real-Time Continuous',
      gcvOrAsh: 'Safety Factor: 2.10'
    },
    description: 'Acoustic micro-seismic sensor tracking highwall stability at south pit boundary.'
  },
  {
    id: 'sn-08',
    name: 'Overland Conveyor Telemetry Node #08',
    code: 'SN-08',
    category: 'sensor',
    latitude: 21.7576,
    longitude: 83.8268,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Conveyor Throughput',
      primaryValue: '4,200 MT / Hour',
      secondaryMetric: 'Bearing Vibration',
      secondaryValue: '1.2 mm/s RMS (Healthy)',
      operatorOrModel: 'Predictive Maintenance IoT',
      lastUpdated: 'Real-Time Continuous',
      gcvOrAsh: 'Belt Speed: 5.2 m/s'
    },
    description: 'High-speed overland curved conveyor transporting crushed coal to railhead silo.'
  },
  {
    id: 'sn-09',
    name: 'South Drainage Sump Telemetry Node #09',
    code: 'SN-09',
    category: 'sensor',
    latitude: 21.7518,
    longitude: 83.8270,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Sump Water Level',
      primaryValue: '-4.6m Below Floor Level',
      secondaryMetric: 'Pumping Flowrate',
      secondaryValue: '14,000 LPM Active',
      operatorOrModel: 'Automated Dewatering PLC',
      lastUpdated: 'Real-Time Continuous',
      gcvOrAsh: 'Floor Condition: Dry'
    },
    description: 'Deepest southern sump drainage station maintaining continuous dry floor for heavy haulers.'
  },

  // 5. Sampling Stations & Proximate Labs (Purple glowing circles with flask)
  {
    id: 'sm-01',
    name: 'West Terrace Borehole Core Lab #01',
    code: 'SM-01',
    category: 'lab',
    latitude: 21.7628,
    longitude: 83.8042,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Diamond Core Sample',
      primaryValue: 'CORE-2026-9041 (182.4m)',
      secondaryMetric: 'Mass Balance Closure',
      secondaryValue: '100.0% Exact Sum',
      operatorOrModel: 'Chief Chemist: Rajesh Kumar',
      lastUpdated: 'Analysis Complete (12m ago)',
      gcvOrAsh: 'Bomb GCV: 4,912 vs AI: 4,920 kcal'
    },
    description: 'Continuous geological core logging and automated spectral gamma proximate testing station.'
  },
  {
    id: 'sm-02',
    name: 'East Belt Rapid Isotopic Ash Lab #02',
    code: 'SM-02',
    category: 'lab',
    latitude: 21.7618,
    longitude: 83.8245,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Real-Time In-Line Ash',
      primaryValue: '24.50% (±0.1% Precision)',
      secondaryMetric: 'Inherent Moisture',
      secondaryValue: '7.82% Consistent',
      operatorOrModel: 'Prompt Gamma Neutron (PGNAA)',
      lastUpdated: 'Analysis Complete (2m ago)',
      gcvOrAsh: 'Verified Grade: G9 CIL Band'
    },
    description: 'In-line prompt gamma neutron activation analyzer scanning coal streaming on the main conveyor.'
  },
  {
    id: 'sm-03',
    name: 'South Cut Core Calibration Node #03',
    code: 'SM-03',
    category: 'lab',
    latitude: 21.7495,
    longitude: 83.8128,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Deep Floor Stratum Test',
      primaryValue: 'CORE-SECL-8840 (Bottom Seam)',
      secondaryMetric: 'Volatile Matter',
      secondaryValue: '27.4% High-Volatile',
      operatorOrModel: 'Laboratory Tech: S. K. Das',
      lastUpdated: 'Analysis Complete (18m ago)',
      gcvOrAsh: 'Fixed Carbon: 40.28%'
    },
    description: 'Ground-truth analytical cross-validation sample feeding continuous ML ensemble retraining.'
  },

  // 6. Sectors & Railhead Dispatch Terminals (Translucent cyan pulsing rings with numbers)
  {
    id: 'sec-03',
    name: 'Sector 03 — North Main Excavation Basin',
    code: '3',
    category: 'sector',
    latitude: 21.7688,
    longitude: 83.8225,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Active Fleet in Sector',
      primaryValue: '14 Units Deployed',
      secondaryMetric: 'Shift Output',
      secondaryValue: '38,400 MT Extracted',
      operatorOrModel: 'Mining Engineer: P. K. Singh',
      lastUpdated: 'Live Shift Telemetry',
      gcvOrAsh: 'Highwall Face: Stable'
    },
    description: 'Upper northern primary extraction basin operating 2 rope shovels and high-capacity haul loops.'
  },
  {
    id: 'sec-04',
    name: 'Sector 04 — South Deep Terrace Cut',
    code: '4',
    category: 'sector',
    latitude: 21.7555,
    longitude: 83.8095,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Active Fleet in Sector',
      primaryValue: '11 Units Deployed',
      secondaryMetric: 'Floor Elevation',
      secondaryValue: '+32m Above Sea Level',
      operatorOrModel: 'Mining Engineer: V. Rao',
      lastUpdated: 'Live Shift Telemetry',
      gcvOrAsh: 'Quality: Premium Thermal'
    },
    description: 'Deepest pit cut exposing high-energy thermal coal with strict de-watering maintenance.'
  },
  {
    id: 'sec-02',
    name: 'Sector 02 — Rapid Loading System (RLS) Rail Terminal',
    code: '2',
    category: 'sector',
    latitude: 21.7565,
    longitude: 83.8290,
    status: 'ACTIVE',
    telemetry: {
      primaryMetric: 'Rapid Loadout Rate',
      primaryValue: '4,500 MT / Hour',
      secondaryMetric: 'Active Train Rake',
      secondaryValue: 'BOXN-8821 (58 Wagons)',
      operatorOrModel: 'Rail Logistics Supervisor',
      lastUpdated: 'Dispatch Gate: PASSED',
      gcvOrAsh: 'Consignee: NTPC Korba STPS'
    },
    description: 'Automated overhead flood-loading silos filling full 58-wagon Indian Railways trains in 42 minutes.'
  }
];
