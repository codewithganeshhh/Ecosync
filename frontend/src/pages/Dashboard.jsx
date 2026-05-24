import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import { 
  PlusCircle, Clock, CheckCircle, XCircle, MapPin, 
  TrendingUp, Info, Leaf, Recycle, Sun, Cloud, 
  Droplets, Thermometer, Wind, Truck, Camera,
  ClipboardCheck, Image as ImageIcon, ArrowRight, CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import ImpactStats from '../components/ImpactStats';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [showAllCases, setShowAllCases] = useState(false);

  // Removed mandatory redirect to allow user to access dashboard first

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, pickupsRes, announceRes] = await Promise.all([
          api.get('/waste/myreports'),
          api.get('/pickup/mypickups'),
          api.get('/announcements/active').catch(() => ({ data: null }))
        ]);
        setReports(reportsRes.data);
        setPickups(pickupsRes.data);
        if (announceRes.data) {
          setActiveAnnouncement(announceRes.data);
          const dismissedId = sessionStorage.getItem(`dismissed_announcement_${announceRes.data._id}`);
          if (dismissedId) {
            setBannerDismissed(true);
          }
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://wttr.in/Jamshedpur?format=j1');
        const data = await res.json();
        setWeather({
          temp: data.current_condition[0].temp_C,
          desc: data.current_condition[0].weatherDesc[0].value,
          humidity: data.current_condition[0].humidity,
          wind: data.current_condition[0].windspeedKmph
        });
      } catch (err) {
        console.error('Weather fetch failed');
      }
    };

    fetchData();
    fetchWeather();
  }, []);

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500', icon: Clock, label: 'Pending' },
      assigned: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500', icon: Truck, label: 'Vehicle Assigned' },
      cleaned: { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500', icon: Camera, label: 'Cleaned - Awaiting Verification' },
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500', icon: CheckCircle, label: 'Resolved' },
      rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500', icon: XCircle, label: 'Rejected' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit border border-transparent ${config.color}`}>
        <Icon className="w-3 h-3" /> {config.label}
      </span>
    );
  };

  const getStatusProgress = (status) => {
    const levels = { pending: 1, assigned: 2, cleaned: 3, completed: 4 };
    return levels[status] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium">Syncing with EcoSync Command...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Broadcast Announcement Banner */}
      {activeAnnouncement && !bannerDismissed && (
        <m.div
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
        </m.div>
      )}

      {/* Personalized Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 flex items-center gap-6">
          {/* Profile Photo */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl border-4 border-primary/20 overflow-hidden shadow-2xl glass transform group-hover:rotate-3 transition-transform">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-3xl">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div>
             <h1 className="text-4xl font-black tracking-tight mb-1">
              Hey, <span className="text-primary">{user?.name?.split(' ')[0] || 'Citizen'}</span>!
            </h1>
            <div className="flex items-center gap-3 text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-80">
              <MapPin className="w-4 h-4 text-red-500" />
              {user?.location || 'Base Location Not Set'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/report-waste" className="px-8 py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
            <PlusCircle className="w-5 h-5" /> Report Waste
          </Link>
          <Link to="/pickup-request" className="px-8 py-4 glass font-black rounded-2xl hover:bg-white/50 transition-all flex items-center gap-3 border border-border">
            <Clock className="w-5 h-5 opacity-60" /> Schedule Pickup
          </Link>
        </div>
      </section>

      {/* Stats Overview */}
      <ImpactStats reportsCount={reports.length} pickupsCount={pickups.length} />

      {/* Hero Mission Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Promo Banner */}
        <m.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex-1 bg-zinc-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group border border-white/10"
        >
           <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full border border-primary/30">
                 <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary">Operational Mission</span>
              </div>
              <h2 className="text-3xl font-black leading-tight tracking-tight">Join the<br /><span className="text-primary font-serif italic capitalize">Cleanup Crew</span></h2>
              <p className="text-zinc-400 text-sm max-w-xs font-medium">Equip your vehicle and help us transform Steel City into a cleaner, greener home.</p>
              <Link to="/profile-setup" className="inline-flex items-center gap-2 font-black text-sm group/btn bg-white text-black px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20">
                 Become a Rider <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
           </div>
           <Truck className="absolute -right-10 -bottom-10 w-64 h-64 text-white/[0.03] -rotate-12 group-hover:rotate-0 transition-all duration-700" />
        </m.div>

        {/* Sidebar Stats Brief */}
        <div className="md:w-72 space-y-4">
           <div className="glass p-8 rounded-[2.5rem] border border-border flex flex-col justify-center h-full text-center md:text-left shadow-2xl shadow-primary/5">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                 <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Solved Cases</p>
              </div>
              <p className="text-4xl font-black">428</p>
              <p className="text-[10px] text-muted-foreground mt-2 font-medium italic opacity-60 uppercase tracking-widest">Global Resolution Rate</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Weather & Goal Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* City Goal */}
            <m.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[2rem] border border-primary/10 relative overflow-hidden flex flex-col justify-between h-full min-h-[180px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                   <TrendingUp className="text-primary w-5 h-5" />
                </div>
                <h2 className="text-lg font-black uppercase tracking-tight">Eco Progress</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Community Goal</span>
                  <span className="text-primary">82% Achieved</span>
                </div>
                <div className="w-full bg-primary/10 rounded-full h-3 overflow-hidden border border-primary/5">
                  <m.div 
                    initial={{ width: 0 }}
                    animate={{ width: '82%' }}
                    className="bg-primary h-full rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
                  />
                </div>
              </div>
            </m.section>

            {/* Weather Widget */}
            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-[2rem] border border-primary/10 flex items-center justify-between h-full min-h-[180px]"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary shadow-inner">
                  {weather?.desc?.toLowerCase().includes('sun') ? <Sun className="w-10 h-10" /> : <Cloud className="w-10 h-10" />}
                </div>
                <div className="space-y-1">
                   <div className="flex items-center gap-1">
                     <span className="text-4xl font-black">{weather ? `${weather.temp}°` : '--°'}</span>
                     <span className="text-xl font-bold opacity-30">C</span>
                   </div>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                     {weather?.desc || 'Fetching...'}
                   </p>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Humidity</p>
                <p className="text-lg font-black">{weather?.humidity}%</p>
              </div>
            </m.div>
          </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
               <ClipboardCheck className="text-primary" /> Active Deployments
             </h2>
             {Array.isArray(reports) && reports.length > 0 && (
               <Link 
                 to="/my-cases" 
                 className="text-xs font-black uppercase text-primary hover:underline tracking-widest cursor-pointer"
               >
                 See All Cases
               </Link>
             )}
          </div>
          
          {reports.length === 0 ? (
            <m.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-16 rounded-[2.5rem] text-center border-2 border-dashed border-border/50 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                 <Leaf className="w-10 h-10 text-primary/20" />
              </div>
              <h3 className="text-foreground font-black text-2xl mb-2 tracking-tight">Clean Area Detected</h3>
              <p className="text-muted-foreground font-medium text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                No active waste reports found nearby. Start your eco-contribution by reporting local waste sites for professional cleanup.
              </p>
              <Link to="/report-waste" className="px-8 py-3 bg-primary/10 text-primary font-black rounded-xl hover:bg-primary hover:text-white transition-all">
                Create First Report
              </Link>
            </m.div>
          ) : (
            <div className="max-h-[550px] overflow-y-auto pr-3 space-y-6 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {((Array.isArray(reports) ? reports : []).slice(-3).reverse()).map((report, idx) => {
                const accentColor = {
                  pending: 'bg-yellow-500 shadow-[0_0_15px_#eab308]',
                  assigned: 'bg-blue-500 shadow-[0_0_15px_#3b82f6]',
                  cleaned: 'bg-indigo-500 shadow-[0_0_15px_#6366f1]',
                  completed: 'bg-green-500 shadow-[0_0_15px_#22c55e]',
                  rejected: 'bg-red-500 shadow-[0_0_15px_#ef4444]',
                }[report.status] || 'bg-primary';

                return (
                  <m.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={report._id} 
                    className="glass p-6 md:p-8 rounded-[2rem] border border-border group hover:border-primary/25 transition-all overflow-hidden relative shadow-lg hover:shadow-2xl hover:shadow-primary/[0.02] flex flex-col gap-6"
                  >
                    {/* Glowing Left Accent border */}
                    <div className={`absolute left-0 top-0 w-1.5 h-full ${accentColor}`} />

                    <div className="flex flex-col md:flex-row gap-6 items-start w-full">
                      {/* Visual Proof */}
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border border-border shrink-0 bg-primary/5 shadow-inner relative">
                        {report.image ? (
                          <img src={report.image} alt="Site" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary/20">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Report Data */}
                      <div className="flex-grow space-y-3 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="font-extrabold text-xl capitalize leading-tight text-foreground">{report.wasteType} Clearance</h3>
                            <div className="flex items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-red-500 mr-1 shrink-0" /> {report.location}
                            </div>
                          </div>
                          <StatusBadge status={report.status} />
                        </div>

                        <p className="text-muted-foreground text-sm font-medium line-clamp-2 italic border-l-2 border-primary/20 pl-3 py-0.5 leading-relaxed">
                          "{report.description}"
                        </p>
                      </div>
                    </div>

                    {/* Stepper Timeline */}
                    <div className="border-t border-border/40 pt-6">
                      <div className="relative max-w-xl mx-auto px-4">
                        {/* Connecting Line background */}
                        <div className="absolute top-[12px] left-[32px] right-[32px] h-[2px] bg-border dark:bg-zinc-800" />
                        {/* Connecting Line progress */}
                        <div 
                          className="absolute top-[12px] left-[32px] h-[2px] bg-primary transition-all duration-500" 
                          style={{ width: `${Math.max(0, Math.min(100, (getStatusProgress(report.status) - 1) * 33.33))}%` }}
                        />
                        
                        <div className="relative flex justify-between items-center">
                          {['Reported', 'Assigned', 'Cleaned', 'Verified'].map((step, i) => {
                            const isCompleted = getStatusProgress(report.status) > i;
                            const isActive = getStatusProgress(report.status) === i + 1;
                            return (
                              <div key={step} className="flex flex-col items-center gap-1.5 z-10">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                  isCompleted 
                                    ? 'bg-primary border-primary text-primary-foreground scale-105 shadow-md shadow-primary/10' 
                                    : isActive 
                                    ? 'bg-background border-primary text-primary font-bold animate-pulse'
                                    : 'bg-background border-border text-muted-foreground'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground stroke-[3px]" />
                                  ) : (
                                    <span className="text-[10px] font-black">{i + 1}</span>
                                  )}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${
                                  isCompleted || isActive ? 'text-foreground' : 'text-muted-foreground opacity-50'
                                }`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {(report.status === 'cleaned' || report.status === 'completed') && (
                      <div className="border-t border-border/40 pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-wider text-green-500 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 fill-green-500/10" /> Mission Success: Site Restored
                          </h4>
                          {report.status === 'completed' ? (
                            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                              Verified by JNAC
                            </span>
                          ) : (
                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 animate-pulse">
                              Verification Pending
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="relative rounded-2xl overflow-hidden border border-border group/img h-44 bg-zinc-950">
                            <img src={report.image} alt="Before Cleanup" className="w-full h-full object-cover opacity-80 group-hover/img:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-[9px] text-white px-2.5 py-1 rounded-lg font-black uppercase tracking-wider border border-white/10">
                              Before Cleanup
                            </span>
                          </div>
                          <div className="relative rounded-2xl overflow-hidden border-2 border-green-500/30 group/img h-44 bg-zinc-950 shadow-lg shadow-green-500/5">
                            <img src={report.cleanedImage} alt="After Cleanup" className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-green-950/40 via-transparent to-transparent" />
                            <span className="absolute bottom-3 left-3 bg-green-600 text-[9px] text-white px-2.5 py-1 rounded-lg font-black uppercase tracking-wider shadow-md">
                              After (Crew Proof)
                            </span>
                          </div>
                        </div>

                        <div className="bg-green-500/[0.02] dark:bg-green-500/[0.01] p-4 rounded-2xl border border-green-500/10 text-center relative overflow-hidden">
                          <div className="absolute -left-4 -top-4 w-12 h-12 bg-green-500/5 rounded-full blur-xl" />
                          <p className="text-xs font-semibold text-muted-foreground leading-relaxed italic relative z-10">
                            "Your contribution has successfully removed a hazard from the community. Together, we are building a greener legacy."
                          </p>
                        </div>
                      </div>
                    )}
                  </m.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Pickups Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Scheduled Pickups</h2>
          {pickups.length === 0 ? (
            <div className="glass p-8 rounded-xl text-center flex flex-col items-center">
              <p className="text-muted-foreground mb-4">No pickups scheduled yet.</p>
              <Link to="/pickup-request" className="text-primary hover:underline">Schedule a pickup</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {pickups.slice(0).reverse().map((pickup, idx) => (
                <m.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={pickup._id} 
                  className="glass p-5 rounded-xl hover:shadow-lg transition-shadow border-l-4 border-l-primary border border-border/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">Scheduled Pickup</h3>
                    <StatusBadge status={pickup.status} />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">
                    Preferred Date: {new Date(pickup.preferredDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground gap-1 mb-2">
                    <MapPin className="w-4 h-4" /> {pickup.location}
                  </div>
                  {pickup.notes && <p className="text-sm text-muted-foreground italic mb-2">"{pickup.notes}"</p>}
                  
                  <div className="text-xs text-muted-foreground/60 mt-3 pt-3 border-t border-border/50">
                    Requested on {new Date(pickup.createdAt).toLocaleDateString()}
                  </div>
                </m.div>
              ))}
            </div>
          )}
        </section>
        </div>

        {/* Sidebar (Right column) */}
        <div className="lg:col-span-4 space-y-8">
          <section className="glass p-6 rounded-2xl border border-border/50">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 underline underline-offset-8 decoration-primary/30">
              <Leaf className="text-primary w-5 h-5" /> Steel City Tips
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Separate at Source', desc: 'Keep wet and dry waste in separate bins as per JUSCO guidelines.' },
                { title: 'Plastic-Free Mango', desc: 'Single-use plastic is banned in Mango area. Switch to cloth bags.' },
                { title: 'Composting at Home', desc: 'Start a small compost bin for kitchen waste to reduce landfill load.' },
                { title: 'JNAC E-Waste', desc: 'Drop off old electronics at designated JNAC centers for safe recycling.' }
              ].map((tip, i) => (
                <div key={i} className="group cursor-default">
                  <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-primary">
              <Info className="w-4 h-4" /> Need Help?
            </h3>
            <p className="text-xs text-muted-foreground">
              For immediate assistance with large-scale waste removal, contact the JUSCO helpline or visit our <strong>Contact</strong> page.
            </p>
            <Link to="/contact" className="block text-center text-xs font-bold text-primary hover:underline">
              Contact Support
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
