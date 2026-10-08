import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  Compass,
  ZoomIn,
  Navigation,
  Globe,
  X,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { MINE_OPERATIONAL_POINTS, type MineOperationalPoint } from '../constants/minePoints';

// ---------------------------------------------------------------------------
// PROFESSIONAL HIGH-TECH MARKER FACTORY (MATCHING IMAGE 2 EXACTLY)
// ---------------------------------------------------------------------------
const createProfessionalIcon = (point: MineOperationalPoint, isSelected: boolean) => {
  // 1. Excavators — Dark circle with luminous Amber glowing border & authentic heavy shovel silhouette
  if (point.category === 'excavator') {
    return L.divIcon({
      html: `
        <div class="relative group cursor-pointer transition-transform transform hover:scale-125 flex items-center justify-center">
          ${isSelected ? '<span class="absolute -inset-1.5 rounded-full bg-amber-400 opacity-80 animate-ping"></span>' : ''}
          <div class="w-9 h-9 rounded-full bg-[#18181B] border-2 ${isSelected ? 'border-amber-300 ring-3 ring-amber-400/60 scale-110' : 'border-[#F59E0B]'} shadow-[0_0_14px_rgba(245,158,11,0.85)] flex items-center justify-center text-white">
            <svg class="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-2h14v2zm-4-4V7l-4-4H6v9h9zm2-7.5l2.5 2.5-1.4 1.4-2.5-2.5 1.4-1.4z"/>
            </svg>
          </div>
        </div>
      `,
      className: 'custom-pro-excavator-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });
  }

  // 2. Haul Trucks — Dark circle with luminous Electric Blue glowing border & heavy dump truck silhouette
  if (point.category === 'truck') {
    return L.divIcon({
      html: `
        <div class="relative group cursor-pointer transition-transform transform hover:scale-125 flex items-center justify-center">
          ${isSelected ? '<span class="absolute -inset-1.5 rounded-full bg-sky-400 opacity-80 animate-ping"></span>' : ''}
          <div class="w-8 h-8 rounded-full bg-[#0F172A] border-2 ${isSelected ? 'border-sky-300 ring-3 ring-sky-400/60 scale-110' : 'border-[#38BDF8]'} shadow-[0_0_14px_rgba(56,189,248,0.85)] flex items-center justify-center text-white">
            <svg class="w-4 h-4 text-[#38BDF8]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 12V9.5h2.5l1.9 2.5H17z"/>
            </svg>
          </div>
        </div>
      `,
      className: 'custom-pro-truck-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  }

  // 3. IoT & Slope Sensors — Vivid emerald round badge with white signal waves & radial glow
  if (point.category === 'sensor') {
    return L.divIcon({
      html: `
        <div class="relative group cursor-pointer transition-transform transform hover:scale-125 flex items-center justify-center">
          ${isSelected ? '<span class="absolute -inset-1 rounded-full bg-emerald-400 opacity-80 animate-ping"></span>' : ''}
          <div class="w-6 h-6 rounded-full bg-[#059669] border border-white shadow-[0_0_12px_rgba(16,185,129,0.9)] flex items-center justify-center text-white">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
              <line x1="12" y1="20" x2="12.01" y2="20"/>
            </svg>
          </div>
        </div>
      `,
      className: 'custom-pro-sensor-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -14]
    });
  }

  // 4. Stockpiles — Dark slate circle with silver border & white triangle
  if (point.category === 'stockpile') {
    return L.divIcon({
      html: `
        <div class="relative group cursor-pointer transition-transform transform hover:scale-125 flex items-center justify-center">
          ${isSelected ? '<span class="absolute -inset-1 rounded-full bg-slate-300 opacity-80 animate-ping"></span>' : ''}
          <div class="w-8 h-8 rounded-full bg-[#1E293B] border-2 ${isSelected ? 'border-white ring-3 ring-slate-400/60 scale-110' : 'border-slate-300'} shadow-md flex items-center justify-center text-white">
            <svg class="w-3.5 h-3.5 text-slate-100" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="12,4 3,20 21,20"/>
            </svg>
          </div>
        </div>
      `,
      className: 'custom-pro-stockpile-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  }

  // 5. Sampling Labs — Dark purple circle with luminous Violet/Purple ring & flask
  if (point.category === 'lab') {
    return L.divIcon({
      html: `
        <div class="relative group cursor-pointer transition-transform transform hover:scale-125 flex items-center justify-center">
          ${isSelected ? '<span class="absolute -inset-1 rounded-full bg-purple-400 opacity-80 animate-ping"></span>' : ''}
          <div class="w-8 h-8 rounded-full bg-[#3B0764] border-2 ${isSelected ? 'border-purple-300 ring-3 ring-purple-400/60 scale-110' : 'border-[#C084FC]'} shadow-[0_0_14px_rgba(192,132,252,0.85)] flex items-center justify-center text-white">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M10 2v5.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 7.5V2"/>
              <path d="M8.5 2h7"/>
              <path d="M7 15h10"/>
            </svg>
          </div>
        </div>
      `,
      className: 'custom-pro-lab-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  }

  // 6. Sectors (2, 3, 4) — Translucent glowing radar rings with sector numbers
  return L.divIcon({
    html: `
      <div class="relative group cursor-pointer transition-transform transform hover:scale-125 flex items-center justify-center">
        <div class="w-11 h-11 rounded-full bg-cyan-500/20 border border-cyan-400/60 animate-pulse flex items-center justify-center">
          <div class="w-7 h-7 rounded-full bg-[#082F49] text-white shadow-lg flex items-center justify-center font-mono font-black text-xs border border-cyan-300">
            ${point.code}
          </div>
        </div>
      </div>
    `,
    className: 'custom-pro-sector-marker',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
};

// ---------------------------------------------------------------------------
// ACCURATE HAUL ROAD NETWORKS TRACED DIRECTLY FROM IMAGE 2
// ---------------------------------------------------------------------------
const BLUE_MAIN_HAUL_ROAD: [number, number][] = [
  [21.7672, 83.8075],
  [21.7650, 83.8068],
  [21.7635, 83.8080],
  [21.7630, 83.8115],
  [21.7645, 83.8155],
  [21.7668, 83.8188],
  [21.7655, 83.8210],
  [21.7635, 83.8205],
  [21.7615, 83.8182],
  [21.7585, 83.8165],
  [21.7552, 83.8152],
  [21.7525, 83.8158],
  [21.7510, 83.8185],
  [21.7528, 83.8235],
  [21.7550, 83.8282],
  [21.7565, 83.8290]
];

const AMBER_NORTH_HAUL_BRANCH: [number, number][] = [
  [21.7655, 83.8210],
  [21.7668, 83.8225],
  [21.7660, 83.8265]
];

const SOUTH_DEEP_CUT_BRANCH: [number, number][] = [
  [21.7552, 83.8152],
  [21.7540, 83.8125],
  [21.7530, 83.8115]
];

// Road traffic directional flow chevrons (Matching Image 2)
interface RoadFlowArrow {
  id: string;
  position: [number, number];
  rotation: number;
  color: string;
}

const ROAD_FLOW_ARROWS: RoadFlowArrow[] = [
  { id: 'arr-1', position: [21.7642, 83.8072], rotation: 145, color: '#38BDF8' },
  { id: 'arr-2', position: [21.7632, 83.8100], rotation: 80, color: '#38BDF8' },
  { id: 'arr-3', position: [21.7663, 83.8235], rotation: 120, color: '#F59E0B' },
  { id: 'arr-4', position: [21.7648, 83.8168], rotation: 40, color: '#38BDF8' },
  { id: 'arr-5', position: [21.7628, 83.8192], rotation: 210, color: '#38BDF8' },
  { id: 'arr-6', position: [21.7570, 83.8158], rotation: 190, color: '#38BDF8' },
  { id: 'arr-7', position: [21.7538, 83.8122], rotation: 220, color: '#38BDF8' },
  { id: 'arr-8', position: [21.7516, 83.8205], rotation: 65, color: '#38BDF8' },
  { id: 'arr-9', position: [21.7538, 83.8255], rotation: 55, color: '#38BDF8' }
];

const createArrowIcon = (arrow: RoadFlowArrow) => {
  return L.divIcon({
    html: `
      <div style="transform: rotate(${arrow.rotation}deg);" class="flex items-center justify-center filter drop-shadow-[0_0_5px_${arrow.color}]">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="${arrow.color}">
          <path d="M5 3l14 9-14 9V3z"/>
        </svg>
      </div>
    `,
    className: 'custom-road-flow-arrow',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

// Map Fly-To controller
const MapController: React.FC<{ target: { center: [number, number]; zoom: number } | null }> = ({ target }) => {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo(target.center, target.zoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [target, map]);

  return null;
};

// Coordinate hover tracking
const MapCoordinateTracker: React.FC<{
  onCoordinatesChange: (coords: { lat: number; lng: number } | null) => void;
}> = ({ onCoordinatesChange }) => {
  useMapEvents({
    mousemove(e) {
      onCoordinatesChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    mouseout() {
      onCoordinatesChange(null);
    }
  });

  return null;
};

interface CoalMapProps {
  onPointSelect?: (point: MineOperationalPoint) => void;
  selectedPointId?: string | null;
  onNavigateToModule?: (path: string) => void;
}

export const CoalMap: React.FC<CoalMapProps> = ({ onPointSelect, selectedPointId, onNavigateToModule }) => {
  const [mapReady, setMapReady] = useState(false);
  const [activeStyle, setActiveStyle] = useState<'satellite' | 'osm' | 'topo'>('satellite');
  const [hoveredCoords, setHoveredCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  // Center tightly on the open-cast pit (Zoom 15 fits the pit edge-to-edge)
  const centerCoords: [number, number] = [21.7605, 83.8154];
  const [flyTarget, setFlyTarget] = useState<{ center: [number, number]; zoom: number } | null>(null);

  // Floating Inspector Drawer State
  const [inspectingPoint, setInspectingPoint] = useState<MineOperationalPoint | null>(null);

  useEffect(() => {
    setMapReady(true);
  }, []);

  // Sync external selection from parent
  useEffect(() => {
    if (selectedPointId) {
      const pt = MINE_OPERATIONAL_POINTS.find((p) => p.id === selectedPointId);
      if (pt) {
        setInspectingPoint(pt);
        setFlyTarget({ center: [pt.latitude, pt.longitude], zoom: 16 });
      }
    }
  }, [selectedPointId]);

  const handleSelectPoint = (pt: MineOperationalPoint) => {
    setInspectingPoint(pt);
    onPointSelect?.(pt);
    setFlyTarget({ center: [pt.latitude, pt.longitude], zoom: 16 });
  };

  if (!mapReady) {
    return (
      <div className="w-full h-full bg-[#121417] rounded-2xl flex items-center justify-center text-xs text-stone-400 font-mono">
        <svg className="animate-spin h-5 w-5 text-[#C9972B] mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>LOADING OPEN-CAST SATELLITE PIT MESH...</span>
      </div>
    );
  }

  const tileUrls = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    topo: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-stone-300 shadow-md flex flex-col bg-[#0D0E11] select-none">
      
      {/* ================================================================ */}
      {/* TOP FLOATING CONTROL BAR MATCHING USER IMAGE 2 EXACTLY           */}
      {/* ================================================================ */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2 pointer-events-auto">
        
        {/* Row 1: CIL Basin & Pit Navigation Pills */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-stone-200/90 shadow-md">
          <button
            type="button"
            onClick={() => setFlyTarget({ center: [23.3, 82.5], zoom: 6 })}
            className="text-[11.5px] font-mono text-stone-700 hover:text-stone-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="text-stone-400 font-sans font-medium">in</span>
            <span className="font-bold">CIL Basins</span>
          </button>

          <span className="text-stone-300 font-light">|</span>

          <button
            type="button"
            onClick={() => setFlyTarget({ center: centerCoords, zoom: 15 })}
            className="text-[11.5px] font-mono text-stone-900 font-bold hover:text-[#C9972B] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5 text-[#C9972B]" />
            <span>Gevra Mega Pit</span>
          </button>

          <span className="text-stone-300 font-light">|</span>

          <button
            type="button"
            onClick={() => setFlyTarget({ center: [20.0, 10.0], zoom: 2 })}
            className="text-[11.5px] font-mono text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold">Open World</span>
          </button>

          <div className="w-[1px] h-4 bg-stone-200 mx-0.5" />

          {/* Pit Badge */}
          <div className="px-2.5 py-0.5 text-[11px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200/80 rounded-xl flex items-center gap-1">
            <span className="text-teal-600 font-black">&lt;</span>
            <span>Open-Cast Pits (8)</span>
          </div>
        </div>

        {/* Row 2: Basemap Switcher (Satellite Highlighted in Gold as in Image 2) */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-stone-200/90 shadow-md self-start">
          {[
            { id: 'osm' as const, label: 'Open World Map', icon: '🗺️' },
            { id: 'satellite' as const, label: 'High-Res Satellite', icon: '🛰️' },
            { id: 'topo' as const, label: 'Topographic Terrain', icon: '🏔️' }
          ].map((st) => {
            const isSelected = activeStyle === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStyle(st.id)}
                className={`px-3 py-1.5 text-[11px] font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#C9972B] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span>{st.icon}</span>
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ================================================================ */}
      {/* LEAFLET MAP VIEWPORT (ZOOM 15 FILLS PIT ACROSS ENTIRE VIEW)      */}
      {/* ================================================================ */}
      <MapContainer
        center={centerCoords}
        zoom={15}
        minZoom={13}
        maxZoom={18}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
        className="w-full h-full flex-1 z-0"
      >
        <MapController target={flyTarget} />
        <MapCoordinateTracker onCoordinatesChange={setHoveredCoords} />

        {/* High-Resolution Satellite Map Layer */}
        <TileLayer
          key={activeStyle}
          url={tileUrls[activeStyle]}
          maxZoom={18}
        />

        {/* ------------------------------------------------------------ */}
        {/* HAUL ROAD NETWORK POLYLINES (BLUE & AMBER DASHED SPINES)     */}
        {/* ------------------------------------------------------------ */}
        <Polyline
          positions={BLUE_MAIN_HAUL_ROAD}
          pathOptions={{
            color: '#38BDF8',
            dashArray: '8, 8',
            weight: 4,
            opacity: 0.95
          }}
        />

        <Polyline
          positions={AMBER_NORTH_HAUL_BRANCH}
          pathOptions={{
            color: '#F59E0B',
            dashArray: '6, 6',
            weight: 3.5,
            opacity: 0.9
          }}
        />

        <Polyline
          positions={SOUTH_DEEP_CUT_BRANCH}
          pathOptions={{
            color: '#38BDF8',
            dashArray: '6, 6',
            weight: 3,
            opacity: 0.85
          }}
        />

        {/* ------------------------------------------------------------ */}
        {/* ROAD FLOW DIRECTIONAL ARROWHEAD INDICATORS                   */}
        {/* ------------------------------------------------------------ */}
        {ROAD_FLOW_ARROWS.map((arr) => (
          <Marker
            key={arr.id}
            position={arr.position}
            icon={createArrowIcon(arr)}
            interactive={false}
          />
        ))}

        {/* ------------------------------------------------------------ */}
        {/* OPERATIONAL POINT MARKERS (EXCAVATORS, TRUCKS, SENSORS, ETC) */}
        {/* ------------------------------------------------------------ */}
        {MINE_OPERATIONAL_POINTS.map((point) => {
          const isSelected = inspectingPoint?.id === point.id;

          return (
            <Marker
              key={point.id}
              position={[point.latitude, point.longitude]}
              icon={createProfessionalIcon(point, isSelected)}
              eventHandlers={{
                click: () => handleSelectPoint(point)
              }}
            >
              <Popup className="custom-cortex-popup">
                <div className="p-3 min-w-[250px] text-xs font-sans text-stone-900">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-2">
                    <span className="font-extrabold text-[#0D0E11] font-mono text-sm">{point.code}</span>
                    <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded uppercase">
                      {point.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-800 text-xs mb-2 leading-tight">{point.name}</h4>
                  <div className="space-y-1 text-[11px] font-mono text-stone-600 mb-3">
                    <div className="flex justify-between"><span className="text-stone-400">{point.telemetry.primaryMetric}:</span> <span className="font-bold text-[#0D0E11]">{point.telemetry.primaryValue}</span></div>
                    <div className="flex justify-between"><span className="text-stone-400">{point.telemetry.secondaryMetric}:</span> <span className="font-bold text-stone-800">{point.telemetry.secondaryValue}</span></div>
                    {point.telemetry.gcvOrAsh && <div className="text-[#8C6615] font-semibold text-[10px] mt-1">{point.telemetry.gcvOrAsh}</div>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectPoint(point)}
                    className="w-full py-1.5 bg-[#C9972B] hover:bg-[#B8861B] text-white rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    <span>View Deep Telemetry</span>
                    <Navigation className="w-2.5 h-2.5" />
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

      </MapContainer>

      {/* ================================================================ */}
      {/* FLOATING SLEEK TELEMETRY DRAWER (IN-FRAME, ZERO PAGE OVERFLOW)   */}
      {/* ================================================================ */}
      {inspectingPoint && (
        <div className="absolute top-3 right-3 z-[1000] w-[340px] max-w-[calc(100%-24px)] bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 font-mono text-xs pointer-events-auto transition-all animate-in fade-in slide-in-from-right-4 duration-200">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-200 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#0D0E11] text-base">{inspectingPoint.code}</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                  ● {inspectingPoint.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-stone-700 font-sans mt-0.5 leading-snug">
                {inspectingPoint.name}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setInspectingPoint(null)}
              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-[11px] text-stone-600 font-sans leading-relaxed">
            {inspectingPoint.description}
          </p>

          {/* Telemetry Metrics */}
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
              <span className="text-[9px] uppercase font-bold text-stone-400 block">
                {inspectingPoint.telemetry.primaryMetric}
              </span>
              <p className="text-sm font-extrabold text-[#0D0E11] mt-0.5">
                {inspectingPoint.telemetry.primaryValue}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
              <span className="text-[9px] uppercase font-bold text-stone-400 block">
                {inspectingPoint.telemetry.secondaryMetric}
              </span>
              <p className="text-xs font-bold text-stone-800 mt-0.5">
                {inspectingPoint.telemetry.secondaryValue}
              </p>
            </div>

            {inspectingPoint.telemetry.operatorOrModel && (
              <div className="text-[10px] text-stone-500 px-1 font-sans">
                {inspectingPoint.telemetry.operatorOrModel}
              </div>
            )}

            {inspectingPoint.telemetry.gcvOrAsh && (
              <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/60 text-[10px] text-[#8C6615] font-bold">
                {inspectingPoint.telemetry.gcvOrAsh}
              </div>
            )}
          </div>

          {/* Direct Module Links */}
          <div className="pt-2 border-t border-stone-200/80 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateToModule?.('/evaluation')}
              className="w-full py-2 bg-[#C9972B] hover:bg-[#B8861B] text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <span>Launch Proximate Evaluation</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateToModule?.('/blend')}
              className="w-full py-1.5 bg-white hover:bg-stone-50 text-stone-800 font-bold border border-stone-200 rounded-xl text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Sliders className="w-3 h-3 text-[#C9972B]" />
              <span>Run Stockpile Blend Solver</span>
            </button>
          </div>

        </div>
      )}

      {/* ================================================================ */}
      {/* FLOATING BOTTOM HUD MATCHING USER IMAGE 2 EXACTLY                */}
      {/* ================================================================ */}
      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-stone-200/90 shadow-md text-[11px] font-mono text-stone-700 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-stone-900">Open World GIS Active</span>
        </div>
        <span className="text-stone-300">|</span>
        <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
          <Compass className="w-3.5 h-3.5 text-[#C9972B]" />
          <span>
            {hoveredCoords
              ? `${hoveredCoords.lat.toFixed(4)}° N, ${hoveredCoords.lng.toFixed(4)}° E`
              : '21.7605° N, 83.8154° E'}
          </span>
        </div>
      </div>

      {/* Map provider badge */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-stone-200/90 shadow-md text-[10.5px] font-mono text-stone-600 select-none hidden sm:flex items-center gap-1">
        <span className="text-stone-400">Provider:</span>
        <span className="font-bold text-stone-900">
          {activeStyle === 'satellite' ? 'Esri Satellite' : activeStyle === 'osm' ? 'OpenStreetMap' : 'Esri Topo'}
        </span>
      </div>

    </div>
  );
};

export default CoalMap;
