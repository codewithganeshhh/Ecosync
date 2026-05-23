import React from 'react';
import { motion } from 'framer-motion';
import { Building2, TreeDeciduous, Factory, Landmark } from 'lucide-react';
import jsr1 from '../assets/jsr1.png';
import jsr2 from '../assets/jsr3.png';
import jsr3 from '../assets/jamshespur.png';
import jntata from '../assets/jntata.png';

const Legacy = () => {
  return (
    <div className="min-h-screen pt-16 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl mx-auto mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 mb-6">
          <Landmark className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Pride of Jharkhand</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground tracking-tight">
          The Legacy of Jamshedpur
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          India's first planned industrial city, Jamshedpur (Tatanagar), is a shining example of how deep industrialization can perfectly co-exist with lush greenery and civic discipline.
        </p>
      </motion.div>

      {/* History Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-24 flex flex-col lg:flex-row items-center gap-12 glass p-8 md:p-12 rounded-[3rem] border border-border/50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10"></div>
        <div className="lg:w-1/3 flex justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-[2rem] overflow-hidden shadow-2xl relative border-4 border-white/20 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
             <img 
               src={jntata} 
               alt="Jamsetji Nusserwanji Tata" 
               className="w-full h-full object-cover filter contrast-125 sepia-[0.2]"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
             <p className="absolute bottom-4 left-4 text-white font-bold tracking-wider text-sm">FOUNDER</p>
          </div>
        </div>
        <div className="lg:w-2/3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6 border border-primary/20">
            <span className="text-sm font-bold text-primary">A Visionary's Dream</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-foreground tracking-tight leading-tight">
            From Sakchi to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Jamshedpur</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Before it became India's steel capital, this region was a quiet, unassuming village known as <strong>Sakchi</strong>. The transformation began with the grand vision of Jamsetji Nusserwanji Tata, who dreamt of a planned industrial city that prioritized both its workforce and the environment.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            In 1919, following the conclusion of World War I, Lord Chelmsford officially renamed the city to <strong>Jamshedpur</strong> to honor Jamsetji Tata's monumental contribution to the nation's industrial rise. Today, his legacy of civic excellence and green urbanization continues to thrive, setting a benchmark for cities worldwide.
          </p>
        </div>
      </motion.section>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[2rem] border border-border/50 relative overflow-hidden group flex flex-col"
        >
          <div className="w-full h-56 relative overflow-hidden">
            <img src={jsr1} alt="The Steel City" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <Building2 className="absolute bottom-4 left-6 w-10 h-10 text-primary drop-shadow-md" />
          </div>
          <div className="p-8 flex-1">
            <h3 className="text-2xl font-bold mb-3 text-foreground">The Steel City</h3>
            <p className="text-muted-foreground leading-relaxed">
              Founded by Jamsetji Tata, it houses Tata Steel, one of the top steel manufacturing companies globally. It represents the backbone of India's early industrial boom.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass rounded-[2rem] border border-border/50 relative overflow-hidden group flex flex-col"
        >
          <div className="w-full h-56 relative overflow-hidden">
            <img src={jsr2} alt="A Green Blueprint" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <TreeDeciduous className="absolute bottom-4 left-6 w-10 h-10 text-green-500 drop-shadow-md" />
          </div>
          <div className="p-8 flex-1">
            <h3 className="text-2xl font-bold mb-3 text-foreground">A Green Blueprint</h3>
            <p className="text-muted-foreground leading-relaxed">
              Unlike typical industrial towns, Jamshedpur is famous for its vast parks, Jubilee Park, and tree-lined avenues, maintaining exceptional air quality and biodiversity.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="glass rounded-[2rem] border border-border/50 relative overflow-hidden group flex flex-col md:col-span-2 lg:col-span-1"
        >
          <div className="w-full h-56 relative overflow-hidden">
            <img src={jsr3} alt="Civic Excellence" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <Factory className="absolute bottom-4 left-6 w-10 h-10 text-blue-500 drop-shadow-md" />
          </div>
          <div className="p-8 flex-1">
            <h3 className="text-2xl font-bold mb-3 text-foreground">Civic Excellence</h3>
            <p className="text-muted-foreground leading-relaxed">
              Managed historically by JUSCO (now Tata Steel Utilities), the city boasts uninterrupted power, clean water, and one of the finest municipal management systems in the country.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Vision Statement */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-primary/5 border border-primary/20 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden"
      >
        <div className="absolute left-1/2 -top-24 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10"></div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Our Responsibility Today</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          The legacy of Jamshedpur was built on the foundation of forward-thinking and community care. 
          Through <span className="font-bold text-foreground">Jamshedpur EcoSync</span>, we are stepping up to digitize and protect this beautiful city. 
          By combining active citizen participation with modern technology, we ensure that the Steel City remains India's cleanest and greenest urban center for generations to come.
        </p>
      </motion.div>
      
    </div>
  );
};

export default Legacy;
