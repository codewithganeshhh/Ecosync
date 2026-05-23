import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MapPin, Check } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const ReportWaste = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    wasteType: 'general',
    description: '',
    location: '',
    reportingCoordinates: null
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);

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
          setFormData(prev => ({ ...prev, location: data.display_name }));
          toast.success("Location synchronized!");
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
      toast.info("Site evidence secured and ready.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isImageProcessing) {
      return toast.warn("Please wait for evidence processing to complete.");
    }

    if (!formData.location || !formData.description) {
      toast.error("Please fill in all required fields!");
      return;
    }
    
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('wasteType', formData.wasteType);
      payload.append('description', formData.description);
      payload.append('location', formData.location);
      if (formData.reportingCoordinates) {
        // Send as JSON string since FormData only takes strings/blobs
        payload.append('reportingCoordinates', JSON.stringify(formData.reportingCoordinates));
      }

      if (imageFile) {
        payload.append('image', imageFile);
      }

      await api.post('/waste/report', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Waste reported successfully! Our crew has been alerted.');
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
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-medium">Precise Location*</label>
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
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="E.g., Sakchi Market, Near Jubilee Park Gate"
                    className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
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
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            </div>
          </div>

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
