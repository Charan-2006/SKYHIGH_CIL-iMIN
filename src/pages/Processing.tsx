import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { apiService } from '../services/api';
import Loader from '../components/Loader';
import { SAMPLE_PRESETS } from '../constants/mockData';

export const Processing: React.FC = () => {
  const navigate = useNavigate();
  const { currentSample, setCurrentSample, setLastPrediction, loadHistory } = useApp();

  useEffect(() => {
    // Fallback to a default sample if none is loaded, to prevent blank state bugs
    const sampleToAnalyze = currentSample || {
      sampleId: `CCX-2026-${Math.floor(Math.random() * 900 + 100)}`,
      mineName: SAMPLE_PRESETS[0].mineName,
      coalfield: SAMPLE_PRESETS[0].coalfield,
      state: SAMPLE_PRESETS[0].state,
      moisture: SAMPLE_PRESETS[0].moisture,
      ash: SAMPLE_PRESETS[0].ash,
      volatileMatter: SAMPLE_PRESETS[0].volatileMatter,
      fixedCarbon: SAMPLE_PRESETS[0].fixedCarbon,
      sulphur: SAMPLE_PRESETS[0].sulphur,
      carbon: SAMPLE_PRESETS[0].carbon,
      hydrogen: SAMPLE_PRESETS[0].hydrogen,
      nitrogen: SAMPLE_PRESETS[0].nitrogen,
      oxygen: SAMPLE_PRESETS[0].oxygen,
      latitude: SAMPLE_PRESETS[0].latitude,
      longitude: SAMPLE_PRESETS[0].longitude
    };

    if (!currentSample) {
      setCurrentSample(sampleToAnalyze);
    }

    // Start API mock model calculations immediately
    let resolvedResult: any = null;
    let loaderFinished = false;

    const runAnalysis = async () => {
      try {
        const result = await apiService.predictCoalQuality(sampleToAnalyze);
        resolvedResult = result;
        checkAndRedirect();
      } catch (err) {
        console.error('AI Processing error:', err);
        navigate('/laboratory');
      }
    };

    const checkAndRedirect = async () => {
      if (resolvedResult && loaderFinished) {
        setLastPrediction(resolvedResult);
        await loadHistory(); // Reload history logs in context
        navigate('/prediction');
      }
    };

    runAnalysis();

    // Give Loader 4 seconds to animate
    const timer = setTimeout(() => {
      loaderFinished = true;
      checkAndRedirect();
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentSample, navigate, setCurrentSample, setLastPrediction, loadHistory]);

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-cortex-bg-secondary">
      <Loader durationMs={4000} />
    </div>
  );
};
export default Processing;
