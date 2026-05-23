import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ChatWidget from './components/ChatWidget';


// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ReportWaste = lazy(() => import('./pages/ReportWaste'));
const PickupRequest = lazy(() => import('./pages/PickupRequest'));
const RecyclingInfo = lazy(() => import('./pages/RecyclingInfo'));
const About = lazy(() => import('./pages/About'));
const Legacy = lazy(() => import('./pages/Legacy'));
const Contact = lazy(() => import('./pages/Contact'));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'));
const DriverDashboard = lazy(() => import('./pages/DriverDashboard'));

// Simple loading spinner
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[70vh]">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AuthProvider>
        <Router>
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/recycling-info" element={<RecyclingInfo />} />
                <Route path="/about" element={<About />} />
                <Route path="/legacy" element={<Legacy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/setup-profile" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
                
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/report-waste" element={<ProtectedRoute><ReportWaste /></ProtectedRoute>} />
                <Route path="/pickup-request" element={<ProtectedRoute><PickupRequest /></ProtectedRoute>} />
                
                <Route path="/driver/dashboard" element={<ProtectedRoute driverOnly={true}><DriverDashboard /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" theme="colored" />
          <ChatWidget />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
