import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MapPin, Check, Loader2, Truck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const ProfileSetup = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [location, setLocation] = useState(user?.location || '');
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const getRealTimeLocation = () => {
    setFetchingLocation(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setFetchingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding using OpenStreetMap (Nominatim)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          setLocation(address);
          toast.success('Location fetched successfully!');
        } catch (error) {
          setLocation(`${latitude}, ${longitude}`);
          toast.warning('Found coordinates but failed to fetch address name.');
        } finally {
          setFetchingLocation(false);
        }
      },
      (error) => {
        toast.error('Failed to get location. Please check permissions.');
        setFetchingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      toast.error('Please enter your location');
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('location', location);
      
      if (photoFile) {
        payload.append('profilePhoto', photoFile);
      } else if (user?.profilePhoto) {
        // Just send back the existing URL if no new file is uploaded
        payload.append('profilePhoto', user.profilePhoto);
      }

      const { data } = await api.put('/user/update', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Update the context state directly — no page reload needed
      updateUser({ profilePhoto: data.profilePhoto, location: data.location });
      toast.success('Profile completed! Welcome to EcoSync.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 w-full max-w-xl rounded-3xl border border-primary/20 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Complete Your Profile</h2>
          <p className="text-muted-foreground italic">Let's make it official, {user?.name}!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-dashed border-primary/30 flex items-center justify-center overflow-hidden bg-white/50 relative">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-primary/40" />
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xs font-bold">Change</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              {photoPreview && <Check className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 w-6 h-6 border-2 border-white" />}
            </div>
            <p className="text-sm font-medium text-muted-foreground">Upload a profile photo <span className="text-xs opacity-60">(optional)</span></p>
          </div>

          {/* Location Section */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">
              Your Primary Location
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Click the button to fetch location..."
                className="w-full px-4 py-3 bg-white/40 border border-border rounded-xl focus:ring-2 focus:ring-primary/30 outline-none transition-all pr-12 text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={getRealTimeLocation}
                disabled={fetchingLocation}
                className="absolute right-2 top-1.5 p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                title="Get Real-time Location"
              >
                {fetchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground pl-1">
              * This helps us identify your area for waste collection priority in Jamshedpur.
            </p>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="translate-x-0 group-hover:translate-x-1 transition-transform">Finalize Profile</span>
                <Check className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;

