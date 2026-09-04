import React, { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';
import { CheckSquare, Database, Server, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Navbar({ onRefreshHealth, healthStatus, loadingHealth }) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <a href="/" className="brand">
          <div className="brand-icon">
            <CheckSquare size={22} />
          </div>
          <span className="brand-title">
            Task<span>Pulse</span>
          </span>
        </a>

        {/* System Health / DB Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {healthStatus ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Server Status */}
              <span className="badge badge-connected" title="Express API is responding">
                <span className="pulse-dot"></span>
                <Server size={13} style={{ marginRight: '2px' }} />
                API: Port 5000
              </span>

              {/* Database Status */}
              {healthStatus.database?.isInMemory ? (
                <span className="badge badge-in-memory" title="Running in zero-setup in-memory MongoDB mode">
                  <Database size={13} style={{ marginRight: '2px' }} />
                  MongoDB: In-Memory (Dev)
                </span>
              ) : (
                <span className="badge badge-connected" title={`Connected to MongoDB: ${healthStatus.database?.host}`}>
                  <Database size={13} style={{ marginRight: '2px' }} />
                  MongoDB: {healthStatus.database?.host || 'Connected'}
                </span>
              )}
            </div>
          ) : (
            <span className="badge badge-disconnected">
              <AlertCircle size={13} style={{ marginRight: '2px' }} />
              API: Offline
            </span>
          )}

          {/* Refresh Health Button */}
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onRefreshHealth} 
            disabled={loadingHealth}
            title="Check backend health status"
          >
            <RefreshCw size={13} className={loadingHealth ? 'spin' : ''} />
            {loadingHealth ? 'Checking...' : 'Check Status'}
          </button>
        </div>
      </div>
    </header>
  );
}
