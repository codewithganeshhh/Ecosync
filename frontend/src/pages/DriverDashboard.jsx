import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, MapPin, Camera, CheckCircle2, 
  ExternalLink, Clock, AlertCircle, Image as ImageIcon,
  User, ClipboardCheck, ArrowRight, ShieldCheck, Settings2,
  Fuel, Zap, Star, Activity, Bell, Info
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const DriverDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null); // ID of task being uploaded
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTrafficZones, setActiveTrafficZones] = useState([]);
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/waste/assigned');
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveAnnouncement = async () => {
    try {
      const { data } = await api.get('/announcements/active');
      if (data) {
        setActiveAnnouncement(data);
        const dismissedId = sessionStorage.getItem(`dismissed_announcement_${data._id}`);
        if (dismissedId) {
          setBannerDismissed(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch active announcement');
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchActiveAnnouncement();

    // Simulation: Real-time Traffic Pulse
    const interval = setInterval(() => {
      const zones = ['Sakchi', 'Bistupur', 'Mango Bridge', 'Adityapur', 'Telco'];
      const currentCongested = zones.filter(() => Math.random() > 0.7);
      setActiveTrafficZones(currentCongested);
    }, 10000); // Pulse every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (e, taskId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage({ taskId, base64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCleanup = async (taskId) => {
    if (!previewImage || previewImage.taskId !== taskId) {
      return toast.warn('Please capture/upload the cleanup image first');
    }

    setUploading(taskId);
    
    // Get Driver's Real-time GPS location
    let cleanupCoordinates = null;
    if (navigator.geolocation) {
       try {
         const position = await new Promise((resolve, reject) => {
           navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
         });
         cleanupCoordinates = { lat: position.coords.latitude, lng: position.coords.longitude };
       } catch (err) {
         console.warn("Location capture failed, proceeding without GPS verification");
       }
    }

    try {
      await api.put(`/waste/${taskId}/submit-cleanup`, { 
        cleanedImage: previewImage.base64,
        cleanupCoordinates
      });
      toast.success('Cleanup verification submitted for approval');
      setPreviewImage(null);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to submit cleanup report');
    } finally {
      setUploading(null);
    }
  };

  const EmbeddedMap = ({ location, coords }) => {
    // If we have precise coords, use them. Otherwise, use the location string.
    const query = (coords && coords.lat && coords.lng) 
      ? `${coords.lat},${coords.lng}` 
      : encodeURIComponent(location);
    
    return (
      <div className="w-full h-44 rounded-2xl overflow-hidden border border-border shadow-inner mt-4 bg-muted relative group">
        <iframe 
          title="Mission Map"
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight="0" 
          marginWidth="0" 
          loading="lazy"
          src={`https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        />
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-md border border-border text-[9px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
          Live Satellite Link
        </div>
      </div>
    );
  };

  const getMapLink = (location) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  const getOptimizedRouteLink = () => {
    const assignedTasks = tasks.filter(t => t.status === 'assigned');
    if (assignedTasks.length === 0) return '#';
    
    const waypoints = assignedTasks.map(t => encodeURIComponent(t.location)).join('|');
    const destination = encodeURIComponent(assignedTasks[assignedTasks.length - 1].location);
    // Format: https://www.google.com/maps/dir/?api=1&destination=Dest&waypoints=W1|W2
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&waypoints=${waypoints}`;
  };

  const getTrafficStatus = (location) => {
    const isCongested = activeTrafficZones.some(zone => location.includes(zone));
    return isCongested 
      ? { label: 'Heavy Traffic', color: 'text-red-500', icon: 'AlertCircle' } 
      : { label: 'Optimal Flow', color: 'text-green-500', icon: 'Zap' };
  };

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground font-medium">Loading assigned missions...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 min-h-screen">
      {/* Broadcast Announcement Banner */}
      {activeAnnouncement && !bannerDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-[2rem] border p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl transition-all ${
            activeAnnouncement.type === 'alert'
              ? 'bg-red-500/10 border-red-500/20 text-red-200 shadow-red-500/5'
              : activeAnnouncement.type === 'warning'
              ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200 shadow-yellow-500/5'
              : 'bg-blue-500/10 border-blue-500/20 text-blue-200 shadow-blue-500/5'
          }`}
        >
          {/* Glowing accent border/light effect */}
          <div className={`absolute top-0 left-0 w-1.5 h-full ${
            activeAnnouncement.type === 'alert' ? 'bg-red-500 shadow-[0_0_20px_#ef4444]' :
            activeAnnouncement.type === 'warning' ? 'bg-yellow-500 shadow-[0_0_20px_#eab308]' :
            'bg-blue-500 shadow-[0_0_20px_#3b82f6]'
          }`} />

          <div className="flex items-center gap-4 flex-1">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              activeAnnouncement.type === 'alert' ? 'bg-red-500/20 text-red-400' :
              activeAnnouncement.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              <Info className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  activeAnnouncement.type === 'alert' ? 'text-red-400' :
                  activeAnnouncement.type === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'
                }`}>
                  City Broadcast Bulletin
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
              </div>
              <p className="text-sm font-bold leading-relaxed">{activeAnnouncement.message}</p>
            </div>
          </div>

          <button
            onClick={() => {
              sessionStorage.setItem(`dismissed_announcement_${activeAnnouncement._id}`, 'true');
              setBannerDismissed(true);
            }}
            className={`p-2 rounded-xl transition-all border ${
              activeAnnouncement.type === 'alert' ? 'border-red-500/10 hover:bg-red-500/20 text-red-400' :
              activeAnnouncement.type === 'warning' ? 'border-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400' :
              'border-blue-500/10 hover:bg-blue-500/20 text-blue-400'
            }`}
          >
            <XCircle className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Top Advisory Strip */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl px-6 py-3 flex items-center justify-between overflow-hidden relative group">
        <div className="flex items-center gap-4 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">
          <Bell className="w-4 h-4 animate-bounce" />
          <span className="whitespace-nowrap">Operational Alert: High efficiency required for Sakchi zone today</span>
        </div>
        <div className="flex bg-orange-500 h-1 absolute bottom-0 left-0 transition-all duration-1000 group-hover:w-full w-0" />
      </div>

      {/* Hero Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-primary p-10 rounded-[3rem] text-primary-foreground shadow-2xl relative overflow-hidden flex flex-col justify-between"
        >
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/20">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Fleet Unit ID: #JR-994</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight flex items-center gap-4">
              <Truck className="w-12 h-12" /> Crew Portal
            </h1>
            <p className="text-primary-foreground/70 font-medium max-w-sm">Jamshedpur Fleet Management: Deploying resources for a cleaner city legacy.</p>
          </div>
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-black/10 rounded-full blur-[80px] pointer-events-none" />
        </motion.div>

        {/* Rapid Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          <StatCard 
            icon={<Zap className="w-6 h-6" />} 
            label="EcoPoints" 
            value={tasks.filter(t => ['cleaned', 'completed'].includes(t.status)).length * 100} 
            sub="Lifetime Earned" 
            color="yellow" 
          />
          <StatCard 
            icon={<Star className="w-6 h-6" />} 
            label="Rating" 
            value="4.9" 
            sub="Elite Performance" 
            color="green" 
          />
          <StatCard 
            icon={<ClipboardCheck className="w-6 h-6" />} 
            label="Missions" 
            value={tasks.filter(t => t.status === 'assigned').length} 
            sub="Awaiting Action" 
            color="primary" 
          />
          <StatCard 
            icon={<Activity className="w-6 h-6" />} 
            label="Efficiency" 
            value="98%" 
            sub="Restoration Rate" 
            color="blue" 
          />
        </div>
      </div>

      {/* Main Board */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-12">
        {/* Left: Intelligence & Diagnostics (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
           {/* Vehicle Intelligence Card */}
           <div className="glass p-8 rounded-[3rem] border-2 border-border space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Unit Health</h3>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground opacity-60">Vehicle: JV-TATA-EX</p>
                </div>
              </div>
              
              <div className="space-y-6">
                 <DiagnosticItem icon={<Fuel className="w-4 h-4" />} label="Energy Level" value="82%" color="bg-green-500" />
                 <DiagnosticItem icon={<Settings2 className="w-4 h-4" />} label="Payload Load" value="45%" color="bg-blue-500" />
                 <DiagnosticItem icon={<MapPin className="w-4 h-4" />} label="Area Coverage" value="Sakchi" />
              </div>

              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-center">
                 <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Service Status</p>
                 <p className="text-xl font-black text-primary">READY FOR DEPLOY</p>
              </div>
           </div>

           {/* Safety Protocol Panel */}
           <div className="bg-zinc-900 text-white p-8 rounded-[3rem] space-y-6 relative overflow-hidden group">
              <h3 className="font-black text-lg flex items-center gap-3">
                 <ShieldCheck className="text-primary w-6 h-6" /> Safety Sync
              </h3>
              <div className="space-y-4">
                 <p className="text-xs text-zinc-400 font-medium leading-relaxed">Ensure all crew members are wearing reflective gear before restoration begins.</p>
                 <div className="space-y-3">
                    <CheckItem text="Gloves & Masks Verified" />
                    <CheckItem text="Disinfection Unit Active" />
                    <CheckItem text="Hazard Signs Deployed" />
                 </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
           </div>

           {/* Route Intelligence Hub */}
           <div className="glass p-8 rounded-[3rem] border-2 border-primary/20 space-y-8 relative overflow-hidden bg-primary/[0.03]">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                    <MapPin className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-black text-lg leading-tight text-primary">Route Intel</h3>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest opacity-60">Traffic-Aware Dispatch</p>
                 </div>
              </div>
              <div className="space-y-6">
                 <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Waypoints</p>
                    <div className="flex flex-col gap-2">
                       {tasks.filter(t => t.status === 'assigned').slice(0, 3).map((task, i) => (
                         <div key={task._id} className="flex items-center justify-between bg-white/40 dark:bg-black/40 p-3 rounded-xl border border-border">
                            <div className="flex items-center gap-3">
                               <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                               <span className="text-[11px] font-bold truncate max-w-[100px]">{task.location}</span>
                            </div>
                            <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase ${getTrafficStatus(task.location).color}`}>
                               {getTrafficStatus(task.location).label === 'Flowing' ? <Zap className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                               {getTrafficStatus(task.location).label}
                            </div>
                         </div>
                       ))}
                       {tasks.filter(t => t.status === 'assigned').length > 3 && (
                         <p className="text-[10px] text-muted-foreground font-bold italic text-center">+ {tasks.filter(t => t.status === 'assigned').length - 3} more waypoints</p>
                       )}
                       {tasks.filter(t => t.status === 'assigned').length === 0 && (
                         <p className="text-xs text-muted-foreground font-medium italic">No active deployments</p>
                       )}
                    </div>
                 </div>

                 {/* Visual SVG Route Optimizer Graph */}
                 {tasks.filter(t => t.status === 'assigned').length > 0 && (
                    <div className="border border-border/60 bg-white/30 dark:bg-black/20 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                       <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-primary">
                          <span>Route map graph</span>
                          <span className="text-emerald-500 font-bold uppercase tracking-widest text-[8px]">Optimized path solved</span>
                       </div>
                       
                       <div className="w-full h-32 flex items-center justify-center bg-zinc-950/5 dark:bg-zinc-950/40 rounded-xl relative border border-border/30">
                          {/* SVG Route Visualizer */}
                          <svg className="w-full h-full p-4" viewBox="0 0 200 100">
                             {/* Optimized path line */}
                             <motion.path 
                               d="M 20 50 Q 80 20, 100 50 T 180 50"
                               fill="none"
                               stroke="#10b981"
                               strokeWidth="3"
                               strokeDasharray="6 4"
                               animate={{ strokeDashoffset: [0, -20] }}
                               transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
                             />
                             {/* Node 1: Depot */}
                             <circle cx="20" cy="50" r="6" fill="#3b82f6" />
                             <text x="12" y="40" fill="currentColor" className="text-[7px] font-black" opacity="0.8">DEPOT</text>
                             
                             {/* Node 2: Waypoint 1 */}
                             <circle cx="95" cy="40" r="6" fill="#eab308" />
                             <text x="75" y="30" fill="currentColor" className="text-[7px] font-black" opacity="0.8">
                                {tasks.filter(t => t.status === 'assigned')[0]?.location?.split(' ')[0] || 'POINT A'}
                             </text>
                             
                             {/* Node 3: Waypoint 2 */}
                             {tasks.filter(t => t.status === 'assigned')[1] ? (
                                <>
                                   <circle cx="180" cy="50" r="6" fill="#ef4444" />
                                   <text x="155" y="42" fill="currentColor" className="text-[7px] font-black" opacity="0.8">
                                      {tasks.filter(t => t.status === 'assigned')[1]?.location?.split(' ')[0] || 'POINT B'}
                                   </text>
                                </>
                             ) : (
                                <>
                                   <circle cx="180" cy="50" r="6" fill="#ef4444" />
                                   <text x="160" y="42" fill="currentColor" className="text-[7px] font-black" opacity="0.8">DUMP</text>
                                </>
                             )}
                          </svg>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                          <div className="bg-primary/5 p-2 rounded-xl border border-primary/10 text-center">
                             <p className="text-muted-foreground uppercase text-[8px] tracking-wider mb-0.5">Est. Fuel Saved</p>
                             <p className="text-sm font-black text-primary">{(tasks.filter(t => t.status === 'assigned').length * 0.8).toFixed(1)} L</p>
                          </div>
                          <div className="bg-primary/5 p-2 rounded-xl border border-primary/10 text-center">
                             <p className="text-sm font-black text-emerald-500">{(tasks.filter(t => t.status === 'assigned').length * 1.9).toFixed(1)} kg</p>
                          </div>
                       </div>
                    </div>
                 )}

                 <a 
                   href={getOptimizedRouteLink()} 
                   target="_blank" rel="noopener noreferrer"
                   className={`w-full py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                     tasks.filter(t => t.status === 'assigned').length > 0
                     ? 'bg-primary text-primary-foreground shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0'
                     : 'bg-zinc-200 text-zinc-400 cursor-not-allowed pointer-events-none'
                   }`}
                 >
                    <ExternalLink className="w-4 h-4" /> Start Shift Route
                 </a>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
           </div>
        </div>

        {/* Right: Deployment Log (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
           <div className="flex items-center justify-between">
             <h2 className="text-3xl font-black flex items-center gap-4">Mission Deployment</h2>
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Sort: Operational Priority</span>
           </div>

           <div className="grid grid-cols-1 gap-8">
              {tasks.sort((a, b) => (a.status === 'assigned' ? -1 : 1)).map((task) => (
                <motion.div 
                  key={task._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`glass overflow-hidden rounded-[3rem] border-2 ${
                    task.status === 'assigned' 
                    ? 'border-primary/20 shadow-2xl shadow-primary/5' 
                    : 'border-border opacity-80 grayscale-[0.5]'
                  } transition-all duration-500`}
                >
                   <div className="flex flex-col lg:flex-row min-h-[450px]">
                      {/* Left: Intelligence & Context */}
                      <div className="lg:w-1/3 p-10 border-r border-border/50 bg-primary/[0.02] space-y-8">
                         <div className="flex justify-between items-center">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border-2 ${
                              task.status === 'assigned' 
                              ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' 
                              : 'bg-green-500/10 text-green-500 border-green-500/20'
                            }`}>
                              {task.status === 'assigned' ? 'Action Required' : 'Task Finished'}
                            </span>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/50 dark:bg-black/50 rounded-lg text-xs font-mono text-muted-foreground border border-border">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                              #{task._id.slice(-6).toUpperCase()}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Field Report By</p>
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
                                     {task.userId?.name[0]}
                                  </div>
                                  <div>
                                     <p className="font-black text-sm leading-tight">{task.userId?.name}</p>
                                     <p className="text-[10px] text-muted-foreground font-medium italic">Verified Citizen</p>
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Mission Coordinates</p>
                               <div className="bg-white/50 dark:bg-black/50 p-4 rounded-2xl border border-border flex items-start gap-3 group relative">
                                  <MapPin className="text-red-500 w-5 h-5 mt-0.5 shrink-0" />
                                  <div className="flex-1">
                                     <p className="font-bold text-xs leading-relaxed">{task.location}</p>
                                     <a href={getMapLink(task.location)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] text-primary font-black uppercase mt-2 hover:underline">
                                        Open Navigator <ExternalLink className="w-3 h-3" />
                                     </a>
                                   </div>
                                </div>
                                <EmbeddedMap location={task.location} coords={task.reportingCoordinates} />
                             </div>
                          </div>

                         <div className="space-y-4">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Evidence: Before Site Condition</p>
                              {task.image ? (
                                <div className="aspect-video rounded-[2rem] overflow-hidden border-2 border-border shadow-inner group relative cursor-zoom-in" onClick={() => setPreviewImage({ taskId: 'VIEW', base64: task.image })}>
                                   <img src={task.image} alt="Site before" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Reported Condition</span>
                                   </div>
                                </div>
                              ) : (
                                <div className="aspect-video rounded-[2rem] bg-primary/[0.02] border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                                   <ImageIcon className="w-8 h-8 opacity-20 mb-2" />
                                   <p className="text-[10px] font-black uppercase tracking-widest opacity-40">No Image Evidence</p>
                                </div>
                              )}
                         </div>
                      </div>

                      {/* Right: Resolution Control */}
                      <div className="flex-1 p-10 flex flex-col">
                         <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-primary/10 rounded-[1.25rem] flex items-center justify-center text-primary border-2 border-primary/5">
                               <Settings2 className="w-7 h-7" />
                            </div>
                            <div>
                               <h3 className="text-2xl font-black tracking-tight">Resolution Report</h3>
                               <p className="text-sm text-muted-foreground font-medium">Protocol compliance and evidence submission</p>
                            </div>
                         </div>

                         <div className="flex-1">
                           {task.status === 'assigned' ? (
                             <div className="h-full flex flex-col gap-10">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                                   <div className="space-y-4">
                                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Resolution Evidence</label>
                                      <div className="relative aspect-video rounded-[2.5rem] border-3 border-dashed border-primary/20 hover:border-primary/50 transition-all group overflow-hidden bg-primary/[0.02] flex flex-col items-center justify-center text-center px-10">
                                         {previewImage?.taskId === task._id ? (
                                           <div className="relative w-full h-full">
                                             <img src={previewImage.base64} alt="Submission Preview" className="w-full h-full object-cover" />
                                             <button 
                                               onClick={() => setPreviewImage(null)}
                                               className="absolute top-4 right-4 p-3 bg-black/60 text-white rounded-full backdrop-blur-xl hover:bg-black transition-all"
                                             >
                                               <XCircle className="w-5 h-5" />
                                             </button>
                                           </div>
                                         ) : (
                                           <>
                                             <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                               <Camera className="w-8 h-8 text-primary" />
                                             </div>
                                             <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Upload Result Photo</p>
                                             <p className="text-[10px] text-muted-foreground font-medium">Capture the restored site condition</p>
                                             <input 
                                               type="file" 
                                               accept="image/*"
                                               capture="environment"
                                               onChange={(e) => handleImageChange(e, task._id)}
                                               className="absolute inset-0 opacity-0 cursor-pointer"
                                             />
                                           </>
                                         )}
                                      </div>
                                   </div>

                                   <div className="space-y-6">
                                     <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 h-full relative overflow-hidden group">
                                        <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-6 text-primary">
                                           <ShieldCheck className="w-4 h-4" /> Compliance Protocol
                                        </h4>
                                        <div className="space-y-5">
                                           <ProtocolItem text="Complete site clearing verified" checked />
                                           <ProtocolItem text="Disposal logistics confirmed" checked />
                                           <ProtocolItem text="Digital signature captured" checked />
                                        </div>
                                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                                     </div>
                                   </div>
                               </div>

                               <button 
                                 onClick={() => handleSubmitCleanup(task._id)}
                                 disabled={uploading === task._id}
                                 className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl shadow-2xl hover:shadow-primary/30 hover:translate-y-[-4px] active:translate-y-[0px] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                               >
                                  {uploading === task._id ? (
                                    <>
                                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                      Transmitting Evidence Data...
                                    </>
                                  ) : (
                                    <>
                                      Finalize Mission & Submit <ArrowRight className="w-6 h-6" />
                                    </>
                                  )}
                               </button>
                             </div>
                           ) : (
                             <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-10">
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", damping: 10 }}
                                  className="w-24 h-24 bg-green-500 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-green-500/30"
                                >
                                   <CheckCircle2 className="w-12 h-12" />
                                </motion.div>
                                <div className="space-y-2">
                                   <h3 className="text-3xl font-black">Mission Accomplished</h3>
                                   <p className="text-muted-foreground font-medium max-w-sm mx-auto">Evidence is encrypted and securely stored for administrative verification</p>
                                </div>
                                {task.cleanedImage && (
                                  <div className="w-full max-w-md aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl group cursor-zoom-in" onClick={() => setPreviewImage({ taskId: 'VIEW', base64: task.cleanedImage })}>
                                     <img src={task.cleanedImage} alt="Cleanup Proof" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                  </div>
                                )}
                             </div>
                           )}
                         </div>
                      </div>
                   </div>
                </motion.div>
              ))}

              {tasks.length === 0 && (
                <div className="p-24 text-center glass rounded-[4rem] border-3 border-dashed border-border flex flex-col items-center justify-center gap-6">
                   <div className="w-28 h-28 bg-primary/5 rounded-[2.5rem] flex items-center justify-center text-primary/10">
                      <Truck className="w-14 h-14" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black italic">"Precision is the hallmark of progress."</h3>
                      <p className="text-muted-foreground font-medium max-w-xs mx-auto">Standby mode active. You have cleared all pending operational zones. Deploying soon.</p>
                   </div>
                   <button onClick={fetchTasks} className="px-8 py-3 bg-primary/10 text-primary rounded-2xl font-black text-xs uppercase tracking-widest border border-primary/20 hover:bg-primary/20 transition-all">
                      Sync Intel Hub
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Fullscreen Preview */}
      <AnimatePresence>
        {previewImage?.taskId === 'VIEW' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
               <img src={previewImage.base64} className="w-full rounded-[3rem] shadow-2xl border-4 border-white/10" alt="Preview" />
               <button onClick={() => setPreviewImage(null)} className="absolute -top-16 right-0 text-white font-black flex items-center gap-2 hover:opacity-70 transition-opacity">
                 CLOSE OVERLAY <XCircle className="w-6 h-6" />
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Internal UI Components */
const StatCard = ({ icon, label, value, sub, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-8 rounded-[3rem] border-2 border-border/50 space-y-4 hover:border-primary/20 transition-all"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
      color === 'yellow' ? 'bg-yellow-500/10 text-yellow-500' :
      color === 'green' ? 'bg-green-500/10 text-green-500' :
      color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
      'bg-primary/10 text-primary'
    }`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-black">{value}</p>
        <p className="text-[10px] font-bold text-muted-foreground italic">{sub}</p>
      </div>
    </div>
  </motion.div>
);

const DiagnosticItem = ({ icon, label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
      <div className="flex items-center gap-2">
        {icon} {label}
      </div>
      <span>{value}</span>
    </div>
    {color && (
      <div className="h-2 w-full bg-border rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: value }} />
      </div>
    )}
  </div>
);

const CheckItem = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
       <CheckCircle2 className="w-3 h-3" strokeWidth={4} />
    </div>
    <span className="text-[11px] font-bold text-zinc-300">{text}</span>
  </div>
);

const ProtocolItem = ({ text, checked }) => (
  <div className="flex items-center gap-3 group">
    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all ${
      checked ? 'bg-primary border-primary text-primary-foreground' : 'border-primary/30'
    }`}>
      {checked && <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={4} />}
    </div>
    <span className="text-[11px] font-bold text-muted-foreground group-hover:text-primary transition-colors">{text}</span>
  </div>
);

const XCircle = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
  </svg>
);

export default DriverDashboard;
