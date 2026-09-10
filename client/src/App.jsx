import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { checkHealth } from './services/api';

function AppContent() {
  const [health, setHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const data = await checkHealth();
      setHealth(data);
    } catch (err) {
      setHealth(null);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Poll health check every 15 seconds to keep live indicator accurate
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-layout">
      {/* Sticky Top Navbar */}
      <Navbar 
        onRefreshHealth={fetchHealth} 
        healthStatus={health} 
        loadingHealth={loadingHealth} 
      />

      {/* Main Application Routes */}
      <main>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Dashboard Route */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// Helper component to ensure TaskProvider resets state on user switch
function AuthenticatedTaskProvider({ children }) {
  const { user } = useAuth();
  return <TaskProvider key={user?._id || 'guest'}>{children}</TaskProvider>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthenticatedTaskProvider>
          <AppContent />
        </AuthenticatedTaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
