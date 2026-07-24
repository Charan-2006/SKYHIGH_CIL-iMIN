import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { CoalIndiaSubsidiary } from '../types';
import { CIL_SUBSIDIARIES } from '../constants/mockData';
import { MapPin, Building, Activity, ShieldAlert } from 'lucide-react';

// Create a custom gold HTML DivIcon to match CarbonCortex styling and bypass default leaflet asset path resolution errors in Vite
const createGoldIcon = (name: string) => {
  return L.divIcon({
    html: `<div class="w-8 h-8 rounded-full bg-gold-800 text-white border-2 border-white shadow-premium flex items-center justify-center text-[9px] font-bold ring-2 ring-gold-500/30 hover:bg-gold-900 transition-colors">${name}</div>`,
    className: 'custom-leaflet-gold-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

interface CoalMapProps {
  onSubsidiarySelect?: (sub: CoalIndiaSubsidiary) => void;
}

export const CoalMap: React.FC<CoalMapProps> = ({ onSubsidiarySelect }) => {
  const [mapReady, setMapReady] = useState(false);

  // Set leaflet default styles explicitly to avoid hydration/render order issues
  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div className="w-full h-[500px] bg-cortex-bg-secondary border border-cortex-border rounded-xl flex items-center justify-center text-xs text-cortex-gray font-semibold">
        <svg className="animate-spin h-5 w-5 text-gold-500 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Initializing Geospatial Map Engine...
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-cortex-border shadow-premium">
      <MapContainer 
        center={[23.3, 82.5]} // Centered on major Coal India activity belt
        zoom={5} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        {/* Sleek Minimal Map Tiles (CartoDB Positron style coordinates) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {CIL_SUBSIDIARIES.map((sub) => (
          <Marker 
            key={sub.id} 
            position={[sub.latitude, sub.longitude]}
            icon={createGoldIcon(sub.id)}
            eventHandlers={{
              click: () => onSubsidiarySelect?.(sub)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px] text-xs">
                <div className="flex justify-between items-start border-b border-cortex-border pb-2 mb-2">
                  <div>
                    <h4 className="font-bold text-cortex-dark text-sm leading-tight">{sub.name}</h4>
                    <p className="text-[10px] text-cortex-gray">{sub.fullName}</p>
                  </div>
                  <span className="bg-gold-50 text-gold-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 text-cortex-dark">
                  <div className="flex items-center gap-1.5 text-cortex-gray">
                    <Building className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                    <span>HQ: <span className="font-semibold text-cortex-dark">{sub.headquarters}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cortex-gray">
                    <Activity className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                    <span>Capacity: <span className="font-semibold text-cortex-dark">{sub.productionCapacity}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cortex-gray">
                    <MapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                    <span>Mines: <span className="font-semibold text-cortex-dark">{sub.activeMinesCount} Active</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cortex-gray">
                    <ShieldAlert className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                    <span>Avg quality: <span className="font-semibold text-cortex-dark">{sub.avgGcv} kcal/kg</span></span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-cortex-border">
                  <button 
                    onClick={() => {
                      onSubsidiarySelect?.(sub);
                      // Custom route dispatch simulation
                    }}
                    className="w-full py-1 bg-gold-500 text-white rounded text-[10px] font-bold hover:bg-gold-600 cursor-pointer text-center block"
                  >
                    Select Workspace Subsidiary
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
export default CoalMap;
