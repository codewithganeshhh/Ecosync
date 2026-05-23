import React from 'react';
import { motion } from 'framer-motion';
import { Users, Leaf, Target, Award, Cpu, Code, Sparkles } from 'lucide-react';

// Custom inline SVG icons for GitHub & LinkedIn to handle package version support cleanly and professionally
const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const About = () => {
  const team = [
    {
      name: "Ganesh",
      role: "Lead Full-Stack Developer",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
      details: "Architected the core system, MongoDB database models, geo-tagged reporting engine, and custom Cloudinary upload pipeline.",
      github: "#",
      linkedin: "#"
    },
    {
      name: "Project Partner 1",
      role: "Frontend & UI/UX Specialist",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      details: "Crafted the responsive glassmorphism interfaces, interactive dashboards, Framer Motion transitions, and fluid calculator widgets.",
      github: "#",
      linkedin: "#"
    },
    {
      name: "Project Partner 2",
      role: "Database & Backend Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      details: "Designed secure user authentication workflows, optimized system state, driver route trackers, and robust testing layouts.",
      github: "#",
      linkedin: "#"
    }
  ];

  const milestones = [
    {
      phase: "Phase 1: Research & Civic Gaps Modeling",
      description: "Analyzed municipal response models in Jamshedpur to design a seamless, real-time communication loop between citizens, Jamshedpur EcoSync administrators, and local collection drivers."
    },
    {
      phase: "Phase 2: Cloud Integration & Core Architecture",
      description: "Built the high-performance Node.js/Express API REST server, linked geo-coded coordinates to reports, and integrated secure Cloudinary storage for instant verification photos."
    },
    {
      phase: "Phase 3: Interactive Dashboards & Optimization",
      description: "Implemented custom user command centers, automated truck route assignments, gamified eco-rewards calculators, and polished modern responsive layouts for project presentation."
    }
  ];

  return (
    <div className="min-h-screen pt-16 pb-20 px-6 lg:px-8 bg-[#fafcfa] text-foreground font-sans overflow-x-hidden">
      
      {/* 1. Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl mx-auto mb-20 relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-emerald-600 mb-6 font-bold text-sm shadow-xl">
          <Sparkles className="w-4 h-4" /> Final Year Engineering Project
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.15]">
          Architecting Smarter <br />
          <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">Municipal Systems</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Jamshedpur EcoSync is a next-generation web application designed to bridge the civic gap. Built from the ground up to empower Jamshedpur citizens with cutting-edge geocoded report filing and waste management workflows.
        </p>
      </motion.div>

      {/* 2. Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-32 relative">
        <motion.div 
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-emerald-500/10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:border-primary/30 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[50px] transition-transform duration-500 group-hover:scale-110"></div>
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Our Mission</h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            To digitize civic hygiene by providing an active gateway for waste tracking. We strive to give every citizen a direct tool to locate neglected dumpsites, dispatch clean-up drivers, and verify resolutions in real-time, removing all standard bureaucratic delays.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-emerald-500/10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-[50px] transition-transform duration-500 group-hover:scale-110"></div>
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
            <Award className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">The Vision</h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            We envision Jamshedpur EcoSync acting as a premier software blueprint for smart cities across India. Our vision centers around citizen-driven governance where technology elevates transparency, reduces response times, and keeps our communities pristine.
          </p>
        </motion.div>
      </div>

      {/* 3. Project Journey & Engineering Timeline */}
      <section className="max-w-5xl mx-auto mb-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 mb-4 font-bold text-sm">
            <Cpu className="w-4 h-4" /> System Life-Cycle
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Engineering Journey</h2>
        </div>

        <div className="relative border-l border-emerald-500/20 ml-4 md:ml-12 space-y-12">
          {milestones.map((m, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline dot */}
              <div className="absolute -left-3 top-1.5 w-6 h-6 bg-white border-4 border-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] z-10"></div>
              
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-emerald-500/10 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-emerald-600 font-extrabold text-sm uppercase tracking-wider mb-2 block">{m.phase.split(':')[0]}</span>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">{m.phase.split(':')[1]}</h3>
                <p className="text-muted-foreground leading-relaxed">{m.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Meet The Creators (Team Grid) */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 font-bold text-sm">
            <Code className="w-4 h-4" /> Final Year Project Group
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Meet the Innovators</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white/90 backdrop-blur-md p-8 pt-10 rounded-[2.5rem] border border-emerald-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.055)] hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group text-center relative overflow-hidden"
            >
              <div>
                
                {/* 3D Glowing Circular Profile Image Frame with Double-Ring Design */}
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-emerald-500 rounded-full blur-[8px] opacity-35 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="w-full h-full rounded-full border-2 border-emerald-500/20 p-1 relative z-10 bg-white">
                    <img 
                      src={t.image} 
                      alt={t.name}
                      className="w-full h-full object-cover rounded-full border-2 border-white relative shadow-inner group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-black tracking-tight text-[#1b251b] mb-1">{t.name}</h3>
                
                {/* Modern Pill Badge for Role */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm uppercase tracking-wider">
                    {t.role}
                  </span>
                </div>
                
                <p className="text-[#606d60] leading-relaxed text-sm mb-6 max-w-[240px] mx-auto">
                  {t.details}
                </p>
              </div>

              {/* Sleek Minimalist Circle Actions styled in actual brand colors */}
              <div className="flex gap-3 border-t border-emerald-500/5 pt-5 justify-center mt-auto">
                <a 
                  href={t.github} 
                  className="w-10 h-10 rounded-full bg-neutral-100/50 hover:bg-[#181717] hover:text-white border border-neutral-200/50 flex items-center justify-center text-neutral-700 transition-all duration-300 shadow-sm"
                  title="GitHub Profile"
                >
                  <GithubIcon />
                </a>
                <a 
                  href={t.linkedin} 
                  className="w-10 h-10 rounded-full bg-blue-50/50 hover:bg-[#0a66c2] hover:text-white border border-blue-100/50 flex items-center justify-center text-[#0a66c2] transition-all duration-300 shadow-sm"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
