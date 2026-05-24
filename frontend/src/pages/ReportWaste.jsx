import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Check, ChevronDown, Sparkles, BrainCircuit } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const JAMSHEDPUR_AREAS = [
  'Sakchi',
  'Mango',
  'Azad Basti',
  'Dimna',
  'Bistupur',
  'Kadma',
  'Sonari',
  'Golmuri',
  'Jugsalai',
  'Telco',
  'Baridih',
  'Sidhgora',
  'Adityapur'
];

const ReportWaste = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    wasteType: 'general',
    description: '',
    selectedArea: '',
    preciseLocation: '',
    reportingCoordinates: null
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [aiScanning, setAiScanning] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser");
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setFormData(prev => ({ ...prev, reportingCoordinates: { lat: latitude, lng: longitude } }));
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        if (data.display_name) {
          const displayName = data.display_name;
          const displayNameLower = displayName.toLowerCase();
          const matchedArea = JAMSHEDPUR_AREAS.find(area => displayNameLower.includes(area.toLowerCase()));
          
          setFormData(prev => ({
            ...prev,
            preciseLocation: displayName,
            selectedArea: matchedArea || prev.selectedArea
          }));
          
          if (matchedArea) {
            toast.success(`Location synchronized: ${matchedArea}!`);
          } else {
            toast.success("Location synchronized! Please select your general area manually.");
          }
        }
      } catch (err) {
        toast.warn("GPS coordinates captured, but failed to fetch address name.");
      } finally {
        setDetecting(false);
      }
    }, () => {
      toast.error("Failed to retrieve location. Please check permissions.");
      setDetecting(false);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) return toast.error("File size exceeds 10MB limit");
      
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setAiResult(null); // Reset previous scan result
      toast.info("Site evidence secured and ready.");
    }
  };

  const handleAIScan = async () => {
    if (!preview) {
      return toast.warn("Please upload an image of the waste first!");
    }

    setAiScanning(true);
    try {
      const { data } = await api.post('/waste/analyze');
      
      // Delay of 2.5s to show scanner animation
      await new Promise(resolve => setTimeout(resolve, 2500));

      setFormData(prev => ({
        ...prev,
        wasteType: data.wasteType,
        description: data.description
      }));
      setAiResult(data.aiAnalysis);
      toast.success("AI Scan Complete! Waste type & descriptions prefilled.");
    } catch (err) {
      toast.error("Simulated AI scan failed. Please select details manually.");
    } finally {
      setAiScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isImageProcessing || aiScanning) {
      return toast.warn("Please wait for evidence processing/AI scan to complete.");
    }

    if (!formData.selectedArea || !formData.preciseLocation || !formData.description) {
      toast.error("Please fill in all required fields!");
      return;
    }
    
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('wasteType', formData.wasteType);
      payload.append('description', formData.description);
      
      const combinedLocation = `${formData.selectedArea} - ${formData.preciseLocation}`;
      payload.append('location', combinedLocation);
      if (formData.reportingCoordinates) {
        payload.append('reportingCoordinates', JSON.stringify(formData.reportingCoordinates));
      }

      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (aiResult) {
        payload.append('aiAnalysis', JSON.stringify(aiResult));
      }

      await api.post('/waste/report', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Waste reported successfully! +10 EcoPoints earned.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to dispatch report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Report Waste</h1>
          <p className="text-muted-foreground">Help keep the community clean by reporting neglected waste.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Waste Type*</label>
                <select 
                  className="w-full px-4 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.wasteType}
                  onChange={(e) => setFormData({...formData, wasteType: e.target.value})}
                >
                  <option value="general">General Waste</option>
                  <option value="plastic">Plastic & Recyclables</option>
                  <option value="electronic">E-Waste</option>
                  <option value="hazardous">Hazardous</option>
                  <option value="organic">Organic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Area / Neighborhood*</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground z-10" />
                  <select 
                    className="w-full pl-10 pr-10 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer text-sm font-semibold"
                    value={JAMSHEDPUR_AREAS.includes(formData.selectedArea) ? formData.selectedArea : ''}
                    onChange={(e) => setFormData({...formData, selectedArea: e.target.value})}
                    required
                  >
                    <option value="" disabled className="text-muted-foreground font-normal">-- Select Area --</option>
                    {JAMSHEDPUR_AREAS.map((area) => (
                      <option key={area} value={area} className="text-black bg-white font-medium">
                        {area}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-medium">Precise Location / Landmark*</label>
                   <button 
                     type="button"
                     onClick={getLocation}
                     disabled={detecting}
                     className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1 leading-none"
                   >
                     {detecting ? 'Detecting...' : <><MapPin className="w-3 h-3" /> Auto-Detect GPS</>}
                   </button>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="E.g., Near Main Gate, behind market"
                    className="w-full px-4 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    value={formData.preciseLocation}
                    onChange={(e) => setFormData({...formData, preciseLocation: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload Issue Image</label>
              <div 
                className={`relative w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center overflow-hidden transition-colors ${preview ? 'border-primary' : 'hover:border-primary/50'}`}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="object-cover w-full h-full opacity-80" />
                ) : (
                  <>
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload (Max 10MB)</span>
                  </>
                )}
                {isImageProcessing && (
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">Securing Evidence...</span>
                  </div>
                )}
                {aiScanning && (
                  <div className="absolute inset-0 bg-primary/10 flex flex-col items-center justify-center overflow-hidden">
                    <motion.div 
                      initial={{ y: -80 }}
                      animate={{ y: 160 }}
                      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5, ease: "easeInOut" }}
                      className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_#10b981]"
                    />
                    <div className="z-10 bg-black/70 px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 border border-primary/20 animate-pulse text-white">
                      <BrainCircuit className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">AI Running Scan...</span>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
              {preview && (
                <button
                  type="button"
                  onClick={handleAIScan}
                  disabled={aiScanning}
                  className="w-full mt-3 py-2.5 bg-gradient-to-r from-primary/15 to-emerald-500/15 border border-primary/20 text-primary hover:from-primary/25 hover:to-emerald-500/25 font-black text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  <BrainCircuit className="w-4 h-4 text-primary" /> Run AI Analysis Scan
                </button>
              )}
            </div>
          </div>

          {/* AI Scanner Intelligence Report Card */}
          {aiResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary/5 dark:bg-primary/[0.02] border border-primary/20 rounded-2xl p-6 space-y-4"
            >
              <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" /> AI Scanner Intel Card
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/50 dark:bg-black/30 p-3 rounded-xl border border-border flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Recyclable</span>
                  <span className="text-sm font-black text-foreground mt-0.5">{aiResult.isRecyclable ? 'YES' : 'NO'}</span>
                </div>
                <div className="bg-white/50 dark:bg-black/30 p-3 rounded-xl border border-border flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Score</span>
                  <span className="text-sm font-black text-foreground mt-0.5">{aiResult.recyclabilityPercentage}%</span>
                </div>
                <div className="bg-white/50 dark:bg-black/30 p-3 rounded-xl border border-border flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Est. Carbon Saved</span>
                  <span className="text-sm font-black text-green-500 mt-0.5 flex items-center gap-0.5">
                     {aiResult.carbonSavedKg} kg CO2
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground border-t border-border/40 pt-3">
                 <span>ESTIMATED WASTE VOLUME / WEIGHT</span>
                 <span className="font-mono font-black text-foreground">{aiResult.estimatedWeightKg} kg</span>
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Description*</label>
            <textarea 
              rows="4"
              placeholder="Describe the type of waste, estimated amount, and any specific details for the collection crew..."
              className="w-full px-4 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : <><Check className="w-5 h-5" /> Submit Report</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ReportWaste;
