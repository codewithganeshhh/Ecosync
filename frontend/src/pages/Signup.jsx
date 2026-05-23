import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const { signup, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
       if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'driver') {
        navigate('/driver/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await signup(name, email, password, role);
      toast.success('Account created successfully!');
      if (userData?.role === 'driver') {
        navigate('/driver/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      if (!error.response) {
        toast.error('Server is currently offline. Please try again later.');
      } else if (error.response.status === 503) {
        toast.error(error.response.data.message || 'Database connection error.');
      } else {
        toast.error(error.response.data?.message || 'Failed to create account.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 w-full max-w-md rounded-2xl relative z-10"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex bg-primary/10 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                role === 'user' ? 'bg-primary text-white shadow-lg' : 'text-primary'
              }`}
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                role === 'driver' ? 'bg-primary text-white shadow-lg' : 'text-primary'
              }`}
            >
              Cleanup Crew
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-white/50 dark:bg-black/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-muted-foreground text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
