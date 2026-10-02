import React, { useState } from 'react';
import type { CoalIndiaSubsidiary } from '../types';
import CoalMap from '../components/CoalMap';
import Card from '../components/Card';
import { MapPin, Building, Activity, ShieldAlert, Award, Globe } from 'lucide-react';

export const MapPage: React.FC = () => {
  const [selectedSub, setSelectedSub] = useState<CoalIndiaSubsidiary | null>(null);

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0">
      {/* Header */}
      <div>
        <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Geospatial Telemetry</h1>
        <h2 className="text-2xl font-bold text-cortex-dark mt-1">India Coalfield GIS Map</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 min-h-0">
        {/* Geographic Leaflet Map */}
        <div className="lg:col-span-8 min-w-0 flex flex-col flex-1 h-full min-h-[460px] lg:min-h-[600px]">
          <CoalMap onSubsidiarySelect={setSelectedSub} />
        </div>

        {/* Selected Mine Details Info Panel */}
        <div className="lg:col-span-4 min-w-0 flex flex-col gap-6 h-full">
          {selectedSub ? (
            <Card 
              title={`${selectedSub.name} Details`}
              headerAction={<Award className="w-5 h-5 text-gold-500" />}
              className="shadow-premium text-left flex-1 h-full"
            >
              <div className="flex flex-col gap-4 text-xs">
                <div className="border-b border-cortex-border pb-3 mb-2">
                  <span className="text-[10px] font-bold text-cortex-gray uppercase tracking-widest block">Full Subsidiary Name</span>
                  <p className="text-sm font-bold text-cortex-dark mt-0.5">{selectedSub.fullName}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 border border-gold-500/10 flex-shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-cortex-gray tracking-wider block">Headquarters</span>
                    <p className="font-bold text-cortex-dark mt-0.5">{selectedSub.headquarters}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 border border-gold-500/10 flex-shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-cortex-gray tracking-wider block">Annual Production Capacity</span>
                    <p className="font-bold text-cortex-dark mt-0.5">{selectedSub.productionCapacity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 border border-gold-500/10 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-cortex-gray tracking-wider block">Active Mine Excavations</span>
                    <p className="font-bold text-cortex-dark mt-0.5">{selectedSub.activeMinesCount} Mines</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 border border-gold-500/10 flex-shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-cortex-gray tracking-wider block">Average Thermal Coefficient</span>
                    <p className="font-bold text-cortex-dark mt-0.5">{selectedSub.avgGcv} kcal/kg</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-cortex-border text-center">
                  <a 
                    href={`/analytics`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:text-gold-900 uppercase tracking-wider"
                  >
                    <span>View Analytics details</span>
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </Card>
          ) : (
            <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium text-center flex flex-col items-center justify-center flex-1 h-full min-h-[350px]">
              <Globe className="w-12 h-12 text-gold-500 mb-4 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-cortex-gray">
                Geographic Workspace Node
              </h3>
              <p className="text-xs text-cortex-gray mt-2 leading-relaxed px-4">
                Select a Coal India subsidiary marker on the map to display operational metrics, headquarters, and quality parameters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MapPage;
