import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award, Recycle, Activity } from 'lucide-react';

const ImpactStats = ({ reportsCount, pickupsCount }) => {
  const stats = [
    {
      label: 'Eco Points',
      value: (reportsCount * 50) + (pickupsCount * 100),
      icon: Award,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      description: 'Earned from your actions'
    },
    {
      label: 'CO2 Offset',
      value: `${(reportsCount * 0.5).toFixed(1)}kg`,
      icon: Leaf,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      description: 'Estimated carbon saved'
    },
    {
      label: 'Submissions',
      value: reportsCount,
      icon: Recycle,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      description: 'Total waste reports'
    },
    {
      label: 'Cleanliness Rank',
      value: reportsCount > 5 ? 'Elite' : reportsCount > 0 ? 'Active' : 'Newbie',
      icon: Activity,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      description: 'Community standing'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass p-5 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-wider">{stat.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ImpactStats;
