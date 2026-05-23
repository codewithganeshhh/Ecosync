import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Trash2, AlertCircle, Eye, Users, 
  BarChart3, Truck, ClipboardList, Search, 
  Filter, CheckCircle2, XCircle, Clock, 
  ShieldCheck, MapPin, UserCheck, ExternalLink,
  ChevronRight, Camera, Activity
} from 'lucide-react';
import { motion as m } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-toastify';

const AREA_COORDINATES = {
  'sakchi': [22.8015, 86.2029],
  'mango': [22.8256, 86.2096],
  'azad basti': [22.8242, 86.2163],
  'dimna': [22.8398, 86.2302],
  'bistupur': [22.7981, 86.1772],
  'kadma': [22.7988, 86.1481],
  'sonari': [22.8124, 86.1558],
  'golmuri': [22.7978, 86.2209],
  'jugsalai': [22.7761, 86.1899],
  'telco': [22.7842, 86.2558],
  'baridih': [22.8094, 86.2483],
  'sidhgora': [22.8078, 86.2292],
  'adityapur': [22.7833, 86.1567]
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [reports, setReports] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [assigningTo, setAssigningTo] = useState(null);
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementType, setAnnouncementType] = useState('info');
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);

  const fetchData = async () => {
    try {
      const [reportsRes, pickupsRes, usersRes, statsRes, driversRes, activeAnnounceRes] = await Promise.all([
        api.get('/waste/all'),
        api.get('/pickup/all'),
        api.get('/user/all'),
        api.get('/stats/dashboard'),
        api.get('/user/drivers'),
        api.get('/announcements/active').catch(() => ({ data: null }))
      ]);
      setReports(reportsRes.data);
      setPickups(pickupsRes.data);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setDrivers(driversRes.data);
      setActiveAnnouncement(activeAnnounceRes.data);
    } catch (error) {
      toast.error('Failed to synchronize command center data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (window.L) {
      setMapLoaded(true);
      return;
    }
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(cssLink);

    const jsScript = document.createElement('script');
    jsScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    jsScript.onload = () => setMapLoaded(true);
    document.body.appendChild(jsScript);
  }, []);

  useEffect(() => {
    if (!mapLoaded || activeTab !== 'overview' || loading) return;

    const map = window.L.map('admin-map').setView([22.8046, 86.2029], 13);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    reports.forEach((report) => {
      let lat = null;
      let lng = null;

      if (report.reportingCoordinates && report.reportingCoordinates.lat && report.reportingCoordinates.lng) {
        lat = report.reportingCoordinates.lat;
        lng = report.reportingCoordinates.lng;
      } else if (report.location) {
        const locLower = report.location.toLowerCase();
        const matchedKey = Object.keys(AREA_COORDINATES).find(key => locLower.includes(key));
        if (matchedKey) {
          [lat, lng] = AREA_COORDINATES[matchedKey];
        }
      }

      if (lat && lng) {
        const colorMap = {
          'pending': '#ef4444',     // Red
          'assigned': '#3b82f6',    // Blue
          'cleaned': '#a855f7',     // Purple
          'completed': '#22c55e',   // Green
          'rejected': '#ef4444'     // Red
        };
        const color = colorMap[report.status] || '#ef4444';

        const icon = window.L.divIcon({
          html: `<div class="relative flex items-center justify-center" style="width: 20px; height: 20px;">
                   <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full opacity-75" style="background-color: ${color};"></span>
                   <span class="relative inline-flex rounded-full h-4 w-4 border-2 border-white shadow-md" style="background-color: ${color};"></span>
                 </div>`,
          className: 'bg-transparent border-transparent',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 150px;">
            <p style="margin: 0 0 5px; font-weight: bold; color: #10b981;">Case #${report._id.slice(-6).toUpperCase()}</p>
            <p style="margin: 0 0 5px;"><b>Type:</b> ${report.wasteType.toUpperCase()}</p>
            <p style="margin: 0 0 5px;"><b>Location:</b> ${report.location.split(',')[0]}</p>
            <p style="margin: 0; font-weight: bold; color: #6b7280;">Status: <span style="text-transform: uppercase;">${report.status}</span></p>
          </div>
        `;

        window.L.marker([lat, lng], { icon })
          .bindPopup(popupContent)
          .addTo(map);
      }
    });

    pickups.forEach((pickup) => {
      let lat = null;
      let lng = null;

      if (pickup.coordinates && pickup.coordinates.lat && pickup.coordinates.lng) {
        lat = pickup.coordinates.lat;
        lng = pickup.coordinates.lng;
      } else if (pickup.location) {
        const locLower = pickup.location.toLowerCase();
        const matchedKey = Object.keys(AREA_COORDINATES).find(key => locLower.includes(key));
        if (matchedKey) {
          [lat, lng] = AREA_COORDINATES[matchedKey];
        }
      }

      if (lat && lng) {
        const color = pickup.status === 'completed' ? '#22c55e' : '#eab308'; // Green or Yellow

        const icon = window.L.divIcon({
          html: `<div class="relative flex items-center justify-center" style="width: 20px; height: 20px;">
                   <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full opacity-75" style="background-color: ${color};"></span>
                   <span class="relative inline-flex rounded-full h-4 w-4 border-2 border-white shadow-md" style="background-color: ${color};"></span>
                 </div>`,
          className: 'bg-transparent border-transparent',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 150px;">
            <p style="margin: 0 0 5px; font-weight: bold; color: #eab308;">Pickup Request</p>
            <p style="margin: 0 0 5px;"><b>Citizen:</b> ${pickup.userId?.name || 'Unknown'}</p>
            <p style="margin: 0 0 5px;"><b>Date:</b> ${new Date(pickup.preferredDate).toLocaleDateString()}</p>
            <p style="margin: 0 0 5px;"><b>Location:</b> ${pickup.location.split(',')[0]}</p>
            <p style="margin: 0; font-weight: bold; color: #6b7280;">Status: <span style="text-transform: uppercase;">${pickup.status}</span></p>
          </div>
        `;

        window.L.marker([lat, lng], { icon })
          .bindPopup(popupContent)
          .addTo(map);
      }
    });

    return () => {
      map.remove();
    };
  }, [mapLoaded, activeTab, loading, reports, pickups]);

  const handleUpdateStatus = async (type, id, status) => {
    try {
      if (type === 'report') {
        await api.put(`/waste/${id}/status`, { status });
      } else {
        await api.put(`/pickup/${id}/status`, { status });
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} status updated`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAssignDriver = async (reportId, driverId) => {
    try {
      await api.put(`/waste/${reportId}/assign`, { driverId });
      toast.success('Assignment confirmed');
      setAssigningTo(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to assign cleanup crew');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    try {
      await api.delete(`/user/${id}`);
      toast.success('User removed from system');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementMessage.trim()) {
      toast.warn('Please type an announcement message');
      return;
    }
    try {
      const { data } = await api.post('/announcements', {
        message: announcementMessage,
        type: announcementType
      });
      toast.success('Broadcast announcement published');
      setActiveAnnouncement(data);
      setAnnouncementMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish announcement');
    }
  };

  const handleClearAnnouncement = async () => {
    try {
      await api.put('/announcements/clear');
      toast.success('Active announcement cleared');
      setActiveAnnouncement(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear announcement');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c * 1000).toFixed(0); // Distance in meters
  };

  const getLoadForDriver = (driverId) => {
    if (!stats || !stats.fleetLoad) return 0;
    const driver = stats.fleetLoad.find(f => f._id === driverId);
    return driver ? driver.activeTasks : 0;
  };

  const getMapLink = (location) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  const filteredReports = reports.filter(r => 
    (filterStatus === 'all' || r.status === filterStatus) &&
    (r.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
     r.wasteType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPickups = pickups.filter(p => 
    (filterStatus === 'all' || p.status === filterStatus) &&
    (p.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     p.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground font-medium animate-pulse">Initializing Command Center...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <ShieldCheck className="h-10 w-10 text-primary" /> Admin Command Center
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">System-wide monitoring and resource management</p>
        </div>
        <div className="flex items-center gap-3">
          <m.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={fetchData}
            className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4" /> Sync Data
          </m.button>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-primary/5 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'reports', label: 'Waste Reports', icon: ClipboardList },
          { id: 'verification', label: 'Pending Verification', icon: CheckCircle2 },
          { id: 'pickups', label: 'Pickups', icon: Truck },
          { id: 'fleet', label: 'Cleanup Fleet', icon: Truck },
          { id: 'users', label: 'User Management', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchQuery(''); setFilterStatus('all'); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <m.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8"
        >
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Citizens" value={stats.totalUsers} icon={Users} color="blue" />
              <StatCard label="Live Reports" value={stats.totalReports} icon={ClipboardList} color="orange" />
              <StatCard label="Pending Pickups" value={stats.pendingPickups} icon={Clock} color="yellow" />
              <StatCard label="Resolution Rate" value={`${Math.round((stats.completedReports / (stats.totalReports || 1)) * 100)}%`} icon={CheckCircle2} color="green" />
              
              {/* Live Dispatch Map */}
              <div className="lg:col-span-4 glass p-6 rounded-3xl border border-border space-y-4">
                 <h3 className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary animate-bounce" /> Live Dispatch Map (Jamshedpur)
                 </h3>
                 <div id="admin-map" className="w-full h-[400px] rounded-2xl overflow-hidden border border-border relative z-10" />
                 
                 {/* Map Legend */}
                 <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-border/40 text-xs font-bold">
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-zinc-900 shadow-sm flex-shrink-0 animate-pulse" />
                     <span className="text-muted-foreground">Pending Waste Report</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-zinc-900 shadow-sm flex-shrink-0 animate-pulse" />
                     <span className="text-muted-foreground">Crew Dispatched</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white dark:border-zinc-900 shadow-sm flex-shrink-0 animate-pulse" />
                     <span className="text-muted-foreground">Cleaned (Pending Review)</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900 shadow-sm flex-shrink-0 animate-pulse" />
                     <span className="text-muted-foreground">Completed Cleanup</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white dark:border-zinc-900 shadow-sm flex-shrink-0 animate-pulse" />
                     <span className="text-muted-foreground">Scheduled Pickup</span>
                   </div>
                 </div>
              </div>
              
              <div className="lg:col-span-3 glass p-8 rounded-3xl border border-border">
                <h3 className="text-xl font-bold mb-6">Waste Distribution</h3>
                <div className="flex flex-wrap gap-4">
                  {stats.wasteTypes.map((type) => (
                    <div key={type._id} className="flex-1 min-w-[150px] p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                      <p className="text-xs uppercase font-black text-muted-foreground tracking-widest">{type._id}</p>
                      <p className="text-2xl font-black text-primary mt-1">{type.count}</p>
                      <div className="w-full bg-primary/10 h-1.5 rounded-full mt-3 overflow-hidden">
                        <m.div 
                          initial={{ width: 0 }} animate={{ width: `${(type.count / stats.totalReports) * 100}%` }}
                          className="bg-primary h-full" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Audit Trail Side-Panel */}
              <div className="glass p-8 rounded-3xl border border-border space-y-6">
                 <h3 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" /> Audit Trail
                 </h3>
                 <div className="space-y-4">
                    {reports.slice(0, 5).map((report) => (
                      <div key={report._id} className="relative pl-6 pb-4 border-l border-border last:pb-0">
                         <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary/40" />
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">
                            {new Date(report.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                         <p className="text-xs font-bold leading-tight">
                            {report.status === 'assigned' ? 'Crew Dispatched' : 
                             report.status === 'cleaned' ? 'Cleanup Pending' : 
                             report.status === 'completed' ? 'Mission Verified' : 'New Report'}
                         </p>
                         <p className="text-[10px] text-muted-foreground italic truncate">Case #{report._id.slice(-6).toUpperCase()} - {report.location}</p>
                      </div>
                    ))}
                    {reports.length === 0 && (
                      <p className="text-xs text-muted-foreground italic text-center">No recent activity</p>
                    )}
                 </div>
              </div>

              <div className="glass p-8 rounded-3xl border border-border flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="w-10 h-10" />
                </div>
                <h3 className="font-bold">System Status</h3>
                <p className="text-xs text-muted-foreground mt-1">Operational & Secure</p>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-6 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                </div>
              </div>

              {/* Broadcast Center Widget */}
              <div className="lg:col-span-3 glass p-8 rounded-3xl border border-border flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-primary" /> City-Wide Broadcast Center
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6">Publish alerts or announcements that show up instantly for citizens & drivers.</p>

                  <form onSubmit={handlePublishAnnouncement} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Announcement Message</label>
                      <textarea
                        value={announcementMessage}
                        onChange={(e) => setAnnouncementMessage(e.target.value)}
                        placeholder="e.g., Weather Alert: Rain in Mango may delay afternoon pickup schedules"
                        rows={2}
                        className="w-full bg-primary/5 border border-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary/50 text-foreground resize-none"
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Alert Severity</label>
                        <select
                          value={announcementType}
                          onChange={(e) => setAnnouncementType(e.target.value)}
                          className="w-full bg-primary/5 border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none focus:border-primary/50 font-bold"
                        >
                          <option value="info" className="bg-background text-foreground font-semibold">Info (Blue Banner)</option>
                          <option value="warning" className="bg-background text-foreground font-semibold">Warning (Yellow Banner)</option>
                          <option value="alert" className="bg-background text-foreground font-semibold">Alert (Red Banner)</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-primary/20 transition-all"
                        >
                          Publish Alert
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {activeAnnouncement && (
                  <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${
                          activeAnnouncement.type === 'alert' ? 'bg-red-500' :
                          activeAnnouncement.type === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Active Broadcast ({activeAnnouncement.type})
                        </span>
                      </div>
                      <p className="text-xs font-semibold truncate text-foreground">{activeAnnouncement.message}</p>
                    </div>
                    <button
                      onClick={handleClearAnnouncement}
                      className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg font-black text-[10px] uppercase border border-red-500/20 hover:bg-red-500/20 transition-all flex-shrink-0"
                    >
                      Clear Broadcast
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VERIFICATION TAB */}
          {activeTab === 'verification' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {reports.filter(r => r.status === 'cleaned').map(report => (
                 <m.div key={report._id} layout className="glass p-6 rounded-3xl border border-border space-y-4">
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="font-bold text-lg">Case #{report._id.slice(-6).toUpperCase()}</h3>
                          <p className="text-sm text-muted-foreground">{report.location}</p>
                       </div>
                       <StatusBadge status="cleaned" />
                    </div>
                    
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase text-muted-foreground">Before (User)</p>
                           <div className="aspect-square rounded-2xl overflow-hidden border border-border relative group cursor-pointer" onClick={() => setViewImage(report.image)}>
                              <img src={report.image} alt="Before" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <Eye className="text-white" />
                              </div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase text-muted-foreground">After (Crew)</p>
                           <div className="aspect-square rounded-2xl overflow-hidden border-2 border-primary/30 relative group cursor-pointer" onClick={() => setViewImage(report.cleanedImage)}>
                              <img src={report.cleanedImage} alt="After" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <Eye className="text-white" />
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* GPS Accuracy Check */}
                     <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className={`w-3 h-3 rounded-full animate-pulse ${
                             calculateDistance(
                               report.reportingCoordinates?.lat, report.reportingCoordinates?.lng,
                               report.cleanupCoordinates?.lat, report.cleanupCoordinates?.lng
                             ) < 100 ? 'bg-green-500' : 'bg-red-500'
                           }`} />
                           <p className="text-xs font-bold">GPS Accuracy Check</p>
                        </div>
                        <div className="text-right">
                           <p className={`text-xs font-black uppercase ${
                             calculateDistance(
                               report.reportingCoordinates?.lat, report.reportingCoordinates?.lng,
                               report.cleanupCoordinates?.lat, report.cleanupCoordinates?.lng
                             ) < 100 ? 'text-green-500' : 'text-red-500'
                           }`}>
                             {calculateDistance(
                               report.reportingCoordinates?.lat, report.reportingCoordinates?.lng,
                               report.cleanupCoordinates?.lat, report.cleanupCoordinates?.lng
                             ) ? `${calculateDistance(
                               report.reportingCoordinates?.lat, report.reportingCoordinates?.lng,
                               report.cleanupCoordinates?.lat, report.cleanupCoordinates?.lng
                             )}m Variance` : 'No GPS Data'}
                           </p>
                           <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">
                             {calculateDistance(
                               report.reportingCoordinates?.lat, report.reportingCoordinates?.lng,
                               report.cleanupCoordinates?.lat, report.cleanupCoordinates?.lng
                             ) < 100 ? 'Location Verified' : 'Check Site Integrity'}
                           </p>
                        </div>
                     </div>

                    <div className="flex gap-3 pt-4">
                       <button 
                        onClick={() => handleUpdateStatus('report', report._id, 'completed')}
                        className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                       >
                          <CheckCircle2 className="w-4 h-4" /> Approve Cleanup
                       </button>
                       <button 
                        onClick={() => handleUpdateStatus('report', report._id, 'assigned')}
                        className="px-6 py-3 border border-red-500/30 text-red-500 rounded-xl font-bold hover:bg-red-500/5 transition-all"
                       >
                          Reject
                       </button>
                    </div>
                 </m.div>
               ))}
               {reports.filter(r => r.status === 'cleaned').length === 0 && (
                 <div className="col-span-full"><EmptyState label="No cleanup submissions awaiting verification" /></div>
               )}
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-4 rounded-2xl border border-border">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search reports..."
                    className="w-full pl-10 pr-4 py-2 bg-primary/5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-primary/5 border border-border rounded-xl px-4 py-2 text-sm font-bold outline-none cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending Assignment</option>
                      <option value="assigned">Assigned</option>
                      <option value="cleaned">Cleaning Done</option>
                      <option value="completed">Completed</option>
                    </select>
                </div>
              </div>

              <div className="overflow-x-auto glass rounded-2xl border border-border">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-primary/5 font-black text-xs uppercase tracking-tighter text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-5">User Profile</th>
                      <th className="p-5">Waste Details</th>
                      <th className="p-5">Location</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredReports.map((report) => (
                      <tr key={report._id} className="hover:bg-primary/5 transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {report.userId?.name?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{report.userId?.name || 'Anonymous'}</p>
                              <p className="text-xs text-muted-foreground">{report.userId?.email || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="text-sm font-bold capitalize px-3 py-1 bg-primary/10 text-primary rounded-full group-hover:scale-105 transition-transform inline-block">
                            {report.wasteType}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col gap-1 max-w-[200px]">
                            <div className="flex items-center gap-2 text-sm italic">
                              <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                              <span className="truncate">{report.location}</span>
                            </div>
                            <a 
                              href={getMapLink(report.location)} 
                              target="_blank" rel="noopener noreferrer"
                              className="text-[10px] text-primary hover:underline flex items-center gap-1 font-bold"
                            >
                              Open Map <ExternalLink className="w-2 h-2" />
                            </a>
                          </div>
                        </td>
                        <td className="p-5">
                          <StatusBadge status={report.status} />
                        </td>
                        <td className="p-5 text-right flex justify-end gap-2 items-center">
                          {report.image && (
                            <button onClick={() => setViewImage(report.image)} className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-all" title="View Evidence">
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          {report.status !== 'completed' && report.status !== 'rejected' && (
                            <button 
                              onClick={() => setAssigningTo(report)}
                              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold shadow-md hover:shadow-primary/20 transition-all flex items-center gap-1"
                              title="Assign Driver"
                            >
                              <Truck className="w-3 h-3" /> Assign
                            </button>
                          )}

                          <select 
                            value={report.status}
                            onChange={(e) => handleUpdateStatus('report', report._id, e.target.value)}
                            className="text-xs border border-border bg-white dark:bg-black rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-primary outline-none cursor-pointer font-bold"
                          >
                            {['pending', 'assigned', 'cleaned', 'completed', 'rejected'].map(s => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PICKUPS TAB */}
          {activeTab === 'pickups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPickups.map(pickup => (
                <m.div key={pickup._id} layout className="glass p-6 rounded-3xl border border-border shadow-xl hover:shadow-primary/5 transition-all group">
                   <div className="flex justify-between items-center mb-5">
                      <StatusBadge status={pickup.status} />
                      <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                        {new Date(pickup.preferredDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary transform group-hover:rotate-6 transition-transform">
                        {pickup.userId?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-bold">{pickup.userId?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{pickup.userId?.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6 bg-primary/5 p-4 rounded-2xl border border-border/50">
                      <div className="flex gap-2 text-sm font-medium italic">
                        <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="truncate">{pickup.location}</p>
                      </div>
                      {pickup.notes && <p className="text-xs text-muted-foreground pl-6 line-clamp-2">"{pickup.notes}"</p>}
                    </div>

                    <select 
                      value={pickup.status}
                      onChange={(e) => handleUpdateStatus('pickup', pickup._id, e.target.value)}
                      className="w-full text-sm border border-border bg-white dark:bg-black rounded-xl px-4 py-2 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approve</option>
                      <option value="completed">Complete</option>
                      <option value="rejected">Reject</option>
                    </select>
                </m.div>
              ))}
            </div>
          )}
          
          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto glass rounded-2xl border border-border">
              <table className="w-full text-left border-collapse">
                <thead className="bg-primary/5 font-black text-xs uppercase tracking-tighter text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-5">User</th>
                    <th className="p-5">Account Type</th>
                    <th className="p-5">Joined On</th>
                    <th className="p-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-primary/5 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {u.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          u.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 
                          u.role === 'driver' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {u.role === 'driver' ? 'Cleanup Crew' : u.role}
                        </span>
                      </td>
                      <td className="p-5 text-sm font-medium text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={u.role === 'admin'}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* FLEET MANAGEMENT TAB */}
          {activeTab === 'fleet' && (
            <div className="space-y-8">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                     <h2 className="text-3xl font-black tracking-tight">Cleanup Fleet</h2>
                     <p className="text-muted-foreground font-medium italic">Active Vehicle Riders & Field Personnel</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-xs uppercase tracking-widest border border-primary/20">
                       {drivers.length} Units Online
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drivers.map(driver => (
                    <m.div 
                      whileHover={{ y: -5 }}
                      key={driver._id} 
                      className="glass p-6 rounded-3xl border border-border space-y-4 hover:border-primary/30 transition-all"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl overflow-hidden border border-primary/10">
                             {driver.profilePhoto ? <img src={driver.profilePhoto} className="w-full h-full object-cover" /> : driver.name[0]}
                          </div>
                          <div>
                             <h3 className="font-bold text-lg leading-none mb-1">{driver.name}</h3>
                             <p className="text-xs text-muted-foreground font-mono">{driver.email}</p>
                          </div>
                       </div>
                       <div className="space-y-2 border-t border-border pt-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                             <MapPin className="w-3 h-3 text-red-500" /> {driver.location || 'Location Not Set'}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-green-500">
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Verified Cleanup Unit
                          </div>
                       </div>
                    </m.div>
                  ))}
                  {drivers.length === 0 && (
                    <div className="lg:col-span-3">
                       <EmptyState label="No drivers found. Promote users to 'driver' role to see them here." />
                    </div>
                  )}
               </div>
            </div>
          )}
        </m.div>
      </AnimatePresence>

      {/* Driver Assignment Modal */}
      <AnimatePresence>
        {assigningTo && (
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
             <m.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-black">Assign Cleanup Crew</h2>
                   <button onClick={() => setAssigningTo(null)} className="p-2 hover:bg-primary/10 rounded-full"><XCircle /></button>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {drivers.map(driver => (
                      <button 
                       key={driver._id} 
                       onClick={() => handleAssignDriver(assigningTo._id, driver._id)}
                       className="w-full text-left p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/40 hover:bg-primary/10 transition-all flex items-center gap-4 group"
                      >
                         <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center font-black text-primary group-hover:scale-110 transition-transform relative">
                            {driver.name[0]}
                            {getLoadForDriver(driver._id) > 0 && (
                              <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-lg">
                                 {getLoadForDriver(driver._id)}
                              </span>
                            )}
                         </div>
                         <div className="flex-1">
                            <p className="font-bold">{driver.name}</p>
                            <div className="flex items-center gap-2">
                               <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none">
                                  Current Load: <span className={getLoadForDriver(driver._id) > 2 ? 'text-red-500 font-bold' : 'text-primary'}>
                                     {getLoadForDriver(driver._id)} Active Missions
                                  </span>
                               </p>
                            </div>
                         </div>
                         <ChevronRight className="w-5 h-5 text-primary/30 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                   {drivers.length === 0 && (
                     <div className="p-8 text-center bg-red-500/5 rounded-2xl border border-red-500/10">
                        <AlertCircle className="w-10 h-10 text-red-500/50 mx-auto mb-2" />
                        <p className="text-sm font-bold text-red-500">No active cleanup crews found.</p>
                        <p className="text-xs text-muted-foreground mt-1">Please promote a user to 'driver' role first.</p>
                     </div>
                   )}
                </div>
             </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {viewImage && (
          <m.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setViewImage(null)}
          >
            <m.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
              <img src={viewImage} alt="Fullscreen View" className="w-full h-auto max-h-[85vh] object-contain rounded-3xl shadow-2xl border-4 border-white/10" />
              <button onClick={() => setViewImage(null)} className="absolute -top-12 right-0 text-white font-bold flex items-center gap-2">Close <XCircle /></button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Components */

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorMap = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  };

  return (
    <m.div whileHover={{ y: -5 }} className="glass p-6 rounded-3xl border border-border">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </m.div>
  );
};

const StatusBadge = ({ status }) => {
  const configs = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    assigned: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    cleaned: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${configs[status] || configs.pending}`}>
      {status}
    </span>
  );
};

const EmptyState = ({ label }) => (
  <div className="p-20 text-center space-y-4">
    <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
      <ClipboardList className="w-10 h-10 text-primary/20" />
    </div>
    <p className="text-muted-foreground font-medium">{label}</p>
  </div>
);

export default AdminDashboard;

