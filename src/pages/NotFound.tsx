import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 min-h-[400px] w-full flex items-center justify-center select-none text-left py-12">
      <div className="max-w-md w-full">
        <Card className="shadow-premium-xl text-center flex flex-col items-center p-8">
          <div className="w-16 h-16 bg-gold-50 border border-gold-250/20 rounded-full flex items-center justify-center text-gold-500 mb-6 animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h1 className="text-4xl font-extrabold text-gold-900 font-mono tracking-tight">404</h1>
          <h2 className="text-lg font-bold text-cortex-dark mt-2 uppercase tracking-wide">
            Telemetry Node Missing
          </h2>
          
          <p className="text-xs text-cortex-gray mt-3 mb-8 leading-relaxed px-4">
            The target workspace coordinates or analytical nodes could not be located. They may have been relocated or deactivated.
          </p>

          <Button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Workspace Core</span>
          </Button>
        </Card>
      </div>
    </div>
  );
};
export default NotFound;
