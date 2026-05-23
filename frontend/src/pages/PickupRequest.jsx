import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Truck } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const PickupRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  
  // Try to grab wasteId from params if passed (optional feature)
  const queryParams = new URLSearchParams(location.search);
  const initialWasteId = queryParams.get('wasteId') || '';

  const [formData, setFormData] = useState({
    wasteId: initialWasteId,
    preferredDate: '',
    location: '',
    notes: '',
    coordinates: null
  });
  const [detecting, setDetecting] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser");
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setFormData(prev => ({ ...prev, coordinates: { lat: latitude, lng: longitude } }));
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        if (data.display_name) {
          setFormData(prev => ({ ...prev, location: data.display_name }));
          toast.success("Pickup location synchronized!");
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

  useEffect(() => {
    // Fetch user's reports to link if needed
    const fetchReports = async () => {
      try {
        const { data } = await api.get('/waste/myreports');
        setReports(data.filter(r => r.status !== 'completed' && r.status !== 'rejected'));
      } catch (error) {
        console.error("Failed to load reports");
      }
    };
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || !formData.preferredDate) {
      toast.error("Location and Preferred Date are required!");
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/pickup/request', formData);
      toast.success('Pickup requested successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request pickup');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl border-l-4 border-l-primary"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Truck className="h-8 w-8 text-primary" /> Schedule Pickup
          </h1>
          <p className="text-muted-foreground">Request a collection truck to pick up your sorted waste.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Link to existing report? (Optional)</label>
              <select 
                className="w-full px-4 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.wasteId}
                onChange={(e) => setFormData({...formData, wasteId: e.target.value})}
              >
                <option value="">-- No linked report --</option>
                {reports.map(report => (
                  <option key={report._id} value={report._id}>
                    {report.wasteType} at {report.location.substring(0, 15)}...
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Date*</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Pickup Address / Location*</label>
              <button 
                type="button"
                onClick={getLocation}
                disabled={detecting}
                className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1 leading-none disabled:opacity-50"
              >
                {detecting ? 'Detecting...' : <><MapPin className="w-3 h-3" /> Auto-Detect GPS</>}
              </button>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Full address or precise location"
                className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Additional Notes</label>
            <textarea 
              rows="3"
              placeholder="Any access codes, specific instructions for the driver..."
              className="w-full px-4 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Schedule Pickup'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PickupRequest;
