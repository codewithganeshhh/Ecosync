import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Lightbulb, RecycleIcon, BookOpen } from 'lucide-react';

const RecyclingInfo = () => {
  const guideCategories = [
    {
      title: 'Plastics',
      icon: <RecycleIcon className="text-blue-500 w-8 h-8" />,
      items: ['Water bottles', 'Milk jugs', 'Detergent containers'],
      tip: 'Rinse out containers to prevent contamination.',
      color: 'border-blue-500/20 bg-blue-500/5'
    },
    {
      title: 'Paper & Cardboard',
      icon: <BookOpen className="text-amber-600 w-8 h-8" />,
      items: ['Newspapers', 'Magazines', 'Corrugated cardboard (flattened)'],
      tip: 'Keep it dry. Wet or food-soiled paper cannot be recycled.',
      color: 'border-amber-600/20 bg-amber-600/5'
    },
    {
      title: 'Glass',
      icon: <Recycle className="text-emerald-500 w-8 h-8" />,
      items: ['Food jars', 'Beverage bottles'],
      tip: 'Labels can stay, but lids often need to be separated.',
      color: 'border-emerald-500/20 bg-emerald-500/5'
    },
    {
      title: 'Metals',
      icon: <Recycle className="text-zinc-500 w-8 h-8" />,
      items: ['Aluminum cans', 'Steel/tin cans', 'Clean foil'],
      tip: 'Crush cans to save space in your bin.',
      color: 'border-zinc-500/20 bg-zinc-500/5'
    }
  ];

  const facts = [
    "Recycling one ton of paper saves 17 trees, 7,000 gallons of water, and 4,000 kilowatts of electricity.",
    "A glass bottle can take up to 4,000 years to decompose in a landfill.",
    "Aluminum can be recycled infinitely without losing its quality.",
    "Only 9% of all plastic ever produced has been recycled."
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6"
        >
          <Leaf className="w-10 h-10 text-primary" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Recycling Knowledge Hub</h1>
        <p className="text-xl text-muted-foreground">Every small action counts. Learn how to sort waste properly and understand the impact of recycling on our environment.</p>
      </section>

      {/* Sorting Guide */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">How to Sort Common Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guideCategories.map((category, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`glass p-6 rounded-2xl border-t-4 ${category.color} hover:-translate-y-2 transition-transform duration-300`}
            >
              <div className="mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold mb-3">{category.title}</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
                {category.items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <div className="mt-auto p-3 bg-white/50 dark:bg-black/20 rounded-lg text-sm border border-border/50">
                <strong className="flex items-center gap-1 mb-1"><Lightbulb className="w-4 h-4 text-yellow-500" /> Pro Tip:</strong>
                {category.tip}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Facts */}
      <section className="glass rounded-3xl p-8 md:p-12 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Recycle className="text-primary w-8 h-8" /> Why It Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facts.map((fact, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-white/40 dark:hover:bg-black/20 transition-colors">
                <span className="text-4xl font-black text-primary/20 italic">{(idx + 1).toString().padStart(2, '0')}</span>
                <p className="text-lg font-medium leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecyclingInfo;
