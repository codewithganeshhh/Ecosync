import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, ShieldCheck, Recycle, MapPin, CheckCircle, BarChart3, Users, Globe2, Sparkles, HelpCircle, ChevronDown } from 'lucide-react';
import jamshedpurImage from '../assets/jamshedpur.png';

// Dynamic Count-Up Counter Component
const Counter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalDuration = 1200; // 1.2 seconds duration
    let increment = Math.ceil(end / (totalDuration / 16));
    
    let timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const Home = () => {
  // Eco-Calculator States
  const [plastic, setPlastic] = useState(25);
  const [organic, setOrganic] = useState(50);

  // Dynamic calculations
  const co2Saved = (plastic * 1.5 + organic * 0.8).toFixed(1);
  const treesSaved = (plastic * 0.05 + organic * 0.02).toFixed(1);
  const energySaved = (plastic * 5.8 + organic * 0.3).toFixed(1); // kWh

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: "Geo-Tagged Reporting",
      description: "Instantly report waste with precise location data, enabling our crews to find and resolve issues faster than ever before."
    },
    {
      icon: <Recycle className="w-6 h-6 text-green-500" />,
      title: "Smart Pickups",
      description: "Schedule recurring or one-time collections. Our intelligent routing system ensures minimal carbon footprint during transit."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
      title: "Transparent Tracking",
      description: "Monitor the lifecycle of your requests. From pending to completed, track our collective environmental impact in real-time."
    }
  ];

  const stats = [
    { label: "Reports Resolved", value: 12450, suffix: "+" },
    { label: "Active Citizens", value: 8900, suffix: "+" },
    { label: "Tons Recycled", value: 450, suffix: "T" },
    { label: "Partner Facilities", value: 24, suffix: "" }
  ];

  const faqs = [
    {
      q: "How do I report neglected waste in my neighborhood?",
      a: "Simply sign up, go to your dashboard, and click 'Report Waste'. You can upload a photo (which automatically processes via our secure system), tag your precise location, and send it directly to local drivers!"
    },
    {
      q: "What is Jamshedpur EcoSync's response time?",
      a: "Most geo-tagged reports are verified by admins and dispatched to municipal drivers within 2-4 hours. You will receive real-time updates as soon as a driver clears the location."
    },
    {
      q: "Is the smart pickup service free for all citizens?",
      a: "Yes! Jamshedpur EcoSync is a community-driven initiative partnered with local utilities to make civic hygiene easy, accessible, and completely free."
    },
    {
      q: "How do I track my reported complaints?",
      a: "Your dashboard features a dedicated live tracker showing exactly whether your report is 'Pending Verification', 'Dispatched to Crew', or successfully 'Resolved' with an after-photo."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans overflow-x-hidden bg-[#fafcfa] text-foreground">
      
      {/* 1. Hero Section */}
      <section className="relative px-6 lg:px-8 pt-12 pb-24 sm:pt-16 sm:pb-32 flex items-center justify-center min-h-[85vh]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-green-500/10 rounded-full blur-[120px] -z-10 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] -z-10 mix-blend-multiply"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 mb-6 w-max">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Next-Gen Municipal Services</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
              Smarter Waste <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                Cleaner Jamshedpur.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mb-10">
              A dedicated initiative for the Steel City. This platform empowers the citizens of Jamshedpur to collaborate with local authorities (like JNAC/JUSCO) to report neglected areas, schedule smart pickups, and maintain the pride of our green city in Jharkhand.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/signup" className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center gap-2">
                Join the Movement <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/admin/login" className="px-8 py-4 glass text-foreground rounded-full font-bold text-lg hover:bg-white/40 dark:hover:bg-black/40 transition-all flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Admin Portal
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual Abstract Representation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block h-[500px] w-full"
          >
            <div className="absolute inset-0 glass rounded-[3rem] border border-white/20 transform rotate-3 z-0"></div>
            <div className="absolute inset-0 rounded-[3rem] transform -rotate-3 z-10 shadow-2xl overflow-hidden border border-white/20 group">
              <img 
                src={jamshedpurImage} 
                alt="Jamshedpur City" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
            </div>
            
            {/* Floating Glass Cards */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -left-12 top-24 glass p-4 rounded-xl flex items-center gap-4 shadow-xl z-20 border border-white/40 backdrop-blur-xl"
            >
              <div className="bg-primary/20 p-3 rounded-full"><MapPin className="text-primary w-6 h-6" /></div>
              <div>
                <p className="text-sm font-bold">New Report</p>
                <p className="text-xs text-muted-foreground">Location Tagged</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [10, -10, 10] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-8 bottom-32 glass p-4 rounded-xl flex items-center gap-4 shadow-xl z-20 border border-white/40 backdrop-blur-xl"
            >
              <div className="bg-green-500/20 p-3 rounded-full"><CheckCircle className="text-green-500 w-6 h-6" /></div>
              <div>
                <p className="text-sm font-bold">Pickup Completed</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Global Impact Stats */}
      <section className="border-y border-emerald-500/5 bg-[#f3f7f3]/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl sm:text-5xl font-black text-foreground mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm sm:text-base font-medium text-muted-foreground tracking-wide uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Dynamic Eco-Impact Calculator Widget */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-primary/5 rounded-[5rem] blur-[120px] -z-10"></div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center bg-white p-8 md:p-16 rounded-[3.5rem] border border-emerald-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden">
          {/* Layered Corner Gradients inside card (behind text but above card bg) */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-[100px] z-0 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-[100px] z-0 pointer-events-none"></div>
          
          <div className="lg:w-1/2 text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 mb-6 border border-emerald-500/20 font-bold text-sm">
              <Sparkles className="w-4 h-4" /> Live Impact Estimator
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6 leading-tight">
              Calculate Your <span className="bg-gradient-to-r from-emerald-500 to-primary bg-clip-text text-transparent">Eco-Impact</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Every scrap of waste reported and recycled prevents severe carbon emissions. Drag the sliders below to visualize the real-world difference your recycling makes!
            </p>

            {/* Slider Controls */}
            <div className="space-y-8">
              <div>
                <div className="flex justify-between font-bold text-foreground mb-2">
                  <span>Plastic Waste Recycled</span>
                  <span className="text-primary">{plastic} kg</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={plastic} 
                  onChange={(e) => setPlastic(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary border border-neutral-200" 
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-foreground mb-2">
                  <span>Organic & Kitchen Waste</span>
                  <span className="text-emerald-500">{organic} kg</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  value={organic} 
                  onChange={(e) => setOrganic(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-neutral-200" 
                />
              </div>
            </div>
          </div>

          {/* Calculator Results Grid */}
          <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            <div className="bg-[#fafdfa] p-6 rounded-3xl border border-emerald-500/10 hover:border-primary/30 transition-all text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe2 className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-black text-foreground mb-1">{co2Saved}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">kg CO₂ Diverted</p>
            </div>

            <div className="bg-[#fafdfa] p-6 rounded-3xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all text-center shadow-sm">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-3xl font-black text-foreground mb-1">{treesSaved}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Tree seedlings saved</p>
            </div>

            <div className="bg-[#fafdfa] p-6 rounded-3xl border border-emerald-500/10 hover:border-blue-500/30 transition-all text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-3xl font-black text-foreground mb-1">{energySaved}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">kWh Energy Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center w-full max-w-3xl mx-auto mb-16">
          <h2 className="text-xl text-primary font-bold tracking-wide uppercase mb-3">How It Works</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-foreground">Everything you need to maintain community excellence.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="glass p-8 rounded-3xl hover:shadow-xl hover:bg-white/60 dark:hover:bg-black/60 transition-all border border-border/50 group"
            >
              <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Citizens Community Section */}
      <section className="py-24 bg-primary/5 border-t border-border mt-12 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/10 rounded-l-full blur-[150px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="text-4xl font-extrabold mb-6">Built for the community. <br/>Driven by you.</h2>
            <p className="text-lg text-muted-foreground mb-6">
              When citizens are equipped with the right digital tools, keeping the environment clean shifts from a chore to a collaborative movement. Join thousands of your neighbors who are already making a visible difference.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-12 h-12 rounded-full border-2 border-background flex items-center justify-center text-white font-bold bg-primary`} style={{ opacity: 1 - (i*0.1) }}>
                    <Users className="w-5 h-5" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium">
                <span className="text-foreground font-bold leading-tight block">Join 8,900+ members</span>
                <span className="text-muted-foreground">making an impact today</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 w-full"
          >
            <div className="glass p-8 rounded-3xl border border-white/20 shadow-2xl relative">
               <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary rounded-full blur-[30px]"></div>
               <h3 className="text-2xl font-bold mb-4">"The app transformed our neighborhood. What used to take weeks to clean up now takes 24 hours."</h3>
               <div className="flex items-center gap-4 mt-8">
                 <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center"><UserIcon /></div>
                 <div>
                   <p className="font-bold text-foreground">Sarah Jenkins</p>
                   <p className="text-sm text-muted-foreground">Community Leader</p>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Premium Accordion FAQ Section */}
      <section className="py-24 px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 font-bold text-sm">
            <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">Got Questions? We Have Answers.</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="glass rounded-2xl border border-border/50 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-lg text-foreground hover:text-primary transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-primary' : ''}`} />
              </button>

              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-2 text-muted-foreground border-t border-border/30 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

// Mini internal icon helper for the testimonial
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export default Home;
