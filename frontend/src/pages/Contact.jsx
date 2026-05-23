import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate real API dispatch delay
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-16 pb-20 px-6 lg:px-8 bg-[#fafcfa] text-foreground font-sans overflow-x-hidden">
      
      {/* 1. Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-20 relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-emerald-600 mb-6 font-bold text-sm shadow-xl">
          <Sparkles className="w-4 h-4" /> Active Civic Support Center
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
          Get in Touch <br />
          <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">With Our Engineering Team</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Have an idea to improve Jamshedpur EcoSync, or need to flag a critical system emergency? We are here to keep Jamshedpur clean, safe, and transparent.
        </p>
      </motion.div>

      {/* 2. Page Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto items-stretch">
        
        {/* Info Column (Left Side - spans 5/12 cols) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 space-y-6 flex flex-col justify-between"
        >
          {/* Card 1: HQ */}
          <div className="bg-white p-8 rounded-[2rem] border border-emerald-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:border-primary/20 transition-all duration-300 flex items-start gap-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[30px] transition-transform duration-500 group-hover:scale-110"></div>
            <div className="bg-primary/10 p-3.5 rounded-2xl text-primary shrink-0 border border-primary/20 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-primary font-bold text-xs uppercase tracking-wider block mb-1">HQ Location</span>
              <h3 className="text-xl font-bold text-[#1b251b] mb-2">Project Headquarters</h3>
              <p className="text-[#606d60] text-sm leading-relaxed">
                Final Year IT Department Wing<br />
                Main Campus, Jamshedpur<br />
                Jharkhand, India 831001
              </p>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white p-8 rounded-[2rem] border border-emerald-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:border-emerald-500/35 transition-all duration-300 flex items-start gap-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-[30px] transition-transform duration-500 group-hover:scale-110"></div>
            <div className="bg-emerald-500/10 p-3.5 rounded-2xl text-emerald-600 shrink-0 border border-emerald-500/20 shadow-sm">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider block mb-1">Direct Mailing</span>
              <h3 className="text-xl font-bold text-[#1b251b] mb-2">Email Directory</h3>
              <p className="text-[#606d60] text-sm leading-relaxed space-y-1">
                <div><strong>Support:</strong> <a href="mailto:support@ecosync.edu.in" className="hover:text-primary transition-colors">support@ecosync.edu.in</a></div>
                <div><strong>Academic:</strong> <a href="mailto:project-team@ecosync.edu.in" className="hover:text-primary transition-colors">project-team@ecosync.edu.in</a></div>
              </p>
            </div>
          </div>

          {/* Card 3: Emergencies */}
          <div className="bg-white p-8 rounded-[2rem] border border-emerald-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:border-emerald-500/35 transition-all duration-300 flex items-start gap-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-[30px] transition-transform duration-500 group-hover:scale-110"></div>
            <div className="bg-emerald-500/10 p-3.5 rounded-2xl text-emerald-600 shrink-0 border border-emerald-500/20 shadow-sm">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider block mb-1">Civic Emergencies</span>
              <h3 className="text-xl font-bold text-[#1b251b] mb-2">Municipal Helplines</h3>
              <p className="text-[#606d60] text-sm leading-relaxed space-y-1">
                <div><strong>JUSCO Helpdesk:</strong> 1800-345-6452</div>
                <div><strong>JNAC Control:</strong> 0657-222-3864</div>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form Column (Right Side - spans 7/12 cols) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-7 bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-emerald-500/10 shadow-[0_15px_40px_rgba(0,0,0,0.015)] hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#1b251b]">Send a Message</h2>
                <p className="text-xs text-muted-foreground mt-0.5">We typically reply within 24 business hours.</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#404c40]">First Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-neutral-50/70 border border-emerald-500/10 rounded-xl focus:outline-none focus:border-primary focus:ring-[4px] focus:ring-primary/10 transition-all duration-200 text-sm text-foreground" 
                    placeholder="John" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#404c40]">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-neutral-50/70 border border-emerald-500/10 rounded-xl focus:outline-none focus:border-primary focus:ring-[4px] focus:ring-primary/10 transition-all duration-200 text-sm text-foreground" 
                    placeholder="Doe" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#404c40]">Email Address <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-neutral-50/70 border border-emerald-500/10 rounded-xl focus:outline-none focus:border-primary focus:ring-[4px] focus:ring-primary/10 transition-all duration-200 text-sm text-foreground" 
                  placeholder="john@example.com" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#404c40]">Your Message <span className="text-red-500">*</span></label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5" 
                  className="w-full px-4 py-3.5 bg-neutral-50/70 border border-emerald-500/10 rounded-xl focus:outline-none focus:border-primary focus:ring-[4px] focus:ring-primary/10 transition-all duration-200 text-sm text-foreground resize-none" 
                  placeholder="Tell us how we can help..." 
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground font-extrabold py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/15 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-60 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;
