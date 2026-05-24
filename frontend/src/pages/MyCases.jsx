import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Filter, MapPin, 
  Image as ImageIcon, Clock, CheckCircle2, 
  ClipboardCheck, Truck, Camera, CheckCircle, XCircle 
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const MyCases = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/waste/myreports');
      setReports(data);
    } catch (error) {
      toast.error('Failed to load your cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getStatusProgress = (status) => {
    const levels = { pending: 1, assigned: 2, cleaned: 3, completed: 4 };
    return levels[status] || 0;
  };

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

  const filteredReports = (Array.isArray(reports) ? reports : []).filter(r =>
    (filterStatus === 'all' || r.status === filterStatus) &&
    (r.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Syncing with EcoSync Command...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-6">
        <div className="space-y-1">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase text-muted-foreground hover:text-primary tracking-widest transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-primary" /> My Reported Cases
          </h1>
          <p className="text-muted-foreground text-sm">Review, track, and monitor the progress of all reported incidents</p>
        </div>
        <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-xs uppercase tracking-widest border border-primary/20 self-start sm:self-center">
          {reports.length} Total Cases
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-4 rounded-2xl border border-border">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by waste type, location, description..."
            className="w-full pl-10 pr-4 py-2.5 bg-primary/5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-primary/5 border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none cursor-pointer text-foreground focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Vehicle Assigned</option>
            <option value="cleaned">Cleaned</option>
            <option value="completed">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      {filteredReports.length === 0 ? (
        <div className="glass p-16 rounded-[2.5rem] text-center border border-border flex flex-col items-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-6 border border-primary/10">
             <ClipboardCheck className="w-8 h-8 text-primary/40" />
          </div>
          <h3 className="text-foreground font-black text-xl mb-2 tracking-tight">No Cases Found</h3>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-6">
            No reported waste cases match your search query or selected status.
          </p>
          <Link to="/report-waste" className="px-6 py-2.5 bg-primary text-primary-foreground font-black rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all text-xs">
            Report New Case
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredReports.slice(0).reverse().map((report, idx) => {
              const accentColor = {
                pending: 'bg-yellow-500 shadow-[0_0_15px_#eab308]',
                assigned: 'bg-blue-500 shadow-[0_0_15px_#3b82f6]',
                cleaned: 'bg-indigo-500 shadow-[0_0_15px_#6366f1]',
                completed: 'bg-green-500 shadow-[0_0_15px_#22c55e]',
                rejected: 'bg-red-500 shadow-[0_0_15px_#ef4444]',
              }[report.status] || 'bg-primary';

              return (
                <m.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
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
                        "{report.description || 'No description provided.'}"
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
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MyCases;
