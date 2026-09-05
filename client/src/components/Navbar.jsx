import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Database, Server, RefreshCw, AlertCircle, LogOut, UserPlus, LogIn, User } from 'lucide-react';

export default function Navbar({ onRefreshHealth, healthStatus, loadingHealth }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="brand">
          <div className="brand-icon">
            <CheckSquare size={22} />
          </div>
          <span className="brand-title">
            Task<span>Pulse</span>
          </span>
        </Link>

        {/* Right Section: Health Badges & User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Health Status */}
          {healthStatus ? (
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge badge-connected" title="Express API is responding">
                <span className="pulse-dot"></span>
                <Server size={12} style={{ marginRight: '2px' }} />
                Port 5000
              </span>

              {healthStatus.database?.isInMemory ? (
                <span className="badge badge-in-memory" title="Running in zero-setup in-memory MongoDB mode">
                  <Database size={12} style={{ marginRight: '2px' }} />
                  In-Memory
                </span>
              ) : (
                <span className="badge badge-connected" title={`Connected to MongoDB Atlas: ${healthStatus.database?.host}`}>
                  <Database size={12} style={{ marginRight: '2px' }} />
                  Atlas Cloud
                </span>
              )}
            </div>
          ) : (
            <span className="badge badge-disconnected">
              <AlertCircle size={12} style={{ marginRight: '2px' }} />
              Offline
            </span>
          )}

          {/* User Auth Buttons or Profile */}
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="nav-user-chip">
                <div className="avatar-chip">
                  {getInitials(user.name)}
                </div>
                <span className="nav-user-name">{user.name}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-sm"
                title="Sign out of your account"
              >
                <LogOut size={14} />
                <span className="hide-mobile">Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={14} /> Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={14} /> Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
