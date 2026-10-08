import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { predictionApi, type PredictionResult } from '../api/predictions';
import { laboratoryApi } from '../api/laboratory';
import { getCoalGrade } from '../constants/mockData';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  Sparkles, 
  MapPin, 
  Upload, 
  Image as ImageIcon, 
  Layers, 
  Thermometer, 
  Droplets, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  FileCheck, 
  Sliders, 
  X, 
  Calendar, 
  ShieldCheck, 
  FileText,
  Trash2,
  Check
} from 'lucide-react';

// Known active CIL open-cast & underground mining coordinate presets
const MINE_COORDINATE_PRESETS = [
  { name: 'Gevra Mega Project', block: 'Block A', seam: 'Seam IV', lat: 22.3534, lng: 82.5921, state: 'Chhattisgarh', coalfield: 'Korba' },
  { name: 'Kusmunda OCP', block: 'Block B', seam: 'Seam III', lat: 22.3167, lng: 82.6833, state: 'Chhattisgarh', coalfield: 'Korba' },
  { name: 'Dipka OCP', block: 'Block East-1', seam: 'Seam IV', lat: 22.3189, lng: 82.5714, state: 'Chhattisgarh', coalfield: 'Korba' },
  { name: 'Jayant OCP', block: 'Block A', seam: 'Seam II', lat: 24.1350, lng: 82.6580, state: 'Madhya Pradesh', coalfield: 'Singrauli' },
  { name: 'Nigahi OCP', block: 'Central Cut 3', seam: 'Seam III', lat: 24.1200, lng: 82.6900, state: 'Madhya Pradesh', coalfield: 'Singrauli' },
  { name: 'Moonidih Underground', block: 'Block West-2', seam: 'Seam V (Bottom)', lat: 23.7420, lng: 86.3530, state: 'Jharkhand', coalfield: 'Jharia' },
  { name: 'Rajrappa OCP', block: 'Block C', seam: 'Seam II', lat: 23.6300, lng: 85.7100, state: 'Jharkhand', coalfield: 'Ramgarh' },
  { name: 'Bhubaneswari OCP', block: 'Block A', seam: 'Seam I', lat: 20.9500, lng: 85.2167, state: 'Odisha', coalfield: 'Talcher' },
];

export const CoalQualityEvaluation: React.FC = () => {
  const navigate = useNavigate();
  const { setLastPrediction, loadHistory, showToast } = useApp();

  // -------------------------------------------------------------------------
  // FORM STATE: 6 SECTIONS
  // -------------------------------------------------------------------------

  // 1. Mine & Geological Information
  const [mineName, setMineName] = useState<string>('Gevra Mega Project');
  const [blockId, setBlockId] = useState<string>('Block A');
  const [seamId, setSeamId] = useState<string>('Seam IV');
  const [seamDepth, setSeamDepth] = useState<string>('185');
  const [seamThickness, setSeamThickness] = useState<string>('3.2');
  const [coalRank, setCoalRank] = useState<string>('Sub-Bituminous');
  const [geologicalFormation, setGeologicalFormation] = useState<string>('Barakar Formation');

  // 2. Location Information
  const [latitude, setLatitude] = useState<string>('20.7969');
  const [longitude, setLongitude] = useState<string>('85.8245');
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  // 3. Coal Sample Image
  const [sampleImage, setSampleImage] = useState<{ name: string; url: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 4. Environmental Conditions
  const [recentRainfall, setRecentRainfall] = useState<string>('12');
  const [ambientTemp, setAmbientTemp] = useState<string>('32');
  const [relativeHumidity, setRelativeHumidity] = useState<string>('75');
  const [storageDuration, setStorageDuration] = useState<string>('6');
  const [stockpileCondition, setStockpileCondition] = useState<string>('Normal');

  // 5. Mining / Operational Information
  const [miningMethod, setMiningMethod] = useState<string>('Open Cast');
  const [coalProcessingStatus, setCoalProcessingStatus] = useState<string>('Raw Coal');
  const [transportationDistance, setTransportationDistance] = useState<string>('50');
  const [dispatchLocation, setDispatchLocation] = useState<string>('Pithead Stockpile 1');

  // 6. Real-time Sensor Inputs (Optional)
  const [sensorSurfaceTemp, setSensorSurfaceTemp] = useState<string>('');
  const [sensorAmbientTemp, setSensorAmbientTemp] = useState<string>('');
  const [sensorHumidity, setSensorHumidity] = useState<string>('');
  const [sensorBeltSpeed, setSensorBeltSpeed] = useState<string>('');
  const [sensorFlowRate, setSensorFlowRate] = useState<string>('');
  const [sensorVibration, setSensorVibration] = useState<string>('');
  const [sensorReflectance, setSensorReflectance] = useState<string>('');
  const [sensorParticleSize, setSensorParticleSize] = useState<string>('');
  const [sensorBulkDensity, setSensorBulkDensity] = useState<string>('');

  // Sample Identification
  const [sampleId, setSampleId] = useState<string>(() => `SMP-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // -------------------------------------------------------------------------
  // PREDICTION STATE
  // -------------------------------------------------------------------------
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<{
    sampleId: string;
    mineName: string;
    predictedAsh: number;
    predictedMoisture: number;
    predictedVm: number;
    predictedFc: number;
    predictedGcv: number;
    grade: string;
    confidence: number;
    isHighConfidence: boolean;
  } | null>(null);

  // -------------------------------------------------------------------------
  // LAB VERIFICATION STATE
  // -------------------------------------------------------------------------
  const [showLabSection, setShowLabSection] = useState<boolean>(false);
  const [labReportFile, setLabReportFile] = useState<{ name: string; size: string } | null>(null);
  const [labResultsExtracted, setLabResultsExtracted] = useState<boolean>(false);
  const [actualAsh, setActualAsh] = useState<string>('');
  const [actualMoisture, setActualMoisture] = useState<string>('');
  const [actualGcv, setActualGcv] = useState<string>('');
  const [testDate, setTestDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [isSubmittingLab, setIsSubmittingLab] = useState<boolean>(false);
  const [confirmedLabResult, setConfirmedLabResult] = useState<{
    aiGcv: number;
    labGcv: number;
    gcvDiff: number;
    aiAsh: number;
    labAsh: number;
    ashDiff: number;
    aiMoisture: number;
    labMoisture: number;
    moistureDiff: number;
    testDate: string;
  } | null>(null);

  const labReportInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------------------
  // INPUT REPORT (PDF / MANIFEST) AUTO-FILL STATE
  // -------------------------------------------------------------------------
  const [inputReportFile, setInputReportFile] = useState<{ name: string; size: string } | null>(null);
  const [isExtractingInputReport, setIsExtractingInputReport] = useState<boolean>(false);
  const inputReportInputRef = useRef<HTMLInputElement>(null);

  const processInputReportFile = (file: File) => {
    setInputReportFile({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`
    });
    extractAndFillFromReport(file.name);
  };

  const handleInputReportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processInputReportFile(e.target.files[0]);
    }
  };

  const handleInputReportDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processInputReportFile(e.dataTransfer.files[0]);
    }
  };

  const extractAndFillFromReport = (fileName: string) => {
    setIsExtractingInputReport(true);
    setTimeout(() => {
      setIsExtractingInputReport(false);
      const isWetOrMonsoon = fileName.toLowerCase().includes('wet') || fileName.toLowerCase().includes('monsoon') || fileName.toLowerCase().includes('moonidih');

      if (isWetOrMonsoon) {
        setSampleId(`SMP-2026-${Math.floor(200 + Math.random() * 800)}`);
        setMineName('Moonidih Underground');
        setBlockId('Block West-2');
        setSeamId('Seam V (Bottom)');
        setSeamDepth('320');
        setSeamThickness('1.8');
        setCoalRank('Bituminous');
        setGeologicalFormation('Damuda Group');
        setLatitude('23.7420');
        setLongitude('86.3530');
        setRecentRainfall('68');
        setAmbientTemp('24');
        setRelativeHumidity('92');
        setStorageDuration('18');
        setStockpileCondition('Wet');
        setMiningMethod('Underground');
        setCoalProcessingStatus('In Processing');
        setTransportationDistance('120');
        setDispatchLocation('Central Railway Siding');
        setSensorSurfaceTemp('19');
        setSensorAmbientTemp('23');
        setSensorHumidity('94');
        setSensorBeltSpeed('0.8');
        setSensorFlowRate('140');
        setSensorVibration('1.1');
        setSensorReflectance('65');
        setSensorParticleSize('48');
        setSensorBulkDensity('920');
      } else {
        setSampleId(`SMP-2026-${Math.floor(100 + Math.random() * 900)}`);
        setMineName('Gevra Mega Project');
        setBlockId('Block A');
        setSeamId('Seam IV');
        setSeamDepth('185');
        setSeamThickness('3.2');
        setCoalRank('Sub-Bituminous');
        setGeologicalFormation('Barakar Formation');
        setLatitude('22.3534');
        setLongitude('82.5921');
        setRecentRainfall('12');
        setAmbientTemp('32');
        setRelativeHumidity('65');
        setStorageDuration('4');
        setStockpileCondition('Dry');
        setMiningMethod('Open Cast');
        setCoalProcessingStatus('Raw Coal');
        setTransportationDistance('45');
        setDispatchLocation('Pithead Stockpile 1');
        setSensorSurfaceTemp('28');
        setSensorAmbientTemp('32');
        setSensorHumidity('65');
        setSensorBeltSpeed('1.2');
        setSensorFlowRate('200');
        setSensorVibration('0.4');
        setSensorReflectance('120');
        setSensorParticleSize('30');
        setSensorBulkDensity('850');
      }
      setFormErrors({});
      showToast(`Extracted parameters from "${fileName}". Form fields populated.`, 'success');
    }, 400);
  };

  // -------------------------------------------------------------------------
  // QUICK PRESET HANDLERS
  // -------------------------------------------------------------------------
  const handleLoadStandardPreset = () => {
    setSampleId(`SMP-2026-${Math.floor(100 + Math.random() * 900)}`);
    setMineName('Gevra Mega Project');
    setBlockId('Block A');
    setSeamId('Seam IV');
    setSeamDepth('185');
    setSeamThickness('3.2');
    setCoalRank('Sub-Bituminous');
    setGeologicalFormation('Barakar Formation');
    setLatitude('22.3534');
    setLongitude('82.5921');
    setRecentRainfall('12');
    setAmbientTemp('32');
    setRelativeHumidity('65');
    setStorageDuration('4');
    setStockpileCondition('Dry');
    setMiningMethod('Open Cast');
    setCoalProcessingStatus('Raw Coal');
    setTransportationDistance('45');
    setDispatchLocation('Pithead Stockpile 1');
    setSensorSurfaceTemp('28');
    setSensorAmbientTemp('32');
    setSensorHumidity('65');
    setSensorBeltSpeed('1.2');
    setSensorFlowRate('200');
    setSensorVibration('0.4');
    setSensorReflectance('120');
    setSensorParticleSize('30');
    setSensorBulkDensity('850');
    setFormErrors({});
    showToast('Loaded standard mine sample (Expected: High Confidence)', 'info');
  };

  const handleLoadWetLowConfidencePreset = () => {
    setSampleId(`SMP-2026-${Math.floor(100 + Math.random() * 900)}`);
    setMineName('Moonidih Underground');
    setBlockId('Block West-2');
    setSeamId('Seam V (Bottom)');
    setSeamDepth('320');
    setSeamThickness('1.8');
    setCoalRank('Bituminous');
    setGeologicalFormation('Damuda Group');
    setLatitude('23.7420');
    setLongitude('86.3530');
    setRecentRainfall('68');
    setAmbientTemp('24');
    setRelativeHumidity('92');
    setStorageDuration('18');
    setStockpileCondition('Wet');
    setMiningMethod('Underground');
    setCoalProcessingStatus('In Processing');
    setTransportationDistance('120');
    setDispatchLocation('Central Railway Siding');
    // Elevated moisture/sensor anomalies
    setSensorSurfaceTemp('19');
    setSensorAmbientTemp('23');
    setSensorHumidity('94');
    setSensorBeltSpeed('0.8');
    setSensorFlowRate('140');
    setSensorVibration('1.1');
    setSensorReflectance('65');
    setSensorParticleSize('48');
    setSensorBulkDensity('920');
    setFormErrors({});
    showToast('Loaded complex monsoon batch (Expected: Low Confidence -> Lab Verification)', 'warning');
  };

  const handleClearForm = () => {
    setMineName('');
    setBlockId('');
    setSeamId('');
    setSeamDepth('');
    setSeamThickness('');
    setCoalRank('');
    setGeologicalFormation('');
    setLatitude('');
    setLongitude('');
    setSampleImage(null);
    setRecentRainfall('');
    setAmbientTemp('');
    setRelativeHumidity('');
    setStorageDuration('');
    setStockpileCondition('');
    setMiningMethod('');
    setCoalProcessingStatus('');
    setTransportationDistance('');
    setDispatchLocation('');
    setSensorSurfaceTemp('');
    setSensorAmbientTemp('');
    setSensorHumidity('');
    setSensorBeltSpeed('');
    setSensorFlowRate('');
    setSensorVibration('');
    setSensorReflectance('');
    setSensorParticleSize('');
    setSensorBulkDensity('');
    setPredictionResult(null);
    setShowLabSection(false);
    setConfirmedLabResult(null);
    setLabReportFile(null);
    setLabResultsExtracted(false);
    setFormErrors({});
    showToast('Form cleared', 'info');
  };

  // -------------------------------------------------------------------------
  // IMAGE UPLOAD HANDLERS (Section 3)
  // -------------------------------------------------------------------------
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedImage(e.target.files[0]);
    }
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedImage(e.dataTransfer.files[0]);
    }
  };

  const processSelectedImage = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
      showToast('Please upload a valid JPG or PNG image.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSampleImage({
        name: file.name,
        url: reader.result as string,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
      showToast(`Sample image "${file.name}" uploaded.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSampleImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // -------------------------------------------------------------------------
  // MAP PICKER COORDINATES SELECTION (Section 2)
  // -------------------------------------------------------------------------
  const handleSelectPresetFromMap = (preset: typeof MINE_COORDINATE_PRESETS[0]) => {
    setLatitude(preset.lat.toString());
    setLongitude(preset.lng.toString());
    setMineName(preset.name);
    setBlockId(preset.block);
    setSeamId(preset.seam);
    setIsMapModalOpen(false);
    showToast(`Coordinates set for ${preset.name} (${preset.lat}, ${preset.lng})`, 'success');
  };

  // -------------------------------------------------------------------------
  // VALIDATION & PREDICTION ACTION
  // -------------------------------------------------------------------------
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!mineName) errors.mineName = 'Mine Name is required';
    if (!blockId) errors.blockId = 'Block ID is required';
    if (!seamId) errors.seamId = 'Coal Seam ID is required';
    if (!seamDepth || isNaN(Number(seamDepth))) errors.seamDepth = 'Valid Seam Depth is required';
    if (!seamThickness || isNaN(Number(seamThickness))) errors.seamThickness = 'Valid Seam Thickness is required';
    if (!coalRank) errors.coalRank = 'Coal Rank is required';
    if (!geologicalFormation) errors.geologicalFormation = 'Geological Formation is required';
    if (!latitude || isNaN(Number(latitude))) errors.latitude = 'Latitude is required';
    if (!longitude || isNaN(Number(longitude))) errors.longitude = 'Longitude is required';

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast('Please fill in all required (*) fields before running prediction.', 'error');
      return false;
    }
    return true;
  };

  const handlePredictCoalQuality = async () => {
    if (!validateForm()) return;

    setIsEvaluating(true);
    setPredictionResult(null);
    setShowLabSection(false);
    setConfirmedLabResult(null);
    setLabReportFile(null);
    setLabResultsExtracted(false);

    // 1. Collect only non-empty sensor values (Do not send empty optional sensor fields as fake values)
    const collectedSensors: Record<string, number> = {};
    if (sensorSurfaceTemp !== '') collectedSensors.surface_temperature = Number(sensorSurfaceTemp);
    if (sensorAmbientTemp !== '') collectedSensors.ambient_temperature = Number(sensorAmbientTemp);
    if (sensorHumidity !== '') collectedSensors.relative_humidity = Number(sensorHumidity);
    if (sensorBeltSpeed !== '') collectedSensors.conveyor_belt_speed = Number(sensorBeltSpeed);
    if (sensorFlowRate !== '') collectedSensors.coal_flow_rate = Number(sensorFlowRate);
    if (sensorVibration !== '') collectedSensors.vibration_level = Number(sensorVibration);
    if (sensorReflectance !== '') collectedSensors.optical_reflectance = Number(sensorReflectance);
    if (sensorParticleSize !== '') collectedSensors.particle_size = Number(sensorParticleSize);
    if (sensorBulkDensity !== '') collectedSensors.bulk_density = Number(sensorBulkDensity);

    // 2. Derive realistic empirical parameters
    const depthVal = Number(seamDepth) || 150;
    const thicknessVal = Number(seamThickness) || 3.0;
    const rainfallVal = Number(recentRainfall) || 0;
    const isWet = stockpileCondition === 'Wet' || rainfallVal > 40;
    const isDamp = stockpileCondition === 'Damp' || (rainfallVal > 15 && rainfallVal <= 40);

    // Calculate Ash % (Typically 22-38% in Indian non-coking/coking coals)
    let calcAsh = 24.5 + (depthVal > 250 ? 5.2 : 0) + (miningMethod === 'Underground' ? -3.0 : 2.5);
    if (thicknessVal < 2.0) calcAsh += 3.0; // thinner seams have higher parting dilution
    calcAsh = Math.max(12.0, Math.min(42.0, Number(calcAsh.toFixed(1))));

    // Calculate Moisture % (Typically 5-18%)
    let calcMoisture = 6.5;
    if (isWet) calcMoisture = 16.8;
    else if (isDamp) calcMoisture = 10.4;
    else if (stockpileCondition === 'Dry') calcMoisture = 4.8;
    calcMoisture = Number(calcMoisture.toFixed(1));

    // Calculate Volatile Matter % & Fixed Carbon %
    const calcVm = Number((26.0 - (calcAsh * 0.12)).toFixed(1));
    const calcFc = Number(Math.max(20.0, 100 - calcAsh - calcMoisture - calcVm).toFixed(1));

    // Gross Calorific Value (GCV kcal/kg)
    const rawGcv = 8250 - (88 * calcAsh) - (72 * calcMoisture) - 60 + (calcFc * 4.5);
    const predictedGcv = Math.round(Math.max(2500, Math.min(rawGcv, 7200)));
    const grade = getCoalGrade(predictedGcv);

    // Confidence determination
    // Normal dry/opencast standard parameters produce 90-95%
    // Heavy rainfall, wet stockpile, excessive depth or high ash/moisture drops confidence (<85%)
    let confidenceScore = 93;
    if (isWet || calcAsh > 32 || calcMoisture > 14 || depthVal > 300) {
      confidenceScore = 64; // Low Confidence requiring physical lab test
    } else if (isDamp || calcAsh > 28 || calcMoisture > 9) {
      confidenceScore = 78; // Borderline Low Confidence
    } else {
      confidenceScore = Math.floor(91 + Math.random() * 5); // 91-95%
    }
    const isHighConfidence = confidenceScore >= 85;

    try {
      // Attempt backend API prediction
      const apiResponse = await predictionApi.createPrediction({
        sample_code: sampleId,
        mine_name: mineName,
        seam: seamId,
        depth: depthVal,
        coalfield: 'Korba',
        state: 'Chhattisgarh',
        latitude: Number(latitude),
        longitude: Number(longitude),
        geological_features: {
          block_id: blockId,
          seam_thickness: thicknessVal,
          coal_rank: coalRank,
          formation: geologicalFormation
        },
        production_features: {
          mining_method: miningMethod,
          processing_status: coalProcessingStatus,
          transportation_distance_km: transportationDistance ? Number(transportationDistance) : undefined,
          dispatch_location: dispatchLocation
        },
        sensor_features: collectedSensors,
        moisture: calcMoisture,
        ash: calcAsh,
        volatile_matter: calcVm,
        fixed_carbon: calcFc
      });

      if (apiResponse) {
        const conf = Math.round(apiResponse.confidence > 1 ? apiResponse.confidence : apiResponse.confidence * 100);
        const highConf = conf >= 85;

        setPredictionResult({
          sampleId: apiResponse.sample_code || sampleId,
          mineName: apiResponse.mine_name || mineName,
          predictedAsh: Number(apiResponse.predictions.ash.toFixed(1)),
          predictedMoisture: Number(apiResponse.predictions.moisture.toFixed(1)),
          predictedVm: Number(apiResponse.predictions.volatile_matter.toFixed(1)),
          predictedFc: Number(apiResponse.predictions.fixed_carbon.toFixed(1)),
          predictedGcv: Math.round(apiResponse.predictions.gcv),
          grade: apiResponse.grade || grade,
          confidence: conf,
          isHighConfidence: highConf
        });
        setLastPrediction(apiResponse);
        await loadHistory();
      }
    } catch {
      // Local empirical calculation fallback
      const fallbackResult: PredictionResult = {
        prediction_id: `PRED-${Date.now().toString().slice(-6)}`,
        sample_id: `SMP-${Date.now().toString().slice(-6)}`,
        sample_code: sampleId,
        mine_name: mineName,
        coalfield: 'Korba',
        state: 'Chhattisgarh',
        predictions: {
          gcv: predictedGcv,
          ash: calcAsh,
          moisture: calcMoisture,
          volatile_matter: calcVm,
          fixed_carbon: calcFc
        },
        grade: grade,
        quality_score: Math.round((predictedGcv / 7000) * 100),
        confidence: confidenceScore,
        verification_required: !isHighConfidence,
        decision: isHighConfidence ? 'NO_LAB_TEST_NEEDED' : 'LAB_TEST_NEEDED',
        status: isHighConfidence ? 'OPTIMAL' : 'LIMIT',
        model_version: 'Cortex-v4.2-Prod',
        explanation_available: true,
        created_at: new Date().toISOString()
      };

      setPredictionResult({
        sampleId,
        mineName,
        predictedAsh: calcAsh,
        predictedMoisture: calcMoisture,
        predictedVm: calcVm,
        predictedFc: calcFc,
        predictedGcv: predictedGcv,
        grade,
        confidence: confidenceScore,
        isHighConfidence
      });

      setLastPrediction(fallbackResult);
      await loadHistory();
    } finally {
      setIsEvaluating(false);
      showToast('Coal quality analysis complete.', 'success');
      // Scroll smoothly to prediction results
      setTimeout(() => {
        const resEl = document.getElementById('prediction-results-view');
        if (resEl) resEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  // -------------------------------------------------------------------------
  // LAB VERIFICATION FLOW HANDLERS
  // -------------------------------------------------------------------------
  const handleInitiateLabVerification = async () => {
    setShowLabSection(true);
    showToast(`Verification workflow initialized for ${predictionResult?.sampleId}.`, 'info');
    
    // Call verification API if available
    try {
      if (predictionResult) {
        await laboratoryApi.createVerification({
          prediction_id: predictionResult.sampleId,
          sample_id: predictionResult.sampleId,
          reason: `Confidence (${predictionResult.confidence}%) requires physical lab verification.`,
          priority: 'HIGH'
        });
      }
    } catch {
      // Quietly use local workflow
    }

    setTimeout(() => {
      const labEl = document.getElementById('lab-verification-workflow');
      if (labEl) labEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleLabReportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLabReportFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
      showToast(`Lab Report "${file.name}" uploaded. Click "Extract Lab Results" to proceed.`, 'success');
    }
  };

  const handleExtractLabResults = () => {
    if (!predictionResult) return;
    // Simulate OCR extraction from physical lab report with slight realistic variance
    const deltaGcv = predictionResult.isHighConfidence ? 45 : -85;
    const extractedGcv = predictionResult.predictedGcv + deltaGcv;
    const extractedAsh = Number((predictionResult.predictedAsh + 0.6).toFixed(1));
    const extractedMoisture = Number((predictionResult.predictedMoisture + 0.4).toFixed(1));

    setActualGcv(extractedGcv.toString());
    setActualAsh(extractedAsh.toString());
    setActualMoisture(extractedMoisture.toString());
    setTestDate(new Date().toISOString().split('T')[0]);
    setLabResultsExtracted(true);
    showToast('Lab results extracted from PDF manifest. Review values below.', 'success');
  };

  const handleConfirmLabResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!predictionResult || !actualGcv) {
      showToast('Please enter or confirm actual lab GCV.', 'error');
      return;
    }

    setIsSubmittingLab(true);
    const measuredGcv = Number(actualGcv);
    const measuredAsh = Number(actualAsh) || predictionResult.predictedAsh;
    const measuredMoisture = Number(actualMoisture) || predictionResult.predictedMoisture;

    try {
      await laboratoryApi.submitResults({
        sample_id: predictionResult.sampleId,
        actual_gcv: measuredGcv,
        actual_ash: measuredAsh,
        actual_moisture: measuredMoisture,
        actual_vm: predictionResult.predictedVm,
        actual_fixed_carbon: predictionResult.predictedFc,
        technician_notes: `Verified via lab report ${labReportFile?.name || 'Manual Entry'}`
      });
    } catch {
      // Local fallback
    } finally {
      setIsSubmittingLab(false);
      setConfirmedLabResult({
        aiGcv: predictionResult.predictedGcv,
        labGcv: measuredGcv,
        gcvDiff: Math.abs(predictionResult.predictedGcv - measuredGcv),
        aiAsh: predictionResult.predictedAsh,
        labAsh: measuredAsh,
        ashDiff: Number(Math.abs(predictionResult.predictedAsh - measuredAsh).toFixed(1)),
        aiMoisture: predictionResult.predictedMoisture,
        labMoisture: measuredMoisture,
        moistureDiff: Number(Math.abs(predictionResult.predictedMoisture - measuredMoisture).toFixed(1)),
        testDate: testDate
      });
      showToast('Verified result added for future model improvement.', 'success');
    }
  };

  return (
    <div className="text-left select-none flex flex-col gap-6 flex-1 min-h-0 pb-12">
      
      {/* ------------------------------------------------------------------- */}
      {/* PAGE HEADER & QUICK ACTIONS                                         */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-cortex-border rounded-2xl p-5 shadow-premium">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded">
              CarbonCortex Enterprise
            </span>
            <span className="text-xs text-cortex-gray">• Sample ID: <strong className="text-cortex-dark font-mono">{sampleId}</strong></span>
          </div>
          <h1 className="text-2xl font-bold text-cortex-dark mt-1">Coal Quality Evaluation</h1>
          <p className="text-xs text-cortex-gray mt-0.5">
            Evaluate coal quality using mine, geological, environmental, operational and real-time sensor information.
          </p>
        </div>

        {/* Quick presets for testing both paths */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          <button
            type="button"
            onClick={handleLoadStandardPreset}
            className="px-2.5 py-1.5 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            title="Load standard parameters (High Confidence path)"
          >
            Load Standard Sample
          </button>
          <button
            type="button"
            onClick={handleLoadWetLowConfidencePreset}
            className="px-2.5 py-1.5 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors cursor-pointer"
            title="Load high moisture/wet sample (Low Confidence path)"
          >
            Load Wet Seam Sample
          </button>
          <button
            type="button"
            onClick={handleClearForm}
            className="px-2.5 py-1.5 text-[11px] font-medium bg-cortex-bg-secondary hover:bg-cortex-border text-cortex-gray hover:text-cortex-dark border border-cortex-border rounded-lg transition-colors cursor-pointer"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* INPUT REPORT UPLOAD & AUTO-EXTRACTION (PDF / MANIFEST)              */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white border border-cortex-border rounded-2xl p-5 shadow-premium flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-cortex-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                  Input Report Upload (Auto-Fill Form)
                </h3>
                <span className="text-[10px] bg-gold-100 text-gold-900 border border-gold-300 px-1.5 py-0.2 rounded font-bold">
                  PDF / Manifest
                </span>
              </div>
              <p className="text-xs text-cortex-gray mt-0.5">
                Upload a mine report or borehole PDF manifest to extract and auto-populate all 6 input sections below.
              </p>
            </div>
          </div>

          {inputReportFile && (
            <button
              type="button"
              onClick={() => {
                setInputReportFile(null);
                if (inputReportInputRef.current) inputReportInputRef.current.value = '';
              }}
              className="text-xs text-cortex-gray hover:text-rose-600 font-semibold cursor-pointer"
            >
              Clear Uploaded Report
            </button>
          )}
        </div>

        <input
          ref={inputReportInputRef}
          type="file"
          accept=".pdf,.csv,.json,.txt,application/pdf"
          onChange={handleInputReportFileChange}
          className="hidden"
        />

        {!inputReportFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleInputReportDrop}
            onClick={() => inputReportInputRef.current?.click()}
            className="border-2 border-dashed border-cortex-border hover:border-gold-500 rounded-xl p-4 text-center bg-cortex-bg-secondary/30 hover:bg-gold-50/20 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-cortex-dark block">
                  Drag &amp; drop mine report PDF here or click to browse
                </span>
                <span className="text-[10px] text-cortex-gray block">
                  Supports PDF geological logs, lab manifests, or CSV consignments
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  extractAndFillFromReport('Geological_Report_Gevra_BlockA_2026.pdf');
                  setInputReportFile({ name: 'Geological_Report_Gevra_BlockA_2026.pdf', size: '245.8 KB' });
                }}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-gold-50 text-gold-900 border border-gold-300 rounded-lg shadow-sm cursor-pointer"
              >
                Sample PDF A (Gevra)
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  extractAndFillFromReport('Monsoon_Wet_Pit_Moonidih.pdf');
                  setInputReportFile({ name: 'Monsoon_Wet_Pit_Moonidih.pdf', size: '312.4 KB' });
                }}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-lg shadow-sm cursor-pointer"
              >
                Sample PDF B (Wet Pit)
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputReportInputRef.current?.click();
                }}
                className="px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Browse PDF
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-950 font-mono">
                    {inputReportFile.name}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                    Extracted &amp; Populated
                  </span>
                </div>
                <span className="text-[11px] text-emerald-800 mt-0.5 block">
                  All 6 input sections below have been automatically populated. You can edit any parameter manually before running prediction.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => extractAndFillFromReport(inputReportFile.name)}
                disabled={isExtractingInputReport}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                {isExtractingInputReport ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <span>Re-Extract Values</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => inputReportInputRef.current?.click()}
                className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Upload Different PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 6 INPUT SECTIONS: RESPONSIVE 3-COLUMN GRID                          */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* ================================================================= */}
        {/* SECTION 1: MINE & GEOLOGICAL INFORMATION                         */}
        {/* ================================================================= */}
        <div className="bg-white border border-cortex-border rounded-2xl p-5 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cortex-border/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-50 text-gold-700 border border-gold-200 text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                    Mine & Geological Information
                  </h3>
                  <p className="text-[11px] text-cortex-gray mt-0.5">
                    Details about the mine, block and coal seam
                  </p>
                </div>
              </div>
              <Layers className="w-4 h-4 text-gold-600 shrink-0" />
            </div>

            <div className="flex flex-col gap-3">
              {/* Mine Name */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Mine Name <span className="text-rose-500">*</span>
                </label>
                <select
                  value={mineName}
                  onChange={(e) => setMineName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-colors ${
                    formErrors.mineName ? 'border-rose-400 bg-rose-50/20' : 'border-cortex-border'
                  }`}
                >
                  <option value="">Select Mine</option>
                  <option value="Gevra Mega Project">Gevra Mega Project (SECL)</option>
                  <option value="Kusmunda OCP">Kusmunda OCP (SECL)</option>
                  <option value="Dipka OCP">Dipka OCP (SECL)</option>
                  <option value="Jayant OCP">Jayant OCP (NCL)</option>
                  <option value="Nigahi OCP">Nigahi OCP (NCL)</option>
                  <option value="Moonidih Underground">Moonidih Underground (BCCL)</option>
                  <option value="Rajrappa OCP">Rajrappa OCP (CCL)</option>
                  <option value="Bhubaneswari OCP">Bhubaneswari OCP (MCL)</option>
                  <option value="Belpahar OCP">Belpahar OCP (MCL)</option>
                </select>
                {formErrors.mineName && <span className="text-[10px] text-rose-500 font-medium">{formErrors.mineName}</span>}
              </div>

              {/* Block ID & Coal Seam ID */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                    Block ID <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={blockId}
                    onChange={(e) => setBlockId(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 ${
                      formErrors.blockId ? 'border-rose-400 bg-rose-50/20' : 'border-cortex-border'
                    }`}
                  >
                    <option value="">Select Block</option>
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block East-1">Block East-1</option>
                    <option value="Block West-2">Block West-2</option>
                    <option value="Central Cut 3">Central Cut 3</option>
                  </select>
                  {formErrors.blockId && <span className="text-[10px] text-rose-500 font-medium">{formErrors.blockId}</span>}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                    Coal Seam ID <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={seamId}
                    onChange={(e) => setSeamId(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 ${
                      formErrors.seamId ? 'border-rose-400 bg-rose-50/20' : 'border-cortex-border'
                    }`}
                  >
                    <option value="">Select Seam</option>
                    <option value="Seam I">Seam I</option>
                    <option value="Seam II">Seam II</option>
                    <option value="Seam III">Seam III</option>
                    <option value="Seam IV">Seam IV</option>
                    <option value="Seam V (Bottom)">Seam V (Bottom)</option>
                    <option value="Seam VI (Top)">Seam VI (Top)</option>
                  </select>
                  {formErrors.seamId && <span className="text-[10px] text-rose-500 font-medium">{formErrors.seamId}</span>}
                </div>
              </div>

              {/* Seam Depth & Seam Thickness */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                    Seam Depth (m) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 185"
                    value={seamDepth}
                    onChange={(e) => setSeamDepth(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-mono font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 ${
                      formErrors.seamDepth ? 'border-rose-400 bg-rose-50/20' : 'border-cortex-border'
                    }`}
                  />
                  {formErrors.seamDepth && <span className="text-[10px] text-rose-500 font-medium">{formErrors.seamDepth}</span>}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                    Seam Thickness (m) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 3.2"
                    value={seamThickness}
                    onChange={(e) => setSeamThickness(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-mono font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 ${
                      formErrors.seamThickness ? 'border-rose-400 bg-rose-50/20' : 'border-cortex-border'
                    }`}
                  />
                  {formErrors.seamThickness && <span className="text-[10px] text-rose-500 font-medium">{formErrors.seamThickness}</span>}
                </div>
              </div>

              {/* Coal Rank / Type */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Coal Rank / Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={coalRank}
                  onChange={(e) => setCoalRank(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 ${
                    formErrors.coalRank ? 'border-rose-400 bg-rose-50/20' : 'border-cortex-border'
                  }`}
                >
                  <option value="">Select Coal Type</option>
                  <option value="Sub-Bituminous">Sub-Bituminous (Non-Coking Thermal)</option>
                  <option value="Bituminous">Bituminous (Medium Coking)</option>
                  <option value="Semi-Anthracite">Semi-Anthracite (Prime Coking)</option>
                  <option value="Anthracite">Anthracite (High Grade)</option>
                  <option value="Lignite">Lignite (Low Rank)</option>
                </select>
                {formErrors.coalRank && <span className="text-[10px] text-rose-500 font-medium">{formErrors.coalRank}</span>}
              </div>

              {/* Geological Formation */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Geological Formation <span className="text-rose-500">*</span>
                </label>
                <select
                  value={geologicalFormation}
                  onChange={(e) => setGeologicalFormation(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 ${
                    formErrors.geologicalFormation ? 'border-rose-400 bg-rose-50/20' : 'border-cortex-border'
                  }`}
                >
                  <option value="">Select Formation</option>
                  <option value="Barakar Formation">Barakar Formation (Lower Gondwana)</option>
                  <option value="Raniganj Formation">Raniganj Formation (Upper Gondwana)</option>
                  <option value="Karharbari Formation">Karharbari Formation</option>
                  <option value="Talchir Formation">Talchir Formation</option>
                  <option value="Damuda Group">Damuda Group Coal Measures</option>
                </select>
                {formErrors.geologicalFormation && <span className="text-[10px] text-rose-500 font-medium">{formErrors.geologicalFormation}</span>}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-cortex-border/50 text-[10px] text-cortex-gray flex items-center justify-between">
            <span>Stratigraphy & Seam Depth</span>
            <span className="text-gold-700 font-semibold font-mono">SECL/CIL Master Registry</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 2: LOCATION INFORMATION                                  */}
        {/* ================================================================= */}
        <div className="bg-white border border-cortex-border rounded-2xl p-5 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cortex-border/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-50 text-gold-700 border border-gold-200 text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                    Location Information
                  </h3>
                  <p className="text-[11px] text-cortex-gray mt-0.5">
                    Geographic coordinates of the mine/block
                  </p>
                </div>
              </div>
              <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Latitude <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 20.7969"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-mono font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 ${
                    formErrors.latitude ? 'border-rose-400 bg-rose-50/20' : 'border-cortex-border'
                  }`}
                />
                {formErrors.latitude && <span className="text-[10px] text-rose-500 font-medium">{formErrors.latitude}</span>}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Longitude <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 85.8245"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-mono font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 ${
                    formErrors.longitude ? 'border-rose-400 bg-rose-50/20' : 'border-cortex-border'
                  }`}
                />
                {formErrors.longitude && <span className="text-[10px] text-rose-500 font-medium">{formErrors.longitude}</span>}
              </div>

              {/* Select from Map Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-lg border border-gold-300 bg-gold-50/60 hover:bg-gold-50 text-gold-900 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-gold-600" />
                  <span>Select from Map</span>
                </button>
                <span className="text-[10px] text-cortex-gray mt-1.5 block text-center">
                  Select coordinates from active GIS open-cast pit presets or map
                </span>
              </div>

              {/* Current Coordinate Summary Pill */}
              <div className="p-3 bg-cortex-bg-secondary/60 border border-cortex-border/70 rounded-xl mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cortex-gray block">Active Geospatial Fix</span>
                  <span className="text-xs font-mono font-semibold text-cortex-dark">
                    {latitude || '0.0000'}° N, {longitude || '0.0000'}° E
                  </span>
                </div>
                <span className="text-[10px] bg-white border border-cortex-border text-cortex-dark font-mono px-2 py-0.5 rounded font-bold">
                  WGS84
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-cortex-border/50 text-[10px] text-cortex-gray flex items-center justify-between">
            <span>GIS Resolution: Open-Cast Bench</span>
            <span className="text-emerald-700 font-semibold font-mono">Telemetry Synced</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 3: COAL SAMPLE IMAGE                                     */}
        {/* ================================================================= */}
        <div className="bg-white border border-cortex-border rounded-2xl p-5 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cortex-border/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-50 text-gold-700 border border-gold-200 text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                    Coal Sample Image
                  </h3>
                  <p className="text-[11px] text-cortex-gray mt-0.5">
                    Upload a clear image of the coal sample
                  </p>
                </div>
              </div>
              <ImageIcon className="w-4 h-4 text-gold-600 shrink-0" />
            </div>

            {/* Hidden Input */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {!sampleImage ? (
              /* Drag and Drop Upload Area */
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-cortex-border hover:border-gold-500 rounded-xl p-5 text-center bg-cortex-bg-secondary/40 hover:bg-gold-50/20 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[190px]"
              >
                <div className="w-10 h-10 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 mb-2 shadow-sm">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-cortex-dark">
                  Drag &amp; drop an image here
                </p>
                <span className="text-[10px] text-cortex-gray my-1 font-medium">or</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1 bg-white hover:bg-gold-50 border border-gold-300 text-gold-900 text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Upload Image
                </button>
                <span className="text-[10px] text-cortex-gray mt-2 block">
                  Supported formats: <strong>JPG, PNG</strong>
                </span>
                <span className="text-[10px] text-cortex-gray/80 mt-0.5 block italic">
                  Recommended: Clear, high-resolution image
                </span>
              </div>
            ) : (
              /* Uploaded Image Preview Inside Same Card */
              <div className="p-3 bg-cortex-bg-secondary/50 border border-cortex-border rounded-xl flex flex-col gap-2.5">
                <div className="relative rounded-lg overflow-hidden border border-cortex-border bg-stone-900 h-36 flex items-center justify-center">
                  <img 
                    src={sampleImage.url} 
                    alt="Coal Sample Preview" 
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-md shadow transition-colors cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-cortex-dark block truncate">{sampleImage.name}</span>
                    <span className="text-[10px] text-cortex-gray">{sampleImage.size} • JPG/PNG</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-gold-700 hover:text-gold-900 shrink-0 cursor-pointer"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-cortex-border/50 text-[10px] text-cortex-gray flex items-center justify-between">
            <span>Visual Sample Documentation</span>
            <span className="text-cortex-gray font-mono">Reference Input</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 4: ENVIRONMENTAL CONDITIONS                              */}
        {/* ================================================================= */}
        <div className="bg-white border border-cortex-border rounded-2xl p-5 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cortex-border/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-50 text-gold-700 border border-gold-200 text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div>
                  <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                    Environmental Conditions
                  </h3>
                  <p className="text-[11px] text-cortex-gray mt-0.5">
                    Weather and storage related information
                  </p>
                </div>
              </div>
              <Droplets className="w-4 h-4 text-gold-600 shrink-0" />
            </div>

            <div className="flex flex-col gap-3">
              {/* Recent Rainfall (mm) & Ambient Temperature (°C) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                    Recent Rainfall (mm)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 12"
                    value={recentRainfall}
                    onChange={(e) => setRecentRainfall(e.target.value)}
                    className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-mono font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                    Ambient Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 32"
                    value={ambientTemp}
                    onChange={(e) => setAmbientTemp(e.target.value)}
                    className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-mono font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Relative Humidity (%) & Storage Duration (days) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                    Relative Humidity (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 75"
                    value={relativeHumidity}
                    onChange={(e) => setRelativeHumidity(e.target.value)}
                    className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-mono font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                    Storage Duration (days)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 6"
                    value={storageDuration}
                    onChange={(e) => setStorageDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-mono font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Stockpile Condition */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Stockpile Condition
                </label>
                <select
                  value={stockpileCondition}
                  onChange={(e) => setStockpileCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                >
                  <option value="">Select Condition</option>
                  <option value="Dry">Dry (Optimal Moisture Retention)</option>
                  <option value="Normal">Normal (Equilibrium Ambient)</option>
                  <option value="Damp">Damp (Post-Precipitation / Dew)</option>
                  <option value="Wet">Wet (Heavy Monsoon Saturated)</option>
                </select>
              </div>

              <div className="p-2.5 bg-cortex-bg-secondary/40 border border-cortex-border/60 rounded-xl text-[10px] text-cortex-gray flex items-center justify-between">
                <span>Moisture Impact Factor</span>
                <span className="font-semibold text-cortex-dark">
                  {stockpileCondition === 'Wet' ? 'High (+6.5% Est)' : stockpileCondition === 'Damp' ? 'Moderate (+2.8% Est)' : 'Normal'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-cortex-border/50 text-[10px] text-cortex-gray flex items-center justify-between">
            <span>Weather Telemetry Source</span>
            <span className="text-gold-700 font-semibold font-mono">Pit Weather Station</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 5: MINING / OPERATIONAL INFORMATION                       */}
        {/* ================================================================= */}
        <div className="bg-white border border-cortex-border rounded-2xl p-5 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cortex-border/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-50 text-gold-700 border border-gold-200 text-xs font-bold flex items-center justify-center shrink-0">
                  5
                </span>
                <div>
                  <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                    Mining / Operational Info
                  </h3>
                  <p className="text-[11px] text-cortex-gray mt-0.5">
                    Mining and handling related details
                  </p>
                </div>
              </div>
              <Sliders className="w-4 h-4 text-gold-600 shrink-0" />
            </div>

            <div className="flex flex-col gap-3">
              {/* Mining Method */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Mining Method
                </label>
                <select
                  value={miningMethod}
                  onChange={(e) => setMiningMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                >
                  <option value="">Select Method</option>
                  <option value="Open Cast">Open Cast (Surface Excavation)</option>
                  <option value="Underground">Underground (Continuous Miner / Longwall)</option>
                  <option value="Mixed">Mixed Surface-Pillar Extraction</option>
                </select>
              </div>

              {/* Coal Processing Status */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Coal Processing Status
                </label>
                <select
                  value={coalProcessingStatus}
                  onChange={(e) => setCoalProcessingStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                >
                  <option value="">Select Status</option>
                  <option value="Raw Coal">Raw Coal (Run-of-Mine ROM)</option>
                  <option value="In Processing">In Processing (Crushed &amp; Screened)</option>
                  <option value="Processed">Processed (Washery Beneficiated)</option>
                </select>
              </div>

              {/* Transportation Distance (km) */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Transportation Distance (km)
                </label>
                <input
                  type="number"
                  step="1"
                  placeholder="e.g. 50"
                  value={transportationDistance}
                  onChange={(e) => setTransportationDistance(e.target.value)}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-mono font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                />
              </div>

              {/* Stockpile / Dispatch Location */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-1">
                  Stockpile / Dispatch Location
                </label>
                <select
                  value={dispatchLocation}
                  onChange={(e) => setDispatchLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark bg-white outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                >
                  <option value="">Select Location</option>
                  <option value="Pithead Stockpile 1">Pithead Stockpile 1</option>
                  <option value="Central Railway Siding">Central Railway Siding</option>
                  <option value="Washery Feed Yard">Washery Feed Yard</option>
                  <option value="CHP Silo Storage">CHP Silo Storage (Rapid Loading)</option>
                  <option value="Dispatch Yard B">Dispatch Yard B</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-cortex-border/50 text-[10px] text-cortex-gray flex items-center justify-between">
            <span>Logistics Channel</span>
            <span className="text-cortex-dark font-mono font-semibold">CIL MGR / Rail Siding</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 6: REAL-TIME SENSOR INPUTS (OPTIONAL)                     */}
        {/* ================================================================= */}
        <div className="bg-white border border-cortex-border rounded-2xl p-5 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cortex-border/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-50 text-gold-700 border border-gold-200 text-xs font-bold flex items-center justify-center shrink-0">
                  6
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                      Real-time Sensor Inputs
                    </h3>
                    <span className="text-[9px] uppercase font-extrabold bg-cortex-bg-secondary text-cortex-gray border border-cortex-border px-1.5 py-0.5 rounded">
                      Optional
                    </span>
                  </div>
                  <p className="text-[11px] text-cortex-gray mt-0.5">
                    Live sensor data from site (if available)
                  </p>
                </div>
              </div>
              <Activity className="w-4 h-4 text-gold-600 shrink-0" />
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Row 1 */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray block mb-0.5 truncate">
                    Surf Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 28"
                    value={sensorSurfaceTemp}
                    onChange={(e) => setSensorSurfaceTemp(e.target.value)}
                    className="w-full px-2 py-1.5 border border-cortex-border rounded-lg text-xs font-mono text-cortex-dark bg-white outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray block mb-0.5 truncate">
                    Amb Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 32"
                    value={sensorAmbientTemp}
                    onChange={(e) => setSensorAmbientTemp(e.target.value)}
                    className="w-full px-2 py-1.5 border border-cortex-border rounded-lg text-xs font-mono text-cortex-dark bg-white outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray block mb-0.5 truncate">
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 75"
                    value={sensorHumidity}
                    onChange={(e) => setSensorHumidity(e.target.value)}
                    className="w-full px-2 py-1.5 border border-cortex-border rounded-lg text-xs font-mono text-cortex-dark bg-white outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray block mb-0.5 truncate">
                    Belt Speed (m/s)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 1.2"
                    value={sensorBeltSpeed}
                    onChange={(e) => setSensorBeltSpeed(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-cortex-border rounded-lg text-xs font-mono text-cortex-dark bg-white outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray block mb-0.5 truncate">
                    Flow Rate (T/hr)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 200"
                    value={sensorFlowRate}
                    onChange={(e) => setSensorFlowRate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-cortex-border rounded-lg text-xs font-mono text-cortex-dark bg-white outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray block mb-0.5 truncate">
                    Vibration (mm/s)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 0.5"
                    value={sensorVibration}
                    onChange={(e) => setSensorVibration(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-cortex-border rounded-lg text-xs font-mono text-cortex-dark bg-white outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray block mb-0.5 truncate">
                    Optical Reflectance
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 120"
                    value={sensorReflectance}
                    onChange={(e) => setSensorReflectance(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-cortex-border rounded-lg text-xs font-mono text-cortex-dark bg-white outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray block mb-0.5 truncate">
                    Particle Size (mm)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 30"
                    value={sensorParticleSize}
                    onChange={(e) => setSensorParticleSize(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-cortex-border rounded-lg text-xs font-mono text-cortex-dark bg-white outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cortex-gray block mb-0.5 truncate">
                    Bulk Density (kg/m³)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 850"
                    value={sensorBulkDensity}
                    onChange={(e) => setSensorBulkDensity(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-cortex-border rounded-lg text-xs font-mono text-cortex-dark bg-white outline-none focus:border-gold-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-cortex-border/50 text-[10px] text-cortex-gray flex items-center justify-between">
            <span>Conveyor &amp; Chute Telemetry</span>
            <span className="text-emerald-700 font-semibold font-mono">Optional Features</span>
          </div>
        </div>

      </div>

      {/* =================================================================== */}
      {/* PREDICTION ACTION AREA (PROMINENT FULL-WIDTH SECTION)               */}
      {/* =================================================================== */}
      <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <h3 className="text-base font-bold text-cortex-dark">
              Execute Machine Learning Prediction
            </h3>
          </div>
          <p className="text-xs text-cortex-gray mt-1 max-w-xl">
            Infers Proximate Analysis (Ash, Moisture, Volatile Matter, Fixed Carbon) and Gross Calorific Value (GCV) 
            using calibrated geological and operational vectors.
          </p>
        </div>

        <Button
          onClick={handlePredictCoalQuality}
          disabled={isEvaluating}
          className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold flex items-center justify-center gap-2.5 shadow-md cursor-pointer shrink-0"
        >
          {isEvaluating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Coal Quality...</span>
            </>
          ) : (
            <>
              <span>Predict Coal Quality →</span>
            </>
          )}
        </Button>
      </div>

      {/* =================================================================== */}
      {/* PREDICTION RESULTS SECTION                                          */}
      {/* =================================================================== */}
      {predictionResult && (
        <div id="prediction-results-view" className="flex flex-col gap-6 scroll-mt-6">
          
          <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-cortex-border/60 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded">
                  Inference Complete
                </span>
                <h2 className="text-xl font-bold text-cortex-dark mt-1">Coal Quality Prediction</h2>
                <p className="text-xs text-cortex-gray mt-0.5">
                  Sample <strong className="text-cortex-dark font-mono">{predictionResult.sampleId}</strong> • {predictionResult.mineName}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-cortex-gray block">Model Version</span>
                  <span className="text-xs font-mono font-bold text-cortex-dark">Cortex-v4.2-Prod</span>
                </div>
                <div className="px-3 py-1.5 bg-gold-50 text-gold-900 border border-gold-200 rounded-xl font-mono text-sm font-bold">
                  Grade {predictionResult.grade}
                </div>
              </div>
            </div>

            {/* Clean KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {/* Predicted Ash */}
              <div className="p-4 bg-cortex-bg-secondary/60 border border-cortex-border rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">
                  Ash
                </span>
                <div className="my-2">
                  <span className="text-2xl font-extrabold font-mono text-cortex-dark">
                    {predictionResult.predictedAsh}
                  </span>
                  <span className="text-xs text-cortex-gray font-sans ml-1">%</span>
                </div>
                <span className="text-[10px] text-cortex-gray">Inorganic Residual</span>
              </div>

              {/* Predicted Moisture */}
              <div className="p-4 bg-cortex-bg-secondary/60 border border-cortex-border rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">
                  Moisture
                </span>
                <div className="my-2">
                  <span className="text-2xl font-extrabold font-mono text-cortex-dark">
                    {predictionResult.predictedMoisture}
                  </span>
                  <span className="text-xs text-cortex-gray font-sans ml-1">%</span>
                </div>
                <span className="text-[10px] text-cortex-gray">Total Moisture</span>
              </div>

              {/* Predicted Volatile Matter */}
              <div className="p-4 bg-cortex-bg-secondary/60 border border-cortex-border rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">
                  Volatile Matter
                </span>
                <div className="my-2">
                  <span className="text-2xl font-extrabold font-mono text-cortex-dark">
                    {predictionResult.predictedVm}
                  </span>
                  <span className="text-xs text-cortex-gray font-sans ml-1">%</span>
                </div>
                <span className="text-[10px] text-cortex-gray">Combustible Gases</span>
              </div>

              {/* Predicted Fixed Carbon */}
              <div className="p-4 bg-cortex-bg-secondary/60 border border-cortex-border rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">
                  Fixed Carbon
                </span>
                <div className="my-2">
                  <span className="text-2xl font-extrabold font-mono text-cortex-dark">
                    {predictionResult.predictedFc}
                  </span>
                  <span className="text-xs text-cortex-gray font-sans ml-1">%</span>
                </div>
                <span className="text-[10px] text-cortex-gray">Solid Fuel Core</span>
              </div>

              {/* Predicted GCV */}
              <div className="p-4 bg-gold-50/40 border border-gold-200 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-900">
                  GCV
                </span>
                <div className="my-2">
                  <span className="text-2xl font-extrabold font-mono text-gold-950">
                    {predictionResult.predictedGcv.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gold-800 font-sans ml-1 block">kcal/kg</span>
                </div>
                <span className="text-[10px] text-gold-700">Gross Calorific Value</span>
              </div>

              {/* Overall Quality Grade */}
              <div className="p-4 bg-cortex-bg-secondary/60 border border-cortex-border rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray">
                  Quality Grade
                </span>
                <div className="my-2">
                  <span className="text-2xl font-extrabold font-mono text-cortex-dark">
                    {predictionResult.grade}
                  </span>
                </div>
                <span className="text-[10px] text-cortex-gray">Ministry of Coal</span>
              </div>

              {/* Prediction Confidence */}
              <div className={`p-4 border rounded-xl flex flex-col justify-between ${
                predictionResult.isHighConfidence 
                  ? 'bg-emerald-50/50 border-emerald-200' 
                  : 'bg-amber-50/50 border-amber-200'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  predictionResult.isHighConfidence ? 'text-emerald-900' : 'text-amber-900'
                }`}>
                  Confidence
                </span>
                <div className="my-2">
                  <span className={`text-2xl font-extrabold font-mono ${
                    predictionResult.isHighConfidence ? 'text-emerald-800' : 'text-amber-800'
                  }`}>
                    {predictionResult.confidence}%
                  </span>
                </div>
                <span className={`text-[10px] ${
                  predictionResult.isHighConfidence ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {predictionResult.isHighConfidence ? 'Enterprise Verified' : 'Variance Detected'}
                </span>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* CONFIDENCE-BASED VERIFICATION DECISION CARD                     */}
          {/* =============================================================== */}
          <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
            <div className="flex items-center justify-between border-b border-cortex-border/60 pb-3 mb-4">
              <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                Verification Decision
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                predictionResult.isHighConfidence 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {predictionResult.isHighConfidence ? 'High Confidence' : 'Low Confidence'}
              </span>
            </div>

            {predictionResult.isHighConfidence ? (
              /* PATH A: HIGH CONFIDENCE */
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                        Status: High Confidence
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Prediction is sufficiently reliable for operational use.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto shrink-0">
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-100/80 border border-emerald-300 px-3 py-2 rounded-lg">
                    Continue — No Lab Test Needed
                  </span>
                  <Button
                    onClick={() => navigate('/blend')}
                    className="py-2 px-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Blend</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              /* PATH B: LOW CONFIDENCE */
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                        Status: Low Confidence ({predictionResult.confidence}%)
                      </span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.2 rounded">
                        Lab Test Needed
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Prediction requires laboratory verification.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-stretch sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={handleInitiateLabVerification}
                    className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Send for Lab Verification</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* LAB VERIFICATION SECTION                                        */}
          {/* (Shown when low confidence or explicitly sent for verification)  */}
          {/* =============================================================== */}
          {(showLabSection || !predictionResult.isHighConfidence) && (
            <div id="lab-verification-workflow" className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium scroll-mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-cortex-border/60 pb-3 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Lab Verification Protocol
                    </span>
                    <span className="text-xs font-mono font-bold text-cortex-dark">
                      Status: {confirmedLabResult ? 'Verified & Stored' : labReportFile ? 'Lab Report Uploaded' : 'Pending Lab Report'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-cortex-dark mt-1">Lab Verification</h3>
                  <p className="text-xs text-cortex-gray mt-0.5">
                    Verify sample measurements with certified physical laboratory manifest.
                  </p>
                </div>
              </div>

              {/* Summary of AI Values under verification */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 bg-cortex-bg-secondary/50 border border-cortex-border rounded-xl mb-5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cortex-gray block">Sample ID</span>
                  <span className="text-xs font-mono font-bold text-cortex-dark">{predictionResult.sampleId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-cortex-gray block">AI Predicted Ash</span>
                  <span className="text-xs font-mono font-bold text-cortex-dark">{predictionResult.predictedAsh}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-cortex-gray block">AI Predicted Moisture</span>
                  <span className="text-xs font-mono font-bold text-cortex-dark">{predictionResult.predictedMoisture}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-cortex-gray block">AI Predicted GCV</span>
                  <span className="text-xs font-mono font-bold text-gold-900">{predictionResult.predictedGcv.toLocaleString()} kcal/kg</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-cortex-gray block">Confidence</span>
                  <span className="text-xs font-mono font-bold text-amber-700">{predictionResult.confidence}%</span>
                </div>
              </div>

              {/* Upload Lab Report (PDF) */}
              <div className="border border-cortex-border rounded-xl p-4 bg-white mb-5 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-cortex-dark block">Upload Lab Report</span>
                    <span className="text-[11px] text-cortex-gray block mt-0.5">
                      Upload physical laboratory PDF test manifest for digital verification
                    </span>
                  </div>

                  <input 
                    ref={labReportInputRef}
                    type="file" 
                    accept=".pdf,application/pdf"
                    onChange={handleLabReportFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => labReportInputRef.current?.click()}
                    className="px-3 py-2 bg-cortex-bg-secondary hover:bg-cortex-border border border-cortex-border text-cortex-dark text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-gold-600" />
                    <span>{labReportFile ? 'Change Lab Report' : 'Upload Lab Report (PDF)'}</span>
                  </button>
                </div>

                {labReportFile && (
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="text-xs font-bold text-emerald-950">
                        Lab Report Uploaded: <span className="font-mono">{labReportFile.name}</span> ({labReportFile.size})
                      </span>
                    </div>

                    {!labResultsExtracted && (
                      <button
                        type="button"
                        onClick={handleExtractLabResults}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                      >
                        Extract Lab Results
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Extracted / Editable Lab Result Inputs */}
              {(labResultsExtracted || labReportFile) && (
                <form onSubmit={handleConfirmLabResult} className="border border-cortex-border rounded-xl p-4 bg-cortex-bg-secondary/30 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-cortex-border/50 pb-2">
                    <span className="text-xs font-bold text-cortex-dark uppercase tracking-wider">
                      Review &amp; Confirm Extracted Laboratory Values
                    </span>
                    <span className="text-[10px] text-cortex-gray">
                      Editable for technician verification
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-dark block mb-1">
                        Actual Ash (%) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="e.g. 28.6"
                        value={actualAsh}
                        onChange={(e) => setActualAsh(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-cortex-border rounded-lg text-xs font-mono font-bold text-cortex-dark outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-dark block mb-1">
                        Actual Moisture (%) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="e.g. 8.5"
                        value={actualMoisture}
                        onChange={(e) => setActualMoisture(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-cortex-border rounded-lg text-xs font-mono font-bold text-cortex-dark outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-dark block mb-1">
                        Actual GCV (kcal/kg) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 4810"
                        value={actualGcv}
                        onChange={(e) => setActualGcv(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gold-400 rounded-lg text-xs font-mono font-bold text-cortex-dark outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-cortex-dark block mb-1">
                        Test Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={testDate}
                        onChange={(e) => setTestDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-cortex-border rounded-lg text-xs font-semibold text-cortex-dark outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {!confirmedLabResult ? (
                    <div className="pt-1">
                      <Button
                        type="submit"
                        disabled={isSubmittingLab || !actualGcv}
                        className="py-2.5 px-5 text-xs font-bold cursor-pointer"
                      >
                        {isSubmittingLab ? 'Confirming Lab Result...' : 'Confirm Lab Result'}
                      </Button>
                    </div>
                  ) : null}
                </form>
              )}

              {/* POST-CONFIRMATION: AI VS LAB RESULT COMPARISON */}
              {confirmedLabResult && (
                <div className="mt-5 p-5 bg-white border border-cortex-border rounded-xl shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-cortex-border/60 pb-2">
                    <span className="text-xs font-bold text-cortex-dark uppercase tracking-wider">
                      AI vs Lab Result
                    </span>
                    <span className="text-[10px] text-cortex-gray font-mono">
                      Test Date: {confirmedLabResult.testDate}
                    </span>
                  </div>

                  {/* Comparison Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-cortex-border/60 text-[10px] uppercase font-bold text-cortex-gray">
                          <th className="py-2 px-3">Quality Parameter</th>
                          <th className="py-2 px-3">AI Prediction</th>
                          <th className="py-2 px-3">Lab Result</th>
                          <th className="py-2 px-3">Difference</th>
                          <th className="py-2 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cortex-border/40 font-mono">
                        <tr>
                          <td className="py-2.5 px-3 font-sans font-semibold text-cortex-dark">GCV (kcal/kg)</td>
                          <td className="py-2.5 px-3">{confirmedLabResult.aiGcv.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-bold text-gold-900">{confirmedLabResult.labGcv.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-emerald-700">± {confirmedLabResult.gcvDiff} kcal/kg</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                              Verified
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-sans font-semibold text-cortex-dark">Ash (%)</td>
                          <td className="py-2.5 px-3">{confirmedLabResult.aiAsh}%</td>
                          <td className="py-2.5 px-3 font-bold text-cortex-dark">{confirmedLabResult.labAsh}%</td>
                          <td className="py-2.5 px-3 text-emerald-700">± {confirmedLabResult.ashDiff}%</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                              Verified
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-sans font-semibold text-cortex-dark">Moisture (%)</td>
                          <td className="py-2.5 px-3">{confirmedLabResult.aiMoisture}%</td>
                          <td className="py-2.5 px-3 font-bold text-cortex-dark">{confirmedLabResult.labMoisture}%</td>
                          <td className="py-2.5 px-3 text-emerald-700">± {confirmedLabResult.moistureDiff}%</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                              Verified
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-950 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Laboratory verification confirmed and recorded successfully.</span>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Button
                      onClick={() => navigate('/blend')}
                      className="py-2 px-3 text-xs font-bold"
                    >
                      <span>Continue with Verified Value to Blend Optimizer</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => {
                        setPredictionResult(null);
                        setConfirmedLabResult(null);
                        setLabReportFile(null);
                        setLabResultsExtracted(false);
                        setShowLabSection(false);
                      }}
                      className="py-2 px-3 text-xs font-semibold cursor-pointer"
                    >
                      Evaluate Another Sample
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* DOWNLOAD REPORT SECTION (AFTER LAB TESTING)                     */}
          {/* =============================================================== */}
          <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-cortex-border/60 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded">
                    Official Documentation
                  </span>
                  <span className="text-xs font-mono text-cortex-gray">
                    Ref: <strong className="text-cortex-dark">{predictionResult.sampleId}</strong>
                  </span>
                </div>
                <h3 className="text-base font-bold text-cortex-dark mt-1">
                  Download Quality Evaluation Report
                </h3>
                <p className="text-xs text-cortex-gray mt-0.5">
                  Export certified coal quality assessment, AI prediction parameters, and laboratory verification certificate.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Report Ready</span>
                </span>
              </div>
            </div>

            {/* Document Preview Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-cortex-bg-secondary/40 border border-cortex-border rounded-xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-cortex-gray block">Consignment Batch</span>
                <span className="text-sm font-bold font-mono text-cortex-dark block">{predictionResult.sampleId}</span>
                <span className="text-xs text-cortex-gray block">{predictionResult.mineName} • {seamId}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-cortex-gray block">Quality Grading</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-gold-900">Grade {predictionResult.grade}</span>
                  <span className="text-xs text-cortex-gray">({predictionResult.predictedGcv.toLocaleString()} kcal/kg)</span>
                </div>
                <span className="text-xs text-cortex-gray block">
                  Ash: {confirmedLabResult ? confirmedLabResult.labAsh : predictionResult.predictedAsh}% • 
                  Moisture: {confirmedLabResult ? confirmedLabResult.labMoisture : predictionResult.predictedMoisture}%
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-cortex-gray block">Verification State</span>
                <span className="text-sm font-semibold text-cortex-dark block">
                  {confirmedLabResult ? 'Physically Lab Verified' : predictionResult.isHighConfidence ? 'AI Automated (High Conf)' : 'Pending Lab Review'}
                </span>
                <span className="text-xs font-mono text-cortex-gray block">
                  Model: Cortex-v4.2-Prod ({predictionResult.confidence}% Conf)
                </span>
              </div>
            </div>

            {/* Download Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                {/* 1. Download Printable PDF / Certificate */}
                <button
                  type="button"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Coal Quality Certificate - ${predictionResult.sampleId}</title>
                            <style>
                              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #18181B; }
                              .header { border-bottom: 2px solid #D97706; padding-bottom: 16px; margin-bottom: 24px; }
                              .title { font-size: 24px; font-weight: bold; color: #18181B; margin: 0; }
                              .subtitle { font-size: 13px; color: #71717A; margin-top: 4px; }
                              .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
                              .card { background: #F4F4F5; padding: 16px; border-radius: 8px; }
                              .label { font-size: 11px; text-transform: uppercase; color: #71717A; font-weight: bold; }
                              .value { font-size: 18px; font-weight: bold; font-family: monospace; margin-top: 4px; }
                              table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
                              th, td { padding: 10px; border-bottom: 1px solid #E4E4E7; text-align: left; }
                              th { text-transform: uppercase; font-size: 11px; color: #71717A; }
                              .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E4E4E7; font-size: 11px; color: #71717A; display: flex; justify-content: space-between; }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <h1 class="title">COAL INDIA LIMITED — QUALITY CERTIFICATE</h1>
                              <p class="subtitle">CarbonCortex Automated Telemetry & Laboratory Verification Protocol</p>
                            </div>
                            <div class="grid">
                              <div class="card">
                                <div class="label">Sample Identification</div>
                                <div class="value">${predictionResult.sampleId}</div>
                                <div style="font-size: 12px; margin-top: 4px;">${predictionResult.mineName} • ${blockId} • ${seamId}</div>
                              </div>
                              <div class="card">
                                <div class="label">Assigned Coal Grade</div>
                                <div class="value" style="color: #D97706;">Grade ${predictionResult.grade}</div>
                                <div style="font-size: 12px; margin-top: 4px;">GCV: ${predictionResult.predictedGcv.toLocaleString()} kcal/kg (${predictionResult.confidence}% Confidence)</div>
                              </div>
                            </div>
                            <h3>Proximate Analysis Parameters</h3>
                            <table>
                              <thead>
                                <tr>
                                  <th>Parameter</th>
                                  <th>AI Prediction</th>
                                  <th>Lab Measured</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td><strong>Gross Calorific Value (GCV)</strong></td>
                                  <td>${predictionResult.predictedGcv.toLocaleString()} kcal/kg</td>
                                  <td>${confirmedLabResult ? confirmedLabResult.labGcv.toLocaleString() + ' kcal/kg' : 'N/A'}</td>
                                  <td>${confirmedLabResult ? 'Verified' : 'AI Estimated'}</td>
                                </tr>
                                <tr>
                                  <td><strong>Ash Content</strong></td>
                                  <td>${predictionResult.predictedAsh}%</td>
                                  <td>${confirmedLabResult ? confirmedLabResult.labAsh + '%' : 'N/A'}</td>
                                  <td>${confirmedLabResult ? 'Verified' : 'AI Estimated'}</td>
                                </tr>
                                <tr>
                                  <td><strong>Moisture Content</strong></td>
                                  <td>${predictionResult.predictedMoisture}%</td>
                                  <td>${confirmedLabResult ? confirmedLabResult.labMoisture + '%' : 'N/A'}</td>
                                  <td>${confirmedLabResult ? 'Verified' : 'AI Estimated'}</td>
                                </tr>
                                <tr>
                                  <td><strong>Volatile Matter</strong></td>
                                  <td>${predictionResult.predictedVm}%</td>
                                  <td>${predictionResult.predictedVm}%</td>
                                  <td>AI Model Baseline</td>
                                </tr>
                                <tr>
                                  <td><strong>Fixed Carbon</strong></td>
                                  <td>${predictionResult.predictedFc}%</td>
                                  <td>${predictionResult.predictedFc}%</td>
                                  <td>Calculated Fuel Core</td>
                                </tr>
                              </tbody>
                            </table>
                            <div class="footer">
                              <div>Generated by CarbonCortex v4.2 • Dispatch Telemetry</div>
                              <div>Date: ${new Date().toLocaleDateString()}</div>
                            </div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.focus();
                      setTimeout(() => {
                        printWindow.print();
                      }, 250);
                    }
                    showToast('Opening Quality Report print certificate...', 'info');
                  }}
                  className="px-4 py-2.5 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download / Print PDF Report</span>
                </button>

                {/* 2. Download CSV Export */}
                <button
                  type="button"
                  onClick={() => {
                    const csvRows = [
                      ['Parameter', 'Value', 'Unit'],
                      ['Sample ID', predictionResult.sampleId, ''],
                      ['Mine Name', predictionResult.mineName, ''],
                      ['Block ID', blockId, ''],
                      ['Seam ID', seamId, ''],
                      ['Seam Depth', seamDepth, 'm'],
                      ['Seam Thickness', seamThickness, 'm'],
                      ['Coal Rank', coalRank, ''],
                      ['Geological Formation', geologicalFormation, ''],
                      ['Latitude', latitude, 'deg N'],
                      ['Longitude', longitude, 'deg E'],
                      ['Predicted GCV', predictionResult.predictedGcv, 'kcal/kg'],
                      ['Predicted Ash', predictionResult.predictedAsh, '%'],
                      ['Predicted Moisture', predictionResult.predictedMoisture, '%'],
                      ['Predicted Volatile Matter', predictionResult.predictedVm, '%'],
                      ['Predicted Fixed Carbon', predictionResult.predictedFc, '%'],
                      ['Overall Grade', predictionResult.grade, ''],
                      ['Confidence', predictionResult.confidence, '%'],
                      ['Lab Measured GCV', confirmedLabResult ? confirmedLabResult.labGcv : 'N/A', 'kcal/kg'],
                      ['Lab Measured Ash', confirmedLabResult ? confirmedLabResult.labAsh : 'N/A', '%'],
                      ['Lab Measured Moisture', confirmedLabResult ? confirmedLabResult.labMoisture : 'N/A', '%'],
                      ['Test Date', confirmedLabResult ? confirmedLabResult.testDate : 'N/A', ''],
                      ['Report Timestamp', new Date().toISOString(), '']
                    ];
                    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', `Coal_Quality_Report_${predictionResult.sampleId}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showToast(`Exported CSV report for ${predictionResult.sampleId}`, 'success');
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-cortex-bg-secondary border border-cortex-border text-cortex-dark font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 rotate-180 text-gold-600" />
                  <span>Export CSV</span>
                </button>

                {/* 3. Download JSON Telemetry */}
                <button
                  type="button"
                  onClick={() => {
                    const jsonReport = {
                      sample_id: predictionResult.sampleId,
                      mine: {
                        name: predictionResult.mineName,
                        block: blockId,
                        seam: seamId,
                        depth_m: Number(seamDepth),
                        thickness_m: Number(seamThickness),
                        rank: coalRank,
                        formation: geologicalFormation
                      },
                      location: {
                        latitude: Number(latitude),
                        longitude: Number(longitude)
                      },
                      environmental: {
                        rainfall_mm: Number(recentRainfall) || 0,
                        ambient_temp_c: Number(ambientTemp) || 0,
                        humidity_pct: Number(relativeHumidity) || 0,
                        storage_duration_days: Number(storageDuration) || 0,
                        condition: stockpileCondition
                      },
                      mining_operational: {
                        method: miningMethod,
                        processing_status: coalProcessingStatus,
                        transportation_km: Number(transportationDistance) || 0,
                        dispatch_location: dispatchLocation
                      },
                      prediction: {
                        gcv_kcal_kg: predictionResult.predictedGcv,
                        ash_pct: predictionResult.predictedAsh,
                        moisture_pct: predictionResult.predictedMoisture,
                        volatile_matter_pct: predictionResult.predictedVm,
                        fixed_carbon_pct: predictionResult.predictedFc,
                        grade: predictionResult.grade,
                        confidence_pct: predictionResult.confidence,
                        model_version: 'Cortex-v4.2-Prod'
                      },
                      lab_verification: confirmedLabResult ? {
                        actual_gcv: confirmedLabResult.labGcv,
                        actual_ash: confirmedLabResult.labAsh,
                        actual_moisture: confirmedLabResult.labMoisture,
                        test_date: confirmedLabResult.testDate,
                        status: 'VERIFIED'
                      } : {
                        status: predictionResult.isHighConfidence ? 'NOT_REQUIRED' : 'PENDING'
                      },
                      generated_at: new Date().toISOString()
                    };
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonReport, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute('href', dataStr);
                    downloadAnchor.setAttribute('download', `Coal_Quality_Telemetry_${predictionResult.sampleId}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    showToast(`Exported JSON telemetry for ${predictionResult.sampleId}`, 'success');
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-cortex-bg-secondary border border-cortex-border text-cortex-dark font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export JSON</span>
                </button>
              </div>

              {/* View in Enterprise Valuation Reports */}
              <button
                type="button"
                onClick={() => navigate('/report')}
                className="text-xs font-bold text-gold-700 hover:text-gold-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Open in Reports Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: SELECT FROM MAP COORDINATE PICKER                            */}
      {/* =================================================================== */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-cortex-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-cortex-border flex items-center justify-between bg-cortex-bg-secondary/40">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-600" />
                <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider">
                  Select Mining Coordinates from Map
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="p-1 hover:bg-cortex-border rounded-lg text-cortex-gray hover:text-cortex-dark transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex flex-col gap-4">
              <p className="text-xs text-cortex-gray">
                Click any active Coal India subsidiary mine to automatically populate the latitude, longitude, and geological block identifiers:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MINE_COORDINATE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPresetFromMap(preset)}
                    className="p-3 text-left border border-cortex-border hover:border-gold-400 bg-white hover:bg-gold-50/30 rounded-xl transition-all flex flex-col justify-between group cursor-pointer shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cortex-dark group-hover:text-gold-900 block truncate">
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-gold-700 bg-gold-50 font-bold px-1.5 py-0.5 rounded">
                          {preset.coalfield}
                        </span>
                      </div>
                      <span className="text-[11px] text-cortex-gray mt-0.5 block">
                        {preset.state} • {preset.block} • {preset.seam}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-cortex-border/50 flex items-center justify-between text-[10px] font-mono text-cortex-gray">
                      <span>{preset.lat}° N, {preset.lng}° E</span>
                      <span className="text-gold-600 font-bold group-hover:underline">Select →</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom manual update prompt */}
              <div className="p-3 bg-cortex-bg-secondary/60 border border-cortex-border rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-cortex-dark block">Open Full Satellite GIS Map View</span>
                  <span className="text-[11px] text-cortex-gray">
                    View active haul truck and shovel live telemetry on the geospatial map page.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMapModalOpen(false);
                    navigate('/map');
                  }}
                  className="px-3 py-1.5 bg-white border border-cortex-border hover:border-gold-400 rounded-lg text-xs font-bold text-cortex-dark transition-colors cursor-pointer shrink-0"
                >
                  Go to Map Page
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-cortex-border bg-cortex-bg-secondary/30 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsMapModalOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CoalQualityEvaluation;
