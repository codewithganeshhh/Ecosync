import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { adminLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(email, password);
      toast.success('Admin Logged in successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      if (!error.response) {
        toast.error(error.customMessage || 'Server is currently offline. Please try again later.');
      } else if (error.response.status === 503) {
        toast.error(error.response.data.message || 'Database connection error.');
      } else {
        toast.error(error.response.data?.message || 'Failed to login as admin.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 relative overflow-hidden bg-zinc-950 text-white">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-[80px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-red-500/20 bg-black/60 p-8 w-full max-w-md rounded-2xl relative z-10"
      >
        <div className="flex justify-center mb-4">
          <ShieldCheck className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">Admin Portal</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">Admin Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Secure Access'}
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-500 text-sm">
          Not an admin? <Link to="/login" className="text-zinc-300 hover:text-white underline font-medium">Return to User Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
