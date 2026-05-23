import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Globe, Heart, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass border-t border-border mt-auto w-full relative z-10 pt-16 pb-8">
      <div className="absolute inset-0 bg-primary/5 -z-10 mix-blend-overlay pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand & Context */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-2xl mb-6">
              <Leaf className="h-8 w-8" />
              <span className="text-foreground">Jamshedpur EcoSync</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              A comprehensive digital ecosystem built to transform waste management across Jamshedpur. We bridge the gap between citizens and local authorities like JNAC & JUSCO to create a cleaner, greener, and more sustainable Steel City.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-colors shadow-sm">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-colors shadow-sm">
                <Heart className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-colors shadow-sm">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary w-2 h-2 rounded-full bg-primary block"></span> Home</Link></li>
              <li><Link to="/legacy" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary w-2 h-2 rounded-full bg-primary block"></span> City Legacy</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary w-2 h-2 rounded-full bg-primary block"></span> About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary w-2 h-2 rounded-full bg-primary block"></span> Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-foreground font-bold text-lg mb-6 relative inline-block">
              Local Resources
              <span className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">JUSCO Helpline</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">JNAC Guidelines</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Steel City Cleanliness Report</a></li>
              <li><Link to="/admin/login" className="text-muted-foreground hover:text-primary transition-colors text-sm">Admin Portal Access</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-foreground font-bold text-lg mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                <span className="text-sm"> Gandhi Maidan Mango<br />Jamshedpur, Jharkhand 831001</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm">+91 00000 00000</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm">project@ecosync-jamshedpur.edu.in</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Jamshedpur EcoSync (Academic Project). All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
