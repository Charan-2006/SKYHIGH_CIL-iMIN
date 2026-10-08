import React from 'react';
import { useNavigate } from 'react-router-dom';
import CoalMap from '../components/CoalMap';

export const MapPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex-1 min-h-0 rounded-2xl overflow-hidden shadow-md border border-stone-300/80 bg-[#0D0E11] select-none">
      <CoalMap onNavigateToModule={(path) => navigate(path)} />
    </div>
  );
};

export default MapPage;
