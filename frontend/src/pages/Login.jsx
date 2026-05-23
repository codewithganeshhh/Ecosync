import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const { login, user, logout } = useContext(AuthContext);
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
      const userData = await login(email, password);
      
      // Categorization enforcement
      if (userData.role !== role) {
        logout(); // Discard the token
        toast.error(`Account not found for the selected role: ${role === 'user' ? 'Citizen' : 'Cleanup Crew'}`);
        setLoading(false);
        return;
      }

      toast.success('Logged in successfully');
      if (userData?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userData?.role === 'driver') {
        navigate('/driver/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      if (!error.response) {
        toast.error(error.customMessage || 'Server is currently offline. Please try again later.');
      } else if (error.response.status === 401) {
        toast.error(error.response.data.message || 'Invalid email or password.');
      } else if (error.response.status === 503) {
        toast.error(error.response.data.message || 'Database connection error.');
      } else {
        toast.error(error.response.data?.message || 'Failed to login. Please check your credentials.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 w-full max-w-md rounded-2xl relative z-10"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        
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
            <label className="block text-sm font-medium mb-1">Email Address</label>
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
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-muted-foreground text-sm">
          Don't have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
        </p>
        <p className="mt-2 text-center text-muted-foreground text-sm">
          Are you an Admin? <Link to="/admin/login" className="text-primary hover:underline font-medium">Admin Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
