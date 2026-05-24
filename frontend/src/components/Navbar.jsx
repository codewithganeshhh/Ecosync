import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, LogOut, Menu, X, User as UserIcon, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-primary font-extrabold text-2xl tracking-tight hover:opacity-90 transition-opacity">
              <Leaf className="h-6 w-6 animate-pulse" />
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">Jamshedpur EcoSync</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">Home</Link>
            <Link to="/legacy" className="text-foreground/80 hover:text-primary transition-colors font-medium">City Legacy</Link>
            <Link to="/leaderboard" className="text-foreground/80 hover:text-primary transition-colors font-medium">Eco Leaderboard</Link>
            <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors font-medium">About</Link>
            <Link to="/contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">Contact</Link>
            
            {user ? (
              <>
                <Link 
                  to={
                    user.role === 'admin' ? '/admin/dashboard' : 
                    user.role === 'driver' ? '/driver/dashboard' : '/dashboard'
                  } 
                  className="text-foreground/80 hover:text-primary transition-colors pr-4 border-r border-border font-bold text-sm tracking-tight"
                >
                  {user.role === 'admin' ? 'Command Center' : 
                   user.role === 'driver' ? 'Crew Dashboard' : 'Dashboard'}
                </Link>
                <div className="flex items-center gap-3 pl-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-foreground">Hi, {user.name}</span>
                    {user.location && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <MapPin className="h-2.5 w-2.5 text-primary" /> {user.location.split(',')[0]}
                      </span>
                    )}
                  </div>
                  <Link to="/setup-profile" title="Update Profile">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center hover:border-primary transition-all">
                      {user.profilePhoto ? (
                        <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </Link>
                </div>
                <button onClick={handleLogout} className="text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1 ml-4 pl-4 border-l border-border">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="px-5 py-2 text-foreground/80 hover:text-primary font-semibold rounded-full border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 text-sm">
                  Login
                </Link>
                <Link to="/signup" className="px-6 py-2.5 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white font-bold rounded-full transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 active:translate-y-0 text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground/80 hover:text-primary">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/legacy" className="block px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary" onClick={() => setIsOpen(false)}>City Legacy</Link>
              <Link to="/leaderboard" className="block px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary" onClick={() => setIsOpen(false)}>Eco Leaderboard</Link>
              <Link to="/recycling-info" className="block px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary" onClick={() => setIsOpen(false)}>Recycling Info</Link>
              <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary" onClick={() => setIsOpen(false)}>About Us</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary" onClick={() => setIsOpen(false)}>Contact</Link>
              {user ? (
                <>
                  <Link 
                    to={
                      user.role === 'admin' ? '/admin/dashboard' : 
                      user.role === 'driver' ? '/driver/dashboard' : '/dashboard'
                    } 
                    className="block px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary" 
                    onClick={() => setIsOpen(false)}
                  >
                    {user.role === 'admin' ? 'Command Center' : 
                     user.role === 'driver' ? 'Crew Dashboard' : 'Dashboard'}
                  </Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-destructive font-medium hover:bg-destructive/10 rounded-md">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md hover:bg-primary/10" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/signup" className="block px-3 py-2 rounded-md hover:bg-primary/10" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
