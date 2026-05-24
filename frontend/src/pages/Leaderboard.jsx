import React, { useState, useEffect, useContext } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Gift, Award, Sparkles, CheckCircle2, 
  ArrowRight, Lock, Ticket, ShieldCheck, MapPin, RefreshCw, X
} from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const REWARDS_STORE = [
  {
    id: 'eco_bag',
    name: 'Mango Area Eco-bag',
    description: 'Durable, cotton grocery bag to replace single-use plastics.',
    cost: 40,
    icon: 'bag'
  },
  {
    id: 'straw_kit',
    name: 'Steel Straw & Brush Kit',
    description: 'Set of 2 stainless steel straws with cleaner brush in canvas pouch.',
    cost: 60,
    icon: 'straw'
  },
  {
    id: 'discount_100',
    name: 'JNAC Partner Discount Coupon',
    description: 'Rs. 100 voucher off at participating local grocery partners.',
    cost: 80,
    icon: 'coupon'
  },
  {
    id: 'jusco_bottle',
    name: 'JUSCO Steel Water Bottle',
    description: 'Premium vacuum insulated double-wall flask (750ml).',
    cost: 100,
    icon: 'bottle'
  },
  {
    id: 'plant_tree',
    name: 'Plant a Tree in Golmuri',
    description: 'Collaborate with JUSCO to plant a native sapling in your name.',
    cost: 150,
    icon: 'tree'
  }
];

const Leaderboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [activeTab, setActiveTab] = useState('store'); // 'store' or 'history'
  const [showVoucherModal, setShowVoucherModal] = useState(null); // Will hold redeemed voucher info

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/user/leaderboard');
      setLeaderboard(data);
    } catch (error) {
      toast.error('Failed to retrieve leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRedeem = async (reward) => {
    if (!user) return toast.error('Please log in to redeem rewards.');
    if ((user.points || 0) < reward.cost) {
      return toast.error(`Insufficient points. You need ${reward.cost - (user.points || 0)} more EcoPoints!`);
    }

    if (!window.confirm(`Are you sure you want to redeem ${reward.name} for ${reward.cost} EcoPoints?`)) return;

    setRedeeming(reward.id);
    try {
      const { data } = await api.post('/user/redeem', {
        rewardId: reward.id,
        name: reward.name,
        cost: reward.cost
      });

      // Update auth context state for user points & history
      updateUser({
        points: data.points,
        rewardsRedeemed: data.rewardsRedeemed
      });

      setShowVoucherModal({
        name: reward.name,
        cost: reward.cost,
        code: data.rewardsRedeemed[data.rewardsRedeemed.length - 1].code
      });

      toast.success(`Successfully redeemed ${reward.name}!`);
      fetchData(); // Refresh leaderboard if ranking changes
    } catch (error) {
      toast.error(error.response?.data?.message || 'Redemption failed');
    } finally {
      setRedeeming(null);
    }
  };

  // Helper to render reward icons
  const renderRewardIcon = (type) => {
    const classStr = "w-6 h-6 text-primary";
    switch (type) {
      case 'bag': return <Gift className={classStr} />;
      case 'straw': return <Award className={classStr} />;
      case 'coupon': return <Ticket className={classStr} />;
      case 'bottle': return <Sparkles className={classStr} />;
      case 'tree': return <Award className={classStr} />;
      default: return <Gift className={classStr} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 min-h-screen">
      {/* Title Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Trophy className="h-10 w-10 text-yellow-500 animate-bounce" /> City Eco Leaderboard & Rewards
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Help keep Jamshedpur green, earn EcoPoints, and redeem premium local rewards.</p>
        </div>
        <button 
          onClick={fetchData} 
          disabled={loading} 
          className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold hover:bg-primary/20 transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Rankings
        </button>
      </section>

      <div className={user ? "grid grid-cols-1 lg:grid-cols-12 gap-10" : "max-w-3xl mx-auto"}>
        {/* Left: Leaderboard rankings */}
        <div className={user ? "lg:col-span-5 space-y-6" : "w-full space-y-6"}>
          <div className="glass p-6 rounded-[2rem] border border-border shadow-2xl space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <Trophy className="text-yellow-500" /> Steel City Guardians
            </h2>
            <p className="text-xs text-muted-foreground">Top resident environmental contributors in Jamshedpur based on verified cleanups reported.</p>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-muted-foreground font-semibold">Tallying point balances...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((member, index) => {
                  const isTop3 = index < 3;
                  const medalColors = [
                    'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-yellow-500/20 shadow-md', // Gold
                    'bg-gradient-to-r from-zinc-300 to-zinc-400 text-black shadow-zinc-400/20 shadow-md', // Silver
                    'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-amber-700/20 shadow-md' // Bronze
                  ];
                  
                  return (
                    <m.div 
                      key={member._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        member._id === user?._id 
                          ? 'bg-primary/10 border-primary/40 shadow-inner' 
                          : 'bg-white/40 dark:bg-black/20 border-border/60 hover:border-primary/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                          isTop3 ? medalColors[index] : 'bg-primary/5 text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black text-sm shrink-0">
                          {member.profilePhoto ? (
                            <img src={member.profilePhoto} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            member.name.charAt(0)
                          )}
                        </div>

                        {/* User Details */}
                        <div className="min-w-0">
                          <p className="font-extrabold text-sm truncate flex items-center gap-1.5">
                            {member.name}
                            {member._id === user?._id && (
                              <span className="text-[9px] font-black uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 rounded-full">YOU</span>
                            )}
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-500" /> {member.location ? member.location.split(',')[0] : 'Jamshedpur'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-base font-black text-primary">{member.points} pts</p>
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground opacity-60">
                          {member.badges?.[member.badges.length - 1] || 'Eco Starter'}
                        </p>
                      </div>
                    </m.div>
                  );
                })}

                {leaderboard.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6 italic">No active contributors yet.</p>
                )}
              </div>
            )}
          </div>

          {!user && (
            <div className="bg-gradient-to-r from-primary/10 via-emerald-500/5 to-transparent border border-primary/20 p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-foreground flex items-center justify-center sm:justify-start gap-2">
                  <Lock className="w-4 h-4 text-primary" /> Unlock Rewards & EcoPoints Tracking
                </h3>
                <p className="text-xs text-muted-foreground font-medium max-w-md">
                  Log in to track your personal EcoPoints, earn badges, and redeem points for premium Jamshedpur green merchandise!
                </p>
              </div>
              <Link 
                to="/login" 
                className="px-6 py-3 bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:opacity-90 transition-all shrink-0"
              >
                Log In for Full Access
              </Link>
            </div>
          )}
        </div>

        {/* Right: Eco-Rewards Store (7 cols) */}
        {user && (
          <div className="lg:col-span-7 space-y-6">
          {/* User Scorecard Banner */}
          <m.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 text-white rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="relative z-10 space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full border border-primary/30">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Eco Account Status</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight">Your Point Balance</h2>
              <p className="text-zinc-400 text-xs font-medium max-w-sm">Redeem points for local green merchandise. Deductions will not lower your historical ranking.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center shrink-0 bg-white/5 border border-white/10 p-6 rounded-3xl min-w-[160px] shadow-2xl">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">ECOPOINTS</p>
              <p className="text-5xl font-black text-primary animate-pulse my-1">{user?.points || 0}</p>
              <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-1">
                🏆 Rank: {user?.badges?.[user.badges.length - 1] || 'Eco Starter'}
              </p>
            </div>

            <div className="absolute -left-16 -bottom-16 w-60 h-60 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          </m.div>

          {/* Store Tabs */}
          <div className="flex gap-4 border-b border-border pb-2">
            <button 
              onClick={() => setActiveTab('store')}
              className={`pb-2 text-sm font-black uppercase tracking-wider relative ${
                activeTab === 'store' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Available Rewards
              {activeTab === 'store' && <m.div layoutId="rewards-tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`pb-2 text-sm font-black uppercase tracking-wider relative ${
                activeTab === 'history' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              My Claim Codes ({user?.rewardsRedeemed?.length || 0})
              {activeTab === 'history' && <m.div layoutId="rewards-tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'store' ? (
              <m.div 
                key="store-pane"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {REWARDS_STORE.map((reward) => {
                  const points = user?.points || 0;
                  const canAfford = points >= reward.cost;
                  
                  return (
                    <m.div 
                      whileHover={{ y: -4 }}
                      key={reward.id} 
                      className={`glass p-6 rounded-[2rem] border flex flex-col justify-between h-64 transition-all ${
                        canAfford 
                          ? 'border-border/60 hover:border-primary/30 shadow-lg hover:shadow-2xl' 
                          : 'border-border/30 opacity-70'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                            {renderRewardIcon(reward.icon)}
                          </div>
                          <span className="text-sm font-black bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                            {reward.cost} pts
                          </span>
                        </div>
                        <div>
                          <h3 className="font-extrabold text-lg text-foreground capitalize leading-snug">{reward.name}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-medium">{reward.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford || redeeming === reward.id}
                        className={`w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                          canAfford 
                            ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-md'
                            : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        {redeeming === reward.id ? (
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        ) : canAfford ? (
                          <>Redeem Reward <ArrowRight className="w-4 h-4" /></>
                        ) : (
                          <><Lock className="w-3.5 h-3.5" /> Need {reward.cost - points} more pts</>
                        )}
                      </button>
                    </m.div>
                  );
                })}
              </m.div>
            ) : (
              <m.div 
                key="history-pane"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {!user?.rewardsRedeemed || user.rewardsRedeemed.length === 0 ? (
                  <div className="glass p-12 text-center rounded-[2rem] border border-border/50">
                    <Ticket className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground font-semibold">No rewards redeemed yet.</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Complete reports, get driver resolution, and accumulate points to redeem vouchers!</p>
                  </div>
                ) : (
                  [...user.rewardsRedeemed].reverse().map((item, idx) => (
                    <m.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={item._id || idx}
                      className="glass p-5 rounded-2xl border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl border border-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                          <Ticket className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm">{item.name}</h3>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">
                            Redeemed on {new Date(item.redeemedAt).toLocaleDateString()} for {item.cost} points
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center sm:items-end gap-1.5 w-full sm:w-auto">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider opacity-60">CLAIM CODE</span>
                        <div className="px-4 py-2 bg-white dark:bg-black/50 border border-primary/20 rounded-xl font-mono text-xs font-black text-primary tracking-widest shadow-sm select-all">
                          {item.code}
                        </div>
                      </div>
                    </m.div>
                  ))
                )}
              </m.div>
            )}
          </AnimatePresence>
        </div>
        )}
      </div>

      {/* Voucher Modal */}
      <AnimatePresence>
        {showVoucherModal && (
          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <m.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background max-w-md w-full rounded-[2.5rem] p-8 border border-border shadow-2xl relative space-y-6"
            >
              <button 
                onClick={() => setShowVoucherModal(null)}
                className="absolute top-4 right-4 p-2 hover:bg-primary/10 rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4 pt-4">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Redemption Confirmed!</h3>
                  <p className="text-xs text-muted-foreground mt-1">Here is your claim code for your local reward.</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-primary/30 p-6 rounded-2xl text-center space-y-3 bg-primary/[0.02]">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{showVoucherModal.name}</p>
                <div className="font-mono text-xl font-black text-primary tracking-widest select-all bg-white dark:bg-black/50 border border-primary/10 py-3 rounded-xl">
                  {showVoucherModal.code}
                </div>
                <p className="text-[9px] text-muted-foreground/80 font-medium">Show this code at JNAC offices or participating merchants to collect your reward.</p>
              </div>

              <button 
                onClick={() => setShowVoucherModal(null)}
                className="w-full py-4 bg-primary text-primary-foreground font-black rounded-xl hover:opacity-90 transition-all text-xs uppercase tracking-wider"
              >
                Done
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaderboard;
